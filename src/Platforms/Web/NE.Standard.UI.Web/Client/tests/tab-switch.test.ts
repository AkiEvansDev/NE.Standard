// A tab strip as the choice moves: the line slides over from the caption chosen before rather than vanishing and reappearing, the
// titles keep the width of their bold selves so the chosen one turning bold moves nothing, the page shown fades in, and under reduced
// motion all of it is at its end at once.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";
import { FakeElement, FakeEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

let reducedMotion = false;
const slides: { element: FakeElement; keyframes: Record<string, unknown>[]; options: KeyframeAnimationOptions }[] = [];

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, innerWidth: 1280, innerHeight: 900 },
    getComputedStyle: () => ({ display: "flex", transform: "none", filter: "none", perspective: "none", getPropertyValue: () => "" }),
    matchMedia: () => ({ matches: reducedMotion }),
    MutationObserver: class {
        public observe(): void {
        }

        public disconnect(): void {
        }
    },
    ResizeObserver: class {
        public observe(): void {
        }

        public unobserve(): void {
        }
    }
});

Object.assign(FakeElement.prototype, {
    animate(this: FakeElement, keyframes: Record<string, unknown>[], options: KeyframeAnimationOptions): unknown {
        slides.push({ element: this, keyframes, options });

        return { cancel: () => undefined };
    }
});

const { TabsEngine } = await import("../src/interactions/tabs-engine.ts");
const { motion } = await import("../src/rendering/motion.ts");

function header(key: string, title: string, left: number, width: number): FakeElement {
    const words = FakeElement.of("ui-text__title");

    words.textContent = title;

    const element = FakeElement.of("ui-tab-header", { "data-ui-tab-key": key }, "button").append(FakeElement.of("ui-button__content ui-text").append(words));

    element.rect = { left, top: 0, width, height: 28 };

    return element;
}

const headers = [header("overview", "Overview", 0, 90), header("activity", "Activity", 90, 98), header("settings", "Settings", 188, 80)];
const pages = ["overview", "activity", "settings"].map(key => FakeElement.of("ui-tabs__page", { "data-ui-tab-page": key }));
const root = FakeElement.of("ui-tabs", { "data-ui-tabs-selected": "overview" }).append(FakeElement.of("ui-tabs__strip").append(...headers), FakeElement.of("ui-tabs__pages").append(...pages));

fakeDocument.body.append(root);
new TabsEngine({ root: real<ParentNode>(fakeDocument.body) });

const titleOf = (element: FakeElement): FakeElement => element.querySelector(".ui-text__title")!;

test("every title carries its own words, for the stylesheet to reserve its bold width", () => {
    assert.deepEqual(headers.map(element => titleOf(element).getAttribute("data-ui-caption-text")), ["Overview", "Activity", "Settings"]);
    assert.equal(slides.length, 0, "the first fit slid a line from nowhere");
});

test("choosing another tab slides its line over from the one chosen before, from the line's start, and fades its page in", () => {
    headers[1].dispatchEvent(new FakeEvent("click"));

    assert.deepEqual(slides.map(slide => slide.element), [headers[1], pages[1]]);
    assert.deepEqual(slides[1].keyframes, [{ opacity: 0 }, { opacity: 1 }]);

    const [slide] = slides;

    assert.equal(slide.element, headers[1]);
    assert.equal(slide.options.pseudoElement, "::after");
    assert.equal(slide.options.duration, motion.normal);
    assert.deepEqual(slide.keyframes, [{ transform: `translateX(-90px) scaleX(${90 / 98})` }, { transform: "none" }]);
});

test("a title a binding rewrote reserves its new words", () => {
    titleOf(headers[2]).textContent = "Preferences";
    headers[0].dispatchEvent(new FakeEvent("click"));

    assert.equal(titleOf(headers[2]).getAttribute("data-ui-caption-text"), "Preferences");
});

test("under reduced motion the line moves at once", () => {
    slides.length = 0;
    reducedMotion = true;
    headers[2].dispatchEvent(new FakeEvent("click"));

    assert.equal(headers[2].classes.has("ui-tab-header--selected"), true);
    assert.equal(real<HTMLElement>(pages[2]).hidden, false);
    assert.equal(slides.length, 0);
});

test("the reserve is the title's words set bold and unseen beneath it, taking no height; the line scales from its start", async () => {
    const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/ui.less");
    const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

    for (const selector of [".ui-tab-header .ui-text__title[data-ui-caption-text]::after {", ".ui-tab-item__label .ui-text__title[data-ui-caption-text]::after {"]) {
        const at = css.indexOf(selector);

        assert.ok(at >= 0, `no reserve for ${selector}`);

        const body = css.slice(at, css.indexOf("}", at));

        assert.match(body, /content: attr\(data-ui-caption-text\);/);
        assert.match(body, /height: 0;/);
        assert.match(body, /visibility: hidden;/);
        assert.match(body, /font-weight: var\(--ui-selected-font-weight, 600\);/);
    }

    const mark = css.slice(css.indexOf(".ui-tab-header::after {"), css.indexOf("}", css.indexOf(".ui-tab-header::after {")));

    assert.match(mark, /transform-origin: left;/);
});
