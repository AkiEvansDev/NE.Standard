import {
    ItemsQueryAttribute, SelectedKeyAttribute, SelectedKeysAttribute, TabCaptionAttribute, TreeDropTargetAttribute, TreeTitleAttribute, TabOrderAttribute, TabsSelectedAttribute, ValueKindAttribute
} from "../addressing/dom-attributes";
import { logWarn } from "../runtime/logger";

export function toDomString(value: unknown): string {
    if (value === null || value === undefined)
        return "";

    if (typeof value === "string")
        return value;

    if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint")
        return String(value);

    return JSON.stringify(value);
}

export function isNullishValue(value: unknown): boolean {
    return value === null || value === undefined;
}

/** Reads the value an element holds, for the kind named by its `data-ui-value-kind`. */
export type ValueReader = (element: Element) => unknown;

export type ValueReaderRegistration = {
    readonly kind: string;
    readonly read: ValueReader;
};

const TrimInputAttribute = "data-ui-trim-input";

/** Readers by kind; an element naming no kind is read by what it is. */
export class ValueReaderRegistry {
    private readonly readers = new Map<string, ValueReader>();

    public constructor(registrations?: Iterable<ValueReaderRegistration>) {
        for (const registration of BuiltInValueReaders)
            this.register(registration);

        for (const registration of registrations ?? [])
            this.register(registration);
    }

    public register(registration: ValueReaderRegistration): void {
        this.readers.set(registration.kind, registration.read);
    }

    public read(element: Element): unknown {
        const kind = element.getAttribute(ValueKindAttribute);

        if (kind === null)
            return readNativeValue(element);

        const reader = this.readers.get(kind);

        if (reader === undefined) {
            logWarn("value reader: no reader registered for this kind.", { kind });
            return null;
        }

        return reader(element);
    }

    /** The value as the binding wants it: trimmed where the component asked for that. */
    public readBound(element: Element): unknown {
        const value = this.read(element);

        return typeof value === "string" && element.hasAttribute(TrimInputAttribute)
            ? value.trim()
            : value;
    }
}

function readNativeValue(element: Element): unknown {
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

    return null;
}

function numberOrNull(text: string | null): number | null {
    return text === null ? null : Number(text);
}

// The kind names are WebValueKinds on the server; the attributes each reads are written by the engine named.
const BuiltInValueReaders: readonly ValueReaderRegistration[] = [
    // flyout-interaction-engine.ts
    { kind: "flyout-open", read: element => element.classList.contains("ui-flyout--open") },
    // tabs-engine.ts and tabs-view-engine.ts
    { kind: "tabs-selected", read: element => element.getAttribute(TabsSelectedAttribute) },
    // tabs-view-engine.ts: the order on the tab's root, the caption on its label
    { kind: "tab-order", read: element => numberOrNull(element.getAttribute(TabOrderAttribute)) },
    { kind: "tab-caption", read: element => element.getAttribute(TabCaptionAttribute) },
    // tree-engine.ts: the title a rename wrote, on the node's root
    { kind: "tree-title", read: element => element.getAttribute(TreeTitleAttribute) },
    { kind: "tree-drop-target", read: element => element.getAttribute(TreeDropTargetAttribute) ?? "" },
    // items-selection-engine.ts: the one key on the root, the JSON list on the host
    { kind: "selected-key", read: element => element.getAttribute(SelectedKeyAttribute) },
    { kind: "selected-keys", read: element => readJsonAttribute(element, SelectedKeysAttribute) },
    // the query element every items component renders: the viewer's terms, as an engine wrote them
    { kind: "items-query", read: element => readJsonAttribute(element, ItemsQueryAttribute) },
    // radio-group-sync-engine.ts
    { kind: "checked-radio", read: element => element.querySelector<HTMLInputElement>("input[type=\"radio\"]:checked")?.value ?? null }
];

/** The list itself, not its text: the engine keeps it serialized only because an attribute is text. */
function readJsonAttribute(element: Element, name: string): unknown {
    const text = element.getAttribute(name);
    return text === null ? null : JSON.parse(text) as unknown;
}

export function clearElementValue(element: Element): void {
    if (element instanceof HTMLInputElement && (element.type === "checkbox" || element.type === "radio")) {
        element.checked = false;
        return;
    }

    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement)
        element.value = "";
}
