import { UserService } from './user.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Controller, Post, Body, Get, Request, UseGuards, NotFoundException, HttpCode, HttpStatus, Query, Param, Delete } from '@nestjs/common';
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
  @Post('requestPasswordReset')
  async requestPasswordReset(@Body('email') email: string) {
    return this.userService.requestPasswordReset(email);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('verifyResetCode')
  async verifyResetCode(@Query('key') key: string) {
    return this.userService.verifyResetCode(key);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('resetPassword')
  async resetPassword(@Body() body: { email: string; newPassword: string; resetCode: string }) {
    const { email, newPassword, resetCode } = body;
    return this.userService.resetPassword(resetCode, email, newPassword);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() body: { email: string; password: string; username: string; otp: string }) {
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
  @HttpCode(HttpStatus.CREATED)
  @Post('rate/:movieId')
  async addRating(@Request() req, @Body() body: { rating: number }, @Param('movieId') movieId: number) {
    const userId = req.email;
    const { rating } = body;
    return this.userService.addRating(userId, movieId, rating);
  }
  
  @HttpCode(HttpStatus.CREATED)
  @Post('watchlist/:movieId')
  async addWatchList(@Request() req, @Param('movieId') movieId: number) {
    const email = req.email;
    console.log(email);
    return this.userService.addToWatchlist(email, movieId);
  }

  @Get('watchlist')
  async getWatchList(@Request() req, @Query('page') page: string,) {
    const email = req.email;
    const pageNumber = parseInt(page, 10) || 1;
    return this.userService.getWatchList(email, pageNumber);
  }
  @HttpCode(HttpStatus.OK)
  @Delete('watchlist/:movieId')
  async deleteFromWatchlist(@Request() req, @Param('movieId') movieId: number) {
    const email = req.email;
    const result = await this.userService.deleteFromWatchlist(email, movieId);
    return {
      message: 'Phim đã được xóa khỏi danh sách xem.',
      success: result.success,
    };
  }


  @HttpCode(HttpStatus.CREATED)
  @Post('favourite/:movieId')
  async addFavourite(@Request() req, @Param('movieId') movieId: number) {
    const email = req.email;
    console.log(email);
    return this.userService.addFavourite(email, movieId);
  }

  @Get('favourite')
  async getFavourite(@Request() req, @Query('page') page: string,) {
    const email = req.email;
    const pageNumber = parseInt(page, 10) || 1;
    return this.userService.getFavourite(email, pageNumber);
  }
  @HttpCode(HttpStatus.OK)
  @Delete('favourite/:movieId')
  async deleteFavourite(@Request() req, @Param('movieId') movieId: number) {
    const email = req.email;
    const result = await this.userService.deleteFavourite(email, movieId);
    return {
      message: 'Phim đã được xóa khỏi danh sách yêu thích .',
      success: result.success,
    };
  }
}