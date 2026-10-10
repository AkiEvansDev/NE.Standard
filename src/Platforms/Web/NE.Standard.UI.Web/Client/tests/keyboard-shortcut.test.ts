// Parsing an authored shortcut string and matching it against a key event, including the Mac Ctrl/Cmd rule — no DOM involved.

import assert from "node:assert/strict";
import test from "node:test";

import { formatShortcut, isPlainKey, matchesShortcut, parseShortcut, shortcutKey, shortcutWords } from "../src/interactions/keyboard-shortcut.ts";

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

test("a chord is written in the platform's words: Ctrl and Shift elsewhere, Apple's glyphs in Apple's order on a Mac", () => {
    const save = parseShortcut("shift+ctrl+s")!;
    const remove = parseShortcut("Ctrl+Meta+Alt+Delete")!;

    assert.equal(formatShortcut(save, false), "Ctrl+Shift+S");
    assert.equal(formatShortcut(save, true), "⇧⌘S");
    assert.equal(formatShortcut(remove, false), "Ctrl+Alt+Meta+Delete");
    assert.equal(formatShortcut(remove, true), "⌃⌥⌘⌦");
    assert.equal(formatShortcut(parseShortcut("/")!, true), "/");
    assert.equal(formatShortcut(parseShortcut("Up")!, false), "Up");
    assert.equal(formatShortcut(parseShortcut("Esc")!, false), "Esc");
});

test("a package's chord is written as the framework writes its own, and a string naming no key is none", () => {
    assert.equal(shortcutWords.words("ctrl+b"), "Ctrl+B");
    assert.equal(shortcutWords.words("Ctrl"), null);
});

test("a package's chord matches with every modifier exact, so a page's Ctrl+Shift+A is not its Ctrl+A", () => {
    assert.equal(shortcutWords.matches(keyEvent("KeyA", { ctrl: true }), "Ctrl+A"), true);
    assert.equal(shortcutWords.matches(keyEvent("KeyA", { ctrl: true, shift: true }), "Ctrl+A"), false);
    assert.equal(shortcutWords.matches(keyEvent("KeyA", { ctrl: true, alt: true }), "Ctrl+A"), false);
    assert.equal(shortcutWords.matches(keyEvent("KeyZ", { ctrl: true, shift: true }), "Ctrl+Shift+Z"), true);
    assert.equal(shortcutWords.matches(keyEvent("KeyA", { ctrl: true }), "Ctrl"), false);
});

test("a key composing a character is the input method's, Safari's Enter told by its key code", () => {
    assert.equal(shortcutWords.isComposing(composing(true, 13)), true);
    assert.equal(shortcutWords.isComposing(composing(false, 229)), true);
    assert.equal(shortcutWords.isComposing(composing(false, 13)), false);
});

test("navigation answers a plain key: Alt+arrows are the browser's or a move's, Shift only where it is allowed, a composition never", () => {
    assert.equal(isPlainKey(keyEvent("ArrowLeft")), true);
    assert.equal(isPlainKey(keyEvent("ArrowLeft", { alt: true })), false);
    assert.equal(isPlainKey(keyEvent("ArrowLeft", { ctrl: true })), false);
    assert.equal(isPlainKey(keyEvent("ArrowLeft", { meta: true })), false);
    assert.equal(isPlainKey(keyEvent("ArrowDown", { shift: true })), false);
    assert.equal(isPlainKey(keyEvent("ArrowDown", { shift: true }), { shift: true }), true);
    assert.equal(isPlainKey(keyEvent("ArrowDown", { alt: true }), { alt: true }), true);
    assert.equal(isPlainKey(keyEvent("ArrowDown", { alt: true, ctrl: true }), { alt: true }), false);
    assert.equal(isPlainKey(composing(true, 40)), false);
});

/** A key as an input method raises it: the flag, and the code Safari's last key of a composition carries in its place. */
function composing(isComposing: boolean, code: number): KeyboardEvent {
    const event = { isComposing, keyCode: code };

    return event as unknown as KeyboardEvent;
}
