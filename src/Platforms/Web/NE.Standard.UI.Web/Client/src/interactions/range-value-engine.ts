import { DomRegistry } from "../addressing/dom-registry";
import { getIdValue } from "../metadata/metadata-index";
import { PropertyPatchEngine } from "../updates/property-patch-engine";

const RangeInputClass = "ui-slider__input";
const RangeValueClass = "ui-slider__value";

export type RangeValueEngineOptions = {
    readonly root?: ParentNode;
    
    readonly propertyPatchEngine?: PropertyPatchEngine;
    readonly dom?: DomRegistry;
};

export class RangeValueEngine {
    private readonly root: ParentNode;

    public constructor(private readonly options: RangeValueEngineOptions = {}) {
        this.root = options.root ?? document;

        this.root.addEventListener("input", domEvent => this.handleInput(domEvent), true);

        // A range input silently clamps whatever it is handed, so a value the server pushes out of range would
        // leave the controller and the handle disagreeing with nothing to reconcile them. Report the browser's
        // own clamp back through the ordinary two-way channel instead.
        this.options.propertyPatchEngine?.addValueChangeHandler(change => {
            const componentId = getIdValue(change.reference.componentId);

            for (const component of this.options.dom?.findAllComponents(componentId, change.dynamicParameters) ?? [])
                this.reportClamped(component.querySelector<HTMLInputElement>(`.${RangeInputClass}`), change.value);
        });
    }

    private reportClamped(input: HTMLInputElement | null, pushed: unknown): void {
        if (input === null || pushed === null || pushed === undefined || input.value === String(pushed))
            return;

        const readout = input.parentElement?.querySelector<HTMLElement>(`.${RangeValueClass}`);

        if (readout !== null && readout !== undefined)
            readout.textContent = input.value;

        input.dispatchEvent(new Event("change", { bubbles: true }));
    }

    private handleInput(domEvent: Event): void {
        if (!(domEvent.target instanceof HTMLInputElement) || !domEvent.target.classList.contains(RangeInputClass))
            return;

        const readout = domEvent.target.parentElement?.querySelector<HTMLElement>(`.${RangeValueClass}`);

        if (readout !== null && readout !== undefined)
            readout.textContent = domEvent.target.value;
    }
}
