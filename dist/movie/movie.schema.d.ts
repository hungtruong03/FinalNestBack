import { Document } from 'mongoose';
export declare class Movie extends Document {
    tmdb_id: number;
    title: string;
    overview: string;
    genres: Array<{
        id: number;
        name: string;
    }>;
    release_date: string;
    vote_average: number;
    vote_count: number;
    poster_path: string;
    trailers: Array<{
        key: string;
        name: string;
    }>;
    credits: {
        cast: Array<{
            cast_id: number;
            character: string;
            name: string;
            profile_path: string;
            order: number;
        }>;
        crew: Array<{
            credit_id: string;
            department: string;
            job: string;
            name: string;
            profile_path: string;
        }>;
    };
}
export declare const MovieSchema: import("mongoose").Schema<Movie, import("mongoose").Model<Movie, any, any, any, Document<unknown, any, Movie> & Movie & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Movie, Document<unknown, {}, import("mongoose").FlatRecord<Movie>> & import("mongoose").FlatRecord<Movie> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
