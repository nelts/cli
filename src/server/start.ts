import exec from './exec';
import * as path from 'path';
import { DevOptions } from './dev';

export default function Start(options: DevOptions) {
  const pkg = require(path.resolve('package.json'));
  const args: string[] = [
    'start',
    'node_modules/@nelts/process/dist/runtime.js',
    `--name=${pkg.name}`,
    '--'
  ];

  if (options.base) args.push(`--base=${options.base}`);
  if (options.max) args.push(`--max=${options.max}`);
  if (options.config) args.push(`--config=${options.config}`);
  if (options.port) args.push(`--port=${options.port}`);
  if (options.module) args.push(`--module=${options.module}`);

  exec('pm2', args).then(() => process.exit(0));
}