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
exports.PeopleSchema = exports.People = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let MovieCredit = class MovieCredit {
};
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], MovieCredit.prototype, "adult", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MovieCredit.prototype, "backdrop_path", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Number] }),
    __metadata("design:type", Array)
], MovieCredit.prototype, "genre_ids", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], MovieCredit.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MovieCredit.prototype, "original_language", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MovieCredit.prototype, "original_title", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MovieCredit.prototype, "overview", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], MovieCredit.prototype, "popularity", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MovieCredit.prototype, "poster_path", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MovieCredit.prototype, "release_date", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MovieCredit.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], MovieCredit.prototype, "video", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], MovieCredit.prototype, "vote_average", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], MovieCredit.prototype, "vote_count", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MovieCredit.prototype, "character", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MovieCredit.prototype, "credit_id", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], MovieCredit.prototype, "order", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MovieCredit.prototype, "department", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MovieCredit.prototype, "job", void 0);
MovieCredit = __decorate([
    (0, mongoose_1.Schema)()
], MovieCredit);
const MovieCreditSchema = mongoose_1.SchemaFactory.createForClass(MovieCredit);
let People = class People extends mongoose_2.Document {
};
exports.People = People;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], People.prototype, "tmdb_id", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], People.prototype, "adult", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], People.prototype, "also_known_as", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], People.prototype, "biography", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], People.prototype, "birthday", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], People.prototype, "deathday", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], People.prototype, "gender", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], People.prototype, "homepage", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], People.prototype, "known_for_department", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], People.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], People.prototype, "place_of_birth", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], People.prototype, "popularity", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], People.prototype, "profile_path", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            cast: { type: [MovieCreditSchema], default: [] },
            crew: { type: [MovieCreditSchema], default: [] },
        },
    }),
    __metadata("design:type", Object)
], People.prototype, "movie_credits", void 0);
exports.People = People = __decorate([
    (0, mongoose_1.Schema)({ collection: 'people' })
], People);
exports.PeopleSchema = mongoose_1.SchemaFactory.createForClass(People);
//# sourceMappingURL=people.schema.js.map