declare module 'request-progress' {
  import * as fs from 'fs';
  import { Request } from 'request';

  interface ProgressInstance {
    on(name: string, listener: (...args: any[]) => void): ProgressInstance;
    pipe(stream: fs.WriteStream): ProgressInstance;
  }

  export function Progress(req: Request, options: { delay: number }): ProgressInstance;

  export interface ProgressState {
    percent: number,
    speed: number,
    time: {
      elapsed: number
    }
  }
}