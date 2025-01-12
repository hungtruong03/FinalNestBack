"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const recommendation_service_1 = require("./recommendation.service");
const recommendation_controller_1 = require("./recommendation.controller");
const movie_schema_1 = require("../movie/movie.schema");
const config_1 = require("@nestjs/config");
const user_module_1 = require("../user/user.module");
const movie_vector_module_1 = require("../movievector/movie-vector.module");
const movie_vector_schema_1 = require("../movievector/movie-vector.schema");
let RecommendationModule = class RecommendationModule {
};
exports.RecommendationModule = RecommendationModule;
exports.RecommendationModule = RecommendationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: movie_schema_1.Movie.name, schema: movie_schema_1.MovieSchema }], 'movie1Connection'),
            mongoose_1.MongooseModule.forFeature([{ name: movie_vector_schema_1.MovieVector.name, schema: movie_vector_schema_1.MovieVectorSchema }], 'movievectorConnection'),
            config_1.ConfigModule.forRoot({
                envFilePath: '.env',
                isGlobal: true,
            }),
            user_module_1.UserModule,
            movie_vector_module_1.MovieVectorModule
        ],
        providers: [recommendation_service_1.RecommendationService],
        controllers: [recommendation_controller_1.RecommendationController],
    })
], RecommendationModule);
//# sourceMappingURL=recommendation.module.js.map