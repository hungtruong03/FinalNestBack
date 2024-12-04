import { UserService } from './user.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Controller, Post, Body, Get, Request, UseGuards, NotFoundException } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string; username: string }) {
    const { email, password, username } = body;
    return this.userService.register(email, password, username); // Truyền đầy đủ ba tham số
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.userService.login(body.email, body.password);
  }

  @Post('logingg')
  async logingg(@Body() body: { token: string }) {
    return this.userService.loginWithGoogle(body.token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.userService.findOne(req.user.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      email: user.email,
      name: user.name,
      birthday: user.birthday,
    };
  }
}
