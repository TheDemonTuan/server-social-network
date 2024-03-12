import { DBUserService } from "@/database/user/user.service";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class MemberService {
  constructor(private readonly dbUserService: DBUserService) {}

  public async getMemberInfo(username: string) {
    const user = await this.dbUserService.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) throw new BadRequestException("User not found");

    return user;
  }
}
