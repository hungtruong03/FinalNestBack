"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const user_module_1 = require("./user/user.module");
const supabase_js_1 = require("@supabase/supabase-js");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply((req, res, next) => {
            if (req.method === 'OPTIONS') {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
                res.setHeader('Access-Control-Allow-Credentials', 'true');
                res.status(200).send();
            }
            else {
                next();
            }
        });
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            user_module_1.UserModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: 'SUPABASE_CLIENT',
                useFactory: () => {
                    const supabaseUrl = process.env.SUPABASE_URL || 'https://ryswjkikhmyotstyscxm.supabase.co';
                    const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5c3dqa2lraG15b3RzdHlzY3htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMTYzNTYsImV4cCI6MjA0ODc5MjM1Nn0.ynpt_RllNm3EuWZVIAwOrRqNq0pvamkgLNdL6QTlW5o';
                    return (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
                },
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map