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
exports.MoviesUpcomingSchema = exports.MoviesUpcoming = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let MoviesUpcoming = class MoviesUpcoming extends mongoose_2.Document {
};
exports.MoviesUpcoming = MoviesUpcoming;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], MoviesUpcoming.prototype, "tmdb_id", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], MoviesUpcoming.prototype, "adult", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MoviesUpcoming.prototype, "backdrop_path", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Number] }),
    __metadata("design:type", Array)
], MoviesUpcoming.prototype, "genre_ids", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MoviesUpcoming.prototype, "original_language", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MoviesUpcoming.prototype, "original_title", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MoviesUpcoming.prototype, "overview", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], MoviesUpcoming.prototype, "popularity", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MoviesUpcoming.prototype, "poster_path", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MoviesUpcoming.prototype, "release_date", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MoviesUpcoming.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], MoviesUpcoming.prototype, "video", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], MoviesUpcoming.prototype, "vote_average", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], MoviesUpcoming.prototype, "vote_count", void 0);
exports.MoviesUpcoming = MoviesUpcoming = __decorate([
    (0, mongoose_1.Schema)({ collection: 'movies_upcoming' })
], MoviesUpcoming);
exports.MoviesUpcomingSchema = mongoose_1.SchemaFactory.createForClass(MoviesUpcoming);
//# sourceMappingURL=movies_upcoming.schema.js.map