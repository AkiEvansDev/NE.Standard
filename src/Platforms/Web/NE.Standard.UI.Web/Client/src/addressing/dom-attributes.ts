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
/** On an element inside a row: a double click there is the element's own (a cell that opens its editor), not the row's open. */
export const NoRowOpenAttribute = "data-ui-no-row-open";
/** On a tree's root: the Delete key raises nothing, whatever a node says. */
export const TreeUnremovableAttribute = "data-ui-tree-unremovable";
/** On a tabs view's root: no tab can be closed, and the strip keeps no room for a close. */
export const TabsUnremovableAttribute = "data-ui-tabs-unremovable";
/** On a tabs view's root: its tabs may be reordered by dragging. */
export const TabsDraggableAttribute = "data-ui-tabs-draggable";

/** The author's own name for a component, written only when the author gave it one. */
export const ComponentNameAttribute = "data-ui-name";
export const BindingAttributePrefix = "data-ui-bind-";

/** On the element holding a property some field sends its validation words to; the rest is the property name in kebab-case. */
export const IntoAttributePrefix = "data-ui-into-";
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
/** The temporal culture pack as JSON — month and day names, the AM and PM words — read the same way. */
export const TemporalCultureAttribute = "data-ui-temporal-culture";
export const EmptyTemplateAttribute = "data-ui-empty-template";
export const GroupTemplateAttribute = "data-ui-group-template";
export const EmptyPlaceholderAttribute = "data-ui-empty-placeholder";
export const GroupHeaderAttribute = "data-ui-group-header";
export const GroupAttribute = "data-ui-group";

/** Marks the one element a component keeps its value on, where that is not the element the reader starts from. */
export const ValueHolderAttribute = "data-ui-value-holder";

/** Names the reader that reads a written value off this element. */
export const ValueKindAttribute = "data-ui-value-kind";

/** How an items host holds its rows — "virtualized" or "windowed"; a plain host carries nothing. */
export const HostModeAttribute = "data-ui-host-mode";
/** On an items host that does not scroll itself: its parent is the viewport its rows are seen through (items-viewport.ts). */
export const HostViewportAttribute = "data-ui-host-viewport";

/** On a component root: the scroll group it scrolls with (scroll-group-engine.ts). */
export const ScrollGroupAttribute = "data-ui-scroll-group";
/** On the element a component scrolls, when that is neither its root nor an items host's viewport. */
export const ScrollViewportAttribute = "data-ui-scroll-viewport";
/** On an element whose children are a source's lines in order, the first child line 1. */
export const ScrollLinesAttribute = "data-ui-scroll-lines";
/** On an element drawn from a source line: the line's number, from 1. */
export const SourceLineAttribute = "data-ui-source-line";

/** Marks a windowed or virtualized host's stand-in for the rows it is not drawing: "top" or "bottom". */
export const WindowSpacerAttribute = "data-ui-window-spacer";

/** On a windowed host whose window is a page: the scroll asks for nothing, and a package's pager asks for a window by offset. */
export const WindowPagedAttribute = "data-ui-window-paged";
/** A windowed host's geometry, read back on every layout. */
export const WindowSizeAttribute = "data-ui-window-size";
export const WindowOffsetAttribute = "data-ui-window-offset";
export const WindowTotalAttribute = "data-ui-window-total";
export const WindowMoreBeforeAttribute = "data-ui-window-more-before";
export const WindowMoreAfterAttribute = "data-ui-window-more-after";
/** On a windowed host: what the source computed over every item the query leaves, by property, as JSON. */
export const WindowAggregatesAttribute = "data-ui-window-aggregates";
export const FormIdAttribute = "data-ui-form-id";

export const VisibilityAttribute = "data-ui-visibility";

/** A collapsible component's state, and its switch. */
export const CollapsedAttribute = "data-ui-collapsed";
// On a menu entry's wrapper: it has sub-entries (a group), they fly out rather than unfold (a select), and the group is open.
export const MenuGroupAttribute = "data-ui-menu-group";
export const MenuSelectAttribute = "data-ui-menu-select";
export const MenuOpenAttribute = "data-ui-menu-open";
/** On a menu entry: what it is beside a plain one — a header, a separator, a check. */
export const MenuItemKindAttribute = "data-ui-menu-item-kind";
/** A menu entry with a mark of its own — a group's chevron, a check's tick — which is also one a press leaves the menu open on. */
export const MarkedMenuEntrySelector = `[${MenuGroupAttribute}] > .ui-menu-item, .ui-menu-item[${MenuItemKindAttribute}="check"]`;
export const CollapseToggleAttribute = "data-ui-collapse-toggle";
/** Client-only: on a collapsible while collapsible-engine.ts slides it, so the stylesheet holds the open layout until the slide ends. */
export const FoldingAttribute = "data-ui-folding";

/** A container's track bounds for a splitter's clamp (`index:min:max` per bounded track), and the pixels a splitter moves per arrow press. */
export const ColumnLimitsAttribute = "data-ui-column-limits";
export const RowLimitsAttribute = "data-ui-row-limits";
export const SplitterStepAttribute = "data-ui-splitter-step";
/** On a table header's resize handle and on every cell: the 0-based column it belongs to. */
export const TableColumnAttribute = "data-ui-table-column";
/** On a table's header cell: the column's key, and the viewport tier below which the author hides the column. */
export const TableColumnKeyAttribute = "data-ui-table-column-key";
export const TableHideBelowAttribute = "data-ui-table-hide-below";
/** On the header cell of a column the control owns: the viewer neither sizes it nor moves it. */
export const TableFixedAttribute = "data-ui-table-fixed";
/** Client-only: on a table's root, the indices of the columns hidden now, which the stylesheet puts out of sight. */
export const TableHiddenAttribute = "data-ui-table-hidden";
/** Client-only: on a table's root, the index of the column at the end of the row — the one with no edge of its own to drag. */
export const TableLastAttribute = "data-ui-table-last";
/** Client-only: on a table's root while a column is being dragged, on the cell being dragged, and on the cell the drop line stands at. */
export const TableReorderingAttribute = "data-ui-table-reordering";
export const TableDraggingAttribute = "data-ui-table-dragging";
export const TableDropAttribute = "data-ui-table-drop";
/** Client-only: on a table's root while it is scrolled sideways, so the last pinned column draws the shadow of what is under it. */
export const TableScrolledAttribute = "data-ui-table-scrolled";
/** On an items host whose rows are chosen by something of its own — a grid's checkboxes: a click on a row chooses nothing. */
export const NoRowSelectAttribute = "data-ui-no-row-select";
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
/** On a tree's row: "hidden" or "shown" where the viewer's remembered fold disagrees with the authored one; the engine takes it off on its first walk. */
export const TreeBootAttribute = "data-ui-tree-boot";
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
/** Client-only: on a handle the pointer focused, so the stylesheet does not draw the keyboard's focus for it; a key or a blur takes it off. */
export const PointerFocusAttribute = "data-ui-pointer-focus";

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
/** On a pinned tab's root: the strip draws its pin, hides its close and refuses to drag it. */
export const TabPinnedAttribute = "data-ui-tab-pinned";

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
