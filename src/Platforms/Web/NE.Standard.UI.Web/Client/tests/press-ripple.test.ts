// The press ripple: a wave from the press point that grows to the farthest corner while held, finishes quickly and fades on release,
// fades where it stands on a cancel (a touch turning into a scroll is one), and plays nowhere under reduced motion. It reaches buttons,
// list entries and the rows whose press does something; an icon that is the whole face shrinks while held, and nothing else does.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";
import { FakeElement, FakeEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

class FakePointerEvent extends FakeEvent {
    public readonly button: number;
    public readonly pointerId: number;
    public readonly clientX: number;
    public readonly clientY: number;

    public constructor(type: string, init: { button?: number; pointerId?: number; clientX?: number; clientY?: number } = {}) {
        super(type);
        this.button = init.button ?? 0;
        this.pointerId = init.pointerId ?? 1;
        this.clientX = init.clientX ?? 0;
        this.clientY = init.clientY ?? 0;
    }
}

/** A Web Animation as the engine drives it: its keyframes and timing, its rate, and a finish a test raises. */
class FakeAnimation {
    public readonly keyframes: readonly Record<string, unknown>[];
    public readonly options: KeyframeAnimationOptions;
    public rate = 1;
    public cancelled = false;
    private readonly finishers: (() => void)[] = [];

    public constructor(keyframes: readonly Record<string, unknown>[], options: KeyframeAnimationOptions) {
        this.keyframes = keyframes;
        this.options = options;
    }

    public updatePlaybackRate(rate: number): void {
        this.rate = rate;
    }

    public cancel(): void {
        this.cancelled = true;
    }

    public addEventListener(type: string, listener: () => void): void {
        if (type === "finish")
            this.finishers.push(listener);
    }

    public finish(): void {
        for (const finisher of this.finishers)
            finisher();
    }
}

let reducedMotion = false;
let clock = 0;
const animations = new Map<FakeElement, FakeAnimation[]>();

installFakeDom({ PointerEvent: FakePointerEvent, matchMedia: () => ({ matches: reducedMotion }) });
Object.defineProperty(globalThis, "performance", { value: { now: () => clock }, configurable: true });
Object.assign(FakeElement.prototype, {
    animate(this: FakeElement, keyframes: Record<string, unknown>[], options: KeyframeAnimationOptions): FakeAnimation {
        const animation = new FakeAnimation(keyframes, options);

        animations.set(this, [...animations.get(this) ?? [], animation]);

        return animation;
    }
});

const { PressRippleEngine } = await import("../src/interactions/press-ripple-engine.ts");
const { motion } = await import("../src/rendering/motion.ts");

const root = fakeDocument.body;
const clicking = new Set<FakeElement>();

new PressRippleEngine({ root: real<ParentNode>(root), clicks: component => clicking.has(component as unknown as FakeElement) });

function page(...children: FakeElement[]): void {
    root.children.length = 0;
    root.append(...children);
    animations.clear();
    clicking.clear();
    reducedMotion = false;
    clock = 0;
}

function placed(element: FakeElement, left: number, top: number, width: number, height: number): FakeElement {
    element.rect = { left, top, width, height };

    return element;
}

function down(target: FakeElement, x = 10, y = 10, pointerId = 1): void {
    target.dispatchEvent(new FakePointerEvent("pointerdown", { clientX: x, clientY: y, pointerId }));
}

function up(target: FakeElement, pointerId = 1): void {
    target.dispatchEvent(new FakePointerEvent("pointerup", { pointerId }));
}

function cancel(target: FakeElement, pointerId = 1): void {
    target.dispatchEvent(new FakePointerEvent("pointercancel", { pointerId }));
}

function grow(element: FakeElement): FakeAnimation {
    return animations.get(element)![0];
}

function fade(element: FakeElement): FakeAnimation | undefined {
    return animations.get(element)?.[1];
}

function rippling(element: FakeElement): boolean {
    return element.classes.has("ui-pressing");
}

test("a press grows a circle from its point to the farthest corner, and holds it there while the pointer is held", () => {
    const button = placed(FakeElement.of("ui-button", {}, "button"), 100, 50, 120, 40);

    page(button);
    down(button, 110, 60);

    assert.equal(rippling(button), true);
    assert.equal(button.classes.has("ui-press-held"), true);
    assert.equal(button.style["--ui-press-x"], "10px");
    assert.equal(button.style["--ui-press-y"], "10px");
    assert.deepEqual(grow(button).keyframes, [{ "--ui-ripple-radius": "0px" }, { "--ui-ripple-radius": `${Math.hypot(110, 30)}px` }]);
    assert.equal(grow(button).options.duration, motion.ripple);
    assert.equal(grow(button).options.fill, "forwards");

    clock = 2000;

    assert.equal(fade(button), undefined, "the wave fades while the pointer is still down");
    assert.equal(rippling(button), true);
});

test("a quick click finishes the growth in a short step and then fades, so it still shows a wave", () => {
    const button = placed(FakeElement.of("ui-button", {}, "button"), 0, 0, 80, 32);

    page(button);
    down(button);
    clock = 40;
    up(button);

    const remaining = motion.ripple - 40;

    assert.equal(button.classes.has("ui-press-held"), false);
    assert.equal(grow(button).rate, remaining / motion.fast);
    assert.deepEqual(fade(button)!.keyframes, [{ "--ui-ripple-opacity": 1 }, { "--ui-ripple-opacity": 0 }]);
    assert.equal(fade(button)!.options.delay, motion.fast);
    assert.equal(rippling(button), true, "the wave is gone before it faded");

    fade(button)!.finish();

    assert.equal(rippling(button), false);
    assert.equal(grow(button).cancelled, true);
    assert.equal(fade(button)!.cancelled, true);
});

test("a release after the wave filled the frame fades it at once", () => {
    const button = placed(FakeElement.of("ui-button", {}, "button"), 0, 0, 80, 32);

    page(button);
    down(button);
    clock = 900;
    up(button);

    assert.equal(grow(button).rate, 1);
    assert.equal(fade(button)!.options.delay, 0);
});

test("a cancel — a touch turning into a scroll — fades the wave where it stands, unfinished", () => {
    const row = placed(FakeElement.of("ui-key-value-action__row", { "data-ui-id": "7" }), 0, 0, 360, 40);

    page(FakeElement.of("ui-key-value-action").append(row));
    clicking.add(row);
    down(row, 30, 20);
    clock = 30;
    cancel(row);

    assert.equal(grow(row).rate, 1, "a cancelled wave raced to its frame");
    assert.equal(fade(row)!.options.delay, 0);
    assert.equal(row.classes.has("ui-press-held"), false);
});

test("a drag starting from the press takes its wave away at once, before the browser draws the dragged row's picture", () => {
    const row = placed(FakeElement.of("ui-tree__row", { "data-ui-unselectable": "" }), 0, 0, 300, 28);

    page(FakeElement.of("ui-tree").append(row));
    down(row);
    row.dispatchEvent(new FakeEvent("dragstart"));

    assert.equal(rippling(row), false);
    assert.equal(row.classes.has("ui-press-held"), false);
    assert.equal(grow(row).cancelled, true);
    assert.equal(fade(row), undefined);
});

test("nothing plays under reduced motion, an icon's shrink included", () => {
    const button = placed(FakeElement.of("ui-button", { "data-ui-text-icon": "" }, "button"), 0, 0, 32, 32);

    page(button);
    reducedMotion = true;
    down(button);

    assert.equal(rippling(button), false);
    assert.equal(button.classes.has("ui-press-held"), false);
    assert.equal(animations.size, 0);
});

test("a press again on a wave still fading replaces it; another pointer's release leaves it alone", () => {
    const button = placed(FakeElement.of("ui-button", {}, "button"), 0, 0, 80, 32);

    page(button);
    down(button);
    clock = 600;
    up(button);

    const first = grow(button);

    down(button, 20, 20, 2);

    assert.equal(first.cancelled, true);
    assert.equal(rippling(button), true);

    up(button, 1);

    assert.equal(button.classes.has("ui-press-held"), true, "the first pointer's release let the second press go");
});

test("a disabled button, a secondary button and a press in a popup the button holds raise no wave", () => {
    const disabled = placed(FakeElement.of("ui-button ui-disabled", {}, "button"), 0, 0, 80, 32);
    const option = FakeElement.of("ui-language-switcher__choice", {}, "button");
    const list = FakeElement.of("ui-language-switcher__menu", { role: "listbox" }).append(option);
    const switcher = placed(FakeElement.of("ui-button ui-language-switcher", {}, "button"), 0, 0, 80, 32).append(list);
    const plain = placed(FakeElement.of("ui-button", {}, "button"), 0, 0, 80, 32);

    page(disabled, switcher, plain);
    down(disabled);
    plain.dispatchEvent(new FakePointerEvent("pointerdown", { button: 2 }));

    assert.equal(rippling(disabled), false);
    assert.equal(rippling(plain), false);

    down(list);

    assert.equal(rippling(switcher), false);

    down(option);

    assert.equal(rippling(switcher), false);
    assert.equal(rippling(option), true, "the entry pressed in the list is the one that answers");
});

test("a row answers a press where it does something: chooses itself, folds a tree's folder, or raises its click", () => {
    const chosen = placed(FakeElement.of("ui-items-view__item"), 0, 0, 300, 40);
    const inert = placed(FakeElement.of("ui-items-view__item"), 0, 0, 300, 40);
    const folder = placed(FakeElement.of("ui-tree__row", { "data-ui-unselectable": "" }), 0, 0, 300, 28);
    const file = placed(FakeElement.of("ui-tree__row"), 0, 0, 300, 28);
    const option = placed(FakeElement.of("ui-key-value-action__row", { "data-ui-id": "12" }), 0, 0, 300, 40);
    const plain = placed(FakeElement.of("ui-key-value-action__row", { "data-ui-id": "13" }), 0, 0, 300, 40);

    page(
        FakeElement.of("ui-items-view", { "data-ui-selection": "one" }).append(chosen),
        FakeElement.of("ui-items-view", { "data-ui-selection": "none" }).append(inert),
        FakeElement.of("ui-tree", { "data-ui-selection": "none" }).append(folder, file),
        FakeElement.of("ui-key-value-action").append(option, plain)
    );
    clicking.add(option);

    for (const [row, answers] of [[chosen, true], [inert, false], [folder, true], [file, false], [option, true], [plain, false]] as const) {
        down(row);
        assert.equal(rippling(row), answers, row.className);
        up(row);
    }
});

test("a row's click raised by its template's component counts; a row chosen by a control of the host's own does not", () => {
    const face = FakeElement.of("ui-text", { "data-ui-id": "40" });
    const row = placed(FakeElement.of("ui-items-view__item"), 0, 0, 300, 40).append(face);
    const boxed = placed(FakeElement.of("ui-table__row"), 0, 0, 300, 40);

    page(
        FakeElement.of("ui-items-view", { "data-ui-selection": "none" }).append(row),
        FakeElement.of("ui-table", { "data-ui-selection": "many", "data-ui-no-row-select": "" }).append(boxed)
    );
    clicking.add(face);
    down(face);
    down(boxed, 5, 5, 2);

    assert.equal(rippling(row), true);
    assert.equal(rippling(boxed), false);
});

test("a press on a control of the row's own is the control's, and an editing or disabled row raises none", () => {
    const action = placed(FakeElement.of("ui-button", {}, "button"), 0, 0, 28, 28);
    const row = placed(FakeElement.of("ui-key-value-action__row", { "data-ui-id": "5" }), 0, 0, 300, 40).append(action);
    const editing = placed(FakeElement.of("ui-key-value-action__row", { "data-ui-id": "6", "data-ui-row-editing": "" }), 0, 0, 300, 40);
    const disabled = placed(FakeElement.of("ui-items-view__item ui-disabled"), 0, 0, 300, 40);

    page(FakeElement.of("ui-key-value-action").append(row, editing), FakeElement.of("ui-items-view", { "data-ui-selection": "one" }).append(disabled));
    clicking.add(row);
    clicking.add(editing);
    down(action);

    assert.equal(rippling(action), true);
    assert.equal(rippling(row), false);

    down(editing, 5, 5, 2);
    down(disabled, 5, 5, 3);

    assert.equal(rippling(editing), false);
    assert.equal(rippling(disabled), false);
});

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

/** The declarations of the rule whose selector list holds `selector`, or "". */
function rule(selector: string): string {
    const at = css.indexOf(selector);

    return at < 0 ? "" : css.slice(css.indexOf("{", at) + 1, css.indexOf("}", at));
}

test("an icon that is the whole face shrinks while held and springs back; a button itself never scales", () => {
    const held = rule(".ui-button[data-ui-text-icon]:not([data-ui-text-title]).ui-press-held > .ui-button__content > .ui-text__icon");

    assert.match(held, /scale: 0\.88;/);
    assert.match(rule(".ui-button[data-ui-text-icon]:not([data-ui-text-title]) > .ui-button__content > .ui-text__icon"), /transition: scale 200ms cubic-bezier\(0\.34, 1\.56, 0\.64, 1\);/);
    assert.ok(css.includes(".ui-menu--rail > .ui-menu__host > .ui-menu__item > .ui-menu-item).ui-press-held > .ui-button__content > .ui-text__icon"), "a rail's entry does not shrink its icon");

    const pressed = [...css.matchAll(/([^{}]*\.ui-press(?:ing|-held)[^{}]*)\{([^}]*)\}/g)].filter(match => !/(?:icon|::before|::after)\s*$/.test(match[1].trim()));

    assert.ok(pressed.length > 0);

    for (const match of pressed)
        assert.doesNotMatch(match[2], /\b(?:scale|transform):/, `${match[1].trim()} scales the pressed element`);
});

test("the wave is a layer of the element's own frame and corners, cut to the circle, so the element itself clips nothing", () => {
    const layer = rule(".ui-button:not(.ui-tab-header, .ui-menu-item).ui-pressing:not(.ui-loading)::after");

    assert.match(layer, /inset: 0;/);
    assert.match(layer, /border-radius: inherit;/);
    assert.match(layer, /clip-path: circle\(var\(--ui-ripple-radius\) at var\(--ui-press-x, 50%\) var\(--ui-press-y, 50%\)\);/);
    assert.doesNotMatch(css, /\.ui-pressing[^{]*\{[^}]*overflow: hidden/);

    // A tab's line and a menu entry's chevron are their ::after; the wave takes ::before there, rounded on a tab's square caption.
    assert.ok(css.includes(".ui-tab-header.ui-pressing:not(.ui-loading)::before"));
    assert.ok(css.includes(".ui-menu-item.ui-pressing:not(.ui-loading)::before"));
    assert.match(rule(".ui-tab-header.ui-pressing:not(.ui-loading)::before {"), /border-radius: calc\(var\(--ui-radius-button\) \* 2 \/ 3\);/);
});
