// The name a control's tooltip gives back when its bound title is pushed empty (*An icon-only button's tooltip name follows the
// tooltip*): an operation of the title's, since the title's value says nothing of the tooltip, reading the words the tooltip's own
// operations last wrote on the component's root.

import { TooltipAttribute } from "../addressing/dom-attributes.ts";
import { inlineMarkupToPlainText } from "../rendering/inline-markup.ts";
import { forgetWords } from "../runtime/client-strings.ts";

/** The operation's kind, as `TextContentRendererBase.TooltipNameOperationKind` spells it on the server. */
export const TooltipNameOperationKind = "tooltip-name";

/** Names `target` by its component's tooltip — its plain text, never the Markdown source — or takes the name off where it has none. */
export function writeTooltipName(component: Element, target: Element, attribute: string): void {
    const name = inlineMarkupToPlainText(component.getAttribute(TooltipAttribute));

    forgetWords(target, attribute);

    if (name.trim().length === 0) {
        if (target.hasAttribute(attribute))
            target.removeAttribute(attribute);

        return;
    }

    if (target.getAttribute(attribute) !== name)
        target.setAttribute(attribute, name);
}
