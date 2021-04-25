"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = exports.io = void 0;
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
//socket io to Attendance
exports.io = undefined;
function initSocket(app, SOCKET_PORT) {
    return __awaiter(this, void 0, void 0, function* () {
        const server = http_1.default.createServer(app);
        const io = socket_io_1.default(server, { origins: '*:*' });
        //Attendance State
        var curState = {
            flag: false,
            time: 180000,
        };
        //connect event
        io.on('connection', function (socket) {
            socket.on('join', function (data) {
                socket.join(data.roomName);
                io.to(socket.id).emit('attendance', curState);
            });
            //attendance event lisner
            socket.on('attendance', function (data) {
                curState.flag = data.flag;
                if (!data.flag)
                    curState.time = 18000;
                var msg = {
                    flag: data.flag,
                    time: curState.time,
                };
                //broadcast changed state
                // socket.broadcast.to('attendance').emit('attendance', msg)
                io.to('attendance').emit('attendance', msg);
            });
            //setTimeout 3m when attendance start
            socket.on('start', function (data) {
                curState.time = 180000;
                var timerID = setInterval(function () {
                    if (curState.flag == false) {
                        clearInterval(timerID);
                        curState.time = 180000;
                    }
                    curState.time -= 1000;
                    if (curState.time == 0) {
                        clearInterval(timerID);
                        if (curState.flag == true) {
                            var msg = {
                                flag: false,
                            };
                            curState.flag = false;
                            io.to('attendance').emit('attendance', msg);
                        }
                    }
                }, 1000);
            });
        });
        //start socket.io server
        server.listen(SOCKET_PORT, function () {
            console.log(`[socket io] server listening on port ${SOCKET_PORT}`); // eslint-disable-line no-console
        });
    });
}
exports.initSocket = initSocket;
//# sourceMappingURL=socket.js.map