"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeapiModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const movies_trending_day_schema_1 = require("./schemas/movies_trending_day.schema");
const movies_trending_week_schema_1 = require("./schemas/movies_trending_week.schema");
const movies_popular_schema_1 = require("./schemas/movies_popular.schema");
const movies_upcoming_schema_1 = require("./schemas/movies_upcoming.schema");
const people_schema_1 = require("./schemas/people.schema");
const homeapi_service_1 = require("./homeapi.service");
const homeapi_controller_1 = require("./homeapi.controller");
const movie_module_1 = require("../movie/movie.module");
let HomeapiModule = class HomeapiModule {
};
exports.HomeapiModule = HomeapiModule;
exports.HomeapiModule = HomeapiModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: movies_trending_day_schema_1.MoviesTrendingDay.name, schema: movies_trending_day_schema_1.MoviesTrendingDaySchema }], 'HomeAPIConnection'),
            mongoose_1.MongooseModule.forFeature([{ name: movies_trending_week_schema_1.MoviesTrendingWeek.name, schema: movies_trending_week_schema_1.MoviesTrendingWeekSchema }], 'HomeAPIConnection'),
            mongoose_1.MongooseModule.forFeature([{ name: movies_popular_schema_1.MoviesPopular.name, schema: movies_popular_schema_1.MoviesPopularSchema }], 'HomeAPIConnection'),
            mongoose_1.MongooseModule.forFeature([{ name: movies_upcoming_schema_1.MoviesUpcoming.name, schema: movies_upcoming_schema_1.MoviesUpcomingSchema }], 'HomeAPIConnection'),
            mongoose_1.MongooseModule.forFeature([{ name: people_schema_1.People.name, schema: people_schema_1.PeopleSchema }], 'HomeAPIConnection'),
            movie_module_1.MovieModule,
        ],
        controllers: [homeapi_controller_1.HomeapiController],
        providers: [homeapi_service_1.HomeapiService],
    })
], HomeapiModule);
//# sourceMappingURL=homeapi.module.js.map