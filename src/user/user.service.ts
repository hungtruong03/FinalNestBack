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
  ) { }
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

  async loginWithGoogle(payload: { email: string; name: string; googleId: string }) {
    const { email, name, googleId } = payload;

    try {
      // Kiểm tra xem người dùng đã tồn tại chưa
      let { data: user, error: fetchError } = await this.supabase
        .from('usersgg')
        .select('*')
        .eq('email', email)
        .single();

      // Nếu có lỗi hoặc không tìm thấy người dùng, tạo mới
      if (fetchError || !user) {
        const { error: insertError } = await this.supabase
          .from('usersgg')
          .insert([{ email, username: name, googleId }]);

        if (insertError) {
          console.error('Error inserting user:', insertError);
          throw new Error('Đã xảy ra lỗi khi đăng ký người dùng Google.');
        }

        // Lấy lại người dùng sau khi thêm
        const { data, error: refetchError } = await this.supabase
          .from('usersgg')
          .select('*')
          .eq('email', email)
          .single();

        if (refetchError || !data) {
          throw new Error('Đã xảy ra lỗi khi lấy thông tin người dùng Google sau khi tạo.');
        }

        user = data;
      }

      // Trả về thông tin người dùng
      return {
        status: 'success',
        message: 'Đăng nhập thành công!',
        user,
      };
    } catch (error) {
      console.error('Error in loginWithGoogle:', error);
      return {
        status: 'error',
        message: error.message || 'Đã xảy ra lỗi khi xử lý yêu cầu.',
      };
    }
  }
}