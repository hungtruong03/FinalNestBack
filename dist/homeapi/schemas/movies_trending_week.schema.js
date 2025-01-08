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
exports.MoviesTrendingWeekSchema = exports.MoviesTrendingWeek = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let MoviesTrendingWeek = class MoviesTrendingWeek extends mongoose_2.Document {
};
exports.MoviesTrendingWeek = MoviesTrendingWeek;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], MoviesTrendingWeek.prototype, "tmdb_id", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], MoviesTrendingWeek.prototype, "adult", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MoviesTrendingWeek.prototype, "backdrop_path", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Number] }),
    __metadata("design:type", Array)
], MoviesTrendingWeek.prototype, "genre_ids", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MoviesTrendingWeek.prototype, "media_type", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MoviesTrendingWeek.prototype, "original_language", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MoviesTrendingWeek.prototype, "original_title", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MoviesTrendingWeek.prototype, "overview", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], MoviesTrendingWeek.prototype, "popularity", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MoviesTrendingWeek.prototype, "poster_path", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MoviesTrendingWeek.prototype, "release_date", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MoviesTrendingWeek.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], MoviesTrendingWeek.prototype, "video", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], MoviesTrendingWeek.prototype, "vote_average", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], MoviesTrendingWeek.prototype, "vote_count", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], MoviesTrendingWeek.prototype, "categories", void 0);
exports.MoviesTrendingWeek = MoviesTrendingWeek = __decorate([
    (0, mongoose_1.Schema)({ collection: 'movies_trending_week' })
], MoviesTrendingWeek);
exports.MoviesTrendingWeekSchema = mongoose_1.SchemaFactory.createForClass(MoviesTrendingWeek);
//# sourceMappingURL=movies_trending_week.schema.js.map