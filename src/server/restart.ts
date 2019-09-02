import exec from './exec';
import * as path from 'path';
import { DevOptions } from './dev';

export default function ReStart(options: DevOptions) {
  const pkg = require(path.resolve('package.json'));
  const args: string[] = [ 'restart', pkg.name ];
  exec('pm2', args, { env: options.env || 'production' }).then(() => process.exit(0));
}