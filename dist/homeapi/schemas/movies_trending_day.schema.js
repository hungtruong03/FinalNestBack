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
exports.MoviesTrendingDaySchema = exports.MoviesTrendingDay = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let MoviesTrendingDay = class MoviesTrendingDay extends mongoose_2.Document {
};
exports.MoviesTrendingDay = MoviesTrendingDay;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], MoviesTrendingDay.prototype, "tmdb_id", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], MoviesTrendingDay.prototype, "adult", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MoviesTrendingDay.prototype, "backdrop_path", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Number] }),
    __metadata("design:type", Array)
], MoviesTrendingDay.prototype, "genre_ids", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MoviesTrendingDay.prototype, "media_type", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MoviesTrendingDay.prototype, "original_language", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MoviesTrendingDay.prototype, "original_title", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MoviesTrendingDay.prototype, "overview", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], MoviesTrendingDay.prototype, "popularity", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MoviesTrendingDay.prototype, "poster_path", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MoviesTrendingDay.prototype, "release_date", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MoviesTrendingDay.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], MoviesTrendingDay.prototype, "video", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], MoviesTrendingDay.prototype, "vote_average", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], MoviesTrendingDay.prototype, "vote_count", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], MoviesTrendingDay.prototype, "categories", void 0);
exports.MoviesTrendingDay = MoviesTrendingDay = __decorate([
    (0, mongoose_1.Schema)({ collection: 'movies_trending_day' })
], MoviesTrendingDay);
exports.MoviesTrendingDaySchema = mongoose_1.SchemaFactory.createForClass(MoviesTrendingDay);
//# sourceMappingURL=movies_trending_day.schema.js.map