import { WebUIMetadata } from "./metadata-index";

const MetadataSelector = "script[type='application/json'][data-ui-metadata]";

export function readWebUIMetadata(documentRoot: ParentNode = document): WebUIMetadata {
    const script = documentRoot.querySelector<HTMLScriptElement>(MetadataSelector);

    if (script === null)
        return createEmptyMetadata();

    const text = script.textContent?.trim() ?? "";

    if (text.length === 0)
        return createEmptyMetadata();

    const parsed = JSON.parse(text) as Partial<WebUIMetadata>;

    return {
        propertyDefinitions: parsed.propertyDefinitions ?? [],
        bindings: parsed.bindings ?? [],
        events: parsed.events ?? [],
        interactions: parsed.interactions ?? [],
        validations: parsed.validations ?? [],
        items: parsed.items ?? [],
        itemsFilterSort: parsed.itemsFilterSort ?? [],
        itemValues: parsed.itemValues ?? []
    };
}

function createEmptyMetadata(): WebUIMetadata {
    return {
        propertyDefinitions: [],
        bindings: [],
        events: [],
        interactions: [],
        validations: [],
        items: [],
        itemsFilterSort: [],
        itemValues: []
    };
}
