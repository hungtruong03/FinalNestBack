import { UserService } from './user.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Controller, Post, Body, Get, Request, UseGuards, NotFoundException, HttpCode, HttpStatus } from '@nestjs/common';
import { Public } from '../decorators/setMetaData';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() body: { email: string; password: string; username: string }) {
    const { email, password, username } = body;
    return this.userService.register(email, password, username); // Truyền đầy đủ ba tham số
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.userService.login(body.email, body.password);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('logingg')
  async logingg(@Body() body: { token: string }) {
    return this.userService.loginWithGoogle(body.token);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
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
