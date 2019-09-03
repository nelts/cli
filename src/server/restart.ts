import exec from './exec';
import * as path from 'path';

export default function ReStart() {
  const pkg = require(path.resolve('package.json'));
  const args: string[] = [ 'restart', pkg.name ];
  exec('pm2', args).then(() => process.exit(0));
}