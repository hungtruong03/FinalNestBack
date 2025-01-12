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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieVectorController = void 0;
const common_1 = require("@nestjs/common");
const movie_vector_service_1 = require("./movie-vector.service");
let MovieVectorController = class MovieVectorController {
    constructor(movieVectorService) {
        this.movieVectorService = movieVectorService;
    }
    async generateMovieVectors() {
        await this.movieVectorService.generateAndStoreMovieVectors();
        return { message: 'Movie vectors generated and stored.' };
    }
};
exports.MovieVectorController = MovieVectorController;
__decorate([
    (0, common_1.Post)('generate'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MovieVectorController.prototype, "generateMovieVectors", null);
exports.MovieVectorController = MovieVectorController = __decorate([
    (0, common_1.Controller)('movie-vectors'),
    __metadata("design:paramtypes", [movie_vector_service_1.MovieVectorService])
], MovieVectorController);
//# sourceMappingURL=movie-vector.controller.js.map