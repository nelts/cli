import exec from './exec';
export interface DevOptions {
  base: string,
  max: string | number,
  config: string,
  port: string | number,
  framework: string,
}

export default function Dev(options: DevOptions) {
  const args: string[] = [
    'node_modules/@nelts/process/dist/runtime.js',
    '--module=@nelts/nelts'
  ];

  if (options.base) args.push(`--base=${options.base}`);
  if (options.max) args.push(`--max=${options.max}`);
  if (options.config) args.push(`--config=${options.config}`);
  if (options.port) args.push(`--port=${options.port}`);
  if (options.framework) args.push(`--framework=${options.framework}`);

  exec('ts-node', args, { env: 'development' }).then(() => process.exit(0));
}