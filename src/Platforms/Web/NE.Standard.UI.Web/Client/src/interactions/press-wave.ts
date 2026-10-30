// A press's wave as the page holds it while it plays (press-ripple-engine.ts): an element of its own, the pressed thing's last child,
// so the browser's compositor grows and fades it whatever the page's script is doing. It is no one else's business: an observer that
// re-reads a component on a change inside it passes it by, and a copy of a pressed thing leaves it out.

import { PressWaveClass } from "../addressing/dom-attributes.ts";

/** Whether a record only puts a wave in or takes one out. */
export function isPressWaveRecord(record: MutationRecord): boolean {
    if (record.type !== "childList" || record.addedNodes.length + record.removedNodes.length === 0)
        return false;

    for (const node of record.addedNodes) {
        if (!isPressWave(node))
            return false;
    }

    for (const node of record.removedNodes) {
        if (!isPressWave(node))
            return false;
    }

    return true;
}

function isPressWave(node: Node): boolean {
    return node instanceof Element && node.classList.contains(PressWaveClass);
}

/** Whether a batch holds nothing but waves put in and taken out. */
export function onlyPressWaves(records: readonly MutationRecord[]): boolean {
    return records.length > 0 && records.every(isPressWaveRecord);
}

/** Takes the waves out of a copy of a pressed thing (a select's option shown in its field). */
export function removePressWaves(root: ParentNode): void {
    for (const wave of root.querySelectorAll(`.${PressWaveClass}`))
        wave.remove();
}
