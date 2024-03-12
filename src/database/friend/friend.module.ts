import { Module } from "@nestjs/common";
import { DBFriendService } from "./friend.service";
import { PrismaModule } from "@/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  providers: [DBFriendService],
  exports: [DBFriendService],
})
export class DBFriendModule {}