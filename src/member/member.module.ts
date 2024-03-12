import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { DBUserModule } from '@/database/user/user.module';

@Module({
  imports: [DBUserModule],
  controllers: [MemberController],
  providers: [MemberService]
})
export class MemberModule {}
