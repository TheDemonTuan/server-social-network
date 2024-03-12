import { Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from "@nestjs/common";
import { FriendService } from "./friend.service";
import { UserInfo } from "@/common/decorators/user-info";
import { User } from "@prisma/client";
import { AuthGuard } from "@/auth/guards/auth.guard";

@UseGuards(AuthGuard)
@Controller("friend")
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Get("get-all-friends-request")
  public async getAllFriendsRequest(@UserInfo() userInfo: User) {
    return this.friendService.getAllFriendsRequest(userInfo?.id);
  }

  @Get("get-all-pending-friends")
  public async getAllPendingFriends(@UserInfo() userInfo: User) {
    return this.friendService.getAllPendingFriends(userInfo?.id);
  }

  @Get('get-all-friends')
  public async getAllFriends(@UserInfo() userInfo: User) {
    return this.friendService.getAllFriends(userInfo?.id);
  }

  @Get("get-all-not-friends")
  public async getAllNotFriends(@UserInfo() userInfo: User) {
    return this.friendService.getAllNotFriends(userInfo?.id);
  }

  @Get(":friendId")
  public async getFriendStatus(@UserInfo() userInfo: User, @Param("friendId", ParseUUIDPipe) friendId: string) {
    return this.friendService.getFriendStatus(userInfo?.id, friendId);
  }

  @Get("search/:keyword")
  public async searchFriends(@Param("keyword") keyword: string) {
    return this.friendService.searchFriends(keyword);
  }

  @Post(":friendId/:status")
  public async addFriends(
    @UserInfo() userInfo: User,
    @Param("friendId", ParseUUIDPipe) friendId: string,
    @Param("status") status: string
  ) {
    return this.friendService.addFriends(userInfo?.id, friendId, status);
  }
}
