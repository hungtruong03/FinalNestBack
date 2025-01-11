import { BadRequestException, Injectable } from '@nestjs/common';
import { MovieService } from '../movie/movie.service';
import axios from 'axios';

@Injectable()
export class AiapiService {
    private geminiAPIKey: string;

    constructor(
        private readonly movieService: MovieService,
    ) {
        this.geminiAPIKey = process.env.LLM_API_Key;
    }

    async getNavigateDestination(query: string) {
        try {
            const response = await axios.post('https://awd-llm.azurewebsites.net/navigate/', {}, {
                params: { 'llm_api_key': this.geminiAPIKey, query },
            });

            const { data } = response;

            if (data.status !== 200) {
                throw new BadRequestException(`API returned status: ${data.status}`);
            }

            const { route, params } = data.data;

            if ((route === 'CAST_PAGE' || route === 'MOVIE_PAGE') && params?.movie_ids?.length > 0) {
                const convertedId = await this.movieService.getMovieByObjectId(params.movie_ids[0]);
                params.movie_ids = convertedId;
            }

            if (route === 'GENRE_PAGE' && params?.genre_ids?.length > 0) {
                const genresString = params.genre_ids.join(',');
                params.genre_ids = genresString;
            }

            return { route, params };
        } catch (error) {
            console.error('Error fetching navigate destination:', error);
            throw new BadRequestException('Failed to fetch navigate destination');
        }
    }
}
