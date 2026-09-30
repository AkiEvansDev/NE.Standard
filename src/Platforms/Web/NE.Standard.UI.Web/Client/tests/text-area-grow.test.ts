// Where the browser cannot size a field to its content, a growing text area is fitted to its text by script: at the reader's typing,
// at a pushed value, and let go once it stops growing. The stylesheet's rows and most rows bound the height either way.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeEvent, FakeTextArea, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

installFakeDom({
    MutationObserver: class {
        public observe(): void {
        }
    },
    getComputedStyle: () => ({ borderTopWidth: "1px", borderBottomWidth: "1px" })
});

const { TextAreaGrowEngine } = await import("../src/interactions/text-area-grow-engine.ts");

type ValueChange = { readonly components: readonly Element[] };

const root = fakeDocument.body;
let pushed: (change: ValueChange) => void = () => { };

/** A text area as the renderer draws it, the height its text takes standing in for the browser's own measure. */
function growingArea(textHeight: number): FakeTextArea {
    const area = new FakeTextArea();

    area.classes.add("ui-text-area__field");
    area.setAttribute("data-ui-text-area-grow", "");
    Object.assign(area, { scrollHeight: textHeight });

    return area;
}

const typed = growingArea(72);
const shown = growingArea(48);
const component = FakeElement.of("ui-text-area").append(shown);

root.append(typed, component);

new TextAreaGrowEngine({
    root: real<ParentNode>(root),
    propertyPatchEngine: real({ addValueChangeHandler: (handler: (change: ValueChange) => void) => { pushed = handler; } })
});

test("an area on the page at the start stands at its text's height, its borders included", () => {
    assert.equal(shown.style.height, "50px");
});

test("typing fits the area again", () => {
    Object.assign(typed, { scrollHeight: 96 });
    typed.dispatchEvent(new FakeEvent("input"));

    assert.equal(typed.style.height, "98px");
});

test("a pushed value fits the component's area, and one that stopped growing is let go to its rows", () => {
    Object.assign(shown, { scrollHeight: 24 });
    pushed({ components: [real<Element>(component)] });

    assert.equal(shown.style.height, "26px");

    shown.removeAttribute("data-ui-text-area-grow");
    pushed({ components: [real<Element>(component)] });

    assert.equal(shown.style.height, undefined);
});
