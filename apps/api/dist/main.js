"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const helmet_1 = require("helmet");
const compression = require("compression");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    app.setGlobalPrefix('api');
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        defaultVersion: '1',
    });
    app.use((0, helmet_1.default)());
    app.enableCors({
        origin: process.env.CORS_ORIGINS?.split(',') || 'http://localhost:3000',
        credentials: true,
    });
    app.use(compression());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    const port = process.env.PORT || 4000;
    await app.listen(port);
    console.log(`Aurapex Next API running on: http://localhost:${port}/api/v1`);
}
bootstrap();
//# sourceMappingURL=main.js.map