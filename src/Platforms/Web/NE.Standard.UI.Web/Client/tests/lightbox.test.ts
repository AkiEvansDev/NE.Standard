// The lightbox a ShowImageEffect opens (interactions/lightbox.ts), driven through the real dialog engine over the stand-in DOM: a
// press on the backdrop round the picture and Escape close it and give the focus back, a press on the picture does not; a set walks
// by its arrows, the arrow keys and a finger's swipe, round past its ends, the strip sliding the step's way and resting again under
// the picture that slid in, at once where the reader asks for less motion; the counter keeps the width of its widest words; an
// address no picture may be fetched from is refused; and a picture read off the page takes its list's other drawn rows only where
// asked, and only its own list's.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

class FakePointerEvent extends FakeEvent {
    public readonly isPrimary = true;
    public readonly button = 0;
    public readonly pointerType = "touch";
    public readonly pointerId = 1;
    public readonly clientX: number;
    public readonly clientY: number;
    public readonly timeStamp: number;

    public constructor(type: string, clientX: number, timeStamp: number) {
        super(type);
        this.clientX = clientX;
        this.clientY = 300;
        this.timeStamp = timeStamp;
    }
}

// The window's capture listeners: a swipe's release swallows the click it raises there.
const windowListeners = new Map<string, ((domEvent: FakeEvent) => void)[]>();

// The page's direction and the reader's motion preference, as a test sets them.
let direction = "ltr";
let reducedMotion = false;

installFakeDom({
    window: {
        innerWidth: 400,
        addEventListener: (type: string, listener: (domEvent: FakeEvent) => void) => void windowListeners.set(type, [...windowListeners.get(type) ?? [], listener]),
        removeEventListener: (type: string, listener: (domEvent: FakeEvent) => void) => void windowListeners.set(type, (windowListeners.get(type) ?? []).filter(other => other !== listener)),
        setTimeout,
        clearTimeout
    },
    getComputedStyle: () => ({ direction }),
    matchMedia: (query: string) => ({ matches: query.includes("prefers-reduced-motion") && reducedMotion }),
    PointerEvent: FakePointerEvent
});

const { clientStrings } = await import("../src/runtime/client-strings.ts");
const { DialogEngine } = await import("../src/interactions/dialog-engine.ts");
const { picturesOnPage, showLightbox } = await import("../src/interactions/lightbox.ts");

clientStrings.useTable({ language: "en", complete: true, prefixes: [], words: { "ui.lightbox.counter": "{index} of {count}", "ui.action.close": "Close" } });

const body = fakeDocument.body;
const dialogs = new DialogEngine({ root: real<ParentNode>(body) });

function part(name: string): FakeElement {
    const found = body.querySelector(`[data-ui-lightbox-part="${name}"]`);

    assert.ok(found !== null, `the lightbox has no ${name}`);

    return found;
}

function lightbox(): FakeElement {
    const found = body.querySelector(".ui-lightbox");

    assert.ok(found !== null, "the lightbox is not on the page");

    return found;
}

/** The address the lightbox's picture shows. */
function shown(): string {
    return real<HTMLImageElement>(part("picture")).src;
}

/** The addresses the strip's neighbours show, the previous one and the next. */
function neighbours(): string[] {
    return ["previous", "next"].map(slot => real<HTMLImageElement>(lightbox().querySelector(`[data-ui-lightbox-slot="${slot}"] img`)).src);
}

/** The counter's words as shown, not the unseen ones that hold its width. */
function counter(): string {
    return lightbox().querySelector(".ui-lightbox__count")!.textContent;
}

function stage(): FakeElement {
    return lightbox().querySelector(".ui-lightbox__stage")!;
}

/** How far the strip stands off its rest. */
function shift(): unknown {
    return stage().style["--ui-lightbox-shift"];
}

/** Lets a slide run out: the stand-in has no transitions, so it lands once the queued work has run. */
async function landed(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 0));
}

function isOpen(): boolean {
    return !lightbox().hasAttribute("hidden");
}

function press(element: FakeElement): void {
    element.dispatchEvent(new FakeEvent("click"));
}

function key(name: string): void {
    const target = fakeDocument.activeElement ?? body;

    target.dispatchEvent(new FakeKeyboardEvent(name, target));
}

/** An opener on the page holding the focus, as the picture a reader pressed does. */
function opener(): FakeElement {
    const button = new FakeElement("button");

    body.append(button);
    button.focus();

    return button;
}

test("A picture opens fitted over the backdrop with the focus on its ×, and a press on the backdrop closes it and gives the focus back", () => {
    const from = opener();

    assert.ok(showLightbox(dialogs, [{ source: "/images/one.jpg", caption: { text: "Harbour" } }], 0));
    assert.ok(isOpen());
    assert.equal(shown(), "/images/one.jpg");
    assert.equal(lightbox().hasAttribute("data-ui-lightbox-set"), false, "a single picture shows no arrows");
    assert.equal(fakeDocument.activeElement, part("close"));
    assert.equal(part("caption").textContent, "Harbour");

    press(part("picture"));
    assert.ok(isOpen(), "a press on the picture itself leaves it open");

    // The press's start takes no focus, which the browser would drop to the body, leaving the close nothing to give back from.
    const backdrop = lightbox().querySelector(".ui-dialog__backdrop")!;
    const start = new FakeEvent("mousedown");

    backdrop.dispatchEvent(start);
    assert.ok(start.defaultPrevented);

    press(backdrop);
    assert.equal(isOpen(), false);
    assert.equal(fakeDocument.activeElement, from);
});

test("Escape and the × close it as the reader's own close", () => {
    const from = opener();

    showLightbox(dialogs, [{ source: "/images/one.jpg" }], 0);
    key("Escape");
    assert.equal(isOpen(), false);
    assert.equal(fakeDocument.activeElement, from);

    showLightbox(dialogs, [{ source: "/images/one.jpg" }], 0);
    press(part("close"));
    assert.equal(isOpen(), false);
});

test("A set opens on its start, and its arrows and the arrow keys walk it round past either end, the counter with it", async () => {
    showLightbox(dialogs, ["/a.jpg", "/b.jpg", "/c.jpg"].map(source => ({ source })), 2);

    assert.ok(lightbox().hasAttribute("data-ui-lightbox-set"));
    assert.equal(shown(), "/c.jpg");
    assert.deepEqual(neighbours(), ["/b.jpg", "/a.jpg"]);
    assert.equal(counter(), "3 of 3");

    press(part("next"));
    await landed();
    assert.equal(shown(), "/a.jpg");
    assert.deepEqual(neighbours(), ["/c.jpg", "/b.jpg"]);
    assert.equal(counter(), "1 of 3");

    press(part("previous"));
    await landed();
    assert.equal(shown(), "/c.jpg");

    key("ArrowLeft");
    await landed();
    assert.equal(shown(), "/b.jpg");

    key("ArrowRight");
    await landed();
    assert.equal(shown(), "/c.jpg");

    key("Escape");
});

test("A step slides the strip its own way, round the set's end too, and the strip rests again under the picture that slid in", async () => {
    showLightbox(dialogs, ["/a.jpg", "/b.jpg", "/c.jpg"].map(source => ({ source })), 2);
    stage().rect = { left: 0, top: 0, width: 390, height: 600 };

    // From the last picture on to the first: the next one comes in from the right, the strip going left by a pitch.
    press(part("next"));
    assert.equal(shift(), "-406px");
    assert.equal(stage().hasAttribute("data-ui-lightbox-still"), false, "the slide runs its transition");
    assert.equal(shown(), "/c.jpg", "the middle keeps its picture while the strip slides");

    await landed();
    assert.equal(shown(), "/a.jpg");
    assert.equal(shift(), "0px");
    assert.ok(stage().hasAttribute("data-ui-lightbox-still"), "the strip goes back under the new picture with no movement");

    // Back from the first to the last: the previous one comes in from the left.
    press(part("previous"));
    assert.equal(shift(), "406px");
    await landed();
    assert.equal(shown(), "/c.jpg");

    // Where the page reads right to left the next picture comes in from the left.
    direction = "rtl";
    key("ArrowLeft");
    assert.equal(shift(), "406px");
    await landed();
    assert.equal(shown(), "/a.jpg");
    direction = "ltr";

    // A second press while one slides lands that one at once, then slides on.
    press(part("next"));
    press(part("next"));
    assert.equal(shown(), "/b.jpg");
    assert.equal(shift(), "-406px");
    await landed();
    assert.equal(shown(), "/c.jpg");

    key("Escape");
});

test("Where the reader asks for less motion a step lands at once, with no slide", () => {
    showLightbox(dialogs, ["/a.jpg", "/b.jpg"].map(source => ({ source })), 0);
    reducedMotion = true;

    press(part("next"));
    assert.equal(shown(), "/b.jpg");
    assert.equal(shift(), "0px");

    reducedMotion = false;
    key("Escape");
});

test("The counter holds the width of its widest words, the set's last, so counting on moves neither arrow", async () => {
    showLightbox(dialogs, Array.from({ length: 10 }, (_, index) => ({ source: `/p${index}.jpg` })), 8);

    const room = (): string => lightbox().querySelector(".ui-lightbox__count-room")!.textContent;
    const roomPart = lightbox().querySelector(".ui-lightbox__count-room")!;

    assert.equal(counter(), "9 of 10");
    assert.equal(room(), "10 of 10");
    assert.equal(roomPart.getAttribute("aria-hidden"), "true");

    press(part("next"));
    await landed();
    assert.equal(counter(), "10 of 10");
    assert.equal(room(), "10 of 10");

    key("Escape");
});

test("A finger's swipe drags the strip, springs back short of a fifth, turns past it, and the click its release raises closes nothing", async () => {
    showLightbox(dialogs, ["/a.jpg", "/b.jpg"].map(source => ({ source })), 0);
    stage().rect = { left: 0, top: 0, width: 400, height: 600 };

    const backdrop = lightbox().querySelector(".ui-dialog__backdrop")!;

    // Short and slow: the strip follows the finger, then springs back to rest, the picture kept.
    backdrop.dispatchEvent(new FakePointerEvent("pointerdown", 300, 0));
    backdrop.dispatchEvent(new FakePointerEvent("pointermove", 260, 200));
    assert.equal(shift(), "-40px");
    assert.ok(stage().hasAttribute("data-ui-lightbox-still"), "the strip follows the finger at once");
    backdrop.dispatchEvent(new FakePointerEvent("pointerup", 260, 400));
    assert.equal(shift(), "0px");
    assert.equal(stage().hasAttribute("data-ui-lightbox-still"), false, "it springs back with its transition");
    await landed();
    assert.equal(shown(), "/a.jpg");

    // Leftward past a fifth: the strip slides on left, the next picture in from the right.
    backdrop.dispatchEvent(new FakePointerEvent("pointerdown", 300, 1000));
    backdrop.dispatchEvent(new FakePointerEvent("pointermove", 250, 1100));
    backdrop.dispatchEvent(new FakePointerEvent("pointermove", 180, 1200));
    assert.equal(shift(), "-120px");
    backdrop.dispatchEvent(new FakePointerEvent("pointerup", 180, 1210));
    assert.equal(shift(), "-416px");

    await landed();
    assert.equal(shown(), "/b.jpg");

    // The browser's click after the release reaches the window's capture first, which takes it.
    const click = new FakeEvent("click");

    for (const listener of windowListeners.get("click") ?? [])
        listener(click);

    assert.ok(click.stopped);
    assert.ok(isOpen());

    // Rightward past a fifth: the previous picture in from the left.
    backdrop.dispatchEvent(new FakePointerEvent("pointerdown", 100, 2000));
    backdrop.dispatchEvent(new FakePointerEvent("pointermove", 220, 2100));
    backdrop.dispatchEvent(new FakePointerEvent("pointerup", 220, 2110));
    assert.equal(shift(), "416px");
    await landed();
    assert.equal(shown(), "/a.jpg");

    key("Escape");
});

test("An address no picture may be fetched from is refused, and the start moves with the pictures left", () => {
    assert.equal(showLightbox(dialogs, [{ source: "javascript:alert(1)" }], 0), false);
    assert.equal(isOpen(), false);

    showLightbox(dialogs, [{ source: "javascript:alert(1)" }, { source: "/a.jpg" }, { source: "/b.jpg" }], 2);
    assert.equal(shown(), "/b.jpg");
    assert.equal(counter(), "2 of 2");

    key("Escape");
});

test("A picture read off the page takes its own list's other drawn rows only where asked", () => {
    const host = FakeElement.of("ui-items-view", { "data-ui-items-host": "" });
    const other = FakeElement.of("ui-items-view", { "data-ui-items-host": "" });
    const photo = (source: string): FakeElement => FakeElement.of("ui-image", { src: source, alt: source }, "img");
    const first = photo("/m1/a.jpg");
    const second = photo("/m1/b.jpg");
    const elsewhere = photo("/m2/a.jpg");

    host.append(first, second);
    other.append(elsewhere);
    body.append(host, other);

    const every = (): readonly Element[] => real<Element[]>([elsewhere, second, first]);

    assert.deepEqual(picturesOnPage(real<Element>(second), false, every), { pictures: [{ source: "/m1/b.jpg", altText: "/m1/b.jpg" }], start: 0 });
    assert.deepEqual(picturesOnPage(real<Element>(second), true, every), {
        pictures: [{ source: "/m1/a.jpg", altText: "/m1/a.jpg" }, { source: "/m1/b.jpg", altText: "/m1/b.jpg" }],
        start: 1
    });

    // A surface holding the picture shows the one inside it; one holding none shows nothing.
    const surface = FakeElement.of("ui-surface");

    surface.append(photo("/card.jpg"));
    assert.equal(picturesOnPage(real<Element>(surface), false, every)?.pictures[0].source, "/card.jpg");
    assert.equal(picturesOnPage(real<Element>(FakeElement.of("ui-surface")), false, every), null);
});
