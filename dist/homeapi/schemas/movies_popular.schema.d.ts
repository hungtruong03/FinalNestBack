import { Document } from 'mongoose';
export declare class MoviesPopular extends Document {
    tmdb_id: number;
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
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
}
export declare const MoviesPopularSchema: import("mongoose").Schema<MoviesPopular, import("mongoose").Model<MoviesPopular, any, any, any, Document<unknown, any, MoviesPopular> & MoviesPopular & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, MoviesPopular, Document<unknown, {}, import("mongoose").FlatRecord<MoviesPopular>> & import("mongoose").FlatRecord<MoviesPopular> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
