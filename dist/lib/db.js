"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
// import "server-only";
const client_1 = require("@prisma/client");
let prisma;
if (process.env.NODE_ENV === "production") {
    exports.db = prisma = new client_1.PrismaClient();
}
else {
    if (!global.prisma) {
        global.prisma = new client_1.PrismaClient();
    }
    exports.db = prisma = global.prisma;
}
