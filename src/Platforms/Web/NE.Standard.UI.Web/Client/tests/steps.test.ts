// A wizard's sequence of steps: the step matching SelectedKey is current (data-ui-selected, aria-current="step"), the shown steps before
// it are completed (data-ui-step-completed), and clicking or arrowing to a selectable step moves SelectedKey while skipping refused steps.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

let resizeCallback: ((entries: readonly { target: Element; contentRect: { width: number } }[], observer: { unobserve(): void }) => void) | null = null;

installFakeDom({
    MutationObserver: class {
        public observe(): void {
        }

        public disconnect(): void {
        }
    },
    ResizeObserver: class {
        public constructor(callback: typeof resizeCallback) {
            resizeCallback = callback;
        }

        public observe(): void {
        }

        public unobserve(): void {
        }

        public disconnect(): void {
        }
    }
});

const { StepsEngine } = await import("../src/interactions/steps-engine.ts");

function stepsStrip(selectedKey: string, ...items: FakeElement[]): FakeElement {
    const host = FakeElement.of("ui-steps__host").append(...items);
    const root = FakeElement.of("ui-steps", { "data-ui-selected-key": selectedKey, "data-ui-bind-selected-key": "1" }).append(host);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(root);

    return root;
}

function stepItem(key: string, attributes: Readonly<Record<string, string>> = {}): FakeElement {
    const inner = FakeElement.of("ui-text", { "data-ui-id": "2", ...attributes });

    return FakeElement.of("ui-steps__item", { "data-ui-key": key }).append(inner);
}

test("marks steps before SelectedKey as completed and the matching step as current", () => {
    const plan = stepItem("plan");
    const address = stepItem("address");
    const confirm = stepItem("confirm");

    stepsStrip("address", plan, address, confirm);
    const engine = new StepsEngine({ root: real<ParentNode>(fakeDocument.body) });

    assert.equal(plan.hasAttribute("data-ui-step-completed"), true);
    assert.equal(plan.hasAttribute("data-ui-selected"), false);
    assert.equal(plan.getAttribute("role"), "button");
    assert.equal(address.hasAttribute("data-ui-selected"), true);
    assert.equal(address.getAttribute("aria-current"), "step");
    assert.equal(address.getAttribute("tabindex"), "0");
    assert.equal(address.getAttribute("role"), "button");
    assert.equal(confirm.hasAttribute("data-ui-step-completed"), false);
    assert.equal(confirm.hasAttribute("data-ui-selected"), false);
    assert.equal(confirm.getAttribute("tabindex"), "-1");
    assert.equal(confirm.getAttribute("role"), "button");
    engine.dispose();
});

test("clicking a selectable step updates SelectedKey and forwards item circle clicks to the template root, while locked and collapsed steps are refused", () => {
    const plan = stepItem("plan");
    const collapsed = stepItem("collapsed", { "data-ui-visibility": "collapsed" });
    const address = stepItem("address");
    const confirm = stepItem("confirm", { "data-ui-unselectable": "" });
    const root = stepsStrip("plan", plan, collapsed, address, confirm);
    let changes = 0;
    let templateClicks = 0;

    root.addEventListener("change", () => changes++);
    address.firstElementChild?.addEventListener("click", () => templateClicks++);
    const engine = new StepsEngine({ root: real<ParentNode>(fakeDocument.body) });

    assert.equal(confirm.hasAttribute("tabindex"), false);
    assert.equal(confirm.hasAttribute("role"), false);
    assert.equal(collapsed.hasAttribute("tabindex"), false);
    assert.equal(collapsed.hasAttribute("role"), false);

    confirm.click();
    collapsed.click();
    assert.equal(root.getAttribute("data-ui-selected-key"), "plan");
    assert.equal(changes, 0);

    address.click();
    assert.equal(root.getAttribute("data-ui-selected-key"), "address");
    assert.equal(plan.hasAttribute("data-ui-step-completed"), true);
    assert.equal(address.hasAttribute("data-ui-selected"), true);
    assert.equal(changes, 1);
    assert.equal(templateClicks, 1);
    engine.dispose();
});

test("arrow keys move across selectable steps and skip unselectable and collapsed ones", () => {
    const plan = stepItem("plan");
    const collapsed = stepItem("collapsed", { "data-ui-visibility": "collapsed" });
    const locked = stepItem("locked", { "data-ui-unselectable": "" });
    const confirm = stepItem("confirm");
    const root = stepsStrip("plan", plan, collapsed, locked, confirm);
    const engine = new StepsEngine({ root: real<ParentNode>(fakeDocument.body) });

    plan.dispatchEvent(new FakeKeyboardEvent("ArrowRight", plan));

    assert.equal(root.getAttribute("data-ui-selected-key"), "confirm");
    assert.equal(fakeDocument.activeElement, confirm);
    assert.equal(plan.hasAttribute("data-ui-step-completed"), true);
    assert.equal(confirm.hasAttribute("data-ui-selected"), true);
    engine.dispose();
});

test("stacks horizontal steps vertically when single-row width overflows the container and unstacks when room returns", () => {
    const originalMatchMedia = globalThis.matchMedia;
    globalThis.matchMedia = ((query: string) => ({
        matches: query === "(min-width: 640px)",
        media: query,
        addEventListener() {
        },
        removeEventListener() {
        }
    })) as unknown as typeof matchMedia;

    try {
        const plan = stepItem("plan");
        const address = stepItem("address");
        const confirm = stepItem("confirm");
        const root = stepsStrip("plan", plan, address, confirm);
        const host = plan.parentElement!;

        host.rect.width = 400;
        Object.assign(host, { scrollWidth: 560 });

        const engine = new StepsEngine({ root: real<ParentNode>(fakeDocument.body) });

        assert.equal(root.hasAttribute("data-ui-steps-stacked"), true);

        host.rect.width = 480;
        Object.assign(host, { scrollWidth: 480 });
        resizeCallback?.([{ target: real<Element>(root), contentRect: { width: 480 } }], { unobserve() {} });
        assert.equal(root.hasAttribute("data-ui-steps-stacked"), true);

        host.rect.width = 600;
        Object.assign(host, { scrollWidth: 560 });
        resizeCallback?.([{ target: real<Element>(root), contentRect: { width: 600 } }], { unobserve() {} });
        assert.equal(root.hasAttribute("data-ui-steps-stacked"), false);

        engine.dispose();
    }
    finally {
        globalThis.matchMedia = originalMatchMedia;
    }
});
