export function toDomString(value: unknown): string {
    if (value === null || value === undefined)
        return "";

    if (typeof value === "string")
        return value;

    if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint")
        return String(value);

    return JSON.stringify(value);
}

export function isMissingValue(value: unknown): boolean {
    return isNullishValue(value);
}

export function isNullishValue(value: unknown): boolean {
    return value === null || value === undefined;
}

export function readElementValue(element: Element): unknown {
    if (element instanceof HTMLInputElement) {
        switch (element.type) {
            case "checkbox":
                return element.checked;
            case "number":
            case "range":
                return element.value.trim().length === 0 ? null : Number(element.value);
            default:
                return element.value;
        }
    }

    if (element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement)
        return element.value;

    if (element instanceof HTMLDetailsElement)
        return element.open;

    if (element.classList.contains("ui-flyout"))
        return element.classList.contains("ui-flyout--open");

    // The current tab is one attribute on the strip's root — see tabs-engine.ts and tabs-view-engine.ts,
    // which are what write it.
    if (element.classList.contains("ui-tabs") || element.classList.contains("ui-tabs-view"))
        return element.getAttribute("data-ui-tabs-selected");

    // A tab's two writable facts, both set by tabs-view-engine.ts and deliberately on different elements: a
    // written value is read from its element without being told which property asked for it.
    if (element.classList.contains("ui-tab-item")) {
        const order = element.getAttribute("data-ui-tab-order");

        return order === null ? null : Number(order);
    }

    if (element.classList.contains("ui-tab-item__label"))
        return element.getAttribute("data-ui-tab-caption");

    const checkedRadio = element.querySelector<HTMLInputElement>("input[type=\"radio\"]:checked");

    if (checkedRadio !== null)
        return checkedRadio.value;

    return null;
}

export function clearElementValue(element: Element): void {
    if (element instanceof HTMLInputElement && (element.type === "checkbox" || element.type === "radio")) {
        element.checked = false;
        return;
    }

    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement)
        element.value = "";
}

const TrimInputAttribute = "data-ui-trim-input";

export function readBoundElementValue(element: Element): unknown {
    const value = readElementValue(element);

    return typeof value === "string" && element.hasAttribute(TrimInputAttribute)
        ? value.trim()
        : value;
}
