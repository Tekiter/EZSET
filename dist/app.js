"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const connect_history_api_fallback_1 = __importDefault(require("connect-history-api-fallback"));
const v1_1 = __importDefault(require("./api/v1"));
const v2_1 = __importDefault(require("./api/v2"));
function setupMiddlewares(app, middlewares) {
    middlewares.forEach(setup => setup(app));
}
function setupSecurity(app) {
    app.disable('x-powered-by');
}
function setupLogger(app) {
    app.use(morgan_1.default('dev', {
        skip: () => app.get('env') === 'test',
    }));
}
function setupParsers(app) {
    app.use(body_parser_1.default.json({ limit: '11mb' }));
    app.use(body_parser_1.default.urlencoded({
        extended: false,
        limit: '10mb',
    }));
}
function setupAPI(app) {
    app.use('/api/v1', v1_1.default);
    app.use('/api/v2', v2_1.default);
    app.use('/api/v1/*', (req, res, next) => {
        const err = new Error('올바르지 않은 API 접근입니다.');
        err.status = 404;
        next(err);
    });
    app.use('/api/v2/*', (req, res, next) => {
        const err = new Error('올바르지 않은 API 접근입니다.');
        err.status = 404;
        next(err);
    });
}
function setupSPA(app) {
    app.use(connect_history_api_fallback_1.default({}));
    app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
}
function setupErrorHandler(app) {
    // Catch 404 and forward to error handler
    app.use((_req, _res, next) => {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
    // Error handler
    app.use((err, _req, res, _next) => {
        // eslint-disable-line no-unused-vars
        return res.status(err.statusCode || 500).json({
            statusCode: err.statusCode,
            status: 'Error',
            message: err.message,
        });
    });
}
const app = express_1.default();
setupMiddlewares(app, [
    setupSecurity,
    setupLogger,
    setupParsers,
    setupAPI,
    setupSPA,
    setupErrorHandler,
]);
exports.default = app;
//# sourceMappingURL=app.js.map