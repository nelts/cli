import exec from './exec';
import * as path from 'path';

export default function Stop() {
  const pkg = require(path.resolve('package.json'));
  const args: string[] = [ 'stop', pkg.name ];
  exec('pm2', args).then(() => process.exit(0));
}