import { Document, Schema as MongooseSchema } from 'mongoose';
declare class MovieCredit {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
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
    character?: string;
    credit_id?: string;
    order?: number;
    department?: string;
    job?: string;
}
export declare class People extends Document {
    tmdb_id: number;
    adult: boolean;
    also_known_as: string[];
    biography: string;
    birthday: string;
    deathday?: string;
    gender: number;
    homepage: string;
    known_for_department: string;
    name: string;
    place_of_birth: string;
    popularity: number;
    profile_path: string;
    movie_credits: {
        cast: MovieCredit[];
        crew: MovieCredit[];
    };
}
export declare const PeopleSchema: MongooseSchema<People, import("mongoose").Model<People, any, any, any, Document<unknown, any, People> & People & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, People, Document<unknown, {}, import("mongoose").FlatRecord<People>> & import("mongoose").FlatRecord<People> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export {};
