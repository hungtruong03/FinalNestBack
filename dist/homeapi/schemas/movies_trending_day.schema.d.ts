import { Document } from 'mongoose';
export declare class MoviesTrendingDay extends Document {
    tmdb_id: number;
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    media_type: string;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    categories: string[];
}
export declare const MoviesTrendingDaySchema: import("mongoose").Schema<MoviesTrendingDay, import("mongoose").Model<MoviesTrendingDay, any, any, any, Document<unknown, any, MoviesTrendingDay> & MoviesTrendingDay & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, MoviesTrendingDay, Document<unknown, {}, import("mongoose").FlatRecord<MoviesTrendingDay>> & import("mongoose").FlatRecord<MoviesTrendingDay> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
