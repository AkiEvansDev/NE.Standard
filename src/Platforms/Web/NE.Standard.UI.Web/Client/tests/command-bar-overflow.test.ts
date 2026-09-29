// A command bar that does not fit: the commands past its room go behind the "…", in order, never squeezed to an ellipsis, and a
// group's separator left with no command after it goes with them. The "…" list holds only those commands; a pick runs one as a
// press would. Opened by a key the list starts on its first entry, opened by a press it holds the keyboard itself — no current
// entry, as every popup list with none. A bar that wraps is not fitted, and a command its own Visibility hides is not counted.
// A command in the list that opens a popup opens it at the "…", marked to show over its item's `visibility: hidden`.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeKeyboardEvent, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

const Overflowed = "ui-command-bar__overflowed";
const Collapsed = "test-collapsed";

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, innerWidth: 1280, innerHeight: 900 },
    // The stylesheet's rules the fit reads back: a command its Visibility collapses is display: none, a wrapping bar's host wraps.
    getComputedStyle: (element: FakeElement) => ({
        display: element.classes.has(Collapsed) ? "none" : "flex",
        flexDirection: "row",
        flexWrap: element.parent?.classes.has("ui-command-bar--wrap") === true ? "wrap" : "nowrap",
        direction: "ltr",
        paddingLeft: "0px",
        paddingRight: "0px",
        marginLeft: "0px",
        marginRight: "0px",
        transform: "none",
        filter: "none",
        perspective: "none"
    }),
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

const { CommandBarEngine } = await import("../src/interactions/command-bar-engine.ts");
const { placeAnchoredPopup, releaseAnchoredPopup } = await import("../src/interactions/anchored-popup.ts");
const { noteKey, notePress } = await import("../src/interactions/popup-focus.ts");

type Bar = { readonly root: FakeElement; readonly commands: readonly FakeElement[]; readonly separator: FakeElement; readonly more: FakeElement };

/** Deploy, Promote | Roll back, Logs in a 300 px bar: the last two end past the room the "…" leaves (268 px). */
function bar(rootClasses = "", collapsed: readonly string[] = [], width = 300): Bar {
    const commands: FakeElement[] = [];
    const part = (title: string, left: number, width: number): FakeElement => {
        const command = FakeElement.of(`ui-button${collapsed.includes(title) ? ` ${Collapsed}` : ""}`, { "data-ui-id": String(commands.length + 1) }, "button");
        const item = FakeElement.of("ui-command-bar__item").append(command);

        command.append(FakeElement.of("ui-text__title", {}, "span"));
        command.children[0].textContent = title;
        item.rect = { left, top: 0, width, height: 40 };
        commands.push(command);

        return item;
    };

    const separator = FakeElement.of("", { "data-ui-group-header": "" });
    const more = FakeElement.of("ui-command-bar__overflow ui-button ui-button--ghost", { "aria-haspopup": "menu" }, "button");
    const host = FakeElement.of("ui-command-bar__host").append(part("Deploy", 0, 90), part("Promote", 100, 90), separator, part("Roll back", 200, 90), part("Logs", 300, 40));
    const root = FakeElement.of(`ui-command-bar ${rootClasses}`).append(host, more);

    separator.rect = { left: 195, top: 0, width: 1, height: 40 };
    more.rect = { left: 268, top: 0, width: 32, height: 40 };
    root.rect = { left: 0, top: 0, width, height: 40 };

    const page = FakeElement.of("page").append(root);

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(page);
    new CommandBarEngine({ root: real<ParentNode>(page) });

    return { root, commands, separator, more };
}

function hidden(scene: Bar): boolean[] {
    return scene.commands.map(command => command.parent?.classes.has(Overflowed) === true);
}

function openList(scene: Bar, by: "key" | "press"): { menu: FakeElement; entries: FakeElement[] } {
    if (by === "key")
        noteKey(real<Event>(new FakeKeyboardEvent("Enter", scene.more)));
    else
        notePress(real<EventTarget>(scene.more));

    scene.more.dispatchEvent(new FakeEvent("click"));

    const menu = fakeDocument.body.querySelector(".ui-tab-overflow__menu");

    assert.ok(menu !== null, "No \"…\" list.");

    return { menu, entries: menu.querySelectorAll(".ui-tab-overflow__entry") };
}

test("the commands past the room go behind the \"…\" in order, and the separator left with none after it goes too", () => {
    const scene = bar();

    assert.deepEqual(hidden(scene), [false, false, true, true]);
    assert.equal(scene.separator.classes.has(Overflowed), true);
    assert.equal(scene.root.classes.has("ui-command-bar--overflowing"), true);
});

test("the list holds the hidden commands alone, and a pick runs its command as a press would, the keyboard back on the \"…\"", () => {
    const scene = bar();
    const pressed: string[] = [];

    scene.commands[3].addEventListener("click", () => pressed.push("Logs"));

    const { menu, entries } = openList(scene, "key");

    assert.deepEqual(entries.map(entry => entry.textContent), ["Roll back", "Logs"]);
    assert.equal(fakeDocument.activeElement, entries[0]);

    entries[1].dispatchEvent(new FakeEvent("click"));

    assert.deepEqual(pressed, ["Logs"]);
    assert.equal(menu.classes.has("ui-tab-overflow__menu--open"), false);
    assert.equal(fakeDocument.activeElement, scene.more);
});

test("opened by a press, the list holds the keyboard itself with no entry current, and the first ArrowDown enters at the first", () => {
    const scene = bar();
    const { menu, entries } = openList(scene, "press");

    assert.equal(fakeDocument.activeElement, menu);
    assert.deepEqual(entries.map(entry => entry.getAttribute("tabindex")), ["-1", "-1"]);

    const arrow = new FakeKeyboardEvent("ArrowDown", menu);

    noteKey(real<Event>(arrow));
    menu.dispatchEvent(arrow);

    assert.equal(fakeDocument.activeElement, entries[0]);
});

test("a bar that wraps its commands is not fitted: nothing goes, and no \"…\" shows", () => {
    const scene = bar("ui-command-bar--wrap");

    assert.deepEqual(hidden(scene), [false, false, false, false]);
    assert.equal(scene.separator.classes.has(Overflowed), false);
    assert.equal(scene.root.classes.has("ui-command-bar--overflowing"), false);
});

test("a command its own Visibility hides is neither fitted nor listed", () => {
    const scene = bar("", ["Roll back"]);
    const { entries } = openList(scene, "key");

    assert.deepEqual(hidden(scene), [false, false, false, true]);
    assert.deepEqual(entries.map(entry => entry.textContent), ["Logs"]);
});

test("a bar only as wide as its commands is measured without the \"…\": it fits, and the \"…\" never shows to widen it", () => {
    const save = FakeElement.of("ui-command-bar__item").append(FakeElement.of("ui-button", { "data-ui-id": "1" }, "button"));
    const cancel = FakeElement.of("ui-command-bar__item").append(FakeElement.of("ui-button", { "data-ui-id": "2" }, "button"));
    const more = FakeElement.of("ui-command-bar__overflow ui-button ui-button--ghost", {}, "button");
    const root = FakeElement.of("ui-command-bar").append(FakeElement.of("ui-command-bar__host").append(save, cancel), more);
    const shown: boolean[] = [];
    const add = root.classes.add.bind(root.classes);

    save.rect = { left: 0, top: 0, width: 90, height: 40 };
    cancel.rect = { left: 100, top: 0, width: 90, height: 40 };
    more.rect = { left: 198, top: 0, width: 32, height: 40 };

    // A dialog's footer, aligned to the end: the bar is its commands' width, and the "…" shown would widen it by its own.
    Object.defineProperty(root, "rect", { get: () => ({ left: 0, top: 0, width: root.classes.has("ui-command-bar--overflowing") ? 230 : 190, height: 40 }) });
    root.classes.add = (name: string) => {
        shown.push(name === "ui-command-bar--overflowing");

        return add(name);
    };

    fakeDocument.body.children.length = 0;
    fakeDocument.body.append(FakeElement.of("page").append(root));
    new CommandBarEngine({ root: real<ParentNode>(fakeDocument.body.children[0]) });

    assert.equal(save.classes.has(Overflowed) || cancel.classes.has(Overflowed), false);
    assert.equal(root.classes.has("ui-command-bar--overflowing"), false);
    // Never shown for the measurement: a bar that grew and shrank again would be fitted again on every resize, without end.
    assert.equal(shown.includes(true), false);
});

type Flyout = { readonly anchor: FakeElement; readonly content: FakeElement };

/** Logs as a flyout: its anchor holds the control a press lands on, the content is the popup a press places against the anchor. */
function logsAsFlyout(scene: Bar, title: string | null = "Logs"): Flyout {
    const opener = FakeElement.of("ui-button", title === null ? { "aria-label": "Show logs" } : {}, "button");
    const anchor = FakeElement.of("ui-flyout__anchor").append(opener);
    const content = FakeElement.of("ui-flyout__content", { role: "dialog", tabindex: "-1" });
    const flyout = FakeElement.of("ui-flyout", { "data-ui-id": "9" }).append(anchor, content);

    if (title !== null) {
        opener.append(FakeElement.of("ui-text__title", {}, "span"));
        opener.children[0].textContent = title;
    }

    // The popup's own words, which the list must not take for the command's.
    content.append(FakeElement.of("ui-text__title", {}, "span"));
    content.children[0].textContent = "tail -f /var/log/deploy.log";
    scene.commands[3].parent?.replaceChildren(flyout);
    anchor.rect = { left: 300, top: 0, width: 40, height: 40 };
    content.rect = { left: 0, top: 0, width: 120, height: 60 };

    opener.addEventListener("click", () => placeAnchoredPopup(real(anchor), real(content), { placement: "bottom-end", gap: 4 }));

    return { anchor, content };
}

test("a command in the list that opens a popup of its own is pressed on its control, and the popup opens at the \"…\", shown", () => {
    const scene = bar();
    const { content } = logsAsFlyout(scene);
    const { entries } = openList(scene, "key");

    entries[1].dispatchEvent(new FakeEvent("click"));

    // Under the "…" (268..300, 0..40), its end at the "…"'s end.
    assert.equal(content.style.top, "44px");
    assert.equal(content.style.left, "180px");
    // Its item is out of sight (`visibility: hidden`), not out of the layout: the mark shows the popup over that.
    assert.equal(content.hasAttribute("data-ui-popup-stood-in"), true);

    releaseAnchoredPopup(real(content));
});

test("a flyout command with no caption is listed by its control's name, never by its popup's content", () => {
    const scene = bar();

    logsAsFlyout(scene, null);

    const { entries } = openList(scene, "key");

    assert.deepEqual(entries.map(entry => entry.textContent), ["Roll back", "Show logs"]);
});

test("a command back on the bar opens its popup at itself, with no mark, as does a popup anchored inside a stood-in one", () => {
    const scene = bar("", [], 400);
    const { anchor, content } = logsAsFlyout(scene);

    assert.deepEqual(hidden(scene), [false, false, false, false]);

    placeAnchoredPopup(real(anchor), real(content), { placement: "bottom-end", gap: 4 });

    // Under Logs itself (300..340, 0..40).
    assert.equal(content.style.top, "44px");
    assert.equal(content.style.left, "220px");
    assert.equal(content.hasAttribute("data-ui-popup-stood-in"), false);

    releaseAnchoredPopup(real(content));

    // A submenu's item inside a popup shown over a part in the list is in sight: its own popup opens at it, not at the "…".
    const inner = bar();
    const flyout = logsAsFlyout(inner);
    const item = FakeElement.of("ui-menu__item", {}, "button");
    const submenu = FakeElement.of("ui-menu__popup");

    flyout.content.append(item, submenu);
    item.rect = { left: 500, top: 300, width: 100, height: 30 };
    submenu.rect = { left: 0, top: 0, width: 80, height: 40 };

    placeAnchoredPopup(real(flyout.anchor), real(flyout.content), { placement: "bottom-end", gap: 4 });
    placeAnchoredPopup(real(item), real(submenu), { placement: "bottom-start", gap: 0 });

    assert.equal(submenu.style.top, "330px");
    assert.equal(submenu.style.left, "500px");
    assert.equal(submenu.hasAttribute("data-ui-popup-stood-in"), false);

    releaseAnchoredPopup(real(submenu));
    releaseAnchoredPopup(real(flyout.content));
});
