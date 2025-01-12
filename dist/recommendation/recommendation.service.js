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
exports.RecommendationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const movie_schema_1 = require("../movie/movie.schema");
const user_service_1 = require("../user/user.service");
const movie_vector_schema_1 = require("../movievector/movie-vector.schema");
const movie_vector_service_1 = require("../movievector/movie-vector.service");
let RecommendationService = class RecommendationService {
    constructor(movieModel, movieVectorModel, userService, movieVectorService) {
        this.movieModel = movieModel;
        this.movieVectorModel = movieVectorModel;
        this.userService = userService;
        this.movieVectorService = movieVectorService;
    }
    async recommendMovies(userId, topN = 15) {
        const userMovies = await this.userService.getCombinedMovies(userId);
        const userVectors = await Promise.all(userMovies.map((movie) => this.movieVectorService.getMovieVector(movie.tmdb_id)));
        const allMovieVectors = await this.movieVectorModel.find().exec();
        const recommendations = allMovieVectors.map((vectorDoc) => {
            const similarity = userVectors.reduce((maxSim, userVector) => Math.max(maxSim, this.calculateCosineSimilarity(userVector, vectorDoc.vector)), 0);
            return { movieId: vectorDoc.tmdb_id, similarity };
        });
        const topRecommendations = recommendations
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, topN);
        const movieDetails = await Promise.all(topRecommendations.map((rec) => this.movieModel.findOne({ tmdb_id: rec.movieId }).exec()));
        return movieDetails.filter(Boolean);
    }
    calculateCosineSimilarity(vec1, vec2) {
        const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
        const magnitudeA = Math.sqrt(vec1.reduce((sum, val) => sum + val ** 2, 0));
        const magnitudeB = Math.sqrt(vec2.reduce((sum, val) => sum + val ** 2, 0));
        return dotProduct / (magnitudeA * magnitudeB);
    }
};
exports.RecommendationService = RecommendationService;
exports.RecommendationService = RecommendationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(movie_schema_1.Movie.name, 'movie1Connection')),
    __param(1, (0, mongoose_1.InjectModel)(movie_vector_schema_1.MovieVector.name, 'movievectorConnection')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        user_service_1.UserService,
        movie_vector_service_1.MovieVectorService])
], RecommendationService);
//# sourceMappingURL=recommendation.service.js.map