// Parsing an authored shortcut string and matching it against a key event, including the Mac Ctrl/Cmd rule — no DOM involved.

import assert from "node:assert/strict";
import test from "node:test";

import { matchesShortcut, parseShortcut, shortcutKey } from "../src/interactions/keyboard-shortcut.ts";

function keyEvent(code: string, modifiers: { ctrl?: boolean; shift?: boolean; alt?: boolean; meta?: boolean } = {}): KeyboardEvent {
    return {
        code,
        ctrlKey: modifiers.ctrl ?? false,
        shiftKey: modifiers.shift ?? false,
        altKey: modifiers.alt ?? false,
        metaKey: modifiers.meta ?? false
    } as KeyboardEvent;
}

test("a plain letter names its own key code", () => {
    assert.deepEqual(parseShortcut("S"), { code: "KeyS", ctrl: false, shift: false, alt: false, meta: false });
});

test("a digit names Digit rather than Key", () => {
    assert.deepEqual(parseShortcut("7"), { code: "Digit7", ctrl: false, shift: false, alt: false, meta: false });
});

test("modifiers combine regardless of the order authored", () => {
    assert.deepEqual(parseShortcut("Shift+Ctrl+P"), { code: "KeyP", ctrl: true, shift: true, alt: false, meta: false });
});

test("Meta, Cmd, Command and Win all name the same modifier", () => {
    for (const word of ["Meta", "Cmd", "Command", "Win"])
        assert.equal(parseShortcut(`${word}+K`)?.meta, true, word);
});

test("a named key resolves through the table", () => {
    assert.deepEqual(parseShortcut("Ctrl+Delete"), { code: "Delete", ctrl: true, shift: false, alt: false, meta: false });
});

test("an F-key up to F24 resolves by number", () => {
    assert.equal(parseShortcut("F12")?.code, "F12");
    assert.equal(parseShortcut("F24")?.code, "F24");
});

test("the last non-modifier wins over an earlier one", () => {
    assert.equal(parseShortcut("A+B")?.code, "KeyB");
});

test("nothing but modifiers names no key", () => {
    assert.equal(parseShortcut("Ctrl+Shift"), null);
});

test("blank or missing input names no key", () => {
    assert.equal(parseShortcut(""), null);
    assert.equal(parseShortcut(null), null);
    assert.equal(parseShortcut(undefined), null);
});

test("modifiers must match exactly off a Mac — Ctrl+S is not Ctrl+Shift+S", () => {
    const shortcut = parseShortcut("Ctrl+S")!;

    assert.equal(matchesShortcut(shortcut, keyEvent("KeyS", { ctrl: true }), false), true);
    assert.equal(matchesShortcut(shortcut, keyEvent("KeyS", { ctrl: true, shift: true }), false), false);
    assert.equal(matchesShortcut(shortcut, keyEvent("KeyS", { meta: true }), false), false);
});

test("an authored Ctrl also answers to Cmd on a Mac keyboard", () => {
    const shortcut = parseShortcut("Ctrl+S")!;

    assert.equal(matchesShortcut(shortcut, keyEvent("KeyS", { ctrl: true }), true), true);
    assert.equal(matchesShortcut(shortcut, keyEvent("KeyS", { meta: true }), true), true);
    // Both pressed together is neither a plain Ctrl nor a plain Cmd press.
    assert.equal(matchesShortcut(shortcut, keyEvent("KeyS", { ctrl: true, meta: true }), true), false);
});

test("an authored Meta keeps meaning only Meta, on a Mac or off one", () => {
    const shortcut = parseShortcut("Meta+S")!;

    assert.equal(matchesShortcut(shortcut, keyEvent("KeyS", { meta: true }), true), true);
    assert.equal(matchesShortcut(shortcut, keyEvent("KeyS", { ctrl: true }), true), false);
    assert.equal(matchesShortcut(shortcut, keyEvent("KeyS", { ctrl: true }), false), false);
});

test("Ctrl+Meta authored together is not loosened by the Mac rule", () => {
    const shortcut = parseShortcut("Ctrl+Meta+S")!;

    assert.equal(matchesShortcut(shortcut, keyEvent("KeyS", { ctrl: true, meta: true }), true), true);
    assert.equal(matchesShortcut(shortcut, keyEvent("KeyS", { ctrl: true }), true), false);
});

test("shortcutKey collides two authored spellings of the same shortcut", () => {
    assert.equal(shortcutKey(parseShortcut("ctrl+s")!), shortcutKey(parseShortcut("Ctrl+S")!));
});
