/** Whether two values off the wire mean the same thing; JSON arrives as fresh objects, so reference equality is not enough. */
export function areValuesEqual(left: unknown, right: unknown): boolean {
    if (Object.is(left, right))
        return true;

    if (left === null || right === null || left === undefined || right === undefined)
        return false;

    if (left instanceof Date || right instanceof Date)
        return left instanceof Date && right instanceof Date && left.getTime() === right.getTime();

    if (typeof left !== "object" || typeof right !== "object")
        return false;

    if (Array.isArray(left) || Array.isArray(right))
        return Array.isArray(left) && Array.isArray(right) && areArraysEqual(left, right);

    return arePlainObjectsEqual(left as Record<string, unknown>, right as Record<string, unknown>);
}

function areArraysEqual(left: readonly unknown[], right: readonly unknown[]): boolean {
    if (left.length !== right.length)
        return false;

    for (let index = 0; index < left.length; index++) {
        if (!areValuesEqual(left[index], right[index]))
            return false;
    }

    return true;
}

function arePlainObjectsEqual(left: Record<string, unknown>, right: Record<string, unknown>): boolean {
    const leftKeys = Object.keys(left);

    if (leftKeys.length !== Object.keys(right).length)
        return false;

    for (const key of leftKeys) {
        // Own key, not just a readable one: a prototype member's name would otherwise compare equal.
        if (!Object.hasOwn(right, key) || !areValuesEqual(left[key], right[key]))
            return false;
    }

    return true;
}
