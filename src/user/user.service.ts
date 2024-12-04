import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
@Injectable()
export class UserService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
    private readonly jwtService: JwtService, 
  ) {}
  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  async register(email: string, password: string, username: string): Promise<string> {
    // Kiểm tra nếu email đã tồn tại trong cơ sở dữ liệu
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (data) {
      throw new ConflictException('Email đã tồn tại.');
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Chèn thông tin người dùng vào bảng
    const { data: insertData, error: insertError } = await this.supabase
      .from('users')
      .insert([{ username: username, email: email, pass: hashedPassword }]);

    if (insertError) {
      console.error('Error inserting user:', insertError); // In ra lỗi chi tiết
      throw new Error('Đã xảy ra lỗi khi đăng ký người dùng.');
    }

    return 'Đăng ký thành công!';
  }

  async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ.');
    }

    const valid = await bcrypt.compare(password, data.pass);
    if (!valid) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ.');
    }

    const payload = { email, sub: data.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken);

      const { sub: userId, email } = payload;
      const newAccessToken = this.jwtService.sign({ email, sub: userId }, { expiresIn: '15m' });

      return { accessToken: newAccessToken };
    } catch (error) {
      console.error('Invalid refresh token:', error);
      throw new UnauthorizedException('Refresh token không hợp lệ.');
    }
  }

  async validateUser(userId: number): Promise<any> {
    // Tìm người dùng theo ID
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error validating user:', error); // In ra lỗi chi tiết
      throw new Error('Không tìm thấy người dùng.');
    }

    return data;
  }

  async findOne(userId: number): Promise<any> {
    // Tìm người dùng theo ID
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error finding user:', error); // In ra lỗi chi tiết
      throw new Error('Không tìm thấy người dùng.');
    }

    return data;
  }
  async loginWithGoogle(idToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const ticket = await this.googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new UnauthorizedException('Xác thực Google không hợp lệ.');
    }

    const { email, sub: googleId } = payload;

    let user = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (!user.data) {
      const { error: insertError } = await this.supabase
        .from('users')
        .insert([{ email, username: payload.name, googleId }]);

      if (insertError) {
        console.error('Error inserting user:', insertError);
        throw new Error('Đã xảy ra lỗi khi đăng ký người dùng Google.');
      }

      user = await this.supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
    }

    const tokens = {
      accessToken: this.jwtService.sign({ email, sub: user.data.id }, { expiresIn: '15m' }),
      refreshToken: this.jwtService.sign({ email, sub: user.data.id }, { expiresIn: '7d' }),
    };

    return tokens;
  }
}
