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
exports.HomeapiService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const movies_trending_day_schema_1 = require("./schemas/movies_trending_day.schema");
const movies_trending_week_schema_1 = require("./schemas/movies_trending_week.schema");
const movies_popular_schema_1 = require("./schemas/movies_popular.schema");
const movies_upcoming_schema_1 = require("./schemas/movies_upcoming.schema");
const people_schema_1 = require("./schemas/people.schema");
let HomeapiService = class HomeapiService {
    constructor(moviesTrendingDay, moviesTrendingWeek, moviesPopular, moviesUpcoming, people) {
        this.moviesTrendingDay = moviesTrendingDay;
        this.moviesTrendingWeek = moviesTrendingWeek;
        this.moviesPopular = moviesPopular;
        this.moviesUpcoming = moviesUpcoming;
        this.people = people;
    }
    async fetchTrendingDay(limit) {
        const results = await this.moviesTrendingDay.find({}).sort({ popularity: -1 }).limit(limit).exec();
        return results;
    }
    async fetchTrendingWeek(limit) {
        const results = await this.moviesTrendingWeek.find({}).sort({ popularity: -1 }).limit(limit).exec();
        return results;
    }
    async fetchPopular(limit) {
        const results = await this.moviesPopular.find({}).sort({ popularity: -1 }).limit(limit).exec();
        return results;
    }
    async fetchUpcoming(limit) {
        const results = await this.moviesUpcoming.find({}).sort({ release_date: -1 }).limit(limit).exec();
        return results;
    }
    async fetchPeople(tmdb_id) {
        const result = await this.people.findOne({ tmdb_id }).exec();
        return result;
    }
};
exports.HomeapiService = HomeapiService;
exports.HomeapiService = HomeapiService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(movies_trending_day_schema_1.MoviesTrendingDay.name, 'HomeAPIConnection')),
    __param(1, (0, mongoose_1.InjectModel)(movies_trending_week_schema_1.MoviesTrendingWeek.name, 'HomeAPIConnection')),
    __param(2, (0, mongoose_1.InjectModel)(movies_popular_schema_1.MoviesPopular.name, 'HomeAPIConnection')),
    __param(3, (0, mongoose_1.InjectModel)(movies_upcoming_schema_1.MoviesUpcoming.name, 'HomeAPIConnection')),
    __param(4, (0, mongoose_1.InjectModel)(people_schema_1.People.name, 'HomeAPIConnection')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], HomeapiService);
//# sourceMappingURL=homeapi.service.js.map