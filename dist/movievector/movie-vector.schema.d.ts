import { Document } from 'mongoose';
export declare class MovieVector extends Document {
    tmdb_id: number;
    vector: number[];
}
export declare const MovieVectorSchema: import("mongoose").Schema<MovieVector, import("mongoose").Model<MovieVector, any, any, any, Document<unknown, any, MovieVector> & MovieVector & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, MovieVector, Document<unknown, {}, import("mongoose").FlatRecord<MovieVector>> & import("mongoose").FlatRecord<MovieVector> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
