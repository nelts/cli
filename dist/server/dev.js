"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exec_1 = require("./exec");
function Dev(options) {
    const args = [
        'node_modules/@nelts/process/dist/runtime.js',
        '--module=@nelts/nelts'
    ];
    if (options.base)
        args.push(`--base=${options.base}`);
    if (options.max)
        args.push(`--max=${options.max}`);
    if (options.config)
        args.push(`--config=${options.config}`);
    if (options.port)
        args.push(`--port=${options.port}`);
    if (options.level)
        args.push(`--level=${options.level}`);
    exec_1.default('ts-node', args, { env: 'development' }).then(() => process.exit(0));
}
exports.default = Dev;
