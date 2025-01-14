import { Injectable, ConflictException, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import * as Redis from 'ioredis';
import * as nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from '../movie/movie.schema';
import { Similar } from '../similar/similar.schema';

@Injectable()
export class UserService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
    private readonly jwtService: JwtService,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    @InjectModel(Movie.name, 'movie1Connection')
    private readonly movieModel1: Model<Movie>,
    @InjectModel(Similar.name, 'similarConnection') private readonly similarModel: Model<Similar>
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
      throw new BadRequestException('Đã xảy ra lỗi khi đăng ký người dùng.');
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

    const payload = { email, isGoogleAccount: false };
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

  async findOne(email: string, isGoogleAccount: boolean): Promise<any> {
    try {
      const tableName = isGoogleAccount ? 'usersgg' : 'users';
  
      const { data, error } = await this.supabase
        .from(tableName)
        .select('*')
        .eq('email', email)
        .single();
  
      if (error || !data) {
        console.error('Error finding user:', error || 'User not found');
        throw new NotFoundException('Không tìm thấy người dùng.');
      }
  
      return {
        email: data.email,
        username: data.username,
        isGoogleAccount: isGoogleAccount,
      };
    } catch (error) {
      console.error('Unexpected error:', error);
      throw new BadRequestException('Đã xảy ra lỗi khi tìm người dùng.');
    }
  }

  async loginWithGoogle(idToken: string) {
    // const { email, name, googleId } = payload;

    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID, // Ensure this matches your Google client ID
      });
  
      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error('Invalid Google token payload.');
      }
  
      const { email, name, sub: googleId } = payload;

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
      const signpayload = { email, isGoogleAccount: true };
      const accessToken = this.jwtService.sign(signpayload, { expiresIn: '15m' });
      const refreshToken = this.jwtService.sign(signpayload, { expiresIn: '7d' });

      // Trả về thông tin người dùng
      return {
        accessToken,
        refreshToken
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

  async verifyResetCode(resetCode: string): Promise<{ email: string }> {
    const email = await this.redisClient.get(`password-reset:${resetCode}`);
    if (email) {
      return { email };
    }
    else {
      throw new NotFoundException('Reset code không hợp lệ.');
    }
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
      .update({ pass: hashedPassword })
      .eq('email', email);

    if (updateError) {
      return false;
    }

    return true;

  }

  async getUserRating(userId: number, movieId: number): Promise<number | null> {
    const { data: existingRating, error } = await this.supabase
      .from('rating')
      .select('point')
      .eq('userID', userId)
      .eq('movieID', movieId)
      .single();

    if (error || !existingRating) {
      return null; // Không có đánh giá
    }

    return existingRating.point; // Trả về điểm đánh giá
  }

  async addRating(userId: number, movieId: number, rating: number): Promise<{ vote_average: number; vote_count: number }> {
    if (rating < 1 || rating > 10) {
      throw new BadRequestException('Điểm đánh giá phải từ 1 đến 10.');
    }

    // Kiểm tra nếu user đã đánh giá phim
    const { data: existingRating } = await this.supabase
      .from('rating')
      .select('*')
      .eq('userID', userId)
      .eq('movieID', movieId)
      .single();

    const movieFromDb1 = await this.movieModel1.findOne({ tmdb_id: movieId }).exec();
    const movie = movieFromDb1;

    if (!movie) {
      throw new NotFoundException('Không tìm thấy phim.');
    }

    // Nếu đã có đánh giá
    if (existingRating) {
      const oldRating = existingRating.point;

      // Loại bỏ điểm cũ và thêm điểm mới
      const adjustedVoteAverage =
        ((movie.vote_average * movie.vote_count) - oldRating + rating) / movie.vote_count;

      movie.vote_average = adjustedVoteAverage;
      await movie.save();

      // Cập nhật điểm mới trong Supabase
      await this.supabase
        .from('rating')
        .update({ point: rating, date: new Date() })
        .eq('userID', userId)
        .eq('movieID', movieId);

      return { vote_average: movie.vote_average, vote_count: movie.vote_count };
    }

    // Nếu chưa có đánh giá, thêm mới
    const newVoteCount = movie.vote_count + 1;
    const newVoteAverage =
      ((movie.vote_average * movie.vote_count) + rating) / newVoteCount;

    movie.vote_average = newVoteAverage;
    movie.vote_count = newVoteCount;
    await movie.save();

    // Thêm đánh giá vào Supabase
    await this.supabase
      .from('rating')
      .insert([{ userID: userId, movieID: movieId, point: rating, date: new Date() }]);

    return { vote_average: movie.vote_average, vote_count: movie.vote_count };
  }

  async addToWatchlist(email: string, movieID: number): Promise<{ success: boolean }> {
    try {
      // Kiểm tra xem phim đã có trong danh sách chưa
      const { data, error } = await this.supabase
        .from('watchlist')
        .select('*')
        .eq('email', email)
        .eq('movieID', movieID)
        .single();

      if (data) {
        console.log("Phim đã có trong danh sách theo dõi");
        return { success: false };
      }
      console.log(email, movieID);
      // Thêm phim vào danh sách theo dõi
      const { error: insertError } = await this.supabase
        .from('watchlist')
        .insert([{ email: email, movieID: movieID }]);

      if (insertError) {
        console.error('Error adding to watchlist:', insertError);
        throw new Error('Đã xảy ra lỗi khi thêm vào danh sách theo dõi.');
      }

      return { success: true };
    } catch (error) {
      console.error('Error in addToWatchlist:', error);
      throw error;
    }
  }

  async getWatchList(email: string, page: number): Promise<{ movies: Movie[]; totalPages: number }> {
    try {
      // Lấy danh sách movieID từ Supabase
      const { data: watchList, error } = await this.supabase
        .from('watchlist')
        .select('movieID')
        .eq('email', email);

      if (error) {
        console.error('Error fetching watch list from Supabase:', error);
        throw new NotFoundException('Không tìm thấy danh sách xem.');
      }

      if (!watchList || watchList.length === 0) {
        throw new NotFoundException('Danh sách xem trống.');
      }
      const skip = (page - 1) * 12;
      const totalPages = Math.ceil(watchList.length / 12);

      // Lấy danh sách movieID cho trang hiện tại
      const paginatedWatchList = watchList.slice(skip, skip + 12);

      // Tìm thông tin chi tiết từng phim trong MongoDB
      const moviePromises = paginatedWatchList.map(async (item) => {
        const movieId = item.movieID;

        const movieFromDb1 = await this.movieModel1.findOne({ tmdb_id: movieId }).exec();
        if (movieFromDb1) return movieFromDb1;

        throw new NotFoundException(`Không tìm thấy phim với ID: ${movieId}`);
      });

      const movies = await Promise.all(moviePromises);

      return { movies, totalPages };
    } catch (error) {
      console.error('Error in getWatchList:', error.message || error);
      throw new NotFoundException('Có lỗi xảy ra khi lấy danh sách xem.');
    }
  }

  async deleteFromWatchlist(email: string, movieID: number): Promise<{ success: boolean }> {
    try {
      const { error } = await this.supabase
        .from('watchlist')
        .delete()
        .eq('email', email)
        .eq('movieID', movieID);

      if (error) {
        console.error('Error deleting from watchlist:', error);
        throw new BadRequestException('Đã xảy ra lỗi khi xóa phim khỏi danh sách theo dõi.');
      }

      return { success: true };
    } catch (error) {
      console.error('Error in deleteFromWatchlist:', error);
      throw error;
    }
  }
  async getFavourite(email: string, page: number): Promise<{ movies: Movie[]; totalPages: number }> {
    try {
      const { data: favourite, error } = await this.supabase
        .from('favourite')
        .select('movieID')
        .eq('email', email);

      if (error) {
        console.error('Error fetching favourite list from Supabase:', error);
        throw new NotFoundException('Không tìm thấy danh sách xem.');
      }

      if (!favourite || favourite.length === 0) {
        throw new NotFoundException('Danh sách xem trống.');
      }
      const skip = (page - 1) * 12;
      const totalPages = Math.ceil(favourite.length / 12);

      const paginatedWatchList = favourite.slice(skip, skip + 12);

      const moviePromises = paginatedWatchList.map(async (item) => {
        const movieId = item.movieID;

        const movieFromDb1 = await this.movieModel1.findOne({ tmdb_id: movieId }).exec();
        if (movieFromDb1) return movieFromDb1;

        throw new NotFoundException(`Không tìm thấy phim với ID: ${movieId}`);
      });

      const movies = await Promise.all(moviePromises);

      return { movies, totalPages };
    } catch (error) {
      console.error('Error in favourite:', error.message || error);
      throw new NotFoundException('Có lỗi xảy ra khi lấy danh sách xem.');
    }
  }

  async deleteFavourite(email: string, movieID: number): Promise<{ success: boolean }> {
    try {
      const { error } = await this.supabase
        .from('favourite')
        .delete()
        .eq('email', email)
        .eq('movieID', movieID);

      if (error) {
        console.error('Error deleting from favourite:', error);
        throw new Error('Đã xảy ra lỗi khi xóa phim khỏi danh sách theo dõi.');
      }

      return { success: true };
    } catch (error) {
      console.error('Error in deleteFromWatchlist:', error);
      throw error;
    }
  }
  async addFavourite(email: string, movieID: number): Promise<{ success: boolean }> {
    try {
      // Kiểm tra xem phim đã có trong danh sách chưa
      const { data, error } = await this.supabase
        .from('favourite')
        .select('*')
        .eq('email', email)
        .eq('movieID', movieID)
        .single();

      if (data) {
        console.log("Phim đã có trong danh sách favourite");
        return { success: false };
      }
      console.log(email, movieID);
      // Thêm phim vào danh sách theo dõi
      const { error: insertError } = await this.supabase
        .from('favourite')
        .insert([{ email: email, movieID: movieID }]);

      if (insertError) {
        console.error('Error adding to favourite:', insertError);
        throw new BadRequestException('Đã xảy ra lỗi khi thêm vào danh sách favourite.');
      }

      return { success: true };
    } catch (error) {
      console.error('Error in addTofavourite:', error);
      throw error;
    }
  }

  async getRecommendations(email: string): Promise<any[]> {
    // Lấy toàn bộ danh sách watchlist
    const watchlistMovies = await this.getAllWatchList(email);
    // console.log(watchlistMovies);
    const favouriteList = await this.getAllFavouriteList(email); // Lấy danh sách favourite

    // Kết hợp và loại bỏ trùng lặp dựa trên `tmdb_id`
    const combinedMovies = [
      ...new Map(
        [...watchlistMovies, ...favouriteList].map((movie) => [movie.tmdb_id, movie])
      ).values(),
    ];

    if (!combinedMovies.length) {
      throw new NotFoundException('Watchlist trống, không thể tạo recommendation.');
    }

    const recommendations = [];

    for (const movie of combinedMovies) {
      // Tìm phim tương tự từ collection `similar`
      const similarData = await this.similarModel.findOne({ tmdb_id: movie.tmdb_id }).exec();
      if (similarData && similarData.similar_movies) {
        recommendations.push(...similarData.similar_movies);
      }
    }

    // Loại bỏ trùng lặp dựa trên `id`
    const uniqueRecommendations = Array.from(
      new Set(recommendations.map((movie) => movie.id))
    ).map((id) => recommendations.find((movie) => movie.id === id));

    // console.log(uniqueRecommendations.slice(0, 20));

    return uniqueRecommendations.slice(0, 20); // Trả về tối đa 20 phim
  }

  async getAllWatchList(email: string): Promise<Movie[]> {
    const { data: watchList, error } = await this.supabase
      .from('watchlist')
      .select('movieID')
      .eq('email', email);

    if (error) {
      console.error('Error fetching watchlist:', error);
      throw new Error('Failed to fetch watchlist.');
    }

    if (!watchList || watchList.length === 0) {
      return []; // Trả về mảng rỗng nếu không có phim
    }

    // Lấy thông tin chi tiết phim từ MongoDB
    const movies = await Promise.all(
      watchList.map(async (item) => {
        const movie = await this.movieModel1.findOne({ tmdb_id: item.movieID }).exec();
        return movie;
      })
    );

    return movies.filter(Boolean); // Loại bỏ các giá trị null (nếu có)
  }

  async getAllFavouriteList(email: string): Promise<Movie[]> {
    const { data: favouriteList, error } = await this.supabase
      .from('favourite')
      .select('movieID')
      .eq('email', email);

    if (error) {
      console.error('Error fetching favourite list:', error);
      throw new Error('Failed to fetch favourite list.');
    }

    if (!favouriteList || favouriteList.length === 0) {
      return []; // Trả về mảng rỗng nếu không có phim
    }

    // Lấy thông tin chi tiết phim từ MongoDB
    const movies = await Promise.all(
      favouriteList.map(async (item) => {
        const movie = await this.movieModel1.findOne({ tmdb_id: item.movieID }).exec();
        return movie;
      })
    );

    return movies.filter(Boolean); // Loại bỏ các giá trị null (nếu có)
  }

  async getCombinedMovies(email: string): Promise<Movie[]> {
    const watchList = await this.getAllWatchList(email); // Lấy danh sách watchlist
    const favouriteList = await this.getAllFavouriteList(email); // Lấy danh sách favourite

    // Kết hợp và loại bỏ trùng lặp dựa trên `tmdb_id`
    const combinedMovies = [
      ...new Map(
        [...watchList, ...favouriteList].map((movie) => [movie.tmdb_id, movie])
      ).values(),
    ];

    return combinedMovies;
  }
  async getRating(
    email: string,
    page: number
  ): Promise<{ movies: (Movie & { userRating: number | null })[]; totalPages: number }> {
    try {
      // Lấy danh sách movieID từ Supabase
      const { data: rating, error } = await this.supabase
        .from('rating')
        .select('movieID, point')
        .eq('userID', email);

      if (error) {
        console.error('Error fetching watch list from Supabase:', error);
        throw new NotFoundException('Không tìm thấy danh sách xem.');
      }

      if (!rating || rating.length === 0) {
        throw new NotFoundException('Danh sách xem trống.');
      }

      const skip = (page - 1) * 12;
      const totalPages = Math.ceil(rating.length / 12);

      // Lấy danh sách movieID cho trang hiện tại
      const paginatedRating = rating.slice(skip, skip + 12);

      // Tìm thông tin chi tiết từng phim trong MongoDB kèm theo điểm đánh giá
      const moviePromises = paginatedRating.map(async (item) => {
        const movieId = item.movieID;
        const movieFromDb1 = await this.movieModel1.findOne({ tmdb_id: movieId }).lean().exec();

        if (movieFromDb1) {
          return {
            ...movieFromDb1, // Đã loại bỏ các thuộc tính Mongoose
            userRating: item.point ?? 0, // Nếu không có điểm, gán giá trị mặc định là 0
          } as unknown as Movie & { userRating: number };
        }

        throw new NotFoundException(`Không tìm thấy phim với ID: ${movieId}`);
      });

      const movies = await Promise.all(moviePromises);

      return { movies, totalPages };
    } catch (error) {
      console.error('Error in getWatchList:', error.message || error);
      throw new NotFoundException('Có lỗi xảy ra khi lấy danh sách xem.');
    }
  }




}