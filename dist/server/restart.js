"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exec_1 = require("./exec");
const path = require("path");
function Start() {
    const pkg = require(path.resolve('package.json'));
    const args = ['restart', pkg.name];
    exec_1.default('pm2', args, { env: 'production' }).then(() => process.exit(0));
}
exports.default = Start;