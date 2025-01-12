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
exports.MovieVectorService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const movie_schema_1 = require("../movie/movie.schema");
const movie_vector_schema_1 = require("./movie-vector.schema");
let MovieVectorService = class MovieVectorService {
    constructor(movieModel, movieVectorModel) {
        this.movieModel = movieModel;
        this.movieVectorModel = movieVectorModel;
    }
    async generateAndStoreMovieVectors() {
        const movies = await this.movieModel.find().exec();
        for (const movie of movies) {
            const vector = this.createMovieVector(movie);
            console.log(vector);
            await this.movieVectorModel.updateOne({ tmdb_id: movie.tmdb_id }, { tmdb_id: movie.tmdb_id, vector }, { upsert: true });
        }
        console.log('Movie vectors generated and stored.');
    }
    createMovieVector(movie) {
        const genreVector = this.encodeGenres(movie.genres);
        const normalizedVoteAverage = movie.vote_average / 10;
        const normalizedVoteCount = Math.log1p(movie.vote_count);
        const releaseYear = movie.release_date && !isNaN(new Date(movie.release_date).getTime())
            ? new Date(movie.release_date).getFullYear()
            : 2000;
        const normalizedReleaseYear = releaseYear / 2025;
        return [...genreVector, normalizedVoteAverage, normalizedVoteCount, normalizedReleaseYear];
    }
    encodeGenres(genres) {
        const allGenreIds = [28, 12, 16, 35, 80, 99, 18];
        return allGenreIds.map((id) => (genres.some((g) => g.id === id) ? 1 : 0));
    }
    async getMovieVector(movieId) {
        const movieVector = await this.movieVectorModel.findOne({ tmdb_id: movieId }).exec();
        if (!movieVector) {
            throw new Error('Movie vector not found.');
        }
        return movieVector.vector;
    }
};
exports.MovieVectorService = MovieVectorService;
exports.MovieVectorService = MovieVectorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(movie_schema_1.Movie.name, 'movie1Connection')),
    __param(1, (0, mongoose_1.InjectModel)(movie_vector_schema_1.MovieVector.name, 'movievectorConnection')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], MovieVectorService);
//# sourceMappingURL=movie-vector.service.js.map