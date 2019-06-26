declare type callbackSchema = () => PromiseLike<void>;
export declare type Stash = (fn: callbackSchema) => any;
export default function rollback(callback: (stash: Stash) => Promise<void>): void;
export {};
