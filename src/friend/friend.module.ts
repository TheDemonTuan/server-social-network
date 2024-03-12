import { Module } from "@nestjs/common";
import { FriendService } from "./friend.service";
import { FriendController } from "./friend.controller";
import { DBFriendModule } from "@/database/friend/friend.module";
import { DBUserModule } from "@/database/user/user.module";

@Module({
  imports: [DBFriendModule,DBUserModule],
  providers: [FriendService],
  controllers: [FriendController],
})
export class FriendModule {}
