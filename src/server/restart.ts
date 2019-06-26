import exec from './exec';
import * as path from 'path';

export default function Start() {
  const pkg = require(path.resolve('package.json'));
  const args: string[] = [ 'restart', pkg.name ];
  exec('pm2', args, { env: 'production' }).then(() => process.exit(0));
}