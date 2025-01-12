"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const movie_schema_1 = require("./movie.schema");
const axios_1 = require("axios");
let MovieService = class MovieService {
    constructor(movieModel1, movieModel2) {
        this.movieModel1 = movieModel1;
        this.movieModel2 = movieModel2;
    }
    async getMovieById(tmdb_id) {
        console.log(`Searching for movie with tmdb_id2: ${tmdb_id}`);
        const movieFromDb1 = await this.movieModel1.findOne({ tmdb_id }).exec();
        if (movieFromDb1) {
            console.log('Found in movie1Connection');
            return movieFromDb1;
        }
        throw new common_1.NotFoundException('Movie not found in either database');
    }
    async getMovieCredits(tmdb_id) {
        console.log(`Searching for movie with tmdb_id1: ${tmdb_id}`);
        const movieFromDb1 = await this.movieModel1.findOne({ tmdb_id }).exec();
        if (movieFromDb1) {
            console.log('Found in movie1Connection');
            return movieFromDb1.credits;
        }
        throw new common_1.NotFoundException('Movie not found.');
    }
    async getTrailers(tmdb_id) {
        const movieFromDb1 = await this.movieModel1.findOne({ tmdb_id }).exec();
        if (!movieFromDb1)
            throw new common_1.NotFoundException('Movie not found.');
        return movieFromDb1.trailers;
    }
    async searchMovies(filters) {
        const { keyword, minVoteAverage, minVoteCount, releaseDateFrom, releaseDateTo, genres, sortBy = 'vote_average', sortOrder = 'desc', limit = 10, page = 1, } = filters;
        try {
            const query = {};
            if (keyword) {
                query.title = { $regex: keyword, $options: 'i' };
            }
            if (minVoteAverage !== undefined) {
                query.vote_average = { $gte: minVoteAverage };
            }
            if (minVoteCount !== undefined) {
                query.vote_count = { $gte: minVoteCount };
            }
            if (releaseDateFrom || releaseDateTo) {
                query.release_date = {};
                if (releaseDateFrom)
                    query.release_date.$gte = releaseDateFrom;
                if (releaseDateTo)
                    query.release_date.$lte = releaseDateTo;
            }
            if (genres && genres.length > 0) {
                query.genres = { $elemMatch: { name: { $in: genres } } };
            }
            const skip = (page - 1) * limit;
            const moviesFromDb1 = await this.movieModel1
                .find(query)
                .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
                .skip(skip)
                .limit(limit)
                .exec();
            const countDb1 = await this.movieModel1.countDocuments(query).exec();
            const total = Math.ceil((countDb1) / limit);
            console.log('duoc ở BES');
            return { movies: moviesFromDb1, total };
        }
        catch (error) {
            console.log(error);
        }
    }
    async getMovieReviews(tmdb_id) {
        const movieFromDb1 = await this.movieModel1.findOne({ tmdb_id }).exec();
        if (movieFromDb1 && movieFromDb1.reviews) {
            return movieFromDb1.reviews;
        }
        return [];
    }
    async searchAIMovies(filters) {
        const { keyword, minVoteAverage, minVoteCount, releaseDateFrom, releaseDateTo, genres, sortBy = 'vote_average', sortOrder = 'desc', limit = 10, page = 1, } = filters;
        try {
            const formattedKeyword = keyword ? keyword.replace(/\s+/g, '+') : '';
            const apiUrl = `https://awd-llm.azurewebsites.net/retriever?llm_api_key=${process.env.LLM_API_KEY}&collection_name=movies&query=${formattedKeyword}&amount=10&threshold=0.5`;
            const response = await axios_1.default.get(apiUrl);
            const movieIds = response.data.data.result;
            if (!movieIds || movieIds.length === 0) {
                return { movies: [], total: 0 };
            }
            const query = { _id: { $in: movieIds } };
            if (minVoteAverage !== undefined) {
                query.vote_average = { $gte: minVoteAverage };
            }
            if (minVoteCount !== undefined) {
                query.vote_count = { $gte: minVoteCount };
            }
            if (releaseDateFrom || releaseDateTo) {
                query.release_date = {};
                if (releaseDateFrom)
                    query.release_date.$gte = releaseDateFrom;
                if (releaseDateTo)
                    query.release_date.$lte = releaseDateTo;
            }
            if (genres && genres.length > 0) {
                query.genres = { $elemMatch: { name: { $in: genres } } };
            }
            const skip = (page - 1) * limit;
            const moviesFromDb1 = await this.movieModel1
                .find(query)
                .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
                .skip(skip)
                .limit(limit)
                .exec();
            const countDb1 = await this.movieModel1.countDocuments(query).exec();
            const total = Math.ceil(countDb1 / limit);
            return { movies: moviesFromDb1, total };
        }
        catch (error) {
            console.log(error);
            throw new common_1.NotFoundException('An error occurred during the AI movie search');
        }
    }
    async getMovieByObjectId(objectId) {
        const movieFromDb1 = await this.movieModel1.findById(objectId).exec();
        if (movieFromDb1) {
            return movieFromDb1.tmdb_id;
        }
        throw new common_1.NotFoundException('Movie not found.');
    }
};
exports.MovieService = MovieService;
exports.MovieService = MovieService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(movie_schema_1.Movie.name, 'movie1Connection')),
    __param(1, (0, mongoose_1.InjectModel)(movie_schema_1.Movie.name, 'movie2Connection')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], MovieService);
//# sourceMappingURL=movie.service.js.map