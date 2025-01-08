"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const user_module_1 = require("./user/user.module");
const supabase_js_1 = require("@supabase/supabase-js");
const mongoose_1 = require("@nestjs/mongoose");
const movie_module_1 = require("./movie/movie.module");
const config_1 = require("@nestjs/config");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply((req, res, next) => {
            if (req.method === 'OPTIONS') {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
                res.status(200).send();
            }
            else {
                next();
            }
        });
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: '.env',
                isGlobal: true,
            }),
            user_module_1.UserModule,
            mongoose_1.MongooseModule.forRoot(process.env.MONGO_URI_MOVIE_2, {
                connectionName: 'movie2Connection',
            }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGO_URI_MOVIE_1, {
                connectionName: 'movie1Connection',
            }),
            movie_module_1.MovieModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: 'SUPABASE_CLIENT',
                useFactory: () => {
                    const supabaseUrl = process.env.SUPABASE_URL;
                    const supabaseKey = process.env.SUPABASE_ANON_KEY;
                    return (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
                },
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map