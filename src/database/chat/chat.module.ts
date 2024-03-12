import { Module } from "@nestjs/common";
import { DBChatService } from "./chat.service";
import { PrismaModule } from "@/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  providers: [DBChatService],
  exports: [DBChatService],
})
export class DBChatModule {}