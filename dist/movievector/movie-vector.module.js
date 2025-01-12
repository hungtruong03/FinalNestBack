"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieVectorModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const movie_vector_schema_1 = require("./movie-vector.schema");
const movie_vector_service_1 = require("./movie-vector.service");
const movie_vector_controller_1 = require("./movie-vector.controller");
const movie_schema_1 = require("../movie/movie.schema");
const config_1 = require("@nestjs/config");
const movie_module_1 = require("../movie/movie.module");
let MovieVectorModule = class MovieVectorModule {
};
exports.MovieVectorModule = MovieVectorModule;
exports.MovieVectorModule = MovieVectorModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: movie_schema_1.Movie.name, schema: movie_schema_1.MovieSchema }], 'movie1Connection'),
            mongoose_1.MongooseModule.forFeature([{ name: movie_vector_schema_1.MovieVector.name, schema: movie_vector_schema_1.MovieVectorSchema }], 'movievectorConnection'),
            config_1.ConfigModule.forRoot({
                envFilePath: '.env',
                isGlobal: true,
            }),
            movie_module_1.MovieModule
        ],
        providers: [movie_vector_service_1.MovieVectorService],
        controllers: [movie_vector_controller_1.MovieVectorController],
        exports: [movie_vector_service_1.MovieVectorService],
    })
], MovieVectorModule);
//# sourceMappingURL=movie-vector.module.js.map