// The client's half of MultiSelectComponentRenderer.RenderCheck: a row the client builds in a multi-select drawn as checkboxes gets
// the checkbox's own input and box ahead of its template, as the server writes them. Whether it is checked or refused for a full field
// is the checkbox engine's, which reads it off the field once the row stands in it (`multi-select-checkboxes-engine.ts`).

// `.ts` on the value imports: `node --test` loads this module as it is.
import { CheckboxBoxClass, CheckboxInputClass } from "../addressing/dom-attributes.ts";
import type { RowDecoratorContext, RowDecoratorRegistration } from "./row-decorators";

export const CheckboxRowDecorator: RowDecoratorRegistration = { kind: "checkbox", decorate: decorateCheckboxRow };

function decorateCheckboxRow(context: RowDecoratorContext): void {
    const input = document.createElement("input");

    input.className = CheckboxInputClass;
    input.type = "checkbox";
    input.name = `ui-${context.componentId}-check`;
    input.value = context.key;

    const box = document.createElement("span");

    box.className = CheckboxBoxClass;
    context.row.prepend(input, box);
}
