// The client's half of ItemsCollectionRendererBase.RenderRowGrip: a row the client builds for a host dragged by grips (`DragHandle`)
// gets the same grip at its end. The stylesheet shows it only while the host's drag and handle are both on.

// `.ts` on the value imports: `node --test` loads this module as it is.
import { RowGripClass } from "../addressing/dom-attributes.ts";
import type { RowDecoratorContext, RowDecoratorRegistration } from "./row-decorators";

export const RowGripDecorator: RowDecoratorRegistration = { kind: "grip", decorate: decorateRowGrip };

function decorateRowGrip(context: RowDecoratorContext): void {
    context.row.append(createRowGrip());
}

/**
 * The grip as the server writes it: hidden from a screen reader, focusable by nothing, its mark drawn by the stylesheet. The pointer's
 * way to move a row; the keyboard's is the row's own Alt+arrows, which a reader hears announced.
 */
function createRowGrip(): HTMLElement {
    const grip = document.createElement("span");

    grip.className = RowGripClass;
    grip.setAttribute("aria-hidden", "true");

    return grip;
}
