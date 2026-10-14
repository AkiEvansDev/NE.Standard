// The press ripple: a wave from the press point that grows to the farthest corner while held, finishes quickly and fades on release,
// fades where it stands on a cancel (a touch turning into a scroll is one), and plays nowhere under reduced motion. It reaches buttons,
// list entries and the rows whose press does something; an icon that is the whole face shrinks while held, and nothing else does.
// The wave is an element of its own, the pressed thing's last child while it plays, and only its circle's scale and its opacity
// animate: what the compositor runs without the page's script.

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
// By the pressed thing: the circle's growth, then the wave's fade.
const animations = new Map<FakeElement, FakeAnimation[]>();

installFakeDom({ PointerEvent: FakePointerEvent, matchMedia: () => ({ matches: reducedMotion }) });
Object.defineProperty(globalThis, "performance", { value: { now: () => clock }, configurable: true });
Object.assign(FakeElement.prototype, {
    animate(this: FakeElement, keyframes: Record<string, unknown>[], options: KeyframeAnimationOptions): FakeAnimation {
        const animation = new FakeAnimation(keyframes, options);
        const pressed = this.classes.has("ui-press-wave") ? this.parent! : this.parent!.parent!;

        animations.set(pressed, [...animations.get(pressed) ?? [], animation]);

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

function waveOf(element: FakeElement): FakeElement | undefined {
    return element.children.find(child => child.classes.has("ui-press-wave"));
}

test("a press grows a circle from its point to the farthest corner, and holds it there while the pointer is held", () => {
    const button = placed(FakeElement.of("ui-button", {}, "button"), 100, 50, 120, 40);

    page(button);
    down(button, 110, 60);

    const radius = Math.hypot(110, 30);
    const wave = waveOf(button)!;
    const ink = wave.children[0];

    assert.equal(rippling(button), true);
    assert.equal(button.classes.has("ui-press-held"), true);
    assert.equal(button.children.at(-1), wave, "the wave stands after the button's own parts");
    assert.equal(wave.getAttribute("aria-hidden"), "true");
    assert.equal(ink.classes.has("ui-press-wave__ink"), true);
    assert.deepEqual([ink.style.left, ink.style.top, ink.style.width, ink.style.height], [`${10 - radius}px`, `${10 - radius}px`, `${radius * 2}px`, `${radius * 2}px`]);
    assert.deepEqual(grow(button).keyframes, [{ transform: "scale(0)" }, { transform: "scale(1)" }]);
    assert.equal(grow(button).options.duration, motion.ripple);
    assert.equal(grow(button).options.fill, "forwards");

    clock = 2000;

    assert.equal(fade(button), undefined, "the wave fades while the pointer is still down");
    assert.equal(rippling(button), true);
});

test("the circle stands round the press point inside a border, which the frame's rect counts and the wave's box does not", () => {
    const button = placed(FakeElement.of("ui-button", {}, "button"), 100, 50, 120, 40);

    Object.assign(button, { clientLeft: 2, clientTop: 1 });
    page(button);
    down(button, 110, 60);

    const radius = Math.hypot(110, 30);
    const ink = waveOf(button)!.children[0];

    assert.deepEqual([ink.style.left, ink.style.top], [`${8 - radius}px`, `${9 - radius}px`]);
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
    assert.deepEqual(fade(button)!.keyframes, [{ opacity: 1 }, { opacity: 0 }]);
    assert.equal(fade(button)!.options.delay, motion.fast);
    assert.equal(rippling(button), true, "the wave is gone before it faded");
    assert.notEqual(waveOf(button), undefined);

    fade(button)!.finish();

    assert.equal(rippling(button), false);
    assert.equal(waveOf(button), undefined, "the wave stayed in the button");
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
    assert.equal(waveOf(row), undefined);
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
    assert.equal(waveOf(button), undefined);
});

test("a press again on a wave still fading replaces it; another pointer's release leaves it alone", () => {
    const button = placed(FakeElement.of("ui-button", {}, "button"), 0, 0, 80, 32);

    page(button);
    down(button);
    clock = 600;
    up(button);

    const first = grow(button);
    const firstWave = waveOf(button);

    down(button, 20, 20, 2);

    assert.equal(first.cancelled, true);
    assert.equal(rippling(button), true);
    assert.equal(button.children.filter(child => child.classes.has("ui-press-wave")).length, 1, "the replaced wave stayed beside the new one");
    assert.notEqual(waveOf(button), firstWave);

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

test("a tabs view's caption takes the wave as a whole, from its label too; its close raises none", () => {
    const label = FakeElement.of("ui-tab-item__label ui-button ui-button--ghost", {}, "button");
    const close = FakeElement.of("ui-tab-item__close", {}, "button");
    const caption = placed(FakeElement.of("ui-tab-item__caption"), 0, 0, 160, 36).append(label, close);

    page(FakeElement.of("ui-tab-item").append(caption));
    down(label);

    assert.equal(rippling(caption), true);
    assert.equal(rippling(label), false, "a wave on the label alone stops short of the caption's edges");

    up(label);
    page(FakeElement.of("ui-tab-item").append(caption));
    caption.classes.delete("ui-pressing");
    down(close);

    assert.equal(rippling(caption), false);
});

test("a split button's part takes the wave alone; a menu split button's pill takes it whole", () => {
    const main = FakeElement.of("ui-split-button__main", {}, "button");
    const toggle = FakeElement.of("ui-split-button__toggle", {}, "button");
    const split = placed(FakeElement.of("ui-split-button ui-button", {}), 0, 0, 120, 32).append(main, toggle);
    const menuMain = FakeElement.of("ui-split-button__main", {}, "button");
    const menu = placed(FakeElement.of("ui-split-button ui-button", { "data-ui-split-mode": "menu" }), 0, 40, 120, 32).append(menuMain);

    page(split, menu);
    down(main);

    assert.equal(rippling(main), true);
    assert.equal(rippling(split), false, "the pill's wave covered the toggle beside the part washed");

    down(toggle, 10, 10, 2);

    assert.equal(rippling(toggle), true);

    down(menuMain, 10, 50, 3);

    assert.equal(rippling(menu), true);
    assert.equal(rippling(menuMain), false);
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

test("the wave is a layer of the element's own frame and corners, cutting the circle, so the element itself clips nothing", () => {
    const layer = rule(".ui-pressing > .ui-press-wave {");

    assert.match(layer, /position: absolute;/);
    assert.match(layer, /inset: 0;/);
    assert.match(layer, /border-radius: inherit;/);
    assert.match(layer, /overflow: hidden;/);
    assert.match(layer, /pointer-events: none;/);
    assert.match(layer, /grid-area: auto;/, "a grid's `> *` placement made a cell the wave's box");
    assert.match(rule(".ui-pressing > .ui-press-wave > .ui-press-wave__ink {"), /border-radius: 50%;[\s\S]*background: color-mix\(in srgb, currentColor 16%, transparent\);/);

    // On the pressed element itself nothing is clipped, so an adornment overhanging it stays whole.
    for (const match of css.matchAll(/([^{}]*)\{([^}]*)\}/g)) {
        if (match[1].split(",").some(selector => selector.trim().endsWith(".ui-pressing")))
            assert.doesNotMatch(match[2], /overflow/, match[1].trim());
    }

    // Nothing animates through a property the page's own frames draw: no registered radius, no clip of a circle.
    assert.doesNotMatch(css, /--ui-ripple-radius|clip-path: circle\(var/);
    assert.match(rule(".ui-loading > .ui-press-wave {"), /display: none;/);
    assert.match(rule(".ui-table__row > .ui-press-wave {"), /z-index: 2;/);
    assert.match(rule(".ui-tab-header > .ui-press-wave {"), /border-radius: calc\(var\(--ui-radius-button\) \* 2 \/ 3\);/);
});

test("a table's column lines stop at the last cell, not the row's last child, so a wave standing after the cells adds none", () => {
    assert.ok(css.includes(".ui-table__row > .ui-table__cell:not(:nth-last-child(1 of :where(.ui-table__cell)))"));
    assert.doesNotMatch(css, /\.ui-table__cell:not\(:last-child\)/);
});
