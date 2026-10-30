// A radio group's value on its root checks its radios, and an option's Enabled moving turns its radio off: the page is watched for the
// value and for the groups and rows that arrive, an option's class inside each group alone.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, FakeInput, fakeDocument, installFakeDom, real } from "./fake-dom.ts";

type Mutation = { readonly type: string; readonly target: FakeElement; readonly addedNodes: FakeElement[]; readonly removedNodes: FakeElement[] };

// Each watch the engine makes, which a test tells what changed as the browser would, and what each is on.
const watches: { readonly answer: (records: Mutation[]) => void; readonly targets: { readonly target: FakeElement; readonly init: MutationObserverInit }[] }[] = [];

installFakeDom({
    MutationObserver: class {
        private readonly targets: { readonly target: FakeElement; readonly init: MutationObserverInit }[] = [];

        public constructor(answer: (records: Mutation[]) => void) {
            watches.push({ answer, targets: this.targets });
        }

        public observe(target: FakeElement, init: MutationObserverInit): void {
            this.targets.push({ target, init });
        }
    }
});

const { RadioGroupSyncEngine } = await import("../src/interactions/radio-group-sync-engine.ts");

/** A group of two options as the server draws it, `b` chosen, under a fresh engine. */
function group(): { root: FakeElement; radios: ReadonlyMap<string, FakeInput> } {
    const radios = new Map<string, FakeInput>();
    const items = ["a", "b"].map(key => {
        const radio = new FakeInput("radio");

        radio.classes.add("ui-radio-group__input");
        radio.value = key;
        radios.set(key, radio);

        // The item's template root, a component of its own beside the radio, which carries the option's Enabled.
        return FakeElement.of("ui-radio-group__item", { "data-ui-key": key }).append(radio, FakeElement.of("ui-text", { "data-ui-id": `3${key}` }));
    });
    const root = FakeElement.of("ui-radio-group", { "data-ui-id": "3", "data-ui-radio-value": "b", "data-ui-radio-group-name": "g3" }).append(...items);

    watches.length = 0;
    fakeDocument.body.replaceChildren(root);
    new RadioGroupSyncEngine({ root: real<ParentNode>(fakeDocument.body) });

    return { root, radios };
}

test("the page is watched for the value and what arrives, an option's class inside the group alone", () => {
    const { root, radios } = group();
    const page = watches.flatMap(watch => watch.targets.filter(each => each.target === fakeDocument.body));
    const own = watches.flatMap(watch => watch.targets.filter(each => each.target === root));

    assert.equal(radios.get("b")?.checked, true);
    assert.equal(page.length, 1);
    assert.deepEqual(page[0].init.attributeFilter, ["data-ui-radio-value"]);
    assert.equal(page[0].init.childList, true);
    assert.equal(own.length, 1, "a group is watched once");
    assert.deepEqual(own[0].init.attributeFilter, ["class"]);
});

test("an option turned off inside the group turns its radio off, told by the group's own watch", () => {
    const { root, radios } = group();
    // Where the renderer writes `ui-disabled`: the template root inside the row, not the row.
    const option = radios.get("a")?.parent?.children[1];
    const watch = watches.find(each => each.targets.some(target => target.target === root));

    assert.ok(option !== null && option !== undefined && watch !== undefined);

    option.classes.add("ui-disabled");
    watch.answer([{ type: "attributes", target: option, addedNodes: [], removedNodes: [] }]);

    assert.equal(radios.get("a")?.disabled, true);
});

test("a group turned disabled or loading turns every radio off, and turning it back on restores enabled options", () => {
    const { root, radios } = group();
    const optionA = radios.get("a")?.parent?.children[1];
    const watch = watches.find(each => each.targets.some(target => target.target === root));

    assert.ok(optionA !== undefined && watch !== undefined);
    optionA.classes.add("ui-disabled");
    root.classes.add("ui-disabled");
    watch.answer([{ type: "attributes", target: root, addedNodes: [], removedNodes: [] }]);

    assert.equal(radios.get("a")?.disabled, true);
    assert.equal(radios.get("b")?.disabled, true);

    root.classes.delete("ui-disabled");
    watch.answer([{ type: "attributes", target: root, addedNodes: [], removedNodes: [] }]);

    assert.equal(radios.get("a")?.disabled, true);
    assert.equal(radios.get("b")?.disabled, false);
});
