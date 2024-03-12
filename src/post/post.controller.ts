import { AuthGuard } from "@/auth/guards/auth.guard";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { PostDto } from "./dtos/post.dto";
import { PostService } from "./post.service";
import { UserInfo } from "@/common/decorators/user-info";
import { User } from "@prisma/client";
import { PostCommentDto } from "./dtos/post-comment.dto";

@UseGuards(AuthGuard)
@Controller("post")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get(":username/:withFriends")
  public async getPosts(
    @Param("username") username: string,
    @Param("withFriends", ParseBoolPipe) withFriends: boolean,
    @UserInfo() userInfo: User
  ) {
    return this.postService.getPosts(username, userInfo?.id, withFriends);
  }

  @Post()
  public async createPost(@Body() postDto: PostDto, @UserInfo() userPayload: User) {
    return this.postService.createPost(postDto, userPayload?.id);
  }

  @Put(":postId")
  public async updatePost(@Param("postId", ParseIntPipe) postID: number, @Body() postDto: PostDto) {
    return this.postService.updatePost(postID, postDto);
  }

  @Delete(":postId")
  public async deletePost(@Param("postId", ParseIntPipe) postID: number, @UserInfo() userInfo: User) {
    return this.postService.deletePost(postID, userInfo?.id);
  }

  @Get("like/:postId")
  public async getLikePosts(@Param("postId", ParseIntPipe) postID: number) {
    return this.postService.getLikePosts(postID);
  }

  @Post("like/:postId")
  public async putLikePost(@Param("postId", ParseIntPipe) postID: number, @UserInfo() userInfo: User) {
    return this.postService.likePost(postID, userInfo?.id);
  }

  @Get("comment/:postId")
  public async getComments(@Param("postId", ParseIntPipe) postID: number) {
    return this.postService.getComments(postID);
  }

  @Post("comment/:postId")
  public async createComment(
    @Param("postId", ParseIntPipe) postID: number,
    @Body() postCommentDto: PostCommentDto,
    @UserInfo() userInfo: User
  ) {
    return this.postService.createComment(postID, postCommentDto, userInfo?.id);
  }

  @Delete("comment/:commentId")
  public async deleteComment(@Param("commentId", ParseIntPipe) commentID: number) {
    // return this.postService.deleteComment(commentID);
  }
}
