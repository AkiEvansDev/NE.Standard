// The client's half of RadioGroupComponentRenderer.RenderRadioInput: a row the client builds gets the native radio and its dot ahead
// of its template, as the server writes them. The group's name, value binding and checked radio are the sync engine's, which reads
// them off the group once the row stands in it (`radio-group-sync-engine.ts`).

// `.ts` on the value imports: `node --test` loads this module as it is.
import { RadioGroupDotClass, RadioGroupInputClass } from "../addressing/dom-attributes.ts";
import type { RowDecoratorContext, RowDecoratorRegistration } from "./row-decorators";

export const RadioRowDecorator: RowDecoratorRegistration = { kind: "radio", decorate: decorateRadioRow };

function decorateRadioRow(context: RowDecoratorContext): void {
    const input = document.createElement("input");

    input.className = RadioGroupInputClass;
    input.type = "radio";
    input.name = `ui-${context.componentId}`;
    input.value = context.key;

    const dot = document.createElement("span");

    dot.className = RadioGroupDotClass;
    context.row.prepend(input, dot);
}
