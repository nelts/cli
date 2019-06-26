"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function rollback(callback) {
    const stacks = [];
    const stash = (fn) => stacks.push(fn);
    callback(stash).catch(e => roll(e));
    async function roll(e) {
        let i = stacks.length;
        while (i--)
            await stacks[i]();
        throw e;
    }
}
exports.default = rollback;
