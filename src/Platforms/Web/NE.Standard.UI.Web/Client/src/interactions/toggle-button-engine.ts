// A button that is a toggle: a press flips its pressed state and raises a `change`, sent like any field's by the value
// binding engine. Started before the event pipeline, so a click command from the same press already reads the new state.

import { ValueKindAttribute } from "../addressing/dom-attributes";

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

        if (button === null || button.matches(":disabled, .ui-disabled"))
            return;

        button.setAttribute("aria-pressed", button.getAttribute("aria-pressed") === "true" ? "false" : "true");
        button.dispatchEvent(new Event("change", { bubbles: true }));
    }
}
