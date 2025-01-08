import { Document } from 'mongoose';
export declare class MoviesUpcoming extends Document {
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
export declare const MoviesUpcomingSchema: import("mongoose").Schema<MoviesUpcoming, import("mongoose").Model<MoviesUpcoming, any, any, any, Document<unknown, any, MoviesUpcoming> & MoviesUpcoming & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, MoviesUpcoming, Document<unknown, {}, import("mongoose").FlatRecord<MoviesUpcoming>> & import("mongoose").FlatRecord<MoviesUpcoming> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
