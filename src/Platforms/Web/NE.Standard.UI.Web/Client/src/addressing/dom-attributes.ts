export const ComponentIdAttribute = "data-ui-id";
export const ComponentParameterCountAttribute = "data-ui-pc";
export const ComponentKeyAttribute = "data-ui-key";

/** The author's own name for a component, written only when the author gave it one. See ClientStore. */
export const ComponentNameAttribute = "data-ui-name";
export const BindingAttributePrefix = "data-ui-bind-";
export const ItemsHostAttribute = "data-ui-items-host";
export const EmptyTemplateAttribute = "data-ui-empty-template";
export const GroupTemplateAttribute = "data-ui-group-template";
export const EmptyPlaceholderAttribute = "data-ui-empty-placeholder";
export const GroupHeaderAttribute = "data-ui-group-header";
export const GroupAttribute = "data-ui-group";

/** Marks an items host whose items come one window at a time, from a source on the server. */
export const WindowedAttribute = "data-ui-windowed";

/** Marks a windowed host's stand-in for the items outside its window: "top" or "bottom". */
export const WindowSpacerAttribute = "data-ui-window-spacer";
export const FormIdAttribute = "data-ui-form-id";

export const HiddenAttribute = "data-ui-hidden";
export const SubmitFormIdAttribute = "data-ui-submit-form-id";
export const ComponentSelector = `[${ComponentIdAttribute}]`;

export function cssAttributeValue(value: string | number): string {
    return String(value).replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
}

export function toKebabCase(value: string): string {
    return value
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .replace(/_/g, "-")
        .toLowerCase();
}
