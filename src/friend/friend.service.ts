import { DBFriendService } from "@/database/friend/friend.service";
import { DBUserService } from "@/database/user/user.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { $Enums } from "@prisma/client";

@Injectable()
export class FriendService {
  constructor(private readonly dbFriendService: DBFriendService, private readonly dbUserSerive: DBUserService) {}

  public async getFriendStatus(userId: string, friendId: string) {
    let friend = await this.dbFriendService.findFirst({
      where: {
        from_user_id: friendId,
        to_user_id: userId,
      },
    });

    if (!friend) {
      friend = await this.dbFriendService.findFirst({
        where: {
          from_user_id: userId,
          to_user_id: friendId,
        },
      });
      if (!friend) return "none";
      return friend?.status;
    } else {
      return friend?.status === $Enums?.FriendStatus?.PENDING ? "REQUESTED" : friend?.status;
    }
  }

  public async getAllFriendsRequest(userId: string) {
    return this.dbFriendService.findMany({
      where: {
        to_user_id: userId,
        status: $Enums.FriendStatus.PENDING,
      },
      include: {
        userid_1: true,
      },
    });
  }


  public async getAllPendingFriends(userId: string) {
    return this.dbFriendService.findMany({
      where: {
        from_user_id: userId,
        status: $Enums.FriendStatus.PENDING,
      },
      include: {
        userid_2: true,
      },
    });
  }

  public async getAllFriends(userId: string) {
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

    let friendIds = friends.map((friend) => {
      if (friend.from_user_id === userId) return friend.to_user_id;
      return friend.from_user_id;
    });

    return this.dbUserSerive.findMany({
      where: {
        id: {
          in: friendIds,
        },
      },
    });
  }

  public async getAllNotFriends(userId: string) {
    const friends = await this.dbFriendService.findMany({
      where: {},
    });

    let friendIds = friends.map((friend) => {
      if (friend.from_user_id === userId) return friend.to_user_id;
      return friend.from_user_id;
    });

    return this.dbUserSerive.findMany({
      where: {
        id: {
          notIn: friendIds,
          not: userId,
        },
      },
    });
  }

  public async addFriends(userId: string, friendId: string, status: string) {
    if (userId === friendId) {
      throw new BadRequestException("You cannot add yourself as a friend");
    }

    switch (status) {
      case "add":
        let isNotFriend = await this.dbFriendService.findFirst({
          where: {
            userid_1: {
              id: friendId,
            },
            userid_2: {
              id: userId,
            },
          },
        });

        if (!isNotFriend)
          isNotFriend = await this.dbFriendService.findFirst({
            where: {
              userid_1: {
                id: userId,
              },
              userid_2: {
                id: friendId,
              },
            },
          });

        if (isNotFriend) throw new BadRequestException("This user is already your friend");

        return this.dbFriendService.insert({
          userid_1: {
            connect: {
              id: userId,
            },
          },
          userid_2: {
            connect: {
              id: friendId,
            },
          },
        });
        break;
      case "accept":
        const isFriend = await this.dbFriendService.findFirst({
          where: {
            from_user_id: friendId,
            to_user_id: userId,
            status: $Enums.FriendStatus.PENDING,
          },
        });
        if (!isFriend) throw new BadRequestException("This user is not request to be friend");

        if (isFriend?.status === $Enums.FriendStatus.ACCEPTED)
          throw new BadRequestException("This user is already your friend");

        return this.dbFriendService.update({
          where: {
            from_user_id_to_user_id: {
              from_user_id: friendId,
              to_user_id: userId,
            },
          },
          data: {
            status: $Enums.FriendStatus.ACCEPTED,
          },
        });
        break;
      case "reject":
        let isRequest = await this.dbFriendService.findFirst({
          where: {
            from_user_id: friendId,
            to_user_id: userId,
          },
        });
        if (!isRequest) {
          isRequest = await this.dbFriendService.findFirst({
            where: {
              from_user_id: userId,
              to_user_id: friendId,
            },
          });

          if (!isRequest) throw new BadRequestException("This user not request to be friend");
          return this.dbFriendService.delete({
            from_user_id_to_user_id: {
              from_user_id: userId,
              to_user_id: friendId,
            },
          });
        } else {
          return this.dbFriendService.delete({
            from_user_id_to_user_id: {
              from_user_id: friendId,
              to_user_id: userId,
            },
          });
        }
        break;
      default:
        throw new BadRequestException("Invalid status");
    }
  }

  public async searchFriends(keyword: string) {
    return this.dbUserSerive.findMany({
      where: {
        OR: [
          {
            first_name: {
              contains: keyword,
            },
          },
          {
            last_name: {
              contains: keyword,
            },
          },
          {
            email: {
              contains: keyword,
              equals: keyword,
            },
          },
        ],
      },
    });
  }
}
