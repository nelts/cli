type callbackSchema = () => PromiseLike<void>;
export type Stash = (fn: callbackSchema) => any;
export default function rollback(callback: (stash: Stash) => Promise<void>) {
  const stacks: callbackSchema[] = [];
  const stash: Stash = (fn: callbackSchema) => stacks.push(fn);
  callback(stash).catch(e => roll(e));
  async function roll(e: Error) {
    let i = stacks.length;
    while (i--) await stacks[i]();
    throw e;
  }
}