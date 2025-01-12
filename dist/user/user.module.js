"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const user_controller_1 = require("./user.controller");
const jwt_1 = require("@nestjs/jwt");
const jwt_strategy_1 = require("./jwt.strategy");
const supabase_js_1 = require("@supabase/supabase-js");
const Redis = require("ioredis");
const jwt_middleware_1 = require("./jwt.middleware");
const mongoose_1 = require("@nestjs/mongoose");
const movie_schema_1 = require("../movie/movie.schema");
const similar_schema_1 = require("../similar/similar.schema");
const config_1 = require("@nestjs/config");
let UserModule = class UserModule {
    configure(consumer) {
        consumer
            .apply(jwt_middleware_1.JwtMiddleware)
            .forRoutes('user/rate/:movieId', 'user/watchlist', 'user/favourite', 'user/profile');
    }
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'SECRET_KEY',
                signOptions: { expiresIn: '5h' },
            }),
            mongoose_1.MongooseModule.forFeature([{ name: movie_schema_1.Movie.name, schema: movie_schema_1.MovieSchema }], 'movie1Connection'),
            mongoose_1.MongooseModule.forFeature([{ name: similar_schema_1.Similar.name, schema: similar_schema_1.SimilarSchema }], 'similarConnection'),
            config_1.ConfigModule.forRoot({
                envFilePath: '.env',
                isGlobal: true,
            })
        ],
        providers: [
            user_service_1.UserService,
            jwt_strategy_1.JwtStrategy,
            {
                provide: 'SUPABASE_CLIENT',
                useFactory: () => {
                    return (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
                },
            },
            {
                provide: 'REDIS_CLIENT',
                useFactory: () => {
                    return new Redis(process.env.REDIS_URL, {
                        tls: { rejectUnauthorized: false },
                    });
                },
            },
        ],
        controllers: [user_controller_1.UserController],
        exports: [user_service_1.UserService],
    })
], UserModule);
//# sourceMappingURL=user.module.js.map