import { UserService } from './user.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Controller, Post, Body, Get, Request, UseGuards, NotFoundException, HttpCode, HttpStatus } from '@nestjs/common';
import { Public } from '../decorators/setMetaData';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('requestOTP')
  async requestOTP(@Body() body: { email: string }) {
    const { email } = body;
    return this.userService.requestOTP(email);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() body: { email: string; password: string; username: string, otp: string }) {
    const { email, password, username, otp } = body;
    return this.userService.register(email, password, username, otp);
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
  async loginWithGoogle(@Body() body: { token: string }) {
    const { token } = body;

    // Giải mã token để lấy thông tin email, name, googleId
    const decodedToken = this.decodeGoogleToken(token);

    if (!decodedToken) {
      return {
        status: 'error',
        message: 'Token không hợp lệ hoặc không giải mã được.',
      };
    }

    // Gọi service với thông tin đã giải mã
    return this.userService.loginWithGoogle(decodedToken);
  }

  private decodeGoogleToken(token: string): { email: string; name: string; googleId: string } | null {
    try {
      // Giải mã token (thay thế logic này bằng thư viện phù hợp nếu cần)
      const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

      // Trích xuất thông tin cần thiết
      return {
        email: decoded.email,
        name: decoded.name,
        googleId: decoded.sub, // `sub` thường là Google ID
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
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