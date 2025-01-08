import { Document } from 'mongoose';
export declare class MoviesTrendingWeek extends Document {
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
export declare const MoviesTrendingWeekSchema: import("mongoose").Schema<MoviesTrendingWeek, import("mongoose").Model<MoviesTrendingWeek, any, any, any, Document<unknown, any, MoviesTrendingWeek> & MoviesTrendingWeek & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, MoviesTrendingWeek, Document<unknown, {}, import("mongoose").FlatRecord<MoviesTrendingWeek>> & import("mongoose").FlatRecord<MoviesTrendingWeek> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
