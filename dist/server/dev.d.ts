export interface DevOptions {
    base: string;
    max: string | number;
    config: string;
    port: string | number;
    framework: string;
}
export default function Dev(options: DevOptions): void;
