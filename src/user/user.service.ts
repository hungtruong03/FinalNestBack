import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import * as Redis from 'ioredis';
import * as nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class UserService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
    private readonly jwtService: JwtService,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) { }
  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  async requestOTP(email: string): Promise<{ success: boolean }> {
    // Kiểm tra xem email đã tồn tại chưa
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (data) {
      throw new ConflictException('Email đã tồn tại.');
    }

    const otpKey = `otp:${email}`;
    const cooldownKey = `otpCooldown:${email}`;

    const cooldown = await this.redisClient.get(cooldownKey);
    if (cooldown) {
      throw new BadRequestException('Yêu cầu quá nhiều lần vui lòng thử lại sau.');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await this.redisClient.set(otpKey, otp, 'EX', 300);

    await this.redisClient.set(cooldownKey, '1', 'EX', 30);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSKEY,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Movies Recommender Code',
      text: `Mã OTP của bạn là: ${otp}. Mã này có hiệu lực trong vòng 5 phút.`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Đã gửi ${otp} đến ${email}`);
    } catch (error) {
      console.error('Error sending OTP via email:', error);
      throw new BadRequestException('Có lỗi xảy ra khi gửi OTP. Hãy thử lại sau.');
    }

    return { success: true };
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const otpKey = `otp:${email}`;
    const storedOtp = await this.redisClient.get(otpKey);

    if (!storedOtp || storedOtp !== otp) {
      return false;
    }

    return true;
  }

  async deleteOtp(email: string, otp: string): Promise<void> {
    const otpKey = `otp:${email}`;
    const storedOtp = await this.redisClient.get(otpKey);

    if (!storedOtp || storedOtp !== otp) {
      return;
    }

    await this.redisClient.del(otpKey);
  }

  async register(email: string, password: string, username: string, otp: string): Promise<string> {
    const isOtpValid = await this.verifyOtp(email, otp);
    if (!isOtpValid) {
      throw new BadRequestException('OTP không tồn tại hoặc đã hết hạn.');
    }

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

    await this.verifyOtp(email, otp);

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

  async requestPasswordReset(email: string): Promise<{ success: boolean }> {
    const resetCode = uuidv4();
    const resetLink = `https://final-react-front-rho.vercel.app/resetpassword?key=${resetCode}`;

    await this.redisClient.set(`password-reset:${resetCode}`, email, 'EX', 86400);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSKEY,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Movies Recommender Password Reset',
      text: `Đường dẫn reset password sau có hiệu lực trong vòng 1 ngày: ${resetLink}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Đã gửi ${resetLink} đến ${email}`);
    } catch (error) {
      console.error('Error sending reset link via email:', error);
      throw new BadRequestException('Có lỗi xảy ra khi gửi Reset Link. Hãy thử lại sau.');
    }

    return { success: true };
  }

  async verifyResetCode(resetCode: string): Promise<string | null> {
    return await this.redisClient.get(`password-reset:${resetCode}`);
  }

  async resetPassword(resetCode: string, email: string, newPassword: string): Promise<{ success: boolean }> {
    const storedEmail = await this.redisClient.get(`password-reset:${resetCode}`);

    if (storedEmail !== email) {
      throw new BadRequestException('Email không hợp lệ.');
    }

    const result = await this.updateUserPassword(email, newPassword);

    if (result) {
      await this.redisClient.del(`password-reset:${resetCode}`);
      return { success: true };
    }

    throw new BadRequestException('Có lỗi xảy ra khi cập nhật mật khẩu.');
  }

  private async updateUserPassword(email: string, newPassword: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return false;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const { error: updateError } = await this.supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('email', email);

    if (updateError) {
      return false;
    }

    return true;

  }
}