import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
class MovieCredit {
    @Prop()
    adult: boolean;

    @Prop()
    backdrop_path: string;

    @Prop({ type: [Number] })
    genre_ids: number[];

    @Prop()
    id: number;

    @Prop()
    original_language: string;

    @Prop()
    original_title: string;

    @Prop()
    overview: string;

    @Prop()
    popularity: number;

    @Prop()
    poster_path: string;

    @Prop()
    release_date: string;

    @Prop()
    title: string;

    @Prop()
    video: boolean;

    @Prop()
    vote_average: number;

    @Prop()
    vote_count: number;

    @Prop()
    character?: string;

    @Prop()
    credit_id?: string;

    @Prop()
    order?: number;

    @Prop()
    department?: string;

    @Prop()
    job?: string;
}

const MovieCreditSchema = SchemaFactory.createForClass(MovieCredit);

@Schema({ collection: 'people' })
export class People extends Document {
    @Prop()
    tmdb_id: number;

    @Prop()
    adult: boolean;

    @Prop({ type: [String], default: [] })
    also_known_as: string[];

    @Prop()
    biography: string;

    @Prop()
    birthday: string;

    @Prop({ required: false })
    deathday?: string;

    @Prop()
    gender: number;

    @Prop()
    homepage: string;

    @Prop()
    known_for_department: string;

    @Prop()
    name: string;

    @Prop()
    place_of_birth: string;

    @Prop()
    popularity: number;

    @Prop()
    profile_path: string;

    @Prop({
        type: {
            cast: { type: [MovieCreditSchema], default: [] },
            crew: { type: [MovieCreditSchema], default: [] },
        },
    })
    movie_credits: {
        cast: MovieCredit[];
        crew: MovieCredit[];
    };
}

export const PeopleSchema = SchemaFactory.createForClass(People);