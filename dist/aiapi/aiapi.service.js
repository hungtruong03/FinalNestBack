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
exports.AiapiService = void 0;
const common_1 = require("@nestjs/common");
const movie_service_1 = require("../movie/movie.service");
const axios_1 = require("axios");
let AiapiService = class AiapiService {
    constructor(movieService) {
        this.movieService = movieService;
        this.geminiAPIKey = process.env.LLM_API_Key;
    }
    async getNavigateDestination(query) {
        try {
            const response = await axios_1.default.post('https://awd-llm.azurewebsites.net/navigate/', {}, {
                params: { 'llm_api_key': this.geminiAPIKey, query },
            });
            const { data } = response;
            if (data.status !== 200) {
                throw new common_1.BadRequestException(`API returned status: ${data.status}`);
            }
            const { route, params } = data.data;
            if ((route === 'CAST_PAGE' || route === 'MOVIE_PAGE') && params?.movie_ids?.length > 0) {
                const convertedId = await this.movieService.getMovieByObjectId(params.movie_ids[0]);
                params.movie_ids = convertedId;
            }
            return { route, params };
        }
        catch (error) {
            console.error('Error fetching navigate destination:', error);
            throw new common_1.BadRequestException('Failed to fetch navigate destination');
        }
    }
};
exports.AiapiService = AiapiService;
exports.AiapiService = AiapiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [movie_service_1.MovieService])
], AiapiService);
//# sourceMappingURL=aiapi.service.js.map