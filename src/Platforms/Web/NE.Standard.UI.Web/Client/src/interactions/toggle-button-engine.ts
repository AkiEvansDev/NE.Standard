// A toggle button: a press flips its pressed state and raises a `change`, sent like any field's.
// Started before the event pipeline, so a click command from the same press already reads the new state.

import { ValueKindAttribute } from "../addressing/dom-attributes";
import { isInert } from "./interactive-state";

const PressedKind = "pressed";
const ButtonSelector = `.ui-button[${ValueKindAttribute}="${PressedKind}"]`;

export type ToggleButtonEngineOptions = {
    readonly root?: ParentNode;
};

export class ToggleButtonEngine {
    public constructor(options: ToggleButtonEngineOptions = {}) {
        const root = options.root ?? document;

        root.addEventListener("click", domEvent => this.handleClick(domEvent), true);
    }

    private handleClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const button = domEvent.target.closest<HTMLElement>(ButtonSelector);

        if (button === null || isInert(button))
            return;

        button.setAttribute("aria-pressed", button.getAttribute("aria-pressed") === "true" ? "false" : "true");
        button.dispatchEvent(new Event("change", { bubbles: true }));
    }
}
