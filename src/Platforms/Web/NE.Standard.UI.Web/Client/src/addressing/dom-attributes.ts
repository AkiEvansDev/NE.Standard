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
/** On an element inside a row: a double click there is the element's own (a cell that opens its editor), not the row's open; nor is a control in it the row's. */
export const NoRowOpenAttribute = "data-ui-no-row-open";
/** Client-only: on a part inside a row that is not the row's to lift (an action bar, a grid's open detail): a press there never drags the row. */
export const NoRowDragAttribute = "data-ui-no-row-drag";
/** On an items view's or a table's root: its rows may be dragged to another place among them, or moved by Alt with an arrow. */
export const RowsDraggableAttribute = "data-ui-rows-draggable";
/** On a drag source's root (`DragKind`): the kind its rows are offered as, dragged or cut out of it (`WebAttributes.DragKind`). */
export const DragKindAttribute = "data-ui-drag-kind";
/** On a drag source's root: what a drop may do with its rows, `move`, `copy` or both, space-separated. */
export const DragEffectsAttribute = "data-ui-drag-effects";
/** On a drag source's root: the id the view gave it, which a drop names as its source. */
export const DragSourceAttribute = "data-ui-drag-source";
/** Client-only: on a component a dragged or pasted item of a kind it takes would land on (not a list, whose rows mark the place); the stylesheet reads it. */
export const ItemDropOverAttribute = "data-ui-item-drop-over";
/** Client-only: beside a drop's mark on a field that draws a box of its own: the box wears the drop's edge, and the root none (`ui-input.less`). */
export const DropBoxedAttribute = "data-ui-drop-boxed";
/** On an items view's or a table's root: a row is dragged only by the grip at its end (`DragHandle`). */
export const RowsDragHandleAttribute = "data-ui-rows-drag-handle";
/** On an items view's or a table's root: its rows' grip stands at their start (`UIDragHandlePlacement.Start`). */
export const DragHandleStartClass = "ui-drag-handle--start";
/** The grip a host dragged by grips draws in each row (`ItemsCollectionRendererBase.RenderRowGrip`, `row-grip.ts`). */
export const RowGripClass = "ui-row__grip";
/** Client-only: on a popup panel named by what opened it (`owned-popup.ts` `nameByOpener`), so an author's name, once it comes, takes its place. */
export const NamedByOpenerAttribute = "data-ui-named-by-opener";
/** Client-only: the hidden words a popup opened from a field is named by — the field's caption as it stood at the opening. */
export const PopupCaptionAttribute = "data-ui-popup-caption";
/** Client-only: on a row's box while another is dragged over it, the side the dragged row would land on. */
export const RowDropAttribute = "data-ui-row-drop";
/** On an items view's, a table's or a tree's root: a row's removal raises a command, so Delete raises it; without it the key is the page's. */
export const RowsRemoveAttribute = "data-ui-rows-remove";
/** On a tree's root: the Delete key raises nothing, whatever a node says. */
export const TreeUnremovableAttribute = "data-ui-tree-unremovable";
/** On a tabs view's root: no tab can be closed, and the strip keeps no room for a close. */
export const TabsUnremovableAttribute = "data-ui-tabs-unremovable";
/** On a tabs view's root while none of its tabs can be closed (`WebAttributes.TabsNoneRemovable`): kept by tabs-view-engine.ts. */
export const TabsNoneRemovableAttribute = "data-ui-tabs-none-removable";
/** On a tabs view's root: a double click or F2 renames a caption in place. */
export const TabsRenamableAttribute = "data-ui-tabs-renamable";
/** On a tabs view's root: its tabs may be reordered by dragging. */
export const TabsDraggableAttribute = "data-ui-tabs-draggable";
/** On a tabs view's root: the built-in entries its tab menu offers, as space-separated tokens — `rename pin delete`. */
export const TabsMenuAttribute = "data-ui-tabs-menu";
/** On a tabs view's root: a tab's close raises a command, so its tab menu may offer the remove entry. */
export const TabsRemovesAttribute = "data-ui-tabs-removes";
/** On a context menu's host: the menu's name, empty for its owner's unnamed one. */
export const ContextMenuAttribute = "data-ui-context-menu";
/** On a component that owns a context menu (the renderer writes it): a long press there is the menu's. */
export const ContextMenuOwnerAttribute = "data-ui-context-menu-owner";
/** On a menu's owner in a row: its menu waits in a template (`row-menus.ts`), drawn into the owner when it is wanted. */
export const ContextMenuLaterAttribute = "data-ui-context-menu-later";
/** On the template a row's menu waits in: the owner's component id. */
export const ContextMenuTemplateAttribute = "data-ui-context-menu-template";
/** On a part of a context menu's owner: the name of the owner's menu a right press there opens. */
export const ContextMenuUseAttribute = "data-ui-context-menu-use";
/**
 * On a context menu's owner, or a part of it naming one of its menus (a node a package draws): its action bar's alignment over
 * it — `end`, `start` or `center`.
 */
export const ActionBarAttribute = "data-ui-action-bar";
/** Client-only: on a host a package draws anew (a node redrawn with its document): what it stands for, so a bar chosen over it outlives the redraw. */
export const ActionBarKeyAttribute = "data-ui-action-bar-key";
/** On a host carrying `ActionBarAttribute` whose bar's "more" opens the rest of its menu: the entries the bar shows are left out. */
export const ActionBarRestAttribute = "data-ui-action-bar-rest";
/** Client-only: on a context menu's row this opening leaves out (the bar's own entries, under its "more"); the next opening clears it. */
export const MenuLeftOutAttribute = "data-ui-menu-left-out";
/** On a menu entry: it also stands in its owner's action bar, as its icon. */
export const InActionBarAttribute = "data-ui-in-action-bar";
/** Client-only: the bar the action bar engine draws inside its host, and the row of its icons atop a menu a long press opened. */
export const ActionBarClass = "ui-action-bar";
export const ActionBarButtonClass = "ui-action-bar__button";
export const ActionBarMoreClass = "ui-action-bar__more";
/** Client-only: an entry's button that shows its icon, which ui-action-bar.less squares; a title's keeps its frame. */
export const ActionBarIconButtonClass = "ui-action-bar__button--icon";
/** Client-only: on a bar whose host the scroll took wholly out of sight: it stays chosen, and shows again as the host comes back. */
export const ActionBarOutClass = "ui-action-bar--out";
/** Client-only: the row of icons atop a menu a long press opened, as against a bar standing over its host. */
export const ActionBarStripClass = "ui-action-bar--strip";
/** Client-only: on the row the keyboard is on in a host with rows; the host's engine moves it. */
export const RowFocusAttribute = "data-ui-row-focus";
/** Client-only: on a host's cursor root while the cursor's row is not drawn (scrolled out of a virtualized host): that row's key. */
export const RowCursorWaitsAttribute = "data-ui-row-cursor-waits";
/**
 * Client-only: on a control a composite took out of the Tab order for now (a row the cursor is not on, a toolbar's control the keyboard
 * is not on): the tabindex it had, empty for none (`tab-out.ts`).
 */
export const TabOutAttribute = "data-ui-tab-out";
/** Client-only: on the cell the keyboard's cursor stands on, in a table acting as a grid (row-cursor.ts). */
export const CellFocusAttribute = "data-ui-cell-focus";
/** Client-only: what the cursor's cell raises before Enter, F2 or a typed character acts on it (`row-cursor.ts`'s `claimCellKey`). */
export const CellKeyEventName = "ui-cell-key";
/** The words of a component's tooltip, where it shows them, and a mark inside a control the tooltip belongs to instead. */
export const TooltipAttribute = "data-ui-tooltip";
export const TooltipPlacementAttribute = "data-ui-tooltip-placement";
/** On an element whose tooltip is shown as written (`TooltipPlain`): its words, written and pushed, are text, never inline markup. */
export const TooltipPlainAttribute = "data-ui-tooltip-plain";
export const TooltipMarkAttribute = "data-ui-tooltip-mark";
/** Client-only: on a validation mark speaking through the tooltip, its severity (`error`, `warning`, `info`), which the tooltip wears while it speaks. */
export const TooltipSeverityAttribute = "data-ui-tooltip-severity";
/** On a control whose tooltip is all it has to say (a caption's badge): a press shows the tooltip, and the next press hides it. */
export const TooltipPressAttribute = "data-ui-tooltip-press";
/** On a badge: its text shown, "compact" while it fits a circle; and its text given at all, blank included (a menu corner's dot). */
export const BadgeTitleAttribute = "data-ui-badge-title";
export const BadgeSetAttribute = "data-ui-badge-set";
export const BadgeIconAttribute = "data-ui-badge-icon";
/** On an element inline markup was written into while it holds a fold, which then wraps (`InlineMarkupRenderer`'s mark too). */
export const FoldsAttribute = "data-ui-folds";

/** The author's own name for a component, written only when the author gave it one. */
export const ComponentNameAttribute = "data-ui-name";
/** What every attribute the framework writes begins with. */
export const FrameworkAttributePrefix = "data-ui-";
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
/** On an image input's root: the frame a chosen picture is cropped to before it uploads, "square" or "circle". */
export const ImageCropAttribute = "data-ui-image-crop";
/** Beside it: the side, in pixels, the cropped picture is written at. */
export const ImageCropSizeAttribute = "data-ui-image-crop-size";
/** A picture's box (`WebClassNames.Image`), the `<img>` it holds, and one drawn round, which shows a glyph while it has no picture. */
export const ImageClass = "ui-image";
export const ImagePictureClass = "ui-image__picture";
export const ImageCircleClass = "ui-image--circle";
/** On a picture: the author's stand-in, shown when its own source is missing or fails (`WebAttributes.FallbackSrc`). */
export const FallbackSrcAttribute = "data-ui-fallback-src";
/** On a round picture or picture icon: the glyph it shows while it has no picture, where its author named one (`WebAttributes.IconFallback`). */
export const IconFallbackAttribute = "data-ui-icon-fallback";
/** On a picture's box showing the framework's own stand-in (`WebAttributes.ImageFailed`); the stylesheet lays it on the wash (ui-image.less). */
export const ImageFailedAttribute = "data-ui-image-failed";
/** On a round picture icon showing its fallback glyph (`WebAttributes.IconFailed`): "missing" with no value, "failed" when its picture failed. */
export const IconFailedAttribute = "data-ui-icon-failed";
/** On a surface whose background picture is blurred: it draws the blur's layer and isolates its stacking (mixins/surface-image.less). */
export const SurfaceImageBlurAttribute = "data-ui-surface-image-blur";
/** A split button's mode: "split" (the end part opens the menu) or "menu" (the whole button does). */
export const SplitModeAttribute = "data-ui-split-mode";
/** On a split button whose menu opens anywhere but below from its end: the placement's token (`WebAttributes.SplitPlacement`). */
export const SplitPlacementAttribute = "data-ui-split-placement";
export const ItemsHostAttribute = "data-ui-items-host";
/** On an items host while it shows its empty state (`WebAttributes.ItemsEmpty`). */
export const ItemsEmptyAttribute = "data-ui-items-empty";
/** A component whose bound collection goes to a registered sink as values rather than into an items host as rows. */
export const CollectionSinkAttribute = "data-ui-collection-sink";
/** On an items component's query element: the viewer's filter and sort terms as JSON. */
export const ItemsQueryAttribute = "data-ui-items-query";
/** Client-only: on an items view's first-visible element, the key of the row at its top as the page last wrote it back; on its last-visible one, the row at its foot. */
export const FirstVisibleKeyAttribute = "data-ui-first-visible-key";
export const LastVisibleKeyAttribute = "data-ui-last-visible-key";
/** The number culture pack as JSON; an engine formats by the nearest one above the element. */
export const NumberCultureAttribute = "data-ui-number-culture";
/** On an element whose number and temporal packs are the page's: a language switch writes them again (`page-culture.ts`). */
export const PageCultureAttribute = "data-ui-page-culture";
/** On a pager's root: the compiled id of the host whose pages it turns. */
export const PagerTargetAttribute = "data-ui-pager-target";
/** On a pager's button: the page it turns to — `first`, `previous`, `next`, `last`, or a page's number. */
export const PagerPageAttribute = "data-ui-pager-page";
/** On a pager's page-size choice: the rows a page holds with it. */
export const PagerSizeAttribute = "data-ui-pager-size";
/** On a number input's root: the author's display format (a .NET numeric format such as `N2`) the value is written in. */
export const NumberFormatAttribute = "data-ui-number-format";
/** The temporal culture pack as JSON — month and day names, the AM and PM words — read the same way. */
export const TemporalCultureAttribute = "data-ui-temporal-culture";
/** On the head's JSON script: the page's language's names and patterns for dates and times, the words table's `temporal` (`WebAttributes.Temporal`). */
export const PageTemporalAttribute = "data-ui-temporal";
/** On a temporal control's root (`WebAttributes.Temporal*`): its mode — `date`, `time` or `date-time` — and the format it shows, the author's or its default. */
export const TemporalModeAttribute = "data-ui-temporal-mode";
export const TemporalFormatAttribute = "data-ui-temporal-format";
export const TemporalDefaultFormatAttribute = "data-ui-temporal-default-format";
/** Its Min, Max and Step, and the unit the Step counts in. */
export const TemporalMinAttribute = "data-ui-temporal-min";
export const TemporalMaxAttribute = "data-ui-temporal-max";
export const TemporalStepAttribute = "data-ui-temporal-step";
export const TemporalStepUnitAttribute = "data-ui-temporal-step-unit";
/** Its marked days, each canonical, separated by spaces; the second on a root that offers only them. */
export const TemporalMarkedDaysAttribute = "data-ui-temporal-marked-days";
export const TemporalMarkedOnlyAttribute = "data-ui-temporal-marked-only";
/** On a root editing a period; on the part — a field, a clock, a hidden input — that holds the period's end. */
export const TemporalRangeAttribute = "data-ui-temporal-range";
export const TemporalEndAttribute = "data-ui-temporal-end";
/** On a period: the least distance between its two ends, as a `TimeSpan`'s invariant text. */
export const TemporalMinDistanceAttribute = "data-ui-temporal-min-distance";
/** On a control whose culture is the page's: a language switch writes its names and default format again. */
export const TemporalPageCultureAttribute = "data-ui-temporal-page-culture";
/** Its culture's names, each list separated by `|`, and the AM and PM words. */
export const TemporalMonthsAttribute = "data-ui-temporal-months";
export const TemporalMonthsGenitiveAttribute = "data-ui-temporal-months-genitive";
export const TemporalMonthsShortAttribute = "data-ui-temporal-months-short";
export const TemporalDayNamesAttribute = "data-ui-temporal-daynames";
export const TemporalWeekdaysAttribute = "data-ui-temporal-weekdays";
export const TemporalAmAttribute = "data-ui-temporal-am";
export const TemporalPmAttribute = "data-ui-temporal-pm";
/** The day a calendar's week starts on, by the culture's: 0 for Sunday. */
export const TemporalFirstDayAttribute = "data-ui-temporal-first-day";
/** On the button that opens a temporal input's popup. */
export const TemporalToggleAttribute = "data-ui-temporal-toggle";
/** On a time input's stepper button: `up` or `down`. */
export const TemporalStepDirectionAttribute = "data-ui-temporal-step-direction";
/** Client-only: on a calendar's header, footer and month buttons, the action each takes — `previous`, `pane`, `month:3`, `now`. */
export const TemporalNavAttribute = "data-ui-temporal-nav";
/** Client-only: on a calendar's day, the day it stands for, canonical. */
export const TemporalDayAttribute = "data-ui-temporal-day";
/** Client-only: on a clock column, the unit it sets; on its cell, the reading it sets. */
export const TemporalUnitAttribute = "data-ui-temporal-unit";
export const TemporalCellAttribute = "data-ui-temporal-cell";
/** Client-only: on a clock column, where the engine parked its chosen reading; a column standing elsewhere was moved by hand. */
export const TemporalCentredAttribute = "data-ui-temporal-centred";
/** Client-only: on a time input's segment, the unit it edits. */
export const TemporalSegmentAttribute = "data-ui-temporal-segment";
/** Client-only: on a time input's segments, the format they were built from, so a live DisplayFormat patch rebuilds them. */
export const TemporalSegmentsOfAttribute = "data-ui-temporal-segments-of";
/**
 * On an element a phrase holding values the page writes itself was painted into — moments, file sizes — those values, whose first paint
 * the boot script writes again (`WebAttributes.PageWritten`).
 */
export const PageWrittenAttribute = "data-ui-page-written";
/** On an element a package's engine draws, and on the region the boot script holds for it until the engines start (`WebAttributes.AwaitsDraw`). */
export const AwaitsDrawAttribute = "data-ui-awaits-draw";
/** A timestamp's root, whose `datetime` is its instant, and the part holding its text (`TimestampComponentRenderer`). */
export const TimestampClass = "ui-timestamp";
export const TimestampTextClass = "ui-timestamp__text";
/** On a timestamp's root: how it shows its instant, read once (`WebAttributes.TimestampFormat`). */
export const TimestampFormatAttribute = "data-ui-timestamp-format";
/** A file shown as a tile — a file tile's root, a shelf's square for a file that is no picture — and its parts (`WebClassNames.FileTile*`). */
export const FileTileClass = "ui-file-tile";
export const FileTileGlyphClass = "ui-file-tile__glyph";
export const FileTileNameClass = "ui-file-tile__name";
export const FileTileSizeClass = "ui-file-tile__size";
/** On a file tile: its file's name, MIME type, size in bytes and its author's glyph (`WebAttributes.FileTile*`). */
export const FileTileNameAttribute = "data-ui-file-name";
export const FileTileTypeAttribute = "data-ui-file-type";
export const FileTileSizeAttribute = "data-ui-file-size";
export const FileTileIconAttribute = "data-ui-file-icon";
export const EmptyTemplateAttribute = "data-ui-empty-template";
export const GroupTemplateAttribute = "data-ui-group-template";
export const EmptyPlaceholderAttribute = "data-ui-empty-placeholder";
export const GroupHeaderAttribute = "data-ui-group-header";
/** On a group header: the key of the row it is drawn from, which its components stand in as a row's stand in its key. */
export const GroupAnchorAttribute = "data-ui-group-anchor";
export const GroupAttribute = "data-ui-group";

/** Marks the one element a component keeps its value on, where that is not the element the reader starts from. */
export const ValueHolderAttribute = "data-ui-value-holder";

/** On the field holding a period's end (`EndValue`), not its `Value`: a temporal input's second field, a range slider's end handle. */
export const ValueEndAttribute = "data-ui-value-end";

/** Names the reader that reads a written value off this element. */
export const ValueKindAttribute = "data-ui-value-kind";
/** The value kind of the element a host's query is carried on. */
export const ItemsQueryValueKind = "items-query";
/** The value kind of the element an items view's first visible key is written on (`WebValueKinds.FirstVisibleKey`). */
export const FirstVisibleKeyValueKind = "first-visible-key";
/** The value kind of the element an items view's last visible key is written on (`WebValueKinds.LastVisibleKey`). */
export const LastVisibleKeyValueKind = "last-visible-key";

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
/** Client-only: on an element drawn from a source line (a package's own client writes it): the line's number, from 1. */
export const SourceLineAttribute = "data-ui-source-line";

/** Client-only: marks a windowed or virtualized host's stand-in for the rows it is not drawing: "top", "bottom", or "pending" for rows on their way. */
export const WindowSpacerAttribute = "data-ui-window-spacer";

/**
 * Client-only: on a windowed host while it reads a window, the edge it reads at (`before`, `after`, `offset`, `start`, `end`), and on its component's
 * root as well: a skeleton shimmers, an indicator stands at that edge (`ui-items-view.less`).
 */
export const WindowPendingAttribute = "data-ui-window-pending";

/** On a windowed host whose window is a page (`Paging`): the scroll asks for nothing, and a pager asks for a window by offset. */
export const WindowPagedAttribute = "data-ui-window-paged";
/** A windowed host's geometry, read back on every layout. */
export const WindowSizeAttribute = "data-ui-window-size";
export const WindowOffsetAttribute = "data-ui-window-offset";
export const WindowTotalAttribute = "data-ui-window-total";
export const WindowMoreBeforeAttribute = "data-ui-window-more-before";
export const WindowMoreAfterAttribute = "data-ui-window-more-after";
/** On a windowed host: the group of the item just before its window, which the window's first row is headed against. */
export const WindowGroupBeforeAttribute = "data-ui-window-group-before";
/** On a windowed host: the totals over its whole source, as JSON, written with each window. */
const WindowAggregatesAttribute = "data-ui-window-aggregates";
export const FormIdAttribute = "data-ui-form-id";
/** The hidden holder of the page's FormId forms, beside the root (`form-owner.ts`). */
export const FormsHolderAttribute = "data-ui-forms";

const VisibilityAttribute = "data-ui-visibility";

/** A collapsible component's state, and its switch. */
export const CollapsedAttribute = "data-ui-collapsed";
// On a menu entry's wrapper: it has sub-entries (a group), they fly out rather than unfold (a select), and the group is open.
export const MenuGroupAttribute = "data-ui-menu-group";
export const MenuSelectAttribute = "data-ui-menu-select";
export const MenuOpenAttribute = "data-ui-menu-open";
// On a page-standing menu entry that acts (`WebAttributes.MenuEntryActing`): its role follows its row's address — a button while it
// holds none, an anchor's link while it does (syncLink; a row built with none takes the button's role as it is stamped).
export const MenuEntryActingAttribute = "data-ui-menu-entry-acting";
/** On a group wrapper holding the current entry, its own or one below (`WebAttributes.MenuHoldsCurrent`): kept by menu-current.ts. */
export const MenuHoldsCurrentAttribute = "data-ui-menu-holds-current";
/** On a menu's host where an entry of its own carries an icon (`WebAttributes.MenuIcons`): kept by menu-icons.ts. */
export const MenuIconsAttribute = "data-ui-menu-icons";
/** On a menu row whose entry is a caption or a rule (`WebAttributes.MenuPassiveRow`): along a bar it takes its own width. */
export const MenuPassiveRowAttribute = "data-ui-menu-passive";
/** On a menu entry showing its chord at its end (`WebAttributes.MenuItemShortcut`): kept by shortcut-engine.ts. */
export const MenuItemShortcutAttribute = "data-ui-menu-item-shortcut";
/** On the popup a menu fills, its Surface's word (`WebAttributes.MenuSurface`): kept by menu-surface.ts. */
export const MenuSurfaceAttribute = "data-ui-menu-surface";
/** On a menu with a search beside its switch (MenuComponent.SetSearch), which menu-search-engine.ts narrows the entries by. */
export const MenuSearchAttribute = "data-ui-menu-search";
/** Client-only: on a searchable menu while something is typed into its search, and on an entry the search leaves out. */
export const MenuSearchingAttribute = "data-ui-menu-searching";
export const MenuUnmatchedAttribute = "data-ui-menu-unmatched";
/** A side's drawer button (naming the side's region), and the backdrop under an open drawer (UIViewOptions.SideDrawers). */
export const DrawerToggleAttribute = "data-ui-drawer-toggle";
export const DrawerBackdropAttribute = "data-ui-drawer-backdrop";
/** Client-only: on the root while a side's drawer is open, naming its region. */
export const DrawerOpenAttribute = "data-ui-drawer-open";
/** Client-only: on an open drawer's own switch standing where the button that opened it is, and on the row it moves with (side-drawer-engine.ts). */
export const DrawerSwitchAttribute = "data-ui-drawer-switch";
export const DrawerSwitchRowAttribute = "data-ui-drawer-switch-row";
/** On the root: the width below which the sides are drawers (`md`, `xl`, `xxl` or `always`; UIViewOptions.SideDrawers), none where they never are. */
export const SideDrawersAttribute = "data-ui-side-drawers";
/** On the root: the sides whose open drawer leaves the page working beside it, unveiled (UIViewOptions.LeftDrawerModal). */
export const DrawerModelessAttribute = "data-ui-drawer-modeless";
/** On a button that pins a side's drawer and unpins it, naming the side (ButtonComponent.PinsDrawer, MenuComponent.DrawerPin). */
export const DrawerPinAttribute = "data-ui-drawer-pin";

/** On the root, one per side: the reader pinned that side, which from the medium breakpoint up stands in its column (side-drawer-engine.ts). */
export function pinnedAttribute(side: string): string {
    return side === "right-side" ? "data-ui-pinned-right-side" : "data-ui-pinned-left-side";
}

/** On a left side that is a rail alone: where the view's sides are drawers a bar along the page's bottom, its groups flying out upward. */
export const BottomBarAttribute = "data-ui-bottom-bar";
/** On a left side that is a rail alone kept a drawer (UIViewOptions.RailBottomBar off): where the view's sides are drawers its rail is a list. */
export const RailDrawerAttribute = "data-ui-rail-drawer";
/** On a menu whose display differs by breakpoint: the tiers it is a rail in, the rest a list (`WebAttributes.MenuRailTiers`). */
export const MenuRailTiersAttribute = "data-ui-menu-rail-tiers";

/**
 * On a component whose orientation, size or list layout differs by breakpoint: that family's class at every tier, narrowest first
 * (`WebAttributes.TierOrientation`, `TierSize`, `TierLayout`); tier-class.ts gives the element the width's.
 */
export const TierOrientationAttribute = "data-ui-tier-orientation";
export const TierSizeAttribute = "data-ui-tier-size";
export const TierLayoutAttribute = "data-ui-tier-layout";
/** On a component marked as the window's foot (WindowFoot). */
export const WindowFootAttribute = "data-ui-window-foot";
/** On the root where the content region's root fills the height (WebAttributes.ContentFills): content-fills.ts keeps it. */
export const ContentFillsAttribute = "data-ui-content-fills";
/** On each band of the page, naming it: a side's drawer is found by it. */
export const RegionAttribute = "data-ui-region";
/** On a menu entry: what it is beside a plain one — a header, a separator, a check. */
export const MenuItemKindAttribute = "data-ui-menu-item-kind";
/** A menu's root, its entry, a check entry turned on, and the entry of the current page. */
export const MenuRootClass = "ui-menu";
export const MenuItemClass = "ui-menu-item";
const MenuItemCheckedClass = "ui-menu-item--checked";
export const MenuItemSelectedClass = "ui-menu-item--selected";
/** A rail (UIMenuDisplay.Rail): it never folds and has no room inline, so its groups fly out, and a label it cuts shows as a tooltip. */
export const MenuRailClass = "ui-menu--rail";
/** A menu standing in another's group: part of that menu, as its submenu. */
export const NestedMenuClass = "ui-menu--nested";
/** A menu entry that runs nothing when pressed: a caption or a rule. */
export const PassiveMenuEntrySelector = `[${MenuItemKindAttribute}="header"], [${MenuItemKindAttribute}="separator"]`;
/** A group's own entry, which opens its block rather than running anything. */
export const MenuGroupEntrySelector = `[${MenuGroupAttribute}] > .${MenuItemClass}`;
/** A menu's entries that are controls: every entry but a header's and a separator's. */
export const MenuControlEntrySelector = `.${MenuItemClass}:not(${PassiveMenuEntrySelector})`;
/** A menu entry with a mark of its own (a group's chevron, a check's tick), which a press also leaves the menu open on. */
export const MarkedMenuEntrySelector = `${MenuGroupEntrySelector}, .${MenuItemClass}[${MenuItemKindAttribute}="check"]`;
/** On a button or a menu entry: the key chord that presses it (`WebAttributes.Shortcut`), read by the page's one registry. */
export const ShortcutAttribute = "data-ui-shortcut";
/** On a range slider: the least distance between its two handles (`WebAttributes.SliderMinDistance`). */
export const SliderMinDistanceAttribute = "data-ui-slider-min-distance";
export const CollapseToggleAttribute = "data-ui-collapse-toggle";
/** Client-only: on a collapsible while collapsible-engine.ts slides it, so the stylesheet holds the open layout until the slide ends. */
export const FoldingAttribute = "data-ui-folding";

/** A container's track bounds for a splitter's clamp (`index:min:max` per bounded track), and the pixels a splitter moves per arrow press. */
export const ColumnLimitsAttribute = "data-ui-column-limits";
export const RowLimitsAttribute = "data-ui-row-limits";
export const SplitterStepAttribute = "data-ui-splitter-step";
/** On a splitter: the share before it, 0 to 1, a bound `Position` holds; and the binding attribute that says it is bound. */
export const SplitterPositionAttribute = "data-ui-splitter-position";
export const BindPositionAttribute = "data-ui-bind-position";
/** A pane container's layout on its root, the name of the pane added at a place on the place, a pane's name on the pane, and the binding attribute that says the layout is bound. */
export const PaneLayoutAttribute = "data-ui-pane-layout";
export const PanePlaceAttribute = "data-ui-pane-place";
export const PaneAttribute = "data-ui-pane";
export const BindLayoutAttribute = "data-ui-bind-layout";
/** A pane that keeps its size wherever it lands; on such a container, a place's authored cells per tier and the tracks a pane may carry. */
export const PaneKeepsSizeAttribute = "data-ui-pane-keeps-size";
export const PaneCellsAttribute = "data-ui-pane-cells";
export const PaneColumnsAttribute = "data-ui-pane-columns";
export const PaneRowsAttribute = "data-ui-pane-rows";
/** On a table header's resize handle and on every cell: the 0-based column it belongs to. */
export const TableColumnAttribute = "data-ui-table-column";
/** On a table's header cell: the column's key, the viewport tier below which the author hides the column, and whether it starts hidden. */
export const TableColumnKeyAttribute = "data-ui-table-column-key";
export const TableHideBelowAttribute = "data-ui-table-hide-below";
export const TableStartsHiddenAttribute = "data-ui-table-starts-hidden";
/** On the header cell of a column the control owns: the viewer neither sizes it nor moves it. */
export const TableFixedAttribute = "data-ui-table-fixed";
/** On the cells of a table's column of checkboxes, and on that column's header cell (`WebAttributes.TableSelect`, `TableSelectAll`). */
export const TableSelectAttribute = "data-ui-table-select";
export const TableSelectAllAttribute = "data-ui-table-select-all";
/** Client-only: on the root of a table's row or header checkbox turned off, which takes back the root's hand (`ui-table.less`). */
export const TableBoxOffAttribute = "data-ui-table-box-off";
/** On a table's root, the indices of the columns hidden now, which the stylesheet puts out of sight: the author's at render, then the columns engine's. */
export const TableHiddenAttribute = "data-ui-table-hidden";
/** A table's parts a package reaches: its row, its scrolling box, its header row, a column's resizer. */
export const TableRowClass = "ui-table__row";
export const TableScrollClass = "ui-table__scroll";
export const TableHeaderClass = "ui-table__header";
export const TableResizerClass = "ui-table__resizer";
/** A tree's root and its row, and a row its rules leave out. */
export const TreeRootClass = "ui-tree";
export const TreeRowClass = "ui-tree__row";
/** A tree node's face inside its row. */
export const TreeNodeClass = "ui-tree-node";
/** Client-only: on the place a drag would drop at in a tree — empty on a folder it goes into or on the tree's ground, `before` or
 * `after` on the row the line stands beside. */
export const TreeDropMarkAttribute = "data-ui-tree-drop";
export const TreeRowFilteredClass = "ui-tree__row--filtered";
/** Client-only: on a table's root, the index of the row's last column, the one with no edge of its own to drag. */
export const TableLastAttribute = "data-ui-table-last";
/** Client-only: on a table's root while a column is being dragged, on the cell being dragged, and on the cell the drop line stands at. */
export const TableReorderingAttribute = "data-ui-table-reordering";
export const TableDraggingAttribute = "data-ui-table-dragging";
export const TableDropAttribute = "data-ui-table-drop";
/** Client-only: on a table's root while it is scrolled sideways, so the last pinned column draws the shadow of what is under it. */
export const TableScrolledAttribute = "data-ui-table-scrolled";
/** Client-only: on a table's root while its rows' host scrolls vertically, so the header and the host keep the same gutter at the end. */
export const TableScrollbarAttribute = "data-ui-table-scrollbar";
/** On an items host whose rows are chosen by something of its own — a grid's checkboxes: a click on a row chooses nothing. */
export const NoRowSelectAttribute = "data-ui-no-row-select";
/** On a tree node's root: the key of the node above it, that it has children, that it starts unfolded, the title a rename wrote. */
export const TreeParentAttribute = "data-ui-tree-parent";
export const TreeChildrenAttribute = "data-ui-tree-children";
/** On a tree node's root: `true` for a folder a drag drops onto even while empty, `false` for a node that takes none. */
export const TreeFolderAttribute = "data-ui-tree-folder";
export const TreeExpandedAttribute = "data-ui-tree-expanded";
export const TreeTitleAttribute = "data-ui-tree-title";
/** On a tree's root: its nodes may be renamed in place. */
export const TreeRenamableAttribute = "data-ui-tree-renamable";
/** Client-only: on a tree's row: the node was unfolded and its children are being asked for. */
export const TreeLoadingAttribute = "data-ui-tree-loading";
/** On a tree node's text: the key of the node it was dropped on. */
export const TreeDropTargetAttribute = "data-ui-tree-drop-target";
/** Client-only: on a tree's row: "hidden" or "shown" where the viewer's remembered fold differs from the authored one; the first walk takes it off. */
export const TreeBootAttribute = "data-ui-tree-boot";
/** On a tree's root: its nodes may be dragged onto one another; a double click renames rather than opens. */
export const TreeDraggableAttribute = "data-ui-tree-draggable";
export const TreeRenameOnDoubleClickAttribute = "data-ui-tree-rename-dblclick";
/** A key-value row while it is being edited: its value is the input and its action the save/cancel pair. */
export const RowEditingAttribute = "data-ui-row-editing";
/** Client-only: on an open key-value row's input cell whose editor draws a field box, which the cell sets down onto its line. */
export const BoxedEditorAttribute = "data-ui-boxed-editor";
/**
 * On an item's row whose template root — its child, or its grandchild through a wrapper — is disabled or loading: the row answers no
 * pointer (`@ui-row-live`). The render writes it, `row-idle.ts` keeps it.
 */
export const RowIdleAttribute = "data-ui-row-idle";
/** On an items view's, a table's, a tree's or a key-value list's row whose press raises `click` (`WebAttributes.RowClick`, `items-row-renderer.ts`). */
export const RowClickAttribute = "data-ui-row-click";
/** On a breadcrumbs step's wrapper: the tiers its step is collapsed in, and those no shown step follows it in (`WebAttributes.StepCollapsed`, `StepEnd`). */
export const StepCollapsedAttribute = "data-ui-step-collapsed";
export const StepEndAttribute = "data-ui-step-end";
/** Client-only: on the row an action bar stands over (action-bar-engine.ts), which washes as the keyboard's row does (`.ui-row-bar()`). */
export const RowBarAttribute = "data-ui-row-bar";
/** An image input's picture, its Value's URL, on the root. */
export const ImageSourceAttribute = "data-ui-image-source";
/** On a file or image input's root: the largest file the server will accept, in bytes; a larger pick is refused on the client. */
export const FileMaxSizeAttribute = "data-ui-file-max-size";
/** On a file or image input's control that opens the native file dialog. */
export const FilePickAttribute = "data-ui-file-pick";
/** On a file or image input's root: the component id whose dropped and pasted files the input takes. */
export const FileDropTargetIdAttribute = "data-ui-file-drop-target-id";
/** On `<html>`: the theme opts every button, action and menu item into the press ripple. */
export const PressRippleAttribute = "data-ui-press-ripple";
/** On `<html>`: the theme draws its scrollbars over the content (overlay-scrollbar-engine.ts). */
export const OverlayScrollbarsAttribute = "data-ui-overlay-scrollbars";
/** On `<html>`: the framework's service worker's address, where the application turned system notifications on. */
export const ServiceWorkerAttribute = "data-ui-service-worker";
/** On `<html>`: the application's own worker imports the framework's, so the page waits for it instead of registering. */
export const ServiceWorkerImportedAttribute = "data-ui-service-worker-imported";
/** On `<html>`, or on an element whose subtree keeps a theme of its own: `light`, `dark` or `auto`. */
export const ThemeAttribute = "data-ui-theme";
/** On the head's `style` holding the reader's own colours, after the theme's (`WebAttributes.ThemeColors`). */
export const ThemeColorsAttribute = "data-ui-theme-colors";
/** On the head's `link` to the theme's stylesheet, which the reader's colours stand right after (`WebAttributes.ThemeStylesheet`). */
export const ThemeStylesheetAttribute = "data-ui-theme-sheet";
/** On a field rendered as a password, kept when its type is switched to show it (`WebAttributes.SecretField`): never stashed. */
export const SecretFieldAttribute = "data-ui-secret";
/** An element's chrome words with their keys (`WebWords`, `strings.write`), which a language switch writes again. */
export const WordsAttribute = "data-ui-words";
/** The place in a words mark that stands for the element's own text, beside the attributes it names: the server's `WebWords.TextTarget`. */
export const WordsTextTarget = "#text";
/** The language switcher's root, whose value says what its button shows for a language, `code` or `name`, or `field` on the field. */
export const LanguageSwitcherAttribute = "data-ui-language-switcher";
/** The theme switcher's root: empty on the button, `field` on the field. */
export const ThemeSwitcherAttribute = "data-ui-theme-switcher";
/** On a theme field's option and its words in the box: the theme it stands for, as `ThemeAttribute` spells it. */
export const ThemeChoiceAttribute = "data-ui-theme-choice";
/** The value of a page switcher's root attribute on its field shape (`SwitcherChromeRenderer.FieldHookValue`). */
export const SwitcherFieldValue = "field";
/** On a language switcher's choice: the language it switches to. */
export const LanguageAttribute = "data-ui-language";
/** Client-only: on a splitter while the pointer holds it, for the stylesheet's pressed look. */
export const SplittingAttribute = "data-ui-splitting";
/** Client-only: on the document element while a phone's on-screen keyboard is up, which the page's bottom bar steps aside for. */
export const KeyboardUpAttribute = "data-ui-keyboard-up";
/** Client-only: on the document element, `reconnecting` once a dropped connection outlasts its grace, `lost` once it is given up. */
export const ConnectionAttribute = "data-ui-connection";
/** Client-only: on the element a press raised a command from while its answer is late (`pending-mark.ts`); never a server patch's. */
export const PendingAttribute = "data-ui-pending";
/** Client-only: on a container's child whose tracks a splitter took to nothing, so its squeezed words lend the row no height. */
export const SplitFoldedAttribute = "data-ui-split-folded";
/** Client-only: on a splitter with nothing left on one side, `before` or `after`: its line stands at that edge, shown only under the pointer. */
export const SplitEdgeAttribute = "data-ui-split-edge";
/** Client-only: on a handle the pointer focused, so no keyboard focus is drawn for it; a key or a blur takes it off. */
export const PointerFocusAttribute = "data-ui-pointer-focus";
/**
 * Client-only: on the focused element's ancestors up to its component root (popup-focus.ts), `pointer` while the focus wears
 * `data-ui-pointer-focus` and `keyboard` otherwise; none while an editable entry holds it. What a field's edge and a list's quiet read.
 */
export const FocusWithinAttribute = "data-ui-focus-within";
/**
 * Client-only: on every element from an open popup up to its owner while the pointer is in the popup (owned-popup.ts), as `:hover` holds
 * on each of them: `@ui-button-live` leaves such an owner quiet.
 */
export const PopupHoverAttribute = "data-ui-popup-hover";
/**
 * Client-only: on a clickable surface while the pointer is over a control of its own (`hover`) or pressed one (`press`), space-separated
 * (surface-press-engine.ts): the surface's wash and press stay off under the control's.
 */
export const InnerPointerAttribute = "data-ui-inner-pointer";

/** Choosing rows in an items view: the mode, the chosen key(s), and the mark on a chosen row's wrapper. */
export const SelectionAttribute = "data-ui-selection";
export const SelectedAttribute = "data-ui-selected";
export const SelectedKeyAttribute = "data-ui-selected-key";
export const SelectedKeysAttribute = "data-ui-selected-keys";
/** On a multi-select's root, how many options it takes at most, whichever way it is drawn (`WebAttributes.SelectMax`). */
export const SelectMaxAttribute = "data-ui-select-max";
/** The generic binding attribute `RenderProperty` emits for a two-way `SelectedKey`, on strips and on the items view alike. */
export const BindSelectedKeyAttribute = "data-ui-bind-selected-key";

/** A tab strip's selected key on its root; a tab's renamed caption on its label. */
export const TabsSelectedAttribute = "data-ui-tabs-selected";
export const TabCaptionAttribute = "data-ui-tab-caption";
/** A Tabs caption's key, its page's, and the tab its group of actions at the strip's end is shown for (TabsComponentRenderer). */
export const TabKeyAttribute = "data-ui-tab-key";
export const TabPageAttribute = "data-ui-tab-page";
export const TabActionsAttribute = "data-ui-tab-actions";
/** On a pinned tab's root: the strip draws its pin, hides its close and refuses to drag it. */
export const TabPinnedAttribute = "data-ui-tab-pinned";

/**
 * Every tier Visibility writes, narrowest first (`responsiveTiers`' order) — each one fenced into its own width band by the stylesheet.
 * Spelled whole rather than built by `responsiveVariable`, so the stylesheet hook guard sees each name written.
 */
export const VisibilityTierAttributes = [
    VisibilityAttribute,
    "data-ui-visibility-sm",
    "data-ui-visibility-md",
    "data-ui-visibility-xl",
    "data-ui-visibility-xxl"
] as const;
export const SubmitFormIdAttribute = "data-ui-submit-form-id";
export const ComponentSelector = `[${ComponentIdAttribute}]`;

/** A link's address, kept while the link is disabled or loading and carries no `href` the browser's own menu could open. */
export const HrefAttribute = "data-ui-href";
/** On a component's root while its Enabled is false: the look, and the mark every refusal reads. */
export const DisabledClass = "ui-disabled";
/** On a component's root while it is Loading. */
export const LoadingClass = "ui-loading";
/** On an input's root while its IsReadOnly is true, whatever its own control carries for the browser. */
export const ReadOnlyClass = "ui-readonly";
/** On a row a filter keeps out of view; named here, not in the filter, so the empty state reads it without an import cycle. */
export const HiddenClass = "ui-hidden";
/** A dialog's panel and a flyout's: each takes the keyboard back from a field inside it. */
export const DialogSurfaceClass = "ui-dialog__surface";
export const FlyoutContentClass = "ui-flyout__content";
/** The popups a menu fills as its host draws them: a right-click menu and a split button's list, whose Surface the popup wears. */
export const MenuHostPopupSelector = ".ui-context-menu, .ui-split-button__menu";
/** The popups a menu can fill: those of `MenuHostPopupSelector`, and a flyout's content (a menu button's list). */
export const MenuPopupSelector = `${MenuHostPopupSelector}, .${FlyoutContentClass}`;
/** On a focusable layer a package draws (a canvas, a panel over it): it takes the keyboard back from a field inside it. */
export const FocusHolderAttribute = "data-ui-focus-holder";
/**
 * Client-only: on an element whose keys are its own while the focus is inside it (a grid's cell editor): no host around it acts on them — a row
 * cursor, a list, a menu — and no popup, dialog or drawer closes on its Escape.
 */
export const OwnsKeysAttribute = "data-ui-owns-keys";
/** The roles a field-opened popup wears — a select's list, a menu, a dialog — shared by every host that must yield keys to one. */
export const PopupRoleSelector = "[role='listbox'], [role='menu'], [role='dialog']";
/** The control that opens a select's, a multi-select's or a search's list — a button in the first two, the field's row in a search. */
export const ListTriggerClass = "ui-select__trigger";
const ListTriggerSelector = `.${ListTriggerClass}` as const;
/** A button's root, a select family's root, a text input's root, and the mark of a field whose value was refused. */
export const ButtonClass = "ui-button";
/** A button's Ghost look and its Small size, as WebClassNames writes them. */
export const GhostButtonClass = "ui-button--ghost";
export const SmallButtonClass = "ui-button--small";
/** A small ghost button's look, as the page draws one of its own (an action bar's icon, a strip's overflow entry). */
export const SmallGhostButtonClasses = `${ButtonClass} ${GhostButtonClass} ${SmallButtonClass}`;
export const SelectClass = "ui-select";
/** On a text body's component root while its title, its description, its icon, its badge's icon or its badge's text shows. */
export const TextTitleAttribute = "data-ui-text-title";
export const TextDescriptionAttribute = "data-ui-text-description";
/** A text's description line, as WebClassNames writes it: what a copy of a text that shows one takes. */
export const TextDescriptionClass = "ui-text__description";
/** On an element whose words are shown as written (`DescriptionPlain`): a pushed value is written as text, never read as inline markup. */
export const PlainTextAttribute = "data-ui-plain-text";
/** On an element whose inline markup reads a bare http(s) address as a link (`DescriptionAutolinks`): a pushed value is read so too. */
export const AutolinksAttribute = "data-ui-autolinks";
export const TextIconAttribute = "data-ui-text-icon";
export const TextBadgeIconAttribute = "data-ui-text-badge-icon";
export const TextBadgeTitleAttribute = "data-ui-text-badge-title";
/** A card's header band, and its mark while the text in it shows nothing (`card-header.ts`, `CardComponentRenderer`). */
export const CardHeaderClass = "ui-card__header";
export const CardHeaderEmptyClass = "ui-card__header--empty";
// A list, table or tree whose scroll is switched off (`DisableScroll()`, `WebClassNames.ScrollY`): clipped with `hidden`, scrolling never.
export const ScrollYDisabledClass = "ui-scroll-y--disabled";
export const TextInputClass = "ui-text-input";
export const InvalidClass = "ui-invalid";
// A field's message, which the validation engine writes as a line or a mark; a package's cell may carry one to speak through.
export const ValidationMessageAttribute = "data-ui-validation-message";

export const RootAttribute = "data-ui-root";

export const TrimInputAttribute = "data-ui-trim-input";
export const TriggersAttribute = "data-ui-triggers";
export const TriggerItemsAttribute = "data-ui-trigger-items";
export const TriggerSearchAttribute = "data-ui-trigger-search";
export const FlyoutOpenClass = "ui-flyout--open";

export const AccordionClass = "ui-accordion";

export const TreeNodeWrapperClass = "ui-tree__node";
export const ItemsViewItemClass = "ui-items-view__item";

export const ButtonContentClass = "ui-button__content";
export const TextTitleClass = "ui-text__title";
export const TextIconClass = "ui-text__icon";

// Client-only: on a popup placed against a stand-in: its part is `visibility: hidden`, and the popup shows itself over that.
export const PopupStoodInAttribute = "data-ui-popup-stood-in";
// Client-only: on a popup lifted into the top layer, for the stylesheet to take the popover's own box back off it.
export const PopupLiftedAttribute = "data-ui-popup-lifted";
/** Client-only: on a list popup shown as a phone's sheet (popup-sheet.ts) rather than beside its anchor: "root", or "nested" over another sheet. */
export const SheetAttribute = "data-ui-sheet";
// Client-only: on a popup capped to its side's room, which `uncap` takes back off before it is measured again.
export const PopupCappedAttribute = "data-ui-popup-capped";
/** Client-only: on an anchored popup, the side it stands at after any flip, which its arrow follows. */
export const PopupPlacementAttribute = "data-ui-placement";

export const BreadcrumbsClass = "ui-breadcrumbs";
export const BreadcrumbsItemClass = "ui-breadcrumbs__item";
export const BreadcrumbClass = "ui-breadcrumb";
/** Client-only: on the trail's step the breadcrumbs engine marks as the current page. */
export const BreadcrumbCurrentClass = "ui-breadcrumb--current";

export const ButtonGroupClass = "ui-button-group";
export const ButtonGroupItemClass = "ui-button-group__item";

export const CollapsibleClass = "ui-collapsible";
export const CollapsibleContentClass = "ui-collapsible__content";
export const CollapsibleBarContentClass = "ui-collapsible__bar-content";
export const SideTopClass = "ui-side--top";
export const SideBottomClass = "ui-side--bottom";
// The row a toggle shares with content set beside it (CollapsibleChromeRenderer).
export const CollapsibleBarClass = "ui-collapsible__bar";

export const ColorInputClass = "ui-color-input";
export const ColorInputPopupClass = "ui-color-input__popup";
export const ColorInputTextClass = "ui-color-input__text";
export const ColorInputRowClass = "ui-color-input__row";
export const ColorInputValueInputClass = "ui-color-input__value-input";
export const ColorInputSquareThumbClass = "ui-color-input__square-thumb";
export const ColorInputHueThumbClass = "ui-color-input__hue-thumb";
export const ColorToggleAttribute = "data-ui-color-toggle";
export const ColorTabAttribute = "data-ui-color-tab";
export const ColorPaneAttribute = "data-ui-color-pane";
export const ColorSquareAttribute = "data-ui-color-square";
export const ColorHueAttribute = "data-ui-color-hue";
export const ColorHexAttribute = "data-ui-color-hex";
export const ColorChannelAttribute = "data-ui-color-channel";
export const ColorFactorAttribute = "data-ui-color-factor";
export const ColorOpacityAttribute = "data-ui-color-opacity";
export const ColorNameAttribute = "data-ui-color-name";
export const ColorFormatAttribute = "data-ui-color-format";
// On the root: the optional parts the author turned off; each is offered unless marked.
export const ColorNoOpacityAttribute = "data-ui-color-no-opacity";
export const ColorNoPaletteAttribute = "data-ui-color-no-palette";
/** Client-only: a color input's mark while its picker is open, and on the tab, pane and palette chip the picker shows as chosen. */
export const ColorInputOpenClass = "ui-color-input--open";
export const ColorTabSelectedAttribute = "data-ui-color-tab-selected";
export const ColorPaneSelectedAttribute = "data-ui-color-pane-selected";
export const ColorNameSelectedAttribute = "data-ui-color-name-selected";

export const CommandBarClass = "ui-command-bar";
export const CommandBarHostClass = "ui-command-bar__host";
export const CommandBarItemClass = "ui-command-bar__item";
export const CommandBarOverflowClass = "ui-command-bar__overflow";
export const OrientationVerticalClass = "ui-orientation--vertical";
/** Client-only: a command bar's mark while its entries overflow, and on each entry folded into its overflow menu. */
export const CommandBarOverflowingClass = "ui-command-bar--overflowing";
export const CommandBarOverflowedClass = "ui-command-bar__overflowed";

// Client-only: on a menu while it is open; the action bar reads it to keep "more" standing under the menu it opened.
export const ContextMenuOpenClass = "ui-context-menu--open";
/** Client-only: raised on a menu just before it opens, with the pressed element: an engine sets its entries here, or cancels to keep it shut. */
export const ContextMenuOpeningEventName = "ui-context-menu-opening";

export const InputDebounceAttribute = "data-ui-input-debounce";

/** Client-only: what a closing row's editor raises so every engine holding a draft inside it lets the draft go. */
export const DraftDroppedEventName = "ui-draft-dropped";

export const ImageInputSurfaceClass = "ui-image-input__surface";

/** Client-only: the picture's frame: the ground, corners and elevation of something lifted off the page (core/runtime.less). */
export const DragPictureClass = "ui-drag-picture";
// Client-only: on a part of the copy whose `::before` or `::after` draws something (an icon's mask, a box's tick): the rule written for it.
export const DragPartAttribute = "data-ui-drag-part";

export const FieldClass = "ui-field";

export const RunsOnEscapeAttribute = "data-ui-runs-on-escape";
// A key-value row and the parts of its open editor, which key-value-action-engine.ts reads by the same names.
export const KeyValueActionRowClass = "ui-key-value-action__row";
export const KeyValueActionValueInputClass = "ui-key-value-action__value-input";
export const KeyValueActionEditActionClass = "ui-key-value-action__edit-action";
// A row's own action: its Edit, where the list edits in place (`EnableEditing`).
export const KeyValueActionActionClass = "ui-key-value-action__action";

// On a text area whose Enter submits its form (`TextAreaComponent.SubmitOnEnter`); Shift+Enter still breaks the line.
export const SubmitOnEnterAttribute = "data-ui-submit-on-enter";
// On a field with `OnEnter` (`TextInputComponent.OnEnter`, `TextAreaComponent.OnEnter`): Enter alone commits the value and raises `enter`.
export const RunsOnEnterAttribute = "data-ui-runs-on-enter";
/**
 * Client-only: raised on a field that keeps the focus while a chord presses something (`shortcut-engine.ts`): what was typed is committed where it
 * stands, as Enter commits it, so the command reads it.
 */
export const CommitInPlaceEventName = "ui-commit-in-place";

/** Client-only: on a drop target while a file is over it, as a field's own dragging attribute is on the field; the stylesheet reads it. */
export const FileDropOverAttribute = "data-ui-file-drop-over";

export const FileInputClass = "ui-file-input";
export const FileInputRowClass = "ui-file-input__row";
export const FileInputNativeClass = "ui-file-input__native";
export const FileInputFieldClass = "ui-file-input__field";
export const FileInputSelectionClass = "ui-file-input__selection";
/** Client-only: on the root while a file is dragged over its row. */
export const FileDraggingAttribute = "data-ui-file-dragging";

export const FlyoutClass = "ui-flyout";
export const FlyoutAnchorClass = "ui-flyout__anchor";
export const FlyoutNoBackdropCloseAttribute = "data-ui-flyout-no-backdrop-close";
export const FlyoutNoEscapeCloseAttribute = "data-ui-flyout-no-escape-close";
/** Client-only: the id a flyout's content takes when its trigger names it as what it controls. */
export const FlyoutContentIdPrefix = "ui-flyout-content";

export const GridSplitterClass = "ui-grid-splitter";
export const ContainerClass = "ui-container";

export const TextTypeSubtitleClass = "ui-text-type--subtitle";
export const ButtonPrimaryClass = "ui-button--primary";
/** Client-only: the image crop dialog the page builds, its parts, and its title's id. */
export const ImageCropTitleId = "ui-image-crop-title";
export const ImageCropFrameAttribute = "data-ui-image-crop-frame";
export const ImageCropClass = "ui-image-crop";
export const ImageCropPartAttribute = "data-ui-image-crop-part";
export const ImageCropSurfaceClass = "ui-image-crop__surface";
export const ImageCropTitleClass = "ui-image-crop__title";
export const ImageCropStageClass = "ui-image-crop__stage";
export const ImageCropCanvasClass = "ui-image-crop__canvas";
export const ImageCropFrameClass = "ui-image-crop__frame";
export const ImageCropZoomClass = "ui-image-crop__zoom";

export const ImageInputClass = "ui-image-input";
export const ImageInputMultipleClass = "ui-image-input--multiple";
export const ImageInputNativeClass = "ui-image-input__native";
export const ImageInputPictureClass = "ui-image-input__picture";
export const ImageInputTextClass = "ui-image-input__text";
export const ImageInputSelectionClass = "ui-image-input__selection";
export const ImageInputSelectionsClass = "ui-image-input__selections";
export const ImageInputTilesClass = "ui-image-input__tiles";
/** Client-only: an image input's shelf as its engine draws it: the tiles, their remove buttons and progress, and the marks while files are dragged over or tiles are shown. */
export const ImageInputTileClass = "ui-image-input__tile";
export const ImageInputRemoveClass = "ui-image-input__remove";
export const ImageInputProgressClass = "ui-image-input__progress";
export const ImageDraggingAttribute = "data-ui-image-dragging";
export const ImageTilesAttribute = "data-ui-image-tiles";
/**
 * Client-only: on the root while the file the viewer chose stands in for the controller's picture; while a drag is over it; while a
 * square stands on its shelf.
 */
export const ImagePreviewAttribute = "data-ui-image-preview";

// Client-only: on every rename field, whatever class its caller dresses it in: what an engine asks before it takes the field's Enter or Escape.
export const RenameFieldAttribute = "data-ui-rename-field";

// Client-only: on the rows a Ctrl+X took, until they are pasted or let go of: the stylesheet dims them.
export const RowCutClass = "ui-row--cut";

export const ItemsViewWrapClass = "ui-items-view--wrap";
export const OrientationHorizontalClass = "ui-orientation--horizontal";
/** Client-only: on the row being dragged among its siblings. */
export const RowDraggingClass = "ui-row--dragging";

export const TableClass = "ui-table";

export const KeyValueActionClass = "ui-key-value-action";
export const KeyValueActionValueClass = "ui-key-value-action__value";
export const KeyValueActionEditableClass = "ui-key-value-action--editable";
export const InputFilledClass = "ui-input--filled";
export const InputOutlineClass = "ui-input--outline";
export const InputGhostClass = "ui-input--ghost";
export const InputUnderlineClass = "ui-input--underline";

export const LanguageSwitcherLabelTextClass = "ui-language-switcher__label-text";
export const LanguageSwitcherLabelTextCurrentClass = "ui-language-switcher__label-text--current";
export const LanguageSwitcherChoiceClass = "ui-language-switcher__choice";
export const LanguageSwitcherTriggerClass = "ui-language-switcher__trigger";
export const LanguageSwitcherMenuClass = "ui-language-switcher__menu";
// The page's language where the switcher does not offer it: shown only while the page is in it, and never a choice.
export const LanguageSwitcherLabelTextPageClass = "ui-language-switcher__label-text--page";
/** Client-only: a language switcher's mark while its list is open. */
export const LanguageSwitcherOpenClass = "ui-language-switcher--open";

export const TextTypeBodyClass = "ui-text-type--body";
export const ButtonDangerClass = "ui-button--danger";
/** Client-only: the leave question the page builds, its parts, and the ids its words take. */
export const LeaveDialogKey = "ui-leave";
export const LeavePartAttribute = "data-ui-leave-part";
export const LeaveDialogClass = "ui-leave-dialog";
export const LeaveTitleId = "ui-leave-title";
export const LeaveMessageId = "ui-leave-message";
export const LeaveDialogTitleClass = "ui-leave-dialog__title";
export const LeaveDialogMessageClass = "ui-leave-dialog__message";

export const TextTypeCaptionClass = "ui-text-type--caption";
/** Client-only: the lightbox the page builds, its parts, and its title's id. */
export const LightboxTitleId = "ui-lightbox-title";
export const LightboxClass = "ui-lightbox";
export const LightboxPartAttribute = "data-ui-lightbox-part";
export const LightboxSurfaceClass = "ui-lightbox__surface";
export const LightboxTitleClass = "ui-lightbox__title";
export const LightboxCloseClass = "ui-lightbox__close";
export const LightboxStageClass = "ui-lightbox__stage";
export const LightboxNavClass = "ui-lightbox__nav";
export const LightboxStepClass = "ui-lightbox__step";
export const LightboxStepPreviousClass = "ui-lightbox__step--previous";
export const LightboxStepNextClass = "ui-lightbox__step--next";
export const LightboxCounterClass = "ui-lightbox__counter";
export const LightboxCountRoomClass = "ui-lightbox__count-room";
export const LightboxCountClass = "ui-lightbox__count";
export const LightboxCaptionClass = "ui-lightbox__caption";
export const LightboxFigureClass = "ui-lightbox__figure";
export const LightboxPictureClass = "ui-lightbox__picture";
/** Client-only: on the lightbox while it shows a set, which its arrows and counter walk; a single picture shows neither. */
export const LightboxSetAttribute = "data-ui-lightbox-set";
/** Client-only: a figure's place in the strip: `previous`, `current` or `next`, which the stylesheet sets a pitch apart. */
export const LightboxSlotAttribute = "data-ui-lightbox-slot";
/** Client-only: on the stage while the strip follows a finger or goes back under a picture that slid in: it moves at once, with no transition. */
export const LightboxStillAttribute = "data-ui-lightbox-still";

/** Client-only: the visually hidden live regions the page speaks to a screen reader through. */
export const AnnouncerClass = "ui-announcer";

/** Client-only: raised on the part a finger is held on once the hold is shown, with the time left until it opens the menu. */
export const LongPressHoldEventName = "ui-long-press-hold";
/** Client-only: raised where a shown hold ended: the menu it asked for opened, or the finger let go, moved on or became a scroll. */
export const LongPressHoldEndEventName = "ui-long-press-hold-end";

export const MenuHostClass = "ui-menu__host";
export const MenuItemWrapperClass = "ui-menu__item";
export const TextClass = "ui-text";
export const TextBodyClass = "ui-text__body";
export const TextHeaderClass = "ui-text__header";
/** Client-only: the inline rename field a text component opens over its title. */
export const TextRenameClass = "ui-text__rename";
export const TextRenamedTitleAttribute = "data-ui-text-renamed-title";
export const TextRenamableAttribute = "data-ui-text-renamable";
export const MenuSubmenuClass = "ui-menu__submenu";

export const SideRightClass = "ui-side--right";
/** Client-only: on a submenu's popup while it opens as a flyout beside its entry. */
export const MenuFlyoutAttribute = "data-ui-menu-flyout";
// Client-only: on a menu once the reader has unfolded a section of it by hand: only then does a section slide open, never as the page arrives.
export const MenuUnfoldedAttribute = "data-ui-menu-unfolded";

export const MultiSelectCheckClass = "ui-multi-select__check";
export const SelectValueInputClass = "ui-select__value-input";
export const MultiSelectButtonClass = "ui-multi-select--button";
// MultiSelectComponentRenderer.CheckboxesClassName, beside `ui-multi-select`; never `ui-select`, so the select engine passes it by.
export const MultiSelectCheckboxesClass = "ui-multi-select--checkboxes";

export const ProgressClass = "ui-progress";
export const ProgressLinearClass = "ui-progress--linear";
export const ProgressTrackClass = "ui-progress__track";
export const ProgressFillClass = "ui-progress__fill";
/** Client-only: the bar the page draws across its top while a navigation is under way. */
export const NavigationProgressClass = "ui-navigation-progress";

/** Client-only: the toasts the notification engine draws, their host and parts, and the mark on the connection's own toast. */
export const NotificationHostClass = "ui-notification-host";
export const NotificationClass = "ui-notification";
export const NotificationLeavingClass = "ui-notification--leaving";
export const NotificationMessageClass = "ui-notification__message";
export const NotificationTitleClass = "ui-notification__title";
export const NotificationActionClass = "ui-notification__action";
export const NotificationCloseClass = "ui-notification__close";
export const NotificationConnectionClass = "ui-notification--connection";

export const NumberInputClass = "ui-number-input";
export const NumberInputFieldClass = "ui-number-input__field";
export const NumberNoDecimalsAttribute = "data-ui-number-no-decimals";
export const NumberNoNegativeAttribute = "data-ui-number-no-negative";
export const NumberThousandsAttribute = "data-ui-number-thousands";
export const NumberNoThousandsAttribute = "data-ui-number-no-thousands";
export const NumberTrimZerosAttribute = "data-ui-number-trim-zeros";
export const NumberStepAttribute = "data-ui-number-step";
export const NumberMinAttribute = "data-ui-number-min";
export const NumberMaxAttribute = "data-ui-number-max";
export const NumberStepDirectionAttribute = "data-ui-number-step-direction";
export const NumberInputRowClass = "ui-number-input__row";

export const DialogAttribute = "data-ui-dialog";
export const DialogModalAttribute = "data-ui-dialog-modal";
export const DialogBackdropAttribute = "data-ui-dialog-backdrop";
export const DialogCloseBackdropAttribute = "data-ui-dialog-close-backdrop";
export const DialogCloseEscapeAttribute = "data-ui-dialog-close-escape";
/** The edge a sheet stands against: "left", "right", "top" or "bottom"; none on a centred dialog. */
export const DialogPlacementAttribute = "data-ui-dialog-placement";

/** Client-only: the overlay scrollbars the engine draws over a scroller, their boxes and thumbs, and their shown and held marks. */
export const OverlayScrollbarClass = "ui-overlay-scrollbar";
export const OverlayScrollbarBoxClass = "ui-overlay-scrollbar__box";
export const OverlayScrollbarThumbClass = "ui-overlay-scrollbar__thumb";
export const OverlayScrollbarShownClass = "ui-overlay-scrollbar--shown";
export const OverlayScrollbarThumbHeldClass = "ui-overlay-scrollbar__thumb--held";

export const TextInputRowClass = "ui-text-input__row";
export const TemporalInputRowClass = "ui-temporal-input__row";
export const FieldBoxClass = "ui-field-box";

/** Client-only: the id an opener takes when a popup is named by it. */
export const PopupOpenerIdPrefix = "ui-popup-opener";
/** Client-only: the id a field's caption takes when a popup the field opens is named by it. */
export const PopupCaptionIdPrefix = "ui-popup-caption";

export const DialogClass = "ui-dialog";
export const DialogBackdropClass = "ui-dialog__backdrop";
/** Client-only: the row of buttons at the foot of a dialog the page builds. */
export const DialogActionsClass = "ui-dialog__actions";

export const PagerClass = "ui-pager";
export const PagerButtonClass = "ui-pager__button";
export const PagerPagesClass = "ui-pager__pages";
export const PagerRangeClass = "ui-pager__range";
export const PagerSizeClass = "ui-pager__size";
export const PagerSizeTriggerClass = "ui-pager__size-trigger";
export const PagerSizeLabelClass = "ui-pager__size-label";
export const PagerSizesClass = "ui-pager__sizes";
export const PagerSizeChoiceClass = "ui-pager__size-choice";
/** Client-only: a pager's page numbers, its gap between them and its size menu's open mark, as the pager engine draws them. */
export const PagerNumberClass = "ui-pager__number";
export const PagerGapClass = "ui-pager__gap";
export const PagerSizeOpenClass = "ui-pager__size--open";

export const PaneContainerClass = "ui-pane-container";
export const PaneContainerPlaceClass = "ui-pane-container__place";
export const PaneContainerPaneClass = "ui-pane-container__pane";
export const PaneContainerGripClass = "ui-pane-container__grip";
export const TextTypeDisplayClass = "ui-text-type--display";
export const TextTypeTitleClass = "ui-text-type--title";
/** Client-only: a pane container's marks while a pane is carried: the pane lifted, the place it would land at, the container moving, the pane near the pointer. */
export const PaneLiftedAttribute = "data-ui-pane-lifted";
export const PaneTargetAttribute = "data-ui-pane-target";
export const PaneMovingAttribute = "data-ui-pane-moving";
export const PaneNearAttribute = "data-ui-pane-near";
// Client-only: on a lifted pane stood in the top layer (`raise`), for the stylesheet to take the popover's own box off it.
export const PaneRaisedAttribute = "data-ui-pane-raised";

/** Client-only: what `OpenPickerEffect` raises on a file field so its engine opens the native chooser. */
export const OpenPickerEventName = "ui-open-picker";

/**
 * Client-only: a list's current entry, the keyboard's or the pointer's, marked outright: `:focus` fails in an unfocused window, and a
 * search keeps its focus (`@ui-list-keyboard` frames it while it is not the pointer's).
 */
export const ActiveAttribute = "data-ui-active";

/** Client-only: the scrim behind a popup shown as a bottom sheet, and the back row atop a sheet's submenu. */
export const SheetScrimClass = "ui-sheet-scrim";
export const SheetBackClass = "ui-sheet__back";
export const SheetBackMarkClass = "ui-sheet__back-mark";
/** Client-only: on a sheet a nested list stands over, which steps aside as the nested one slides in. */
export const SheetCoveredAttribute = "data-ui-sheet-covered";
// Client-only: on the veil once its sheets have gone under a press still going on: unseen, it takes the rest of that press.
export const SheetScrimLeavingAttribute = "data-ui-sheet-scrim-leaving";

export const TabItemCaptionClass = "ui-tab-item__caption";
export const SplitButtonClass = "ui-split-button";
export const SplitButtonMainClass = "ui-split-button__main";
export const SplitButtonToggleClass = "ui-split-button__toggle";
export const ActionClass = "ui-action";
export const SelectOptionClass = "ui-select__option";
export const ExpanderHeaderClass = "ui-expander__header";
export const TabItemCloseClass = "ui-tab-item__close";
/** Client-only: on a control while it is pressed and while a long press holds it; the rename field a tab's caption opens. */
export const PressingClass = "ui-pressing";
export const PressHeldClass = "ui-press-held";
export const TabItemRenameClass = "ui-tab-item__rename";
// Client-only: on a held part not positioned of its own while its wave stands on it: any component may own a menu, so the stylesheet cannot list them.
export const PressPlacedClass = "ui-press-placed";

/** Client-only: the wave: the pressed thing's frame and corners, cutting the ink's circle to them. */
export const PressWaveClass = "ui-press-wave";
/** Client-only: the circle that grows inside the wave. */
export const PressWaveInkClass = "ui-press-wave__ink";

export const RadioValueAttribute = "data-ui-radio-value";
export const RadioGroupClass = "ui-radio-group";
export const RadioGroupItemClass = "ui-radio-group__item";
export const RadioGroupNameAttribute = "data-ui-radio-group-name";
export const RadioBindValueIdAttribute = "data-ui-radio-bind-value-id";

export const SliderInputClass = "ui-slider__input";
export const SliderInputEndClass = "ui-slider__input--end";
export const SliderValueClass = "ui-slider__value";
export const SliderBubbleClass = "ui-slider__bubble";
export const SliderTrackClass = "ui-slider__track";
export const SliderThumbAnchorClass = "ui-slider__thumb-anchor";
export const SliderClass = "ui-slider";
export const SliderRangeClass = "ui-slider--range";
/** Client-only: on a slider's input whose thumb the pointer holds. */
export const SliderInputHeldClass = "ui-slider__input--held";

/** Client-only: the ids a row, its name and a cell take when a host's cursor points at them. */
export const RowNameIdPrefix = "ui-row-name";
export const RowIdPrefix = "ui-row";
export const CellIdPrefix = "ui-cell";
/** Client-only: what a row pressed from the keyboard raises in place of a click: the event pipeline runs the row's click command for it. */
export const RowPressEventName = "ui-row-press";

export const BindSelectedKeysAttribute = "data-ui-bind-selected-keys";
export const ItemsViewClass = "ui-items-view";

/** The end-anchor contract, shared with the virtualization engine, which keeps its own host at the end the same way. */
export const ScrollAnchorAttribute = "data-ui-scroll-anchor";

export const SearchDebounceAttribute = "data-ui-search-debounce";
export const SearchMinLengthAttribute = "data-ui-search-min-length";
export const SearchManualAttribute = "data-ui-search-manual";
export const SearchInputClass = "ui-search__input";
export const SearchFieldClass = "ui-search__field";
// On the field of a search whose list is the server's answer to `OnSearch` (SearchComponentRenderer).
export const SearchAnsweredAttribute = "data-ui-search-answered";
// The listbox the options stand in: the popup itself in a select, the part under the field in a search's.
export const SelectListClass = "ui-select__list";
// Client-only: on the field's box while a query is past its moment unanswered: the glyph in it is the loading ring (ui-search.less).
export const SearchWaitingAttribute = "data-ui-search-waiting";

export const SelectValueAttribute = "data-ui-select-value";
export const SelectTriggerContentClass = "ui-select__trigger-content";
export const SelectPlaceholderClass = "ui-select__placeholder";
export const SelectPopupClass = "ui-select__popup";
export const SelectClearAttribute = "data-ui-select-clear";
export const MultiSelectChipsClass = "ui-multi-select__chips";
export const MultiSelectChipClass = "ui-multi-select__chip";
export const MultiSelectChipLabelClass = "ui-multi-select__chip-label";
export const MultiSelectChipRemoveClass = "ui-multi-select__chip-remove";
export const TextBadgeClass = "ui-text__badge";
export const BadgeClass = "ui-badge";
export const BadgeIconClass = "ui-badge__icon";
export const BadgeTitleClass = "ui-badge__title";
export const TextTypeOverlineClass = "ui-text-type--overline";
export const MultiSelectEntryClass = "ui-multi-select__entry";
export const BadgeVariantInfoClass = "ui-badge-variant--info";
/** The box an icon value is drawn in, the mark that says a glyph is there — `.ui-icon::before` stays hidden without it — and the picture's. */
export const IconClass = "ui-icon";
// Where the list opens when the author said so; below from the start edge otherwise.
export const SelectPlacementAttribute = "data-ui-select-placement";
// What the render leaves on the content it drew, naming the option it drew — read once and taken off.
export const SelectContentAttribute = "data-ui-select-content";
// On a select, multi-select or search that shows its clear (ShowClearButton).
export const ClearableAttribute = "data-ui-clearable";
// A select whose open list carries a text field over its options; the field holds the keyboard while the list is open.
export const SearchClass = "ui-search";
// A multi-select wears the select's shell: its value is the JSON list on the root's chosen-keys attribute, shown as chips.
export const MultiSelectClass = "ui-multi-select";
// A multi-select drawn as badges (UIMultiSelectVariant.Badges): each chip is a copy of the badge its option's row draws, its remove inside it.
export const BadgeSelectClass = "ui-badge-select";
// On a chip, the key of the option it stands for.
export const SelectChipAttribute = "data-ui-select-chip";
// On the chips' host while a chip stands, as the render writes it: the field's clear shows by it.
export const SelectChipsAttribute = "data-ui-select-chips";
// On a multi-select's root that takes the reader's own text: its entry after the chips is the control the reader types in.
export const SelectFreeTextAttribute = "data-ui-select-free-text";
// A field's icon before its text, which a select's trigger draws the chosen option after.
export const InputAffixIconPrefixClass = "ui-input__affix-icon--prefix";
// On a free-text multi-select whose first suggestion Enter takes, marked as the reader types: "first-suggestion".
export const SelectTagEntryAttribute = "data-ui-select-tag-entry";
/** Client-only: a select's mark while its list is open, and the ids its list and options take. */
export const SelectOpenClass = "ui-select--open";
export const SelectListIdPrefix = "ui-select-list";
export const SelectOptionIdPrefix = "ui-select-option";
// Client-only: on the list while its current option is the keyboard's rather than the pointer's: the options' wash then moves without a fade.
export const ListKeyboardAttribute = "data-ui-list-keyboard";

/** Client-only: on a sheet while a finger or the pointer drags it: its transform follows at once, with no transition. */
export const SheetDraggingAttribute = "data-ui-sheet-dragging";

export const MenuItemShortcutClass = "ui-menu-item__shortcut";

export const SideLeftClass = "ui-side--left";

export const SplitButtonMenuClass = "ui-split-button__menu";
/** Client-only: a split button's mark while its menu is open. */
export const SplitButtonOpenClass = "ui-split-button--open";

export const TabOverflowClass = "ui-tab-overflow";
/** Client-only: the menu a strip's overflow button opens, its entries, and their open and current marks. */
export const TabOverflowMenuClass = "ui-tab-overflow__menu";
export const TabOverflowMenuOpenClass = "ui-tab-overflow__menu--open";
export const TabOverflowEntryClass = "ui-tab-overflow__entry";
export const TabOverflowEntryCurrentClass = "ui-tab-overflow__entry--current";

export const SurfaceClickableClass = "ui-surface--clickable";
export const SurfaceClass = "ui-surface";
export const CardClass = "ui-card";

/** A tab's own element: what the strip's engine reads and the tab's events are raised on. */
export const TabItemClass = "ui-tab-item";

/** Client-only: on a caption's title: its own words, which the stylesheet lays out bold and unseen under it (`.ui-tab-caption-reserve()`). */
export const CaptionTextAttribute = "data-ui-caption-text";

export const TableReorderableClass = "ui-table--reorderable";
export const ScrollXAutoClass = "ui-scroll-x--auto";
export const ScrollXAlwaysClass = "ui-scroll-x--always";
export const TableHeaderCellClass = "ui-table__header-cell";
export const TableHeaderCellPinnedClass = "ui-table__header-cell--pinned";
export const TableHostClass = "ui-table__host";
/** Client-only: on a table's cell in its row's last column. */
export const TableCellLastAttribute = "data-ui-table-cell-last";
/** Client-only: on a cell of a column past the styled ones: hidden, or the one ending the row. */
export const TableCellHiddenAttribute = "data-ui-table-cell-hidden";

export const TabsClass = "ui-tabs";
export const TabCaptionClass = "ui-tab-caption";
export const TabCaptionSelectedClass = "ui-tab-caption--selected";
export const TabsNoOverflowClass = "ui-tabs--no-overflow";
export const TabsStripClass = "ui-tabs__strip";
// The band a strip with actions at its end stands in (TabsComponentRenderer), the strip still the tablist.
export const TabsBandClass = "ui-tabs__band";
/** Client-only: a tab strip's mark while its captions overflow, and on each caption folded into its overflow menu. */
export const TabCaptionOverflowedClass = "ui-tab-caption--overflowed";
export const TabsOverflowingClass = "ui-tabs--overflowing";

export const TabsViewClass = "ui-tabs-view";
export const TabItemLabelClass = "ui-tab-item__label";
export const TabItemPinClass = "ui-tab-item__pin";
export const TabsViewNoOverflowClass = "ui-tabs-view--no-overflow";
export const TabItemPageClass = "ui-tab-item__page";
export const TabItemSelectedClass = "ui-tab-item--selected";
export const TabsViewTablistClass = "ui-tabs-view__tablist";
/** Client-only: a tabs view's marks while its captions overflow, on each folded caption and the dragged tab; the ids a tab and its page take. */
export const TabItemDraggingClass = "ui-tab-item--dragging";
export const TabItemCaptionOverflowedClass = "ui-tab-item__caption--overflowed";
export const TabsViewOverflowingClass = "ui-tabs-view--overflowing";
export const TabIdPrefix = "ui-tab";
export const TabPanelIdPrefix = "ui-tab-panel";

/** Client-only: a date picker's day and month cells, as the calendar engine draws them. */
export const TemporalInputDayClass = "ui-temporal-input__day";
export const TemporalInputMonthClass = "ui-temporal-input__month";

export const TemporalInputClass = "ui-temporal-input";
export const TemporalInputValueInputClass = "ui-temporal-input__value-input";
/** A calendar drawn in place (`CalendarComponent`): its root carries the attributes a temporal input's does, and its grid is the popup's. */
export const CalendarClass = "ui-calendar";
/** The period's end, beside the start's hidden input; the two are told apart by the end attribute below. */
export const TemporalInputEndValueInputClass = "ui-temporal-input__end-value-input";

export const TemporalInputFieldClass = "ui-temporal-input__field";
export const TemporalInputPopupClass = "ui-temporal-input__popup";
/** Where a calendar drawn in place draws its grid, as a temporal input draws it into its popup. */
export const CalendarBodyClass = "ui-calendar__body";
/** Client-only: a temporal input's mark while its picker is open, and the clock's columns and cells. */
export const TemporalInputOpenClass = "ui-temporal-input--open";
export const TemporalInputTimeCellClass = "ui-temporal-input__time-cell";
export const TemporalInputTimeColumnClass = "ui-temporal-input__time-column";

export const TextAreaGrowAttribute = "data-ui-text-area-grow";
export const TextAreaFieldClass = "ui-text-area__field";

export const TextFoldToggleClass = "ui-text__fold-toggle";

export const ThemeSwitcherChoiceClass = "ui-theme-switcher__choice";
export const ThemeSwitcherMenuClass = "ui-theme-switcher__menu";
/** Client-only: a theme switcher's mark while its list is open. */
export const ThemeSwitcherOpenClass = "ui-theme-switcher--open";

export const TemporalInputSegmentsClass = "ui-temporal-input__segments";
/** Client-only: a time field's segments as the segment engine draws them, the literals between them, and the mark on an empty one. */
export const TemporalInputSegmentClass = "ui-temporal-input__segment";
export const TemporalInputSegmentLiteralClass = "ui-temporal-input__segment-literal";
export const TemporalInputSegmentEmptyClass = "ui-temporal-input__segment--empty";

/** Client-only: the tooltip's shown mark, and the plain words it read off an element for a copy. */
export const TooltipVisibleClass = "ui-tooltip--visible";
export const TooltipTextAttribute = "data-ui-tooltip-text";
/** Client-only: the page's one tooltip, which takes its class as its id too. */
export const TooltipClass = "ui-tooltip";
// Client-only: words carrying a link, which the pointer may press: any other tooltip lets a press through to the control under it.
export const TooltipLinkedClass = "ui-tooltip--linked";

export const TreeRowFoldedClass = "ui-tree__row--folded";
export const TreeNodeTextClass = "ui-tree-node__text";
export const TreeNodeToggleClass = "ui-tree-node__toggle";
/** Client-only: a tree's dragged row, the row standing for children being asked for and its ring, and a node's rename field. */
export const TreeRowDraggingClass = "ui-tree__row--dragging";
export const TreeLoadingClass = "ui-tree__loading";
export const TreeLoadingRingClass = "ui-tree__loading-ring";
export const TreeNodeRenameClass = "ui-tree-node__rename";
// Client-only: raised on a row once the command its unfold raised has settled, whatever came of it (`TreeUnfoldEvent`).
export const UnfoldSettledEventName = "ui-tree-unfold-settled";

export const ValidationWarningClass = "ui-validation--warning";
export const ValidationInfoClass = "ui-validation--info";
/** Client-only: a validation message drawn as a mark, and the mark beside a field mirroring its severity. */
export const ValidationMessageMarkerClass = "ui-validation-message--marker";
export const ValidationMarkClass = "ui-validation-mark";

export const CheckboxInputClass = "ui-checkbox__input";
export const CheckboxBoxClass = "ui-checkbox__box";

/** Client-only: on a child an engine puts into a host that stands for no item (a tree's row of waiting): a collection index does not count it. */
export const NonItemAttribute = "data-ui-non-item";

/** Client-only: raised on a tree's host when its rules or their sources changed; the tree engine answers with a walk. */
export const TreeRulesEventName = "ui-tree-rules";

export const TemplateAttribute = "data-ui-template";

export const ItemsViewStackClass = "ui-items-view--stack";
export const ItemsViewAccordionClass = "ui-items-view--accordion";

export const RadioGroupInputClass = "ui-radio-group__input";
export const RadioGroupDotClass = "ui-radio-group__dot";

export const TableNoHeaderClass = "ui-table--no-header";
export const ItemsViewHostClass = "ui-items-view__host";

export const MetadataAttribute = "data-ui-metadata";

export const IconAttribute = "data-ui-icon";
/** The class an untinted picture wears: painted as it is. */
export const IconImageClass = "ui-icon--image";
/** The class a tinted picture wears: the one form `.ui-icon::before` paints, a mask filled with the text colour. */
export const IconMaskClass = "ui-icon--mask";

export const TextFoldClass = "ui-text__fold";
export const TextFoldContentClass = "ui-text__fold-content";
export const TextCodeClass = "ui-text__code";
export const TextLinkClass = "ui-text__link";
export const TextIconInlineClass = "ui-text__icon-inline";

// Client-only: on a rail kept a drawer while it is drawn as a list there, so the rail's class can be given back: its tiers, where it has them, say so.
export const MenuRailListAttribute = "data-ui-menu-rail-list";

/** Client-only: the box's words for the theme the page is set to. */
export const ThemeSwitcherLabelTextCurrentClass = "ui-theme-switcher__label-text--current";

export const IconCircleClass = "ui-icon--circle";
export const BadgeColoredClass = "ui-badge--colored";
export const ExpanderQuietClass = "ui-expander--quiet";
export const TextMaxLinesClass = "ui-text--max-lines";
export const TextAreaGrowClass = "ui-text-area--grow";

export const StringsAttribute = "data-ui-strings";

export const HydrationAttribute = "data-ui-hydration";

export const NavigationAttribute = "data-ui-navigation";

/** `IconValueRenderer.StandInClassName`. */
export const IconStandInClass = "ui-icon-stand-in";

export const ClearAttribute = "data-ui-clear";
// The field a clear empties where the bound value is not what the reader edits: a date's text, which its engine reads into the value.
export const ClearTargetAttribute = "data-ui-clear-target";

const CheckboxClass = "ui-checkbox";
const SmallInputClass = "ui-input--small";
export const MenuItemValueClass = "ui-menu-item__value";
const TextInputActionClass = "ui-text-input__action";
const BadgeDangerClass = "ui-badge-variant--danger";
const BadgeWarningClass = "ui-badge-variant--warning";
const BadgeSurfaceClass = "ui-badge-variant--surface";

export const StepCompletedAttribute = "data-ui-step-completed";

export const StepsStackedAttribute = "data-ui-steps-stacked";

export const StepsClass = "ui-steps";

export const StepsItemClass = "ui-steps__item";

export const TriggerClickAttribute = "data-ui-trigger-click";

export const TriggerTokenHoveredAttribute = "data-ui-trigger-hovered";

export const TriggerLayerClass = "ui-text-trigger__layer";

export const TriggerTokenClass = "ui-text-trigger__token";

export const SelectActionClass = "ui-select__action";

export const WindowFootEdgeAttribute = "data-ui-window-foot-edge";

export const ItemsNoMatchAttribute = "data-ui-items-no-match";

export const GroupStartAttribute = "data-ui-group-start";

export const GroupEndAttribute = "data-ui-group-end";

export const InputHeaderClass = "ui-input__header";

export const PlaceholderNamesAttribute = "data-ui-placeholder-names";

export const TextAreaClass = "ui-text-area";

export const ItemsVersionAttribute = "data-ui-items-version";

export const SliderInputHoveredClass = "ui-slider__input--hovered";

/** The names above a package reads too, handed to it as `names` so a rename here reaches it. */
export const pluginDomNames = {
    componentId: ComponentIdAttribute,
    key: ComponentKeyAttribute,
    selected: SelectedAttribute,
    selectedKey: SelectedKeyAttribute,
    selectedKeys: SelectedKeysAttribute,
    unselectable: UnselectableAttribute,
    rowFocus: RowFocusAttribute,
    cellFocus: CellFocusAttribute,
    cellKey: CellKeyEventName,
    itemsHost: ItemsHostAttribute,
    valueHolder: ValueHolderAttribute,
    bindValue: ValueBindingAttribute,
    noRowOpen: NoRowOpenAttribute,
    noRowDrag: NoRowDragAttribute,
    eventBoundary: EventBoundaryAttribute,
    focusHolder: FocusHolderAttribute,
    ownsKeys: OwnsKeysAttribute,
    tooltip: TooltipAttribute,
    tooltipPlacement: TooltipPlacementAttribute,
    contextMenu: ContextMenuAttribute,
    contextMenuUse: ContextMenuUseAttribute,
    actionBar: ActionBarAttribute,
    actionBarKey: ActionBarKeyAttribute,
    actionBarRest: ActionBarRestAttribute,
    disabledClass: DisabledClass,
    loadingClass: LoadingClass,
    readOnlyClass: ReadOnlyClass,
    hiddenClass: HiddenClass,
    buttonClass: ButtonClass,
    ghostButtonClass: GhostButtonClass,
    smallButtonClass: SmallButtonClass,
    selectClass: SelectClass,
    textInputClass: TextInputClass,
    invalidClass: InvalidClass,
    validationMessage: ValidationMessageAttribute,
    sourceLine: SourceLineAttribute,
    textDescription: TextDescriptionAttribute,
    popupSelector: PopupRoleSelector,
    listTriggerSelector: ListTriggerSelector,
    tableRowClass: TableRowClass,
    tableScrollClass: TableScrollClass,
    tableHeaderClass: TableHeaderClass,
    tableResizerClass: TableResizerClass,
    tableHidden: TableHiddenAttribute,
    hostMode: HostModeAttribute,
    windowOffset: WindowOffsetAttribute,
    windowTotal: WindowTotalAttribute,
    windowSize: WindowSizeAttribute,
    windowMoreAfter: WindowMoreAfterAttribute,
    windowAggregates: WindowAggregatesAttribute,
    itemsQuery: ItemsQueryAttribute,
    valueKind: ValueKindAttribute,
    itemsQueryKind: ItemsQueryValueKind,
    menuItemClass: MenuItemClass,
    menuItemKind: MenuItemKindAttribute,
    menuItemCheckedClass: MenuItemCheckedClass,
    menuItemValueClass: MenuItemValueClass,
    menuOpeningEvent: ContextMenuOpeningEventName,
    collapsed: CollapsedAttribute,
    collapseToggle: CollapseToggleAttribute,
    checkboxClass: CheckboxClass,
    checkboxInputClass: CheckboxInputClass,
    checkboxBoxClass: CheckboxBoxClass,
    smallInputClass: SmallInputClass,
    pictureSelectionClass: ImageInputSelectionClass,
    pictureTextClass: ImageInputTextClass,
    textInputActionClass: TextInputActionClass,
    badgeClass: BadgeClass,
    badgeTitleClass: BadgeTitleClass,
    badgeTitle: BadgeTitleAttribute,
    badgeDangerClass: BadgeDangerClass,
    badgeWarningClass: BadgeWarningClass,
    badgeSurfaceClass: BadgeSurfaceClass,
    itemsVersion: ItemsVersionAttribute
} as const;

/** A value as the inside of a quoted attribute selector: a quote, a backslash and a control character escaped. */
export function cssAttributeValue(value: string | number): string {
    return String(value)
        .replace(/[\\"]/g, "\\$&")
        // A raw newline ends a CSS string and the selector throws; a control character goes as its hex escape, space-terminated.
        // oxlint-disable-next-line no-control-regex -- the control characters are what it escapes
        .replace(/[\u0000-\u001f\u007f]/g, character => `\\${character.charCodeAt(0).toString(16)} `);
}

/** `IsURLValid` to `is-url-valid`; must stay in step with `WebNaming.ToKebabCase` on the C# side. */
export function toKebabCase(value: string): string {
    return value
        // Unicode classes, as char.IsLower/IsUpper/IsLetterOrDigit are: an ASCII-only rule split `isÉtat` apart from the server.
        .replace(/(\p{Ll})(\p{Lu})/gu, "$1-$2")
        .replace(/([\p{L}\p{Nd}])(\p{Lu}\p{Ll})/gu, "$1-$2")
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

/** Writes the attribute only when it changes, so its observers are not woken for nothing; null takes it off. */
export function writeAttribute(element: Element, name: string, value: string | null): void {
    if (value === null)
        element.removeAttribute(name);
    else if (element.getAttribute(name) !== value)
        element.setAttribute(name, value);
}
