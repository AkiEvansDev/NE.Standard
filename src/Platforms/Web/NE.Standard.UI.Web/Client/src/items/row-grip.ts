// The client's half of ItemsCollectionRendererBase.RenderRowGrip: a row the client builds for a host dragged by grips (`DragHandle`)
// gets the same grip at its end. The stylesheet shows it only while the host's drag and handle are both on.

// `.ts` on the value imports: `node --test` loads this module as it is.
import { RowGripClass } from "../addressing/dom-attributes.ts";
import { clientStrings } from "../runtime/client-strings.ts";
import type { RowDecoratorContext, RowDecoratorRegistration } from "./row-decorators";

export const RowGripDecorator: RowDecoratorRegistration = { kind: "grip", decorate: decorateRowGrip };

function decorateRowGrip(context: RowDecoratorContext): void {
    context.row.append(createRowGrip());
}

/** The grip as the server writes it: named for a screen reader, focusable by nothing, its mark drawn by the stylesheet. */
function createRowGrip(): HTMLElement {
    const grip = document.createElement("span");

    grip.className = RowGripClass;
    grip.setAttribute("role", "button");
    clientStrings.write(grip, "aria-label", "ui.row.drag");

    return grip;
}
