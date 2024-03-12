import { Controller, Get, Param } from "@nestjs/common";
import { MemberService } from "./member.service";

@Controller("member")
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get(":username")
  getMemberInfo(@Param("username") username: string) {
    return this.memberService.getMemberInfo(username);
  }
}
