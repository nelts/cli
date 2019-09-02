export interface DevOptions {
    base: string;
    max: string | number;
    config: string;
    port: string | number;
    module: string;
    env?: string;
}
export default function Dev(options: DevOptions): void;
