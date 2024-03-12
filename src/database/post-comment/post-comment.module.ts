import { Module } from "@nestjs/common";
import { DBPostCommentService } from "./post-comment.service";
import { PrismaModule } from "@/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  providers: [DBPostCommentService],
  exports: [DBPostCommentService],
})
export class DBPostCommentModule {}