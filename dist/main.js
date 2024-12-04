"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const dotenv = require("dotenv");
async function bootstrap() {
    dotenv.config();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    try {
        app.enableCors({
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            credentials: false,
            allowedHeaders: [
                'Origin',
                'X-Requested-With',
                'Content-Type',
                'Accept',
                'Authorization',
                'Access-Control-Allow-Origin',
            ],
        });
        await app.listen(process.env.PORT ?? 3000);
        console.log(`Server is running on http://localhost:${process.env.PORT ?? 3000}`);
    }
    catch (error) {
        console.error('Error starting server:', error);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map