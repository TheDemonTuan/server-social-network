import { DBPostCommentService } from "./../database/post-comment/post-comment.service";
import { DBPostService } from "@/database/post/post.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { PostDto } from "./dtos/post.dto";
import { DBPostLikeService } from "@/database/post-like/post-like.service";
import { DBFriendService } from "@/database/friend/friend.service";
import { $Enums } from "@prisma/client";

@Injectable()
export class PostService {
  constructor(
    private readonly dbPostService: DBPostService,
    private readonly dbPostLikeService: DBPostLikeService,
    private readonly dbPostCommentService: DBPostCommentService,
    private readonly dbFriendService: DBFriendService
  ) {}

  public async getPosts(username: string, userId: string, withFriends: boolean) {
    let friendIds: string[] = [];
    if (withFriends) {
      const friends = await this.dbFriendService.findMany({
        where: {
          OR: [
            {
              from_user_id: userId,
              status: $Enums.FriendStatus.ACCEPTED,
            },
            {
              to_user_id: userId,
              status: $Enums.FriendStatus.ACCEPTED,
            },
          ],
        },
      });

      friendIds = friends.map((friend) => {
        if (friend.from_user_id === userId) return friend.to_user_id;
        return friend.from_user_id;
      });
    }

    return this.dbPostService.findMany({
      where: {
        OR: [
          {
            user: {
              username: username,
            },
          },
          {
            user_id: {
              in: friendIds,
            },
          },
        ],
        status: 1,
      },
      include: {
        user: true,
        post_likes: true,
        post_comments: {
          select: {
            id: true,
            content: true,
            user: true,
            created_at: true,
          },
        },
        _count: {
          select: {
            post_likes: true,
            post_comments: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }

  public async createPost(postDto: PostDto, userID: string) {
    return this.dbPostService.insert({
      content: postDto.content,
      user: {
        connect: {
          id: userID,
        },
      },
    });
  }

  public async updatePost(postID: number, postDto: PostDto) {
    const post = await this.dbPostService.findUnique({ where: { id: postID } });
    if (!post) throw new BadRequestException("Post not found");
    return await this.dbPostService.update({
      where: {
        id: post?.id,
      },
      data: {
        content: postDto.content,
      },
    });
  }

  public async deletePost(postID: number, userID: string) {
    const post = await this.dbPostService.findUnique({ where: { id: postID, user_id: userID } });
    if (!post) throw new BadRequestException("Post not found");
    return await this.dbPostService.update({
      where: {
        id: post?.id,
      },
      data: {
        status: 0,
      },
    });
  }

  public async getLikePosts(postID: number) {
    return this.dbPostLikeService.count({
      where: {
        post_id: postID,
      },
    });
  }

  public async likePost(postID: number, userId: string) {
    const post = await this.dbPostService.findUnique({ where: { id: postID } });
    if (!post) throw new BadRequestException("Post not found");

    const isLikedPost = await this.dbPostLikeService.findFirst({
      where: {
        post_id: post?.id,
        user_id: userId,
      },
    });

    if (isLikedPost) {
      await this.dbPostLikeService.delete({
        post_id_user_id: {
          post_id: post?.id,
          user_id: userId,
        },
      });
    } else {
      await this.dbPostLikeService.insert({
        post: {
          connect: {
            id: post?.id,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      });
    }

    return {
      post_id: post?.id,
      post_likes: await this.dbPostLikeService.count({
        where: {
          post_id: post?.id,
        },
      }),
    };
  }

  public async getComments(postID: number) {
    return this.dbPostCommentService.findMany({
      where: {
        post_id: postID,
      },
      include: {
        user: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }

  public async createComment(postID: number, body: PostDto, userID: string) {
    const post = await this.dbPostService.findUnique({ where: { id: postID } });
    if (!post) throw new BadRequestException("Post not found");

    return this.dbPostCommentService.insert({
      content: body.content,
      post: {
        connect: {
          id: post?.id,
        },
      },
      user: {
        connect: {
          id: userID,
        },
      },
    });
  }
}
