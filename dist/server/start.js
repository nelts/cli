"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exec_1 = require("./exec");
const path = require("path");
function Start(options) {
    const pkg = require(path.resolve('package.json'));
    const args = [
        'start',
        'node_modules/@nelts/process/dist/runtime.js',
        `--name=${pkg.name}`,
        '--'
    ];
    if (options.base)
        args.push(`--base=${options.base}`);
    if (options.max)
        args.push(`--max=${options.max}`);
    if (options.config)
        args.push(`--config=${options.config}`);
    if (options.port)
        args.push(`--port=${options.port}`);
    if (options.module)
        args.push(`--module=${options.module}`);
    if (options.env)
        args.push(`--env=${options.env}`);
    exec_1.default('pm2', args).then(() => process.exit(0));
}
exports.default = Start;
