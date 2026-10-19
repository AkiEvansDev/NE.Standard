import { ComponentIdAttribute, TextDescriptionAttribute, TextDescriptionClass } from "../addressing/dom-attributes.ts";

const DescriptionSelector = `.${TextDescriptionClass}`;

/**
 * The words a component shows, as a reader would select and copy them: its rendered text, trimmed. What a copy of a component that holds
 * no value takes — a message's text in a chat row — rather than nothing.
 */
export function shownText(element: Element): string {
    // A text showing a description reads that as its body and its title as a label over it: a message's copy is its text, not its author.
    const source = (element.hasAttribute(TextDescriptionAttribute) ? ownDescription(element) : null) ?? element;
    // `innerText` is the rendered text, without what a style hides; a document without layout answers `textContent`.
    const rendered = "innerText" in source && typeof source.innerText === "string" ? source.innerText : source.textContent;

    return (rendered ?? "").trim();
}

/** The component's own description line, not one of a component inside it. */
function ownDescription(element: Element): Element | null {
    for (const description of element.querySelectorAll(DescriptionSelector)) {
        if (description.closest(`[${ComponentIdAttribute}]`) === element)
            return description;
    }

    return null;
}
