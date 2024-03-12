import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { PostModule } from "./post/post.module";
import { FriendModule } from "./friend/friend.module";
import { MemberModule } from "./member/member.module";
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, PostModule, FriendModule, MemberModule, ChatModule],
})
export class AppModule {}
