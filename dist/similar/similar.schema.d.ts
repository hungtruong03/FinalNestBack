import { Document } from 'mongoose';
export declare class Similar extends Document {
    tmdb_id: number;
    similar_movies: Array<{
        id: number;
        title: string;
        overview: string;
        poster_path: string;
        vote_average: number;
        release_date: string;
        popularity: number;
        genre_ids: number[];
    }>;
}
export declare const SimilarSchema: import("mongoose").Schema<Similar, import("mongoose").Model<Similar, any, any, any, Document<unknown, any, Similar> & Similar & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Similar, Document<unknown, {}, import("mongoose").FlatRecord<Similar>> & import("mongoose").FlatRecord<Similar> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
