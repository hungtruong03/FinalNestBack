import { AiapiService } from './aiapi.service';
export declare class AiapiController {
    private readonly aiapiService;
    constructor(aiapiService: AiapiService);
    getNavigateDestination(query: string): Promise<{
        route: any;
        params: any;
    }>;
}
