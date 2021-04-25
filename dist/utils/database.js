"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const cachegoose_1 = __importDefault(require("cachegoose"));
const mongoose_auto_increment_1 = __importDefault(require("mongoose-auto-increment"));
mongoose_auto_increment_1.default.initialize(mongoose_1.default.connection);
cachegoose_1.default(mongoose_1.default);
const database = {
    initialize(DATABASE_URI) {
        return new Promise(function (resolve, reject) {
            mongoose_1.default.connect(DATABASE_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }, function (err, db) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    },
};
exports.default = database;
//# sourceMappingURL=database.js.map