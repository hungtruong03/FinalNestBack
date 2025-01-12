import { Model } from 'mongoose';
import { Similar } from './similar.schema';
export declare class SimilarService {
    private readonly similarModel;
    constructor(similarModel: Model<Similar>);
    getSimilarMovies(movieId: number): Promise<any[]>;
}
