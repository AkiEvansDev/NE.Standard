export const ComponentIdAttribute = "data-ui-id";
export const ComponentContextAttribute = "data-ui-context";
export const ComponentParameterCountAttribute = "data-ui-pc";
export const ComponentKeyAttribute = "data-ui-key";
/** On an item's row: the item refuses to be chosen, dragged, removed or renamed. */
export const UnselectableAttribute = "data-ui-unselectable";
export const UndraggableAttribute = "data-ui-undraggable";
export const UnremovableAttribute = "data-ui-unremovable";
export const UnrenamableAttribute = "data-ui-unrenamable";
/** On a component, a row or an items host: the context menu inside is not opened. */
export const NoContextMenuAttribute = "data-ui-no-context-menu";
/** On a tree's root: the Delete key raises nothing, whatever a node says. */
export const TreeUnremovableAttribute = "data-ui-tree-unremovable";
/** On a tabs view's root: no tab can be closed, and the strip keeps no room for a close. */
export const TabsUnremovableAttribute = "data-ui-tabs-unremovable";
/** On a tabs view's root: its tabs may be reordered by dragging. */
export const TabsDraggableAttribute = "data-ui-tabs-draggable";

/** The author's own name for a component, written only when the author gave it one. */
export const ComponentNameAttribute = "data-ui-name";
export const BindingAttributePrefix = "data-ui-bind-";
/** The binding a value is written through, on the element that carries the value. */
export const ValueBindingAttribute = "data-ui-bind-value";

/** Marks a component as not taking one named event; the pipeline keeps walking outwards past it. */
export const eventSuppressAttribute = (eventName: string): string => `data-ui-no-${eventName}`;
/** An element no event crosses outward: a component above it never takes an event raised inside it. */
export const EventBoundaryAttribute = "data-ui-event-boundary";
export const ImageCaptionAttribute = "data-ui-image-caption";
/** A split button's mode: "split" (the end part opens the menu) or "menu" (the whole button does). */
export const SplitModeAttribute = "data-ui-split-mode";
export const ItemsHostAttribute = "data-ui-items-host";
/** A component whose bound collection goes to a registered sink as values rather than into an items host as rows. */
export const CollectionSinkAttribute = "data-ui-collection-sink";
/** On an items component's query element: the viewer's filter and sort terms as JSON. */
export const ItemsQueryAttribute = "data-ui-items-query";
/** The number culture pack as JSON; an engine formats by the nearest one above the element. */
export const NumberCultureAttribute = "data-ui-number-culture";
export const EmptyTemplateAttribute = "data-ui-empty-template";
export const GroupTemplateAttribute = "data-ui-group-template";
export const EmptyPlaceholderAttribute = "data-ui-empty-placeholder";
export const GroupHeaderAttribute = "data-ui-group-header";
export const GroupAttribute = "data-ui-group";

/** Names the reader that reads a written value off this element. */
export const ValueKindAttribute = "data-ui-value-kind";

/** How an items host holds its rows — "virtualized" or "windowed"; a plain host carries nothing. */
export const HostModeAttribute = "data-ui-host-mode";

/** Marks a windowed or virtualized host's stand-in for the rows it is not drawing: "top" or "bottom". */
export const WindowSpacerAttribute = "data-ui-window-spacer";

/** A windowed host's geometry, read back on every layout. */
export const WindowSizeAttribute = "data-ui-window-size";
export const WindowOffsetAttribute = "data-ui-window-offset";
export const WindowTotalAttribute = "data-ui-window-total";
export const WindowMoreBeforeAttribute = "data-ui-window-more-before";
export const WindowMoreAfterAttribute = "data-ui-window-more-after";
export const FormIdAttribute = "data-ui-form-id";

export const VisibilityAttribute = "data-ui-visibility";

/** A collapsible component's state, and its switch. */
export const CollapsedAttribute = "data-ui-collapsed";
// On a menu entry's wrapper: it has sub-entries (a group), they fly out rather than unfold (a select), and the group is open.
export const MenuGroupAttribute = "data-ui-menu-group";
export const MenuSelectAttribute = "data-ui-menu-select";
export const MenuOpenAttribute = "data-ui-menu-open";
export const CollapseToggleAttribute = "data-ui-collapse-toggle";
/** Client-only: on a collapsible while collapsible-engine.ts slides it, so the stylesheet holds the open layout until the slide ends. */
export const FoldingAttribute = "data-ui-folding";

/** A container's track bounds for a splitter's clamp (`index:min:max` per bounded track), and the pixels a splitter moves per arrow press. */
export const ColumnLimitsAttribute = "data-ui-column-limits";
export const RowLimitsAttribute = "data-ui-row-limits";
export const SplitterStepAttribute = "data-ui-splitter-step";
/** On a table header's resize handle: the 0-based column it sizes. */
export const TableColumnAttribute = "data-ui-table-column";
/** On a tree node's root: the key of the node above it, that it has children, that it starts unfolded, the title a rename wrote. */
export const TreeParentAttribute = "data-ui-tree-parent";
export const TreeChildrenAttribute = "data-ui-tree-children";
export const TreeExpandedAttribute = "data-ui-tree-expanded";
export const TreeTitleAttribute = "data-ui-tree-title";
/** On a tree's root: its nodes may be renamed in place. */
export const TreeRenamableAttribute = "data-ui-tree-renamable";
/** On a tree's row: the node was unfolded and its children are being asked for. */
export const TreeLoadingAttribute = "data-ui-tree-loading";
/** On a tree node's text: the key of the node it was dropped on. */
export const TreeDropTargetAttribute = "data-ui-tree-drop-target";
/** On a tree's root: its nodes may be dragged onto one another; a double click renames rather than opens. */
export const TreeDraggableAttribute = "data-ui-tree-draggable";
export const TreeRenameOnDoubleClickAttribute = "data-ui-tree-rename-dblclick";
/** A key-value row while it is being edited: its value is the input and its action the save/cancel pair. */
export const RowEditingAttribute = "data-ui-row-editing";
/** An image input's picture (its Value's URL) and its read-only state, both on the root. */
export const ImageSourceAttribute = "data-ui-image-source";
export const ImageReadonlyAttribute = "data-ui-image-readonly";
/** On a file or image input's root: the largest file the server will accept, in bytes; a larger pick is refused on the client. */
export const FileMaxSizeAttribute = "data-ui-file-max-size";
/** On `<html>`: the theme opts every button, action and menu item into the press ripple. */
export const PressRippleAttribute = "data-ui-press-ripple";
/** Client-only: on a splitter while the pointer holds it, for the stylesheet's pressed look. */
export const SplittingAttribute = "data-ui-splitting";

/** Choosing rows in an items view: the mode, the chosen key(s), and the mark on a chosen row's wrapper. */
export const SelectionAttribute = "data-ui-selection";
export const SelectedAttribute = "data-ui-selected";
export const SelectedKeyAttribute = "data-ui-selected-key";
export const SelectedKeysAttribute = "data-ui-selected-keys";
/** The generic binding attribute `RenderProperty` emits for a two-way `SelectedKey`, on strips and on the items view alike. */
export const BindSelectedKeyAttribute = "data-ui-bind-selected-key";

/** A tab strip's selected key on its root; a tab's order on its root and its renamed caption on its label. */
export const TabsSelectedAttribute = "data-ui-tabs-selected";
export const TabOrderAttribute = "data-ui-tab-order";
export const TabCaptionAttribute = "data-ui-tab-caption";

/** Every tier Visibility writes, narrowest first — each one fenced into its own width band by the stylesheet. */
export const VisibilityTierAttributes = [
    VisibilityAttribute,
    "data-ui-visibility-sm",
    "data-ui-visibility-md",
    "data-ui-visibility-xl",
    "data-ui-visibility-xxl"
] as const;
export const SubmitFormIdAttribute = "data-ui-submit-form-id";
export const ComponentSelector = `[${ComponentIdAttribute}]`;

export function cssAttributeValue(value: string | number): string {
    return String(value).replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
}

/** `IsURLValid` to `is-url-valid`; must stay in step with `WebNaming.ToKebabCase` on the C# side. */
export function toKebabCase(value: string): string {
    return value
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
        .replace(/_/g, "-")
        .toLowerCase();
}

let generatedIdCount = 0;

/** The element's own id, assigning a unique one first if it has none. */
export function ensureElementId(element: Element, prefix: string): string {
    if (element.id.length === 0) {
        generatedIdCount++;
        element.id = `${prefix}-${generatedIdCount}`;
    }

    return element.id;
}
