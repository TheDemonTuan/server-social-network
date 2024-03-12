import { Body, Controller, Get, Post, Res, UseGuards } from "@nestjs/common";
import { RegisterDto } from "./dtos/register.dto";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dtos/login.dto";
import { Response } from "express";
import { jwtConstants } from "./constants";
import { AuthGuard } from "./guards/auth.guard";
import { UserInfo } from "@/common/decorators/user-info";
import { User } from "@prisma/client";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const { token, user } = await this.authService.login(loginDto);
    response.cookie(jwtConstants?.name, token, { httpOnly: true, sameSite: "strict", maxAge: 1000 * 60 * 60 * 24 });
    return user;
  }

  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @UseGuards(AuthGuard)
  @Get("me")
  async me(@UserInfo() userInfo: User) {
    return userInfo;
  }

  @UseGuards(AuthGuard)
  @Post("logout")
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(jwtConstants?.name);
  }
}
