import exec from './exec';
export interface DevOptions {
  base: string,
  max: string | number,
  config: string,
  port: string | number,
  module: string,
  env?: string,
}

export default function Dev(options: DevOptions) {
  const args: string[] = ['node_modules/@nelts/process/dist/runtime.js'];

  if (options.base) args.push(`--base=${options.base}`);
  if (options.max) args.push(`--max=${options.max}`);
  if (options.config) args.push(`--config=${options.config}`);
  if (options.port) args.push(`--port=${options.port}`);
  if (options.module) args.push(`--module=${options.module}`);
  if (options.env) args.push(`--env=${options.env}`);

  exec('ts-node', args).then(() => process.exit(0));
}