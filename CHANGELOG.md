# Changelog

The framework's changelog — the `core` slice. One section per release, headed `## X.Y.Z`; the tag that carries
it is `core/vX.Y.Z`. Every package in the slice carries the same version and goes out together, so a section
describes the release, not a list of packages that moved. Other slices keep their own, beside their sources:
`addons/Icons/CHANGELOG.md`, `addons/CodeInput/CHANGELOG.md`, `addons/DataGrid/CHANGELOG.md`, `addons/Charts/CHANGELOG.md` and
`addons/Graph/CHANGELOG.md`.

The release workflow cuts the matching section out to become the body of the GitHub release — a tag with no
section fails the release before anything is published.

## 1.3.0

- **Read-only is one mark on the root and stays focusable.** Every input's root wears `ui-readonly` (`WebClassNames.ReadOnly`,
  the twin of `ui-disabled`) while it is read-only. A read-only select, checkbox, switch, radio group, slider and time input stay
  in the tab order and readable: the select's trigger, the box, the range and the radio group say `aria-readonly="true"` instead
  of being `disabled`, the time segments stay focusable, and the change is refused on the client (`refusal-engine.ts`); a
  read-only colour or image input's action buttons, the file input's pick and a date or date-time field's calendar toggle say
  `aria-disabled="true"`, so the picker keeps the focus it holds. **Breaking** for a stylesheet keyed on `:disabled` of the pick
  or the toggle, which no longer matches. **Breaking:** the marks `data-ui-color-readonly`,
  `data-ui-image-readonly`, `data-ui-temporal-readonly` and `data-ui-radio-disabled` are gone (with `WebAttributes.ColorReadonly`,
  `ImageReadonly`, `TemporalReadonly`, `RadioDisabled`) — read `.ui-readonly`; `NativeInputRendererBase.RenderIsReadOnly` takes
  the root, `RenderIsReadOnlyAsDisabled` is removed and `RenderIsReadOnlyAsAria`, `RenderIsReadOnlyMark` and
  `ReadOnlyMarkOperation` join it. `WebClassNames.Disabled`, `Loading` and `ReadOnly` name the three state classes.
- **A read-only control looks like one.** A read-only field no longer lifts its edge under the pointer (every field, through
  `@ui-field-live`); a read-only checkbox, switch or slider thumb shows no hand and no halo (the colour slider's halo included,
  and a read-only slider refuses a touch too — on the range itself, so no touch scroll elsewhere waits for it); a read-only
  search shows no hand beside its text; a field's part that does
  nothing now — a read-only field's calendar toggle and file pick, the colour toggle — is drawn faded and answers no hover
  (`@ui-field-idle-part-opacity`).
- **What is disabled or loading answers nothing, through one predicate** (`isInert`, `isItemDisabled`): a menu entry's shortcut
  no longer fires inside a disabled or loading menu; Enter on a key-value row no longer presses a loading Save, nor Enter in a
  field a submit button inside a disabled container; the arrows of a tabs view skip a disabled tab, whose caption is dimmed and
  which the "…" list shows as a disabled entry; a disabled row of an items view, table or tree takes no hover wash and no hand,
  a disabled tree node is not dragged, a disabled folder takes no drop and does not spring open, and Delete never removes a
  disabled row.
- **A disabled component says so on its root, and what is inside it is inert.** `Enabled = false` writes `ui-disabled` and
  `aria-disabled="true"` on the root, `Loading = true` writes `ui-loading` and `aria-busy="true"`; the client makes the root's
  children inert and refuses a press, a double click, a middle click, a drag start and Enter/Space on the root itself in one place
  (`refusal-engine.ts`, ahead of every engine), and the event pipeline raises nothing from inside a disabled or loading component.
  The root stays hit-testable and focusable, so **a disabled control shows its tooltip** — the natural place to say why it is off
  — a screen reader finds it as disabled, and a disabled button takes the keyboard's focus while Enter and Space do nothing. A
  disabled or loading root shows the `default` or `progress` cursor whatever the component's own. **Breaking:** the root is no
  longer `inert`; `.ui-disabled-state()` (plugin surface) no longer sets `pointer-events: none`, so a package's own hover rule on a
  component root spells a live guard (`@ui-button-live`). A read-only slider takes the focus from a click; its value still does
  not move.
- **Plugin contract 2. Breaking:** `ContractVersion` is 2, so a package built against contract 1 refuses to register against
  this framework and the other way round. New on `PluginEngineContext`: `states` (`isInert`, `isReadOnly` — the framework's own
  predicates), `wheel` (`notch`, and `pixels(event, pagePixels?)`: a wheel event's turn in pixels on both axes), `names` (the
  attribute, class and selector names the framework writes that a package reads, literal-typed so a rename fails a package's
  build rather than leaving a copy), and `tooltips.show(target, words, { delay: true })`, which waits as a hover does. New in the
  plugin Less: `.ui-popup-look()` (a floating panel's look without its placement; `.ui-popup-surface()` is it plus `position:
  fixed`), `@ui-font-mono`, `.ui-field-edge-hover()`/`.ui-field-edge-active()`/`.ui-field-states()` (a field's edges, which
  `ui-input.less` draws through too), `.ui-dialog-enter()`/`.ui-dialog-backdrop-enter()` (with no reduced-motion guard of their
  own: the core's stylesheet stops them on every page), `.ui-entry-hover(@current)`, `.ui-entry-keyboard(@current)` and
  `@ui-keyboard-focus` (a list's keyboard entry), `.ui-popup-closed()`/`.ui-popup-open(@display)` (a popup that fades out;
  `.ui-popup-surface()` now fades every popup in, so a package's gains the entrance with no change), `.ui-row-ground()`,
  `.ui-tile-wash()` and `@ui-row-cursor-focus`, `@ui-field-focus`, `@ui-motion-ripple` and `@ui-root-transition`, and
  `.ui-reveal-hover(@transition: true)`; `.ui-row-hover()` now brightens a ghost button's ink in the row and gives its press
  `--ui-wash-active`. `names` carries `selectedKeys`, `unselectable` and `eventBoundary` too, and `selectedKey`,
  `listTriggerSelector` (a select's, a multi-select's and a search's list trigger), `buttonClass`, `selectClass`,
  `textInputClass`, `invalidClass` and `sourceLine`; `rows.isKeyTarget(target)` says whether a key is the row keyboard's;
  `popups.open` takes an `owner` (below), `PopupDismissReason` adds `"focus"` and `"owner"`; `renames.open` takes `refocus`,
  where the focus goes back after Enter or Escape — **`done` no longer is**: a package's `done` that focuses moves the focus to
  `refocus`, or it takes the focus from a click elsewhere; `strings.format` takes an author's text as `{ text }`. New in the
  plugin Less: `.ui-entry-quiet(@entry; @live; @current)`, `.ui-row-cursor-layer()`, `.ui-dialog-exit()`/
  `.ui-dialog-backdrop-exit()`, `.ui-arc-share(@share)` and `@ui-field-idle-part-opacity`; `@ui-keyboard-focus`,
  `@ui-field-focus` and `@ui-row-cursor-focus` live in `mixins/focus.less`, and `@ui-button-live` leaves out the owner of a
  popup the pointer is in (a split button's list), so the owner no longer washes and presses with its entries. Also new, the
  contract still unreleased: `states.setDisabled(element, disabled)` (a package's control turned off the framework's way — the
  disabled mark and `aria-disabled`, still focusable), `values.write(element, value)` (a value written into a bound element as
  its binding writes a push — a variant `rows.renderVariant` drew), `validation.mark(field, severity, words?)` (a package's own
  field marked invalid, warned or noted through the validation engine — the classes, `aria-invalid`, the message line or mark,
  weighed with the field's other messages), and in `names` `focusHolder`, `popupSelector`, the table's parts
  (`tableRowClass`, `tableScrollClass`, `tableHeaderClass`, `tableResizerClass`, `tableHidden`), `hostMode`, the window's
  attributes (`windowOffset`, `windowTotal`, `windowSize`, `windowMoreAfter`, `windowAggregates`), `itemsQuery` with
  `valueKind`/`itemsQueryKind`, and the menu's check entry (`menuItemClass`, `menuItemKind`, `menuItemCheckedClass`). In the
  plugin Less: `@ui-adornment-live`, `@ui-ring-focus`, `@ui-list-current`, `@ui-table-ground`, `@ui-drag-ghost-opacity`,
  `@ui-loading-label-opacity`, `.ui-popup-fade()`, `.ui-dialog-veil()`, `.ui-inline-link()`, `.ui-text-description-line()`
  and `.ui-drag-bar-line()`. Then `popups.focusReturn(opener)` — where the focus goes back as a package's surface closes or goes:
  the opener, the nearest focusable around it, else its component root made focusable for that one return, never the body —
  `.ui-selected-tile()` (a chosen wrapped tile, over its own picture) and an optional `@property` on `.ui-selected-ground()`.
  `.ui-popup-fade()` is the transition alone: the fade in's `@starting-style` is `.ui-popup-open()`'s, once per popup, at the open
  rule's weight.
- **A disabled link opens from nowhere.** A Link, a menu entry or a breadcrumb has no `href` while disabled or loading, so the
  browser's own menu cannot open it either; the address is kept on `data-ui-href` (`WebAttributes.Href`) and comes back with the
  state (`WebComponentRendererBase.RenderLinkAddress`).
- **A hover tooltip still waiting to open is called off** when the pointer leaves its control first.
- **A file dropped where nothing takes it is refused.** A read-only or disabled file or image input refuses a drop in place, and
  a file let go anywhere no drop host takes it is refused on the window rather than opened by the browser in place of the page.
  An image input whose picture is still uploading wears `ui-loading` and refuses a second drop as it refuses a press; the file
  input still lets a later pick supersede the one in flight.
- **Nothing shows a keyboard mark after a pointer action.** The keyboard's row in an items view, a table and a tree is drawn
  only once a key is used — a click moves the cursor and leaves no wash; the entry the arrows reached in a menu (sidebar or
  popup), the "…" list, a split button's list, a context menu and the calendar is lit while the keyboard is on it; and one rule
  (`popup-focus.ts`) marks every focus that arrives while the pointer was the last input — a button the press focused, an option
  chosen, a list's entry following the pointer, a core engine's or a package's `.focus()` after a press —
  `data-ui-pointer-focus`. A marked focus lights no focus ring, no field edge and no Ghost wash, and opens no tooltip on its
  own; the first key other than a modifier held alone lights them. **An editable text entry is the exception** — a caret field
  that is not read-only or disabled, an editable region, a time segment that is not read-only: its edge says where typing
  goes, whatever put the focus there, as a browser's own `:focus-visible` does. So a press anywhere on a field
  (its padding, caption, label, affix) lights it, a text entry a script focuses after a press (a grid's cell editor, a date
  field its closed picker hands the focus back to) shows its edge at once, a text clear leaves the caret with its edge, and a
  read-only field clicked stays unlit. An invalid or warning field keeps its edge through any focus, a Ghost one included.
- **A list has one current entry, and the pointer moves it**, as in a native list: a select's option under the pointer becomes
  the current one, and so do a popup menu's entry, the "…" list's, the calendar's day and the language switcher's list, so a
  hover never lights a second entry; while a key has put the keyboard on an entry, the one a resting pointer is on stays quiet.
  The calendar's day and the dial's cell follow the pointer only as it moves, so the arrows move the day while the pointer
  rests on the grid, and the dial keeps one lit cell; an entry the keyboard and the pointer share keeps the keyboard's wash and
  takes the pointer's colour off, so it neither blinks nor shows the theme's ring as the pointer crosses it. **A menu or list
  opened by the pointer has no current entry**: its container holds the keyboard, and the first ArrowDown lands on the first
  entry, the first ArrowUp on the last (the context menu, a split button's list, a Select, MultiSelect or Search with no value);
  opened by a key it starts on its first entry — ArrowUp on a split button's closed opener, on its last — and every opening
  starts afresh. A list that opens on a value starts from it, as before. A folded rail's group flyout opened from the keyboard
  gives its first entry the focus.
  A full multi-select's refused options are passed over by the arrows and the pointer alike, as a disabled option is. A press on an option, a calendar or a dial cell washes stronger than the hover, and the dial's chosen reading no
  longer brightens under the pointer; a multi-select's chosen option keeps no ground once the pointer that marked it has left.
- **A popup closes when its owner can no longer use it.** A select's list, a picker, a flyout, a menu's or a split button's
  list, the "…" list and a context menu close when their owner leaves the page, turns disabled or loading, or — an input's —
  read-only; a select's list left open no longer takes a choice after a read-only push. Every one also closes when the keyboard
  takes the focus out of it or its owner (Tab out of the calendar, the colour picker, a split button's list, a context menu), and
  a right press outside a popup that waits for the click closes it at once, so no context menu opens beside a list still open
  — and so does a long press, a macOS Ctrl+click or the Menu key. A popup closed for its owner hands the keyboard it held to the
  owner's root, not the page. **A popup under a modal dialog is left alone**: a flyout whose button opened a dialog is not
  dismissed by a press in the dialog nor closed by the focus going into it, and is back as the dialog closes; the dialog's
  focus goes back to its opener, found again by its component where the page redrew it, else to its component's root — never
  the page. Behind a modal is judged by the popup's owner, so the tab strip's "…" list inside a modal dialog closes on Escape and
  a press (Escape closed the dialog instead). The context menu gives the focus back to what held it before the right press,
  else to its owner — its nearest focusable, else its component root made focusable for that return — and a closing press on
  nothing focusable leaves it there. A dialog or popup closed with the focus elsewhere no longer leaves a component root
  focusable.
  **A package's popup is owned too:** `popups.open(anchor, popup, { owner, onDismiss })` closes the same ways — on the owner's
  state (the anchor when no owner is named) and when the keyboard leaves — and `onDismiss` hears why; an owner that cannot keep
  a popup gets none, told `"owner"`. **Breaking (behaviour)** for a package that kept a popup open while the focus left it.
- **What arrives animated leaves animated.** Every popup fades in and out (opacity, `@ui-motion-fast`), the context menu, the
  tooltip and a menu's flyout included; the dialog fades out; the side drawer's backdrop fades both ways and the drawer
  slides at the sheet's tempo; a leaving toast closes its gap; and a `HideEffect` fades as Show does on every component, the
  button family, links, clickable surfaces and button groups included. A menu section unfolds and folds as the expander
  does, once a hand has unfolded one, and an expander's header answers the pointer with its chevron's ink. A tree's unfolded
  rows fade in, and a toast's close fades and presses with the family's wash, with no shrink. Entrances take the enter curve
  and exits the exit curve. A menu's inline group folds (a flex item's automatic minimum held its height, so it snapped), on one
  curve both ways with its chevron at the fold's tempo, its 2 px of air over the first entry folding with it, and an
  accordion's closing section no longer snaps its last 12 px. A
  popup menu replaced by another — a folded rail's flyout, a context menu — goes at once rather than fading under the new one. A period's tints on the calendar are layers under the pointer's wash and a press, and while its end
  is being chosen only the preview tints, not the span to the end kept from before.
- **Reduced motion stops every animation too**, on every element, a package's included: the dialog, the toast and the ripple
  lose their own guards, a scripted smooth scroll honours it, and the loading ring keeps turning.
- **Forced colours are answered more widely.** The focus ring is 2px there, the keyboard's only; the select's keyboard option,
  the keyboard's entry in a menu, the "…" list and the calendar, the calendar's chosen day, period and today, the time dial's
  band, a focused time segment, the tree's drop target, the splitter and column resize lines, the slider's track and fill, a
  folded menu section holding the current page, a tinted picture icon, the loading ring and the colour input's colours and
  pane tab are drawn in the system's colours.
- **The rows' keyboard is the host's and its rows'.** Keys pressed in a host's own chrome — a grid's search box, sortable
  captions, pager, band buttons, flyouts — are no longer taken by the rows; a wrapped items view moves with all four arrows,
  Up and Down to the nearest tile on the next line (before, none moved it: a wrap's rows had no box to measure); a chosen row
  under the keyboard's cursor keeps its chosen ground, with the cursor's wash laid over it as a layer — a table's pinned cell
  too — so the cursor shows among many chosen rows, and fades as it comes and goes. A chosen row with pinned columns draws its
  mark and its forced-colours outline once, above them (no bar per pinned cell, no doubled line under the last row, kept in a
  table without separators); a nested table's pinned cells no longer wear an outer row's cursor wash; a table's chosen row keeps
  its ground under the pointer in a `RowHover` table. A held modifier alone no longer lights the row cursor. **Breaking
  (behaviour):** under `data-ui-no-row-select` (a data grid with `SelectionMode.Many`) Enter only opens the row and no longer
  replaces the chosen rows, and Shift with an arrow adds its range to them, from the row last clicked or ticked; such rows no
  longer show the pointer's hand.
- **A row's wash fades, and one wash shows at a time.** A row's hover and keyboard wash fade in and out in the items view,
  the table and the tree; on a wrapped items view the wash lies over the tile's own ground and picture, and `RowHoverable`
  washes its tiles (it painted nothing). A ghost button in a hovered row brightens under the pointer and shows the pressed
  wash when pressed; a clickable surface no longer washes and lifts while the pointer is on a control inside it; the ghost,
  outline and link buttons' border, ink and filter fade with their ground again, and a link's underline fades in.
- **A table's rules reach its own rows only.** A table nested in another table's row (a data grid's detail) no longer takes
  the outer table's column tracks, order, hidden columns, pinned offsets, stripes, separators, hover or reorder cursor.
- **A select-all takes only rows that can be chosen.** The plugin surface's `selection.setSelected`/`setSelectedKeys` pass
  over disabled rows and rows whose item has `CanSelect = false`. `ItemAbilitiesRenderer.RenderItemAbilities(IHtmlElementBuilder
  row, IItemAbilitiesModel abilities)` joins the template's overload, and the items host writes an item's refusals through it.
- **A TabsView caption is pressed anywhere on it** but its close, and washes stronger under the press; a folded menu section
  holding the current page answers hover and press.
- **A text field's clear is the pointer's shortcut**: out of the tab order, and hidden while the field is empty; a press on it
  keeps the caret in the field (a text input's and a search's), and a select's clear keeps the focus on the field. A search's
  list closed from an option gives the focus back to its field, not to the row that takes none. **A disabled or loading link
  stays focusable**, taking `tabindex="0"` while it has no `href`.
- **A search shows the server's answer as it came.** A search with `OnSearch` no longer narrows its list on the client — the
  list stands until the answer and shows exactly what the server returned (`WebAttributes.SearchAnswered`,
  `data-ui-search-answered`, on its field); a search over its own options narrows by the menu search's rule — every typed
  word, in any order, case and accents aside, in an option's name — and hides a group's header with its last option, in the
  same frame.
- **Commands reach the server in the order they were raised.** A command raised after an `.OnChange`-kind one (a selection
  change among them), which waits for its value's answer, no longer overtakes it: a grid's double click sent the row's open
  ahead of the choice its first click made. A command raised right after one of those now waits that value's round trip.
- **A table of static items inside a row's template** (a grid's detail) no longer warns, as the template is built, that an
  item scope is not on the stack: the rows the server drew keep what it wrote.
- **Enter or Escape in a field hands the keyboard to what holds it, where something does.** The field still leaves,
  committing, and the focus goes to the holder around it — a dialog's surface, a flyout's panel, a host of rows whose own row
  holds the field, or a layer a package marks `data-ui-focus-holder` (`WebAttributes.FocusHolder`, `names.focusHolder`); with
  none the field just blurs and Tab goes on from its place, so a code field and a side drawer's search are no traps. A host's
  chrome (a grid's band search) is no holder. Escape in a flyout's field closes the flyout first, returning the focus to its
  anchor. A rename committed by a click elsewhere leaves the focus where the click put it; Enter and Escape give it back. The
  side drawer opened from the keyboard gives its first control the focus; opened by a press it takes the focus itself, as a
  holder (no field focused, no on-screen keyboard), and gives it back when it closes. The colour pane is a holder too: Enter
  in its Hex, R, G or B field keeps the keyboard in the pane. A field's Enter takes its open list with it — a date field's
  calendar, a search's list — in a flyout, a dialog or a drawer too.
- **A field holding an edit still takes a read-only.** While a field's value is on its way or held for its form, a push of that
  value waits as before, but its other properties — a read-only, a placeholder — land; a field used to stay editable under a
  read-only it was given mid-edit. `states.isReadOnly(element)` (plugin surface) reads the nearest component root's mark, so a
  component inside a read-only host is read-only only by its own `IsReadOnly`.
- **A colour input's offers are refusals on the root. Breaking:** `data-ui-color-picker`, `data-ui-color-palette` and
  `data-ui-color-opacity-shown` (present = offered) became `data-ui-color-no-picker`, `-no-palette` and `-no-opacity` (present =
  taken away), and `WebAttributes.ColorPicker`/`ColorPalette` became `ColorNoPicker`/`ColorNoPalette`; a stylesheet or script
  reading the old marks inverts. The first paint said "offered unless false" while a live patch to null took the part away;
  both now agree that null, the default, offers it. `RenderFlagAttribute`'s live patch lands on the element it marks, as its
  first paint does — it went to the root, which every caller in the repository passes; **breaking** only for a caller passing
  a part and relying on the patch reaching the root.
- **A dragged bar's line is one mixin. Breaking (styling):** `--ui-grid-splitter-line`, `--ui-grid-splitter-offset` and
  `--ui-table-resizer-line` are replaced by `--ui-drag-bar-line`/`--ui-drag-bar-offset` (`.ui-drag-bar-line()`), and the column
  resizer's line has the splitter's rounded ends. `--ui-row-wash` is a registered `<color>`: a package setting it to anything
  else gets `transparent`.
- **A translatable value travels as its key, and the page translates it. Breaking:** a plain string on a `[Translatable]`
  property, or a `UIPhrase` on any property, is sent on every push as it is, and the page translates it by its words table — a
  value a command sets is now shown in the page's language, and a value equal to a key is translated on push as it was at render
  (mark it `AsContent`, or configure `KeyPrefixes`). A package's value-change handler hears the value as shown; the page's state
  keeps the key. The first paint is still the server's. **Breaking:** every page carries a hydration block (`words`, `title`), a
  page without a controller too; the render metadata gains `translatable`, `content` and `words`, and a recorded static word's
  element carries `data-ui-into-<property>`. The page's first change set, the hydration's too, waits for its table.
- **The page's words table.** `GET /_ne/words/{language}.json?v=…` — the translator's own listing and the framework's words for
  one listed language, cached for good under its version, `no-cache` with an ETag without it, compressed once, `404` for a
  language the translator does not list; `data-ui-strings` stays as the boot subset. A key the table lacks is asked about (hub
  `TranslateAsync`, ≤ 256 keys of ≤ 512 characters, once per language) where the table is incomplete or missing words are
  reported for a prefixed key. `ITranslator.ListWords(language)` → `UIWordTable(Words, Complete, KeyPrefixes)` (default:
  `UIWordTable.Unlisted`); `ITranslationSource.ListWords(language)` (default `null` = cannot list), which
  `DictionaryTranslationSource` answers.
- **A language switch in place. Breaking:** switching rewrites the page where it stands — no navigation; numbers and dates keep
  their culture until the next render, and other tabs of the session keep their language until theirs. `LanguageSwitcherComponent`
  (`Icon`, `IconSize`, `Display` `Code`/`Name` — `UILanguageDisplay`, in `NE.Standard.UI.Primitives.Styling` — `Languages`,
  `Type`, `Size`, the surface, border and tooltip blocks): one language draws nothing, two switch on a press, more open a list;
  each language named in itself (`CultureInfo.NativeName`); every language's words stacked so the button keeps its widest
  language's width; `aria-label` is `UIStrings.LanguageSwitch`, "Switch language, {language}", which names the language shown.
  `Type`, `Size` and `IconSize` of the language and theme switchers come from one block, `ISwitcherComponent` (same names,
  defaults and setters), drawn with `ButtonRendererBase.RenderButtonLook`, every button-shaped control's.
  `SetLanguageEffect(language)` / `ClientEffectKinds.SetLanguage` (may run in an interaction), `SetLanguageEffect.Href` (the
  table's address the web platform names on a switch it pushes, so the page calls no hub); hub `SetLanguageAsync({language})`
  stores the session's language, tells the page's controller as a command does and answers `{language, href}`, refusing a
  language the translator does not list (`ITranslator.HasLanguage`, the one answer the endpoint, the hub and the switcher ask);
  a switch to the language shown does nothing, and a session already in the language is left as stored;
  `UserSessionStoreExtensions.SetLanguageAsync`. `UIControllerBase.OnLanguageChangedAsync(previousLanguage, cancellationToken)`.
  **Breaking:** `UILanguageDisplay` moved to `NE.Standard.UI.Primitives.Styling`, and an application's translation of
  `ui.language.switch` takes the `{language}` slot (one without it still reads, without the language).
- **A command sees the session it changed. Breaking:** `UIContext.UpdateSessionAsync` makes the session it stored the connection's
  session at once (`UIHandle.Session` can change during a command; a resolver's own `IUserSessionContext` type in the handle is
  replaced by the stored `UserSessionState`, which now implements `IUserSessionContext`), and `SignInAsync` goes the same way.
  **Breaking:** a language change made by `UpdateSessionAsync` runs `OnLanguageChangedAsync` inline, before the update returns,
  and pushes a `SetLanguage` effect to that connection. `UserSessionStoreExtensions.SetThemeModeAsync` writes through
  `TryUpdateAsync` — it read and saved, which could write back a session signed out or changed meanwhile.
  `IUserSessionStore.TryUpdateAsync`'s contract says an update answering the very session it was given writes nothing.
- **Words with arguments and plurals.** `UIPhrase` (`NE.Standard.UI.Primitives.Localization`, a global using of the Primitives
  package): a key with arguments, always translated on any property; `{"key":…,"args":{…}}` on the wire; an argument a string,
  number, bool, null or a nested phrase. `UIWords.Format(template, arguments, translateNested)` and `UIWords.Positional`: `{name}`
  slots (`[A-Za-z0-9_]+`, so `{0}` is positional), an unknown slot kept, no escape, numbers as their shortest invariant text.
  **Breaking:** no `string` converts to a `UIPhrase` — a key alone is `new UIPhrase(key)` or `UIPhrase.Of(key)`, an author's
  text `UIPhrase.Text(text)`; a string passed through a helper typed `UIPhrase` became a key silently, and now does not
  compile. `UIPhrase.FromString` stays.
  `UIPhrase.Text(text)` / `UIPhrase.IsText`: an author's text as an argument (or a value), looked up by the plain rule — under
  `KeyPrefixes` only a prefixed one — on both sides, `{"text":…}` on the wire, `strings.format(key, { label: { text } })` on the
  client; the multi-select chip's "Remove {label}" and the data grid's sort names pass their caption so, and are no longer
  reported missing under prefixes. `UIPluralRules.Select(language, number)` → `UIPluralCategory` (CLDR 48 for en, de, es, fr,
  ru, uk, pl, zh; any other language `Other`), `UIPluralRules.Forms` (the six form names in category order); a numeric `count`
  picks `key.{category}` → `key.other` → key; `ITranslator.TryTranslate(language, key, out words)` probes a key without
  reporting it missing. `ITranslator.Translate(language, key, arguments)` (a
  default member doing both), `UIContext.Translate(key, arguments)`, `Translate(key, params object?[])`, `Translate(UIPhrase)`,
  `WebRenderContext.Translate(key, arguments)`/`Translate(UIPhrase)`. `IUIView.TitleArguments` (virtual on `UIViewBase`) →
  `CompiledView.TitleArguments`: a title with arguments, re-titled in place by a switch. The multi-select chip's remove, the data
  grid's sort names and the code input's position are filled through them instead of a hand-spliced `Replace`.
- **Content and namespaced keys.** `VisualComponentBase.AsContent(params UIProperty[])` and `IBindableComponent.IsContent(UIProperty)`:
  an instance's translatable property shown as written, bound or static (`CompiledUIBinding.IsTranslatable`;
  `CompiledUIPropertyValue.IsTranslatable` false for content too); a static `AsContent` property tells the client as well
  (`WebRenderPropertyMetadata.Content`, `WebRenderMetadata.RegisterRenderedProperty(address, id, content)`, an exposed property's
  `"content": true`), so a package's `properties.set` there is content. `IContentItem.IsContent` (on `BadgeItem`, so on every
  built-in item; `"isContent": true` on the wire, only when set): every word read off the item is shown as written, never
  recorded for a switch or reported missing — a select's options, a menu's entries. `UILocalizationOptions.KeyPrefixes`: a plain
  string is a key only with one of them (`ui.` always one; empty = every string, as before) — `ITranslator.Translate(language,
  key)` returns a non-prefixed plain string as it is, and a blank key as itself. A row's value pushed later is content too:
  `ServerValueUIUpdate.Content` (`content`, only when true) on an item-scoped update read off a content item — the innermost
  row's item on the value's path, not an ordinary item nested under a content one — and
  `ServerValidationUIUpdate.Content` on a refusal the input marked content — `MinMaxInputComponentBase.FormatMessage` is
  `[Translatable]`, so `AsContent` on it no longer throws and keeps the refusal as written. The render reads whether a property
  is content off `CompiledUIPropertyValue.IsContent` rather than the property register, whose lookup takes a process-wide lock.
- **Chrome words switch in place.** `WebWords.Write(context, element, attribute, key, arguments?)` / `WebWords.WriteText(...)` (and
  `ITranslator` + language overloads) write a chrome word marked with its key (`data-ui-words`, `WebAttributes.Words`), and a switch
  writes it again: the split button's "More", the theme and language switchers, the colour input's words, the file and image
  inputs', the select's clear and placeholder, the multi-select chip's remove, the text input's clear, the table's captions and
  resizer, the tree toggle, the splitter, the breadcrumbs, a tab's close, the collapsible toggle, the temporal inputs' picker and
  period ends, the strip's "More tabs", the side drawer's toggle, a dialog's label. Plugin surface (contract 2):
  `strings.write(element, attribute, key, args?)`, `strings.resolveText(text)` (an author's text as a plain value is looked up),
  `strings.onChange(handler)`; `strings.format` picks a plural form by a numeric `count`. `WebAttributes.LanguageSwitcher`,
  `WebAttributes.Language`; render metadata `WebRenderPropertyDefinitionMetadata.Translatable`, `WebRenderBindingMetadata.Content`,
  `WebRenderMetadata.Words`/`AddWord`, `RegisterProperty(owner, property, translatable, operations)`, `Bind(context, binding,
  propertyId, content)`. A renderer writes a translatable property's words with its key through
  `WebComponentRendererBase.ResolveRenderWord(context, property, out key, out words)` and `WriteRenderWord(context, element,
  attribute, property)`; `ReadRenderValue`/`ResolveRenderValue` answer the words already translated, never to be marked. The
  palette's colour names are words, `ui.color.name.<name>` (`UIStrings.ColorNameKey`, English "Iron fog", "Quantum blue"), on a
  chip's tooltip and `aria-label`, the identifier staying on `data-ui-color-name`. An icon-only button's name from its tooltip
  is the tooltip's plain text, never its Markdown source (`WebDomConverters.InlineMarkupPlainText`), follows a pushed tooltip
  and a switch, and a bound title that arrives takes it off — a button with a bound title is named by its tooltip again once the
  title is pushed empty and the tooltip next pushed or the language switched (`TextContentRendererBase.TooltipNamedAttribute`,
  `TooltipNameOperation`, `WebTextBodyOptions.TooltipNamesHost`, a protected `WebComponentRendererBase.RenderTooltip(context,
  target, nameOperation)`); **binary-breaking** only: the protected `TextContentRendererBase.RenderTitle` gains an optional
  `tooltipNamesHost`. An operation's selector target may name the component's root itself.
- **The framework's words, listed and checked.** `UIStrings.List(packages)` (the one English floor, duplicate keys refused),
  `UIStrings.Discover(params Assembly[])` (every public `IUIStringsSource` of the assemblies, no DI),
  `UIStrings.Missing(source, language, packages)` (the framework and package keys a source lacks), `UIStrings.LanguageSwitch`,
  and `UIStrings.ItemsEmpty` — **breaking:** an items view's empty text is the key `ui.items.empty`
  (`DefaultEmptyTemplate.DefaultText`, English "Nothing to show." from the floor), so it translates and switches.
- **Missing translations reported.** `UILocalizationOptions.ReportMissingWords` (`bool?`; `null` — the default — reports in
  Development and not in Production on the web platform), `IUIMissingWords` (`Snapshot()`, `Clear()`) with `UIMissingWord(Language,
  Key)`, resolvable from DI and as `UIApplication.MissingWords`; `UIApplication.Localization`. Each miss is logged once at Warning,
  at most 4096, then one line saying recording stopped; exact only under `KeyPrefixes`. The hub's `TranslateAsync` no longer
  records a missing word for every plural form a source that cannot list lacks, and a listed table no longer reports a form its
  language never picks (`files.one` in zh) beside a `.other` or plain sibling — but does report one its language picks and no
  table holds (ru's `files.few` and `files.many` beside English's `.one`/`.other`), so an application with such gaps sees new
  warnings in Development. `UIPluralRules.HasForm(language, category)` is public: whether `Select` ever answers a form.
- **A collection held for rows built later.** A host declared inside an item template (a select's options in every row), sent
  while no row wears the template, is held and drawn into every row built later — the collection as the server last sent it, not
  the one the template was rendered with — and no longer logs "items host was not found".
- **Validation messages are translatable. Breaking:** `UIValidationMessage.Message`, `UIValidationRule.Message`,
  `CompiledUIValidationRule.Message` and `WebRenderValidationMetadata.Message` are a `UIPhrase` (were `string`). A string still
  compiles — `UIValidationMessage.Error("text")`, `Required("text")`, `new UIValidationRule(…, "text")` — and becomes
  `UIPhrase.Text("text")`, the author's text or a key by the plain rule; code that read `Message` as a string reads
  `Message.Key` (with `IsText` and `Arguments`). New: `Error`/`Warning`/`Info(UIPhrase)`, a `(severity, UIPhrase)`
  constructor, and `Required(UIPhrase)`, `Regex(pattern, UIPhrase)`, `Validate(trigger, op, value, UIPhrase)` beside the string
  ones — `.Regex("^.{0,12}$", UIPhrase.Of("form.name-max", ("max", 12)))`. On the wire a message is `{"text":…}` or
  `{"key":…,"args":…}`; the client still reads a bare string as an author's text. A rule's message, a bound `Validation` and the
  runtime's refusal (the input's `FormatMessage`, else the new framework word `ui.value.format`, `UIStrings.ValueFormat`) are
  shown in the page's language and written again on a switch, the lines another component holds included.
- **An icon is a name, not a word. Breaking:** `[Translatable]` is off `IconComponent.Icon`, `ITextBaseModel.Icon`/
  `TextBaseItem.Icon`, `BadgeComponent.Icon` and `IBadgeModel.BadgeIcon`/`BadgeItem.BadgeIcon`: an icon is never looked up and
  never reported missing. An icon that differs per language is a binding.
- **Only a tinted picture paints. Breaking:** `.ui-icon::before` paints nothing by default; a tinted picture (`mask:`) wears
  `ui-icon--mask` (`WebIconValue.MaskClassName`), the one form that paints the box in `currentColor`, while a glyph is text and
  an untinted picture (`ui-icon--image`) is painted as it is. So an icon whose glyph has no rule — a name nothing registered, a
  misspelt `ne-` mark, a name from data — draws nothing rather than a filled square in the text colour. `--ui-icon-paint` left
  the pack contract, which is three properties (`--ui-icon-font`, `--ui-icon-glyph`, `--ui-icon-fill`): a third-party pack that
  drew by writing `--ui-icon-url` per glyph class writes its rule with `background-color: currentColor` and the mask itself,
  and a stylesheet that found a tinted picture by `:not(.ui-icon--image)` keys on `.ui-icon--mask`. `WebIconValue.ClassName(value)`
  ↔ `toIconClassName` give the class a value wears, corpus-pinned.
- **An icon value that draws nothing marks nothing.** A value with no letter or digit (`"★"` from data) gets no `data-ui-icon`
  and no mark that says an icon is there — an icon-only button's layout, a field's adornment room, a badge's icon — on the first
  paint (`IconValueRenderer.Draws`) or on a push (`WebValueCondition.DrawsIcon`); `icons.apply` writes nothing for it instead
  of throwing; a mask icon with no address paints nothing. `WebIconValue.Names(value)` says whether a value names a glyph or a
  picture without building its class (`IconValueRenderer.Draws` answers by it), and `WebIconValue.ClassName` trims the value
  as the client does. A glyph is silent to a screen reader (`content: … / ""`): a titled button is named "Save changes", not
  "save Save changes", and the theme switcher is not read "light_mode dark_mode".
- **Fonts are preloaded.** The shell's head preloads every font asset (`<link rel="preload" as="font" type="font/woff2"
  crossorigin>`) before the stylesheets — the NE Glyphs face, an icon pack's font, and Inter when an entry of the theme's
  `FontFamily` list is `Inter` (not a substring: "Interstate" is another face) — so an icon is no longer a blank box for an
  extra round trip on a cold load.
- **The page names its icon.** The shell always writes `<link rel="icon">`: `WebEndpointOptions.Icon` when the application
  sets one (an absolute path under its static files, or a `data:` URL), else `data:,`, so a browser asks for no `/favicon.ico`
  an application never serves.
- **What a language switch misses, fixed.** Every option of a select inside an item template (a data grid's cell editor)
  showed the first option's caption after a switch — a word read off an item is now recorded with the rows' keys the render has
  (`ResolveItemKeys`) and matched from the innermost; a part a package inserted (a grid's open detail) and a package's copy of a
  component (Graph's parameters panel) are written again too; and a property written over a place the chrome had marked (a
  code field's line-ending placeholder over "Select…") keeps its value at a switch. The page's boot words and the words table
  share one cache per language.
- `UINaming.Humanize` keeps an acronym whole and splits it from the next word ("UI calculator operation", "Parse HTML", "IDs
  count"), and reads "Is"/"As" after an acronym as a word ("UI is ready", "PDF as image"), so a caption derived from a name with
  an acronym changes.
- **The tab strip's "…" list** lists a tab the fit hid and stays open, and Tab from it goes on from the "…".
- **The language switcher weighs a request against the language asked for**: a second request for the language already on its
  way is none, and one back to the language shown cancels the pending switch, tells the session and fetches nothing; a
  two-language toggle asks for the language not requested, so a second press while the first switch loads goes back, and a
  table still loading for the earlier request is dropped, so the page ends in the language the session holds. Over a
  page in a language it does not offer, the switcher shows that language as a label that is never a choice and checks none of
  its own; a toggle then asks for the first language it lists. The switcher's label gives way with an ellipsis.
- **The image input** answers nothing on its surface while its picture loads, its hover no longer outranks its invalid and
  focus edges, its name follows a pick, a push and a switch, and its squares carry no native `title`. Under forced colours the
  colour input's parts are ringed in the system colour; a card header holding only a picture badge stays; a split button of
  type Link no longer moves its open list.
- `BadgeRenderer.RenderCountBadge(parent, style, count, configure)`: a bare count badge with no component behind it, for a
  count a package's script fills.
- A multi-select option whose title is blank shows its key and no longer fails the render. The web update sink names the
  words' table on a copy of a pushed command result, never on the runtime's own effects.
- The demo carries whole zh-Hans and Russian tables of every word it registers — its own, the framework's and the code
  input's — held by a test, and its shell's words (page tabs, group titles, the Code and Copy tooltips) are `demo.*` keys.
- `ButtonRendererBase.RenderButtonLook(context, root)` writes the Type/Size classes, one registration for every button-shaped
  control.
- `DictionaryTranslationSource.TryTranslate` answers `false` for a blank language or key instead of throwing.
- **A validation mark without words raises no message line** (`.ui-validation-message:empty`), on every field and
  presentation; a line filled later shows.
- `UIStrings.NotFoundPageTitle` (`ui.notfound.page`, "Page not found"): the default not-found page's tab title is that word,
  not the view type's name.
- **Breaking:** `TemporalInputRendererBase.RenderRow` is no longer `protected virtual` — the time input draws its row through
  the base (`HasPicker => false`: a clock's segments and a stepper); a subclass that overrode it answers `HasPicker` instead.
- Smaller fixes: a read-only time field no longer fills a clicked segment; a Link button (a Link language switcher) no longer
  throws its open list off-screen under the pointer — a quiet button brightens its parts, never the root a popup inside is
  placed from; a breadcrumb trail's text separator is set in the trail's font; forced colours mark a chosen colour chip under the
  keyboard; the Multiple image shelf keeps its invalid and focus edges under the pointer; a chosen wrapped tile keeps its
  picture; a quote paragraph standing as a wrapped tile keeps its line, drawn in forced colours too; a folded menu group holding
  the current page keeps its mark under the quiet rule.
- **The caret at the end of a caption-inside field no longer stands on the last character.** Chromium keeps a caret inside the
  field's inner editor, so an end-aligned value put it over its last glyph whatever the padding (the 2 px of padding added
  before is gone). The value is now as wide as its text plus a caret and stands at the trailing edge
  (`.ui-field-value-at-end()`, `mixins/field.less`, on the plugin surface), where the browser has `field-sizing` and
  `calc-size`; elsewhere it stays end-aligned.
- **A press on a field's box reaches its text field.** A press on the box's own empty space — its padding, the gap after a
  caption inside it — focuses the field with the caret at the end (`field-box-press-engine.ts`); a read-only, disabled or
  loading field is left alone, and a stepper, a clear or a picker's toggle keeps its own press.
- **A collapsible that changes both of its sizes slides both.** A panel folded to its switch is a box: its height used to snap on
  the first frame while its width slid, and a scrolling body lost and regained its scrollbar at the fold's ends. The content is
  held at its open box on each axis that moves.
- **A side becomes a drawer on a phone by default. Breaking:** `UIViewOptions.SideDrawers` (and `WebShellContext.SideDrawers`)
  defaults to `true`, so below the medium breakpoint the left and right sides slide over the content, opened by a button the
  header carries (the content, where a page has no header). A view that relied on its sides keeping their columns on a phone
  sets `SideDrawers = false`; an explicit `SideDrawers = true` is now redundant.
- **A page header's title and line run the full width on a phone. Breaking** for code that read the header's children:
  `UIPage.Header` holds the title (a `TextComponent`, Display, one line), the description when given (a `ParagraphComponent`,
  Body, Muted, up to three lines) and the trailing stack, in that order, where it held one paragraph and the trailing stack.
  From the small breakpoint up the title and the trailing controls share the first row, both centred on it; the line takes
  the second — the band's whole width below `md`, the title's columns from `md` up — so the line no longer squeezes into a
  120-pixel column. **Breaking (layout):** below the small breakpoint the title takes the band's whole width and the trailing
  controls fold to a row of their own under the title and its line, still at the far edge, so the title no longer shrinks to a
  few letters and an ellipsis beside two switchers.
- **`UILayout.Columns`, `Split` and `Sidebar` honour a child's `VerticalAlignment`. Breaking (layout):** a cell took `Start`
  whatever the child said, and as tall as its child it left the child's own alignment nothing to act in — a switch beside a
  taller select stood 10 px high. The cell now takes the child's alignment (`Start` only where the child has none), and most
  components carry one (texts, inputs and buttons `Center`, a container `Stretch`); a child that should stay at the top beside
  a taller sibling says `SetVerticalAlignment(UIAlignment.Start)`.
- **`UIForm.Row` holds its fields by the top. Breaking (layout):** every cell of a form row is `Start`, whatever its field's own
  alignment, so a field that grows a validation line no longer moves its neighbour; a plain `UILayout.Columns` cell still
  follows its child.
- **A command bar that does not fit puts its trailing commands under a "…".** A bar on one line whose commands pass its room
  moves them — from the first that does not fit to the end, with a group's separator left with no command after it — into a
  "…" list, keyboard-reachable, and a pick presses the command's own control — a flyout's or a split button's included, whose
  popup then opens anchored to the "…" and shows there (`anchored-popup.ts` places a popup anchored inside a command in the
  list against the stand-in its strip names and marks it `data-ui-popup-stood-in`; a command in the list is out of the flow
  and `visibility: hidden`, not `display: none`, and a command with no caption is listed by its control's name); the renderer
  draws the "…" (`ui-command-bar__overflow`,
  a tab stop) named by a new framework word, `ui.commandbar.more` ("More commands"), which an application with its own word
  tables adds. A vertical or wrapping bar, and a bar on a narrow screen below `md`, still wrap. **Breaking (look):** a bar's
  commands no longer shrink to ellipsised labels, so a bar in a narrow column shows fewer commands and a "…".
  `WebComponentRendererBase.RenderOverflowButton(context, parent, className, word, tabStop)` is the "…" both strips draw.
  The "…" list of a strip with no current entry, opened by a press, lights no entry and holds the keyboard until the first
  arrow, as every popup list does; the tabs' list still opens on the current tab. A strip is fitted with its "…" hidden and
  shows it only once a caption has to go, so a bar only as wide as its commands (end-aligned, a dialog's footer) shows no empty
  "…" and settles instead of refitting without end.
- **Muted text reads on the ground it stands on.** A component given a `Background` writes `--ui-faint-base` as that colour's
  on-colour (a role's `--ui-color-on-<role>`; a raw colour's `on-light` or `on-dark` by its lightness, `light-dark()` for a
  pair; nothing for a colour no text stands on), and the muted family fades the ground's own text colour, not the page's:
  the Action's trailing part, a menu's header, shortcut and value, key-value keys, breadcrumbs, the collapsible and expander
  marks, a separator's label, tab captions, the tabs view's pin and close, the strips' "…", the tree's marks and the slider's
  readouts — on a filled button or badge too. Popups, the dialog and Raised, Background and Tinted surfaces keep their own
  ground's ink. Muted words on a filled ground are its on-colour at 87 % rather than 68 %, so they read 4.5:1 on every default
  fill; the page's own muted text is unchanged. New: `WebCssValues.ThemeOnColor`, the converter `themeOnColorCss`, and in the
  plugin Less `@ui-text-ink`, `@ui-text-muted`, `@ui-text-muted-share`, `@ui-text-muted-filled-share` and `@ui-faint-lift`,
  with `.ui-popup-look()` resetting `--ui-faint-base`.
- **The ground a part stands on has a name.** `--ui-ground`, and `@ui-ground` in the plugin Less (falling back to
  `--ui-color-surface`), is the ground's own colour, for a part cut out of it — a chart's hollow marker, a pie's sector edge.
  It is written wherever `--ui-faint-base` is: a `Background` inline (for a colour no text stands on too), a filled button or
  badge, the temporal picker's selected cells, and as their own colour by popups, the dialog's surface and Raised, Background
  and Tinted surfaces.
- **A tinted badge writes its words in the colour's ink.** A badge, or a text's badge, given a semantic `Color` writes
  `color: var(--ui-color-<role>-ink)` for Primary, Accent, Info, Warning, Success and Danger and mixes its 16 % ground from the
  raw colour through `--ui-badge-tint`; a raw colour is used for both. A light-theme badge in Warning went from about 1.1:1
  to the ink's contrast. New: `WebCssValues.ThemeInk`, the converter `themeInkCss`. A tinted badge writes its words in
  `--ui-color-<role>-ink-on-tint` (new theme variables for Primary, Accent, Info, Warning, Success and Danger: a brand ink
  56 %, a status ink 80 % toward `--ui-color-on-surface`), 4.5:1 on its own tint over the page, a card and a raised card; the
  inks elsewhere are unchanged.
- **The default palette's status inks read 4.5:1 on their tinted badge, over the page and over a card. Breaking (look):**
  light `SuccessInk` is `AuroraGreen` Shade 2 and `DangerInk` `StellarRed` Shade 1; dark `InfoInk`, `SuccessInk` and
  `DangerInk` are Tint 4. Every word, icon and link written in those inks is a shade darker (light) or lighter (dark); a palette
  of an application's own is untouched.
- **`ShownWhen`, `HiddenWhen` and `EnabledWhen` follow the reader's own edit.** A property-sourced interaction heard only a
  value the server pushed, and the writer never gets its own value back, so a switch the reader turned on never revealed its
  panel. It now also runs on the source field's `change`/`toggle`, with the value the field holds — a switch, a checkbox, a
  text, a field with no binding (its `Value`) — and a value the server refuses puts it back. An `Effect` interaction reading a
  field that is also a list's filter or sort `Source` runs once per edit (it ran twice), and a rule source's edit is no longer
  written back into the field it came from. A field's interactions run once per value: a debounced text field's `change` at the
  reader's pause and the browser's own when the reader leaves no longer run an `Effect` twice.
- **A link and a Ghost or Outline button take a filled ground's ink.** In a component given a theme `Background` (where
  `--ui-faint-base` is written) a Ghost or Outline button's words and a link — the Link component, a Link button, an inline
  `[label](url)`, a Markdown link — are the ground's on-colour rather than the page's ink or the brand ink (2.5:1 and 1:1 on
  Primary before), a link wearing its underline there; on the page and on a card nothing changes. Plugin Less: `@ui-link-ink`,
  `@ui-link-rest-underline`, read by `.ui-inline-link()`. **Breaking (look):** a `Background` of `Surface` or `Background`
  writes `--ui-faint-base: initial` (`WebCssValues.ThemeOnColor`, converter `themeOnColorCss`) instead of the on-surface colour,
  so a card of the page's own ground keeps the page's muted share and links, and takes the page's inks back inside a filled panel.
- **A heading in prose may wrap.** `ParagraphComponent.TitleWrap` (`SetTitleWrap(true)`, class `ui-text--title-wrap`): the
  title runs on to further lines, balanced, instead of ending in an ellipsis — an article's headline. Every other title keeps
  one line.
- **A checkbox's and a switch's label is body text. Breaking (look):** `CheckboxComponent` (so `SwitchComponent`) defaults its
  `TitleType` to Body, as a radio option's label is, so a Medium label grows from 12 to 14 px and no longer reads smaller than
  its description; the Small size keeps the caption. A Small radio option's text steps to caption the same way; Large stays
  body.
- **A key-value list with no border and no fill of its own drops its rows' inline padding**, so its keys line up with a card's
  or an expander's content; the separators stay. Its default Surface, Background, is no fill of its own — only Raised, Tinted
  or an inline Background colour keep the inset. A `BorderThickness` of nothing on every side now adds `ui-border--none`
  (`WebClassNames.BorderNone`, converter `borderNoneClass`) beside the inline `border-width`.
- **A default floor yields to an authored size.** A Select, Search, MultiSelect or horizontal Slider given a Width below 12rem,
  and a Separator below 1rem, is that wide; an authored MinWidth still wins. Plugin Less: `.ui-responsive-floor(@property,
  @variable, @floor, @size-variable)`.
- **The shell that scrolls its own regions reserves no scrollbar gutter on the document**, so the dialog's backdrop, a sheet
  and the toasts reach the window's right edge.
- **A title-aligned icon with no title stands on the description's line**: its box took the absent title's line height and set
  the glyph 4 px below a Body description.
- The demo: a group's content lines up with the page's heading, and its code button — a 24 px ghost — stands level with the
  group's title without an offset, a group's context line on a row of its own under it; a component with one kind draws no tab
  strip; the command bar's deploy example has its controls under it; a dialog's title and question wrap; the text examples'
  alignment and picture lines and the menu's context-card explanation no longer end in an ellipsis; the
  items view's scenario rows are body text and its chat messages wrap; catalogue tiles fill the shelf's line and keep the price
  and *Add* on one row; stale minimum heights are gone from the semantic colours and home pages; the tree's folder glyphs read
  in the light theme; the radio group's orientation example is top-aligned; fixed widths that cut titles with room to spare
  are gone or wider (Text, Menu), the Surface example's title is shorter, and the grid splitter's log pane scrolls. The demo
  no longer sets `SideDrawers`. TeamRoom's composer field takes the rest of its row, ending where the feed does, and its Files
  and Chat pages stack their two panes on a phone, the editor and the conversation taking the width.
- TeamRoom's chat at a tablet's width: a message is as wide as the feed at most below the extra-large width, so its attachments
  wrap under one another rather than running past the column, and the conversation's search stands under its title there; the
  640 px cap holds from the extra-large width up. The host no longer calls `UseStaticFiles()` — it serves no file of its own —
  so it starts without the *WebRootPath was not found* warning.
- **A collapse goes at once, as a show arrives.** `@ui-root-transition` no longer holds `display`: a component collapsed by a
  rule (`ShownWhen`, `HiddenWhen`), a bound `Visibility` or a `CollapseEffect` leaves the page in the frame the change lands,
  where it stayed drawn 200 ms, fading, and then took its room away at once — the page below jumped late. Hide (the room kept)
  still fades both ways. A search's group header, which set `transition: none` to go with its options, needs nothing of its own.
- **A list's entries stand 2 px apart** (`@ui-list-entry-gap`, `.ui-entry-list()` on the plugin surface), so a chosen entry and
  the pointer's read as two: the language switcher's list, a select's, search's and multi-select's options, the "…" lists of a
  tab strip and a command bar, as a menu's entries and the calendar's cells already stood. A select's list is a flex column now.
- **A row built into a list is drawn once from the collection it shares.** A select in every row of an items view shares one
  options collection; a row built while the same set went on to change those options (a planner's resource opened: a new
  ingredient row, and the opened resource taken out of the choices) had its empty host passed each change, warning *collection
  remove did not resolve an item*, before the held collection drew it. The waiting host is passed by, and drawn from the held
  rows as they stand then (`HeldCollections.markWaiting`/`takeWaiting`).

## 1.2.0

- **A read-only field offers nothing that would change it.** A read-only number input's stepper goes, as the time input's
  does, and a press on it changes nothing; ArrowDown in a read-only date or date-time field no longer opens the calendar,
  whose choice was written into the field; a read-only select's clear and chevron go, as a read-only search's and
  multi-select's do. A read-only file input's pick button is dimmed, as a date field's calendar toggle is.
- **ArrowUp and ArrowDown step a number input**, as a native number field's do, whether or not it shows its stepper — whose
  buttons stay out of the tab order and hidden from assistive technology, the keys being the accessible way to step.

## 1.1.0

- **Every package moves to 1.1.0.** A change to the framework now releases every package on the next minor version; a
  change to one component package alone moves only its last digit (`docs/PUBLISHING.md`, *One number per slice*).
- **A mirror's build waits for the feed itself.** On a release's sync commit it polls nuget.org until every version its
  tree pins is there, then builds; the release no longer starts the mirrors' builds.
- **Breaking:** `WebComponentRendererBase.RenderTemplateVariant` is gone. It drew a template variant outside any row, but a
  variant is compiled in a row's scope, so what it drew asked for a row key it did not have (the data grid's band warned
  about it on every page). A part drawn outside the rows is a region of its component: declare it through
  `IRegionContainerComponent` and draw it with `RenderRegion`.
- **A container puts air between its children.** `ContainerComponent` has a `Spacing` (`UIResponsive<double>`, bindable,
  unset by default so no page changes): the same pixels between its columns and between its rows, per breakpoint —
  `SetSpacing(16)`, `SetSpacing(8, xl: 24)`. The space between columns is capped at a twenty-fourth of the room the
  absolute columns and column floors leave, so a narrow container closes its columns up rather than overflowing; a
  container with `Auto` columns wants a responsive spacing with a small base. A page that parted placed children with
  hand-tuned margins can drop them for it; the demo's `/layouts/container` page walks a few values.
- **A tab's page stands clear of the strip.** `TabsComponent`'s page has the air under the strip a `TabsView` page has
  always had (`@ui-space-3`); a page that set a top margin of its own for it can drop it.
- **A colour swatch is as wide as its longest value, and its corners are clean.** The standalone swatch of a
  `ColorInputComponent` (`AsSwatch()`) is sized for `#RRGGBB`, or `#RRGGBBAA` with opacity shown, so swatches down a column
  line up whatever they hold; its ring is drawn over the fill, where a border let the page show through the rounded corners.
- **A table's last column lines up under its caption while the rows scroll.** The rows' vertical scrollbar took its width
  out of the last column's cells but not out of its header cell, so an end-aligned or centred caption stood off its values.
  While the rows scroll, the header — and a grid's totals row — now keeps the same gutter at its end
  (`data-ui-table-scrollbar` on the table); a table scrolling sideways, whose header and rows share one scrollbar, is
  unchanged. A keyboard ring on a header cell is drawn inside the cell, where the frame no longer clips it.

## 1.0.1

- **The first stable release.** No `--prerelease` is needed any more. Until 2.0.0 the public surface may still move
  between versions; every such change is marked **Breaking:** in this file.
- **The tabs view offers its own tab menu.** A right press on a caption, or the context-menu key on a focused one, opens a
  menu of the built-in entries the strip chose in the new `TabMenuEntries` (a `[Flags]` `UITabMenuEntries`: `Rename`, `Pin`,
  `Close`, `Delete`; bindable, `None` by default) and the application's own, in a fixed order: *Rename*, *Pin* or *Unpin*, a
  rule, the application's entries and a rule, then the remove entry last — a rule only where entries show on both sides of
  it. *Rename* opens the caption's field whether or not the strip is `Renamable`, which keeps governing the double click and
  F2. *Pin*/*Unpin* follows the tab's state: it sets the tab's `Pinned`, now two-way like `Order`, and moves the tab to the end
  of the pinned ones, writing its new `Order` back as a drop does. The remove entry comes in two forms, chosen one or the
  other — `SetTabMenuEntries` refuses both: *Close*, neutral with the cross, and *Delete*, with the trash glyph in the
  danger colour; either raises exactly what the cross does, so it needs `OnItemRemove` and a pinned tab has none. The words
  are the framework's (`UIStrings.TabRename`, `TabPin`, `TabUnpin`, `TabClose`, `TabDelete`). An application adds its own
  entries with `AddTabMenuEntries` and hears them with `OnTabMenuEntry`, which carries the entry's key and the tab's
  (`UITabMenu.Entry`/`Tab`); `TabMenu` is the menu itself, and a menu with nothing to offer a tab stays shut. A tab template
  with a context menu of its own keeps it, and the strip then draws none. An application that assembled a tab menu by hand —
  entries per item, a pin toggle, an order at the pinned boundary, a `RenameTabEffect` — drops it for these. The demo's
  editor at `/navigation/tabs-view/scenarios` chooses *Rename*, *Pin* and *Close* and keeps only its *Close others*; the main
  page's `TabMenuEntries` row walks a few sets.
- **A context menu's owner with no menu for a press hands it to the owner around it** — as does an owner whose menus all keep
  themselves shut for it, so a tab strip with nothing to offer a caption leaves the right press to the card around it — and an
  engine can set a menu's entries for what it was opened on, or keep it shut, on the `ui-context-menu-opening` event raised
  just before it opens. The first entry the opening shows and can run takes the keyboard and the menu's tab stop, whichever
  entry held it before; a right press on the open menu opens nothing over it.
- **A menu entry is pressed from the keyboard.** Enter or Space on an entry with no address raises its click — an entry is a
  link, and one without an address had no press of its own — so a context menu's, a split button's and a command sidebar's
  entries answer the keyboard as they answer the pointer. A group's choices flown out beside it close on a press elsewhere and
  when the window loses focus, rather than coming back open with the next context menu.
- **Tab strips**: the "…" list walks with the arrows, Home and End and closes when a Tab leaves it; a `ShowOverflow` switched
  live fits the strip again at once; a tab pinned or dropped in a strip whose tabs carry no `Order` stays where it was put —
  the strip is numbered afresh when the tab after it has no order, which sorts ahead of every number.
- **The core glyph face grows from 45 marks to 114** (12.9 KB), every one named in `UIGlyphs`: the marks the graph package's
  kinds wear, a message's standing (`Info`, `CheckCircle`, `Warning`, `Error`, `Help`), a control's everyday chrome (`Copy`,
  `Undo`, `Redo`, `Refresh`, `Settings`, `OpenInNew`, `Link`, `Upload`, `Download`, `AttachFile`, `VisibilityOff`, `ZoomIn`,
  `ZoomOut`, `Fullscreen`, `FullscreenExit`, `DragIndicator`, `UnfoldLess`, `History`), and files, data and an application's
  frame (`Folder`, `CreateNewFolder`, `NoteAdd`, `Code`, `DataObject`, `Terminal`, `Cloud`, `Storage`, `Lock`, `LockOpen`, `Star`,
  `Home`, `Logout`) — drawn with no icon pack installed.
- **A multi-select built-in, `MultiSelectComponent`.** One field holding several options out of a bound list: the chosen ones
  stand in it as chips that wrap onto more lines, each with its own remove button, and the list checks them and stays open while
  options are toggled. The value is an `IReadOnlyList<string>` of keys in the order they were chosen, each once, bound two-way
  like any input's; `MaxSelected` caps it. It shares the select's field — clear button, chevron, placeholder, where the list
  opens, appearance, size, caption, affixes, validation — through a new `SelectComponentBase<T, TItem, TValue>`, and
  `OptionsInputComponentBase` gained a value type parameter for it (`OptionsInputComponentBase<TComponent, TItem>` is the
  one-key base it was). The keyboard opens the list from the field, arrows move, Space and Enter toggle, Escape closes and
  Backspace takes out the last chip; the chip's remove button is named "Remove …", a translatable word. The demo has its
  Main and Examples pages at `/inputs/multi-select`.
- **Under the claims identity source the session id rotates on the page that first sees the principal.** It was persisted
  after the rotation ran, so the id the browser held while anonymous carried the signed-in identity through that whole page —
  its attach and its commands — until the next load. The claims source is now proven end to end behind a real
  `AddAuthentication()` cookie handler and a real hub connection, and the web hosting guide shows where
  `UseAuthentication()`/`UseAuthorization()` go.
- **An end-anchored windowed list opened on an older part of its source stays there.** The anchor engine scrolled every
  end-anchored container to its bottom, which on a window with newer items after it is the spacer standing for them, and the
  window engine answered by swapping the window for the newest one — a chat opened on a search hit showed the latest messages.
  Such a window is no longer pulled down, and it opens with its last row at the bottom edge, as the newest would.
- **TeamRoom opens a search hit on a long feed with the message in view** — the window ends on it however near the start it
  is — and marks the feed read once the reader scrolls down to its end, not only as far as the window the page opened with.
- **Both source generators are incremental.** Their models are plain equatable data, so an edit that changes no annotated
  member no longer re-runs them on every keystroke in the IDE; the generated code is byte for byte what it was.
- **The TypeScript clients are linted as they build.** oxlint, with its type-aware rules on typescript-go, runs after the type
  check in every client's `npm run build`, and knip beside it for an export, a file or a dependency nothing uses, so a finding
  fails `dotnet build` as a type error does. The sweep they started took `export` off what only its own module uses and
  removed what nothing used.
- **The framework's scripts and stylesheets are compressed once, not per response.** They are compressed at Brotli's and Gzip's
  smallest size in the background at start and served as they are by `Accept-Encoding`: `ui.js` is about 97 KB of Brotli, and a
  first visit costs the server no compression at all.
- **A page is named.** The shell writes the view's `Title`, translated for the session's language, into the document's `<title>`,
  so a browser's tab and history say which page it is; until now every tab showed the address. The framework demo's pages are
  titled from their header, and a dialog can carry a `Label`, its name for a screen reader, which the demos now set.
- **TeamRoom signs in with a press in Development**: a button per test account (Admin, Robin, Sam) beside the form, and the two
  test accounts seeded with it; off everywhere else.
- **A select cleared from outside no longer keeps its old value underneath.** A value taken off an unbound select's root — a
  push, a package emptying its field — left the hidden element the value is read from holding the old one, so the next read
  brought it back. Both now move together. And `UIItemsQuery.IsEmpty`, computed, no longer travels on the wire.
- **A screen reader is told what each control is.** The renderers write the roles and states the eye already gets: an items
  view is a `listbox` of `option`s where rows are chosen and hold no control of their own, a `list` otherwise; a table whose
  rows are chosen is a `grid` of `gridcell`s (`TableComponentRenderer.CellRole`, for a package's cells too), any other a
  `table`; a menu's entries are `menuitem`s only in a popup — a sidebar's are links, the current one `aria-current="page"`;
  tabs are a `tablist`, `tab`s and `tabpanel`s, the open one marked and the others hidden at render; a radio group, a select's
  trigger (`combobox`), a switch (`switch`), a progress bar (`progressbar`, with its range and reading) and a spinner
  (`status`) say what they are, and a row the client builds carries the server's role and starts unchosen. A field's caption
  is its control's name (`TextContentRendererBase.RenderFieldLabel`: `aria-label`, `aria-required`, `aria-describedby` to
  the validation line, `aria-invalid`), the validation line is a polite live region, and `aria-invalid` follows the field's
  error afterwards — an error's alone. Notifications speak through one polite live region that stands from the start, a
  `Danger` toast as an `alert`, and a toast waits while the keyboard is on its button. A picture loads lazily.
- **`AccessibleName` names a control by words it does not show** — on the button, the split button, the checkbox and the
  switch (`IAccessibleNameComponent`, written by `WebComponentRendererBase.RenderAccessibleName`), over its caption or its
  tooltip: a switch drawn as "Aa" is "Match case", a checkbox alone in a table's column names its row.
- **A Menu-mode split button with a click command of its own fails the view's compile.** The whole button opens the menu, so
  the command could never run; the entries take it through `OnItemClick`. `ISplitButtonComponent` is what the compiler reads.
- **A number input shows its value in its culture and `DisplayFormat`** — `N`, `F`, `C`, `P` or `D` with a precision, the
  component's own `Culture` or else the page's — and is edited with the culture's decimal separator, a percent as the percent
  it shows; the value still travels as invariant text, so the server reads it the same whatever the page's language. It used
  to show the invariant text grouped with commas in every culture.
- **Values given while a change set is on its way go together in the next one**, and a field given again meanwhile sends only
  its latest value: a slider dragged or a time segment turned is one trip per answer, not one per move.
- **A field whose value is on its way keeps it.** A push that landed before the answer — the attach's snapshot among them,
  taken before the value arrived — was written into the field and put back what the reader had just replaced; it is now
  recorded, not written, as for an unsubmitted `OnSubmit` edit. A held field its row took off the page is let go, and the
  clear button no longer clears a disabled or read-only field.
- **A staged value's trip is given up after 30 seconds**, fetch and POST alike, since every change set behind it waits: a
  fetch that hangs now reattaches the page instead of stalling it without an error.
- **A colour is sent once per gesture.** The picker's field, its hue and its sliders redraw at every move and send the colour
  the pointer lets go on, not one round trip per move.
- **The reader's system preferences win.** `core/preferences.less`, imported last: under `prefers-reduced-motion` every
  transition goes and its end state stays (the loading ring keeps turning, the one sign of work under way); under
  `forced-colors` a chosen row, option or entry, the keyboard's row, the current tab's line, a checked box, switch or radio and
  a progress bar's fill are redrawn in the system's colours, since the mode takes away the washes and inset shadows they were
  drawn with.
- **A `NavigateEffect`'s parameters join the query its route already carries**, ahead of its fragment, and an object goes as
  its JSON; they were appended after a `#` or a `?` as a second query, and an object as `[object Object]`.
- **A sort is one order over every value**: nothing first (null, blank text), then numbers by value, then text by locale.
  Choosing number or text per pair of values made `"2" < "10" < "1a" < "2"`, an order no sort can keep.
- **A row that leaves takes its recorded values with it wherever it was.** A value pushed while its row was not drawn (a
  virtualized row off screen) outlived the row, and a refill kept the values of the rows it redrew or dropped, so the same value
  pushed later read as no change; both are forgotten now. A re-attach keeps the item a server-rendered row was drawn from, so
  the refill after it redraws a row that changed rather than taking it as current.
- **A virtualized list redraws only for what changes it.** A patch to any property of a row not drawn re-ran the rules and
  redrew the list, and reached every virtualized list keyed the same way; it now reaches the list it is addressed to and
  redraws for a whole item, a rule's or the grouping's value. The heights it estimates from are every row measured so far, the
  row at the top of the viewport stays put while the list is scrolled, and the top spacer is no longer taken for a row when
  rows are put back in order. A windowed list's scroll is not undone by a read in flight.
- **A server-rendered list inside every row of another has its own values per row.** The render metadata held one entry per
  component, the rows' values folded into the first; **Breaking:** `WebRenderMetadata.RegisterItemValues` takes the host's
  `UIComponentAddress`, and `WebRenderItemValuesMetadata` carries its `DynamicParameters`.
- **A subtree the client clones renders as a template** (`WebRenderContext.IsTemplate`, `AsTemplate(html)`): identities kept,
  nothing written that must be unique on the page — a validation line's id went into every cloned row.
- **A table orders and hides its columns past the 64th**: the stylesheet's rules stop at 64, and a column past them took the
  first place; it keeps its source place and the columns engine writes the viewer's order, hiding and last column on its cells.
- **The image input's remove is a corner button on a touch screen**, where the tap that brought the veil up also pressed it;
  a picture being loaded shows the shared loading veil and one ring, not two.
- **The time and date pickers read the wheel in notches** (`wheel-notches.ts`), so a trackpad's glide no longer races through
  the values; the wheel steps only the focused segment, or the column it is over while the popup is open, and does not hold the
  page's scroll. A time segment is a named `spinbutton` with its bounds, a 12-hour dial reads its own hour, and a picker rebuilt
  under the focus keeps it where it was.
- **Smaller client fixes.** Picking the same file again after a failed upload is a change; files all refused for size leave the
  selection as it was. Radio groups drawn from one template keep one name each, so checking one no longer unchecks another
  row's. A tooltip whose control was redrawn away closes, a popup whose anchor was redrawn away stays where it stood, a flyout
  moves the focus in once as it opens, a menu group's entry says whether its block is open, a select's search is spent only
  when a value is chosen, a pointer drag answers one finger at a time, and a tree with a parent key that loops back no longer
  hangs a drag. A boot patch naming its targets by selector reaches the rows the parser hands over after the first. A text
  area whose value starts with a line break keeps it.
- **`observeComponents` takes a `relevant` filter** (on the plugin surface too), which drops the records an engine does not
  answer before their components are looked for, and **`selection.setSelectedKeys`** takes or clears rows by key, for rows a
  virtualized host has not drawn; `selection.setSelected` passes over a row a filter hides.
- **Breaking: the built-in templates' generic bases bind only when asked**, as their sealed classes already did:
  `DefaultButtonTemplate<T>`, `DefaultTextTemplate<T>`, `DefaultMenuItemTemplate<T>`, `DefaultTabItemTemplate<T>` and
  `DefaultBreadcrumbItemTemplate<T>` default `binds` to `false`, so a derived template that wants the model's properties
  bound passes `binds: true`. **`TemplateKeyProperty` is no longer bindable** — the renderer reads it off the compiled state to
  pick a variant, so a binding changed nothing; its `Bind*` is gone.
- **A session ends everywhere, from anywhere.** `IUISessions`, registered by the startup and implemented by the host:
  `EndSessionAsync(sessionId, except)` removes the stored session and its uploads, ends every runtime open under it and sends
  each of its pages to `Security.SignInRoute` with the page's address as `returnUrl` (a reload where no sign-in route is
  registered); `EndUserSessionsAsync(userId)` ends every session one person is signed in with — a blocked or deleted
  account — and `UpdateUserSessionsAsync(userId, update)` changes each, so a role taken away holds for pages already open
  from their next command. `UIContext.SignOutAsync` goes through it: **signing out in one tab now signs out every tab at
  once** — they are sent to sign in — where it used to remove the stored session and leave the other tabs to find out on
  their next move. The asking page's runtime stays to finish its answer; under `PerClient` the tabs sharing it are sent
  away too.
- **A controller hears its pages come and go.** `UIControllerBase.OnAttachedAsync(navigation)` runs on every page that
  attaches — a new tab, a reload, a navigation that finds a kept runtime — as a command runs, with `Context.Handle` the
  attaching tab, so a parameter the route does not key its runtime by still reaches a runtime that already existed;
  `OnDetachedAsync` runs, queued, when one leaves; `HasViewers` (on the controller and on `IUIRuntimeAccess`) says whether
  anyone looks at the page now. A page render's own attach is none of them.
- **`IUIRuntimeAccess.Post(action)` hands work to a runtime without waiting for it**: queued, run on the thread pool as
  `InvokeAsync` runs it, one at a time and in the order posted for that runtime, counted as a command in flight so the
  runtime is not disposed under it, dropped if the runtime is asked to go first; a failure goes to the controller's exception
  handler. The shape for an event every subscriber reacts to. **Breaking** for an `IUIRuntimeAccess` of an application's own:
  `Post`, `HasViewers` and `SendEffectsToAllAsync` are new members.
- **`SendEffectsToAllAsync`** on `UIContext` and `IUIRuntimeAccess` pushes effects to every page attached to the runtime —
  under `PerClient`, every tab sharing it — where `SendEffectsAsync` reaches the one connection; a tab whose send fails does
  not keep the effect from the rest.
- **A controller is built from a service scope of its own**, opened with its runtime, exposed as `Context.Services` and
  disposed after the controller — asynchronously where a service needs it. A scoped dependency (a `DbContext`) was the root
  provider's, one for every page, and a disposable transient was held by the root until the host stopped.
- **A session is never written back from a stale read.** A request that overlapped a sign-out in another tab saved the
  session it had read and brought it back; one that overlapped a role change undid it. Every write now applies to what the
  store holds at that moment and never recreates a session, and a request whose signed-in session was removed while it ran
  goes on as a new anonymous session. **Breaking:** `IUserSessionStore` gains `TryUpdateAsync` (read, apply and save as one
  step, answering whether the session existed), `TouchAsync` (the last-seen time alone) and `FindByUserAsync` (the sessions
  one user is signed in with); a store of an application's own implements them.
- **A return address keeps its query.** The sign-in and forbidden redirects wrote the refused route alone as `returnUrl` /
  `deniedUrl`, so a deep link's `?id=42` was lost on the way through sign-in; the route and its parameters travel now, as the
  client writes an address.
- **A page render never reads a runtime that has not started**, and the flush leaves one for the tick after it starts: under
  `PerClient` a render could read the state of a runtime another request's attach was still initializing. **An attach that
  fails or is cancelled releases its connection**, which otherwise counted as connected for good and kept the runtime from
  ever being cleaned up.
- **A session holds at most `UIPersistenceOptions.MaxUnclaimedRuntimesPerSession` runtimes no tab has presented** (4 by
  default, within `MaxRuntimesPerSession`): a client that loads pages and never attaches — a crawler, a prefetch, a script —
  left one runtime per load for 30 seconds, and a load test of sixteen such sessions held 1 024 runtimes and about 1.2 GB. A
  render past the bound gives up the session's longest-idle unclaimed runtime, never one a tab presented, one connected or
  one running a command.
- **A direct runtime's queue is bounded.** The pump's queue grew without limit while a send to a client that stopped reading
  held it up; past 16 384 changes the queue is dropped for a full resync, as a batch runtime's is past
  `MaxQueuedChangeSets`, and one wake of the pump covers every change queued before it. `MaxQueuedChangeSets` below one is
  refused at startup.
- **A number typed under a culture with a decimal comma arrives as typed.** The client sends a number invariant and the
  server read it through the component's culture first, where under `de-DE` the `.` of `1.234` is a group separator: 1.234
  was stored as 1234. The invariant form is read first; text written with a group separator still falls to the culture.
- **A value from the client that names no enum member is refused**, where any number the enum's type could hold was stored;
  a `[Flags]` enum takes any union of its members. A theme colour on the wire is read by member name only — a number or a comma
  list is no colour. A flags argument with a negative member no longer overflows the command's check.
- **A recursive node lives in one place.** A node could be put in two properties or two collections of one owner, and raised
  its changes under one path of the two; the second place is refused now, and refused before the collection or property
  changes — a refusal used to come after the item was already in. Move a node by removing it first.
  `RecursiveCollection.InsertRange(index, items)` inserts a run as one change, beside `AddRange`.
- **A window read never asks its source for more than the window holds**: the hub clamps the count off the wire to
  `UIItemWindowClientRequest.MaxCount` (1 000) and the source base to `MaxWindowSize` before the source is asked, so a
  hand-made call cannot ask for a whole table; a prepend is one `InsertRange` and a trim one `RemoveRange`, not a change per
  row.
- **A lookup by path no longer keeps a process-wide cache of path shapes.** The binding index answers it from a map of the
  shapes its own view binds, built with the index, so it grows with the view and never with the paths a model raises; a path
  of a shape nothing binds answers nothing without building a template. `RecursivePathTemplate.FromPath` builds a template on
  every call, and `GetParameters(path)` and `ShapeComparer` are new.
- **A write that changed nothing is not held back as the writer's own value**, where it could later hold back a newer value
  of the same property; and taking the attach snapshot no longer marks every item window whose rules read a snapshot path as
  stale, which reloaded those windows from the start after every render and attach.
- **Inline markup parses in linear time**, however many marks are left open, and a fold nested more than eight deep stays
  literal text rather than recursing — a few kilobytes of user text could exhaust the stack of whatever rendered it.
- **The component property generator settles on a component's self type by rule.** The type its setters return is the type
  parameter constrained to the type itself (`where T : Foo<T>`), else one named `T` or `TComponent`, else the type when it is
  not generic; **breaking:** a generic component with one type parameter of another name and no such constraint, taken as the
  self type before, is `NEUI006` now. A `DefaultValue` the property's type cannot hold is `NEUI004` at build time instead of a
  failure of the type's initializer; the generated code carries no `using` and spells every name from `global::`, so a type an
  application declares beside its component cannot take a framework name's place; a generated file's hint name is the type's
  full metadata name, so two types sharing a name never collide; type parameter constraints are no longer repeated; a
  non-finite `double` default compiles.
- **`SetValue` on a number input or a slider is checked against its range**, as `SetMin` and `SetMax` already were: whichever
  of the three is set last is checked against the others.
- **A dialog can be named for a screen reader**: `UIDialog.Label`, translated for the page's language.
- **The load is on the meter, and every step's time is in the debug log.** `ne.ui.runtimes.attached` (the pages open now),
  `ne.ui.updates.pending` (change sets waiting to be sent), `ne.ui.sessions`, `ne.ui.files` and `ne.ui.files.size` (for the
  default stores), `ne.ui.runtime.start.duration`, and the web platform's own under the same meter: `ne.ui.web.connections`,
  `ne.ui.web.render.duration` and `.length`, `ne.ui.web.files.transferred`, `ne.ui.web.render_cache.held`, `.held.length` and
  `.disk.io`, `ne.ui.web.values.staged` and `.size`. A size is read off its store only when a listener collects. At `Debug` the
  server logs how long a compile, a resolution, an attach, a command, a change set, an item window, a flush pass, a page render,
  a render cache read or write and a file transfer took; the client, at `setLogLevel("debug")`, times its own steps from
  building the runtime to the page going live.
- **TeamRoom leaves sessions to the framework.** A role change reaches the account's sessions at once, a block, a deletion or
  a password reset ends them all and a password change every other one, and their pages go to sign in at once rather than on
  their next move; sign-in is throttled per login (five wrong passwords in five minutes); a conversation is marked read only
  while someone looks at it, and a search hit opens on the message even in a kept conversation; attachments are capped at
  25 MB each and 512 MB an account and stream in and out of the database, which vacuums incrementally and keeps its journal
  to 16 MB.
- **Everything the framework serves stands under `/_ne/`.** **Breaking:** the hub moved from `/_ui/hub` to `/_ne/hub`, and
  the framework's assets from `/css/`, `/js/` and `/fonts/` to `/_ne/css/`, `/_ne/js/` and `/_ne/fonts/` — `ui.css`,
  `ui-fonts.css`, `ui.js`, `ui-boot.js`, `inter.woff2` and `ne-glyphs.woff2`, a package's bundles (`WebPackageClient`) and the
  icon packs' stylesheets and font among them. A proxy rule, a rate limit or a content policy naming the old paths follows
  them. The page route now answers nothing under the prefix: an address beneath it that nothing maps is a `404` where it was
  a rendered page, and the rest of the address space is the application's, so its own routes and static files cannot collide
  with the framework's.
- **A page streams into the response instead of being built as a string.** The shell writes the document through a UTF-8
  writer over the response's pipe (`WebShellRenderer.Render(context, writer)`), the second render included as its own tree,
  so a large page is no longer several strings on the large object heap a request; the words the client needs are serialized
  once per language (`WebShellContext.StringsJson`, `WebShellRenderer.SerializeStrings`), the theme's stylesheet once per
  theme. The page is answered `text/html; charset=utf-8` and `Cache-Control: private, no-cache`, since it carries the
  session's values. **Breaking:** `WebShellContext.Content` is an `IHtmlContent` rather than a string, and `IHtmlBuilder`
  has a `Content(IHtmlContent)` member, which adds markup built elsewhere without turning it into a string.
- **The render cache is bounded in bytes, renders a page once however many ask, and keeps to a folder of its own.**
  `WebViewRenderCacheOptions.MaxHeldBytes` (128 MB) bounds the markup and metadata held in memory beside `MaxHeldRenders`,
  since a few large views could hold hundreds of megabytes within the count. Requests that miss one entry together render
  it once and write its files once, where a cold start's burst did both once per request. The files go into a `renders`
  folder inside `DirectoryPath` — a folder per view and language, one per compile beneath it — so a clear never empties a
  folder the application keeps other files in; with `ClearOnStartup` off a start removes every compile of a view but the
  newest and temporary files a stopped process left behind. An entry is read only when all three of its files are there,
  and its write is not cancelled by the request that started it: a half-written entry gave a controller page no values
  until the cache was cleared.
- **What every session holds together is bounded.** A session costs a visitor one page load, so the per-session limits
  bounded nothing on their own. `UIFileOptions.MaxUploadBytesTotal` (4 GB) caps every session's uploads, answered `413` like
  the session's limit; `WebValueOptions.MaxStagedBytesTotal` (512 MB) caps every session's staged values, answered `503`,
  since the server is full rather than the request too large. The first refusal of a burst is logged as a warning. Zero or
  `null` turns either off, and `WebValueOptions.Validate` checks the value options when the staging store is built.
- **A staged value must be JSON, and is held as the bytes it arrived as.** `POST /_ne/values` answers `415` to a body not
  typed `application/json` — a plain-text body is a request any page may send without asking, and this one carries the
  cookie — and `400` to one that is not JSON; the value is read into objects when the hub takes it, so what the byte limits
  count is what is held rather than an object graph several times its size.
- **The upload and the staged value refuse every other origin, a sibling subdomain included.** Only
  `Sec-Fetch-Site: cross-site` was refused, and a sibling subdomain (`same-site`) is sent the session's `Lax` cookie; now
  only `same-origin` and `none` pass.
- **A download is answered `Cache-Control: no-store`**: one fetch of one session's file, which nothing on the way may keep.
- **A versioned asset answers `304` when the browser revalidates it**, as a hard reload does, rather than sending its bytes
  again.
- **A store that fails while saving an upload is not answered `413`.** Any `InvalidOperationException` out of the save read as
  a size limit; the stream that counts the bytes now says whether it refused them.
- **An enum value a renderer does not know writes nothing rather than failing the page.** The web CSS value helpers threw
  for a value outside their enum, and an empty class or style value was refused; both now write nothing, so the stylesheet's
  own applies.
- **A part of a context menu's owner can refuse the menu**: `data-ui-no-context-menu` (`WebAttributes.NoContextMenu`) on any element
  inside the owner keeps the owner's menu off it — a panel over a canvas — as it already did on the owner itself and on an item row.
- **A badge's figures keep their tops.** Its text is trimmed to the capitals' height, and the clip that ends a long text in an
  ellipsis shaved the overshoot of a round figure — a 6, a 0 — which read as a darker line along the top at a fractional zoom.
  The text is clipped across only.
- **A row of an items view stands inset only where it can be chosen or wears the hover** — `SelectionMode` One or Many, or
  `RowHoverable`. A list of a form's fields stood indented from the fields around it.
- **What the server sends is applied in the order it arrived.** SignalR hands a pushed message to its handler at once but an
  invoke's answer only through a promise, a turn later, so a push that came right behind an answer in one frame was applied
  first and the answer's older values over it. An answer's changes — a command's, a value's, an item window's, a background
  command's pushed result — are now applied by the transport in their turn (`inbound-order.ts`), and the caller gets the answer
  once they are.
- **A strip being reordered by hand is not re-sorted under the pointer**: a filter, sort or order value the server sends
  during a drag brings the host in step once the drag lands.
- **A pushing runtime sends in the order it drains.** A Direct runtime sends what it drains outside the state lock, so two
  change sets drained one after the other — the pump's and a value's answer, a window reload — could leave in the other order.
  A drain and its send are now one turn.
- **A page that attaches is sent each change once.** A change queued before its attach snapshot was in the snapshot and was
  pushed to it again — a row inserted twice — and a push the server sent right behind the snapshot could land before it and be
  put back by it. The runtime numbers what it queues, takes the snapshot and the connection's starting point in one step
  (`IUIRuntime.BuildAttachChangesAsync`, `UIInstance.StartsFromSnapshot`) and hands each connection only what came after it
  (`IUIRuntime.ChangesFor`); the browser holds what arrives during its attach until the snapshot is on the page. The demo's
  provisioning button goes back to *Not started* when the tab that pressed it reloads mid-way.
- **A command's argument reads the scope it names, however deep.** A bound argument took the first keys of the event's chain
  rather than the keys of the scopes it reads, so `ArgParent` three items views deep read the outer row's key as the middle
  row's; and a value of a static items view's row was read off the controller, where it is not. The runtime now places each
  scope in the chain (`CompiledUIActionArgumentResolver.Resolve(..., scopes)`) and reads a static row off its component.
  Three levels of items are covered end to end. `RecursivePath.Skip(count)` beside `Take`.
- **A table that scrolls sideways gives a content column its content's width** (`max-content` for a bare `Auto` track):
  `auto` gave it only what the other columns left, which a cell ending in an ellipsis made nothing, and the table never grew
  wide enough to scroll. The demo's tables lose the floors they carried for it.
- **Inside a sideways scroll a width or a floor the author wrote holds** — `SetWidth(Fill)` with `SetMinWidth(560)` is the
  box's width down to 560, then a scroll; the content took its own width whatever was written. The grid splitter's side-by-side
  examples keep their width on a phone this way.
- **A period field too narrow for its phrase puts the end under the start** rather than cutting both short, and
  **`UIPage.Header`'s line under the title runs to three lines** on a phone rather than ending in an ellipsis after a few
  words.
- **`[UIComponentPropertyDefault]`** gives a property a `[UIComponentPropertyBlock]` brings its own default on one type, read
  from a static member of the type — the table, the tree, the key-value list and the bordered regions say their edge this way
  rather than declaring `BorderThickness` again. A name no block brings is `NEUI016`.
- **The caret after the last character of a field with its title inside stands clear of it.** The value is aligned to the
  field's trailing edge, and Chrome drew the caret there over the last character; the field keeps two pixels for it.
- **A collapsible carries content beside its switch** — `SetToggleContent` on `CollapsiblePanelComponent` and
  `MenuComponent`, a `toggle-content` region (`RegionNames.ToggleContent`) that stands in one row with the burger and is seen
  only while the control is open. The switch keeps its edge: the content takes the rest of the row.
- **A menu can carry a search**: `MenuComponent.SetSearch(placeholder)` puts a small underlined search field beside its switch,
  its glyph in the column of the entries' glyphs, and what is
  typed narrows the entries in the browser by the words they show — a group stays, opened, while one of its sub-entries
  matches, a caption while an entry under it does, rules step out; emptied, the menu and its open groups are as they were.
  The demo's sidebar has one. Every typed word has to appear, in any order, with case and accents aside (in the page's
  language); captions inside a group's sub-entries follow the same rule; rows the server adds mid-search are filtered as
  they arrive; folding the menu lets the search go; the arrow down from the field reaches the first entry left, and Tab
  never lands on an entry the search hid. `SetToggleContent` with the author's own content turns the search off.
- **The sides can run the page's full height**: `UIViewOptions.ShellLayout = UIShellLayout.FullHeightSides` puts the
  header and footer between the sides, over and under the content, where by default (`FullWidthBands`) they run the page's
  full width. The demo's sidebar starts at the top of the page.
- **A page on a phone.** `UIViewOptions.SideDrawers`: below the medium breakpoint the sides leave the page's columns and slide
  over the content, each opened by a button the header carries (`ui.side.open`), put away by a press outside, Escape, a link
  taken inside or the screen growing wide again. A component laid out in the flow is never wider than its parent — a card of
  460 pixels is capped at a phone's width rather than cut off — while a scroll container's content keeps its size. The layout
  presets stand their cells one under another where there is no room (`UILayout.Columns` below `md` for two or three, below
  `xl` for four or six; `Split` and `Sidebar` below `xl`), `UIButtons.Pair` and `Toolbar` wrap, a button group too long for its
  room scrolls sideways, a command bar wraps on a narrow screen, and `UIPage.Header` gives its trailing controls a column as
  wide as they are, so the title keeps the rest. The demo's sidebar is a drawer on a phone, and every page was walked at 375
  and 768 pixels.
- **A background command that fails past its own result still answers its tab.** A throwing exception handler or a result the
  sink refused left the tab waiting on the accepted command, its button refused, until the connection dropped; a bare
  failure is now pushed in its place.
- **A search-type text input shows one clear button**, the framework's; the browser's own cross is hidden.
- **Sixteen more `ne-` glyphs** — `Numbers`, `TextFields`, `ToggleOn`, `Abc`, `Visibility`, `StickyNote`, `Hourglass`,
  `FolderOpen`, `Description`, `Save`, `Restart`, `PlusOne`, `Play`, `FastForward`, `Stop`, `Dice` — the marks of the kinds a
  node canvas offers every application, the reset of a node's kept value and a run panel, so they need no icon pack.
- **A badge's figures stand in the middle of its circle.** Chrome rounds a face's ascent and descent to whole pixels before it
  lays a line out, so a 10px count in a 15px circle sat half a pixel to a pixel low; the text is trimmed to its capitals and
  its baseline (`text-box: trim-both cap alphabetic`), and the badge centres the ink itself.
- **A collection bound from the root inside an item template reaches every row.** The server sends it once, with no row key,
  and the client put it into the first row's copy alone: a select whose options are the page's list showed them in its first
  row and *Nothing to show* in every other. It now fills each row's copy, as a scalar bound the same way always reached each.
- **Emptying the last term of a list's query shows every item again.** The rule watcher found the query element by its
  `data-ui-items-query` attribute, which an emptied query takes off, so it never heard the change; and with no authored
  rule and no query left the client returned before un-hiding what the last query had hidden. A data grid kept its rows
  filtered after its only filter was cleared.
- **Every notification of a view is one width**, 360 pixels unless `UIViewOptions.NotificationWidth` says otherwise, and
  never wider than the screen; a toast was as wide as its message, up to 420.
- **A content key may hold slashes, as documented.** `UIContentAddress.AddressOf` escaped the whole key, so a slash became
  `%2F`, which a server does not unescape in a path, and the provider was asked for a key it never issued; each segment is
  now escaped alone.
- **An icon that turns from a picture back into a glyph shows the glyph.** The client tracks the classes it wrote itself,
  so its first write after the page arrived left the server's `ui-icon--image` beside the new glyph's class and the glyph
  stayed hidden; the icon converter's classes are now a family its first write clears.
- **A text input's bound `DebounceMilliseconds` below zero is not written.** The text area and the search field already
  refused a negative value; the text input wrote it into `data-ui-input-debounce`.
- **A number input holds its value to its range the way the date and time inputs do**, through the shared ordered-range
  check, with its messages; the two checks it wrote itself, and the comment saying it held nothing, are gone.
- **A compiled dialog is modal and closes on the backdrop and on Escape by default**, as an authored `UIDialog` is; the
  compiled twin defaulted all three to false and relied on the compiler to copy them.
- **A filtered command's chain is ordered once per command**, not sorted again on every call; the authorization filter
  stays outermost.
- **The action's and the expander's chevron flag goes through the foundation's `RenderFlagClass`**, the helper every
  other renderer uses for a class a boolean toggles.
- **A digit does not start a word in a kebab-case name.** `WebNaming.ToKebabCase` and the client's `toKebabCase` write
  `Chart2D` as `chart2d` (`Column2Span` stays `column2-span`), the rule the docs site already used; the shared corpus pins both.
- **A row that leaves takes its recorded values with it.** The client's property state store kept the last pushed value of
  every row it ever saw until a full resync, and a replaced row kept its predecessor's, so the same value pushed again after
  the replace read as no change; a `Remove`, `Replace` or `Reset` now forgets the rows it takes away — of that one copy of
  the list: a nested list is one component in every outer row, and the same row key in another outer row is left alone.
- **A page that fails while it is rendered shows the error page**, as a failed resolution already did: an exception from the
  controller's start or from reading this reader's values went out as a bare 500. It goes through the same
  `IResolveExceptionViewHandler` to `ErrorRoute`, and is logged.
- **A raw `Bind(property, path)` takes the property's own default mode**, as the generated `Bind*` does: a field's `Value`
  binds two-way unless a mode is named. `mode` is `UIBindingMode?` now, and `UIPropertyDefinition.DefaultBindingMode` carries
  the default the generator used to know alone. Before, the raw call bound one-way, so a template field built on it showed the
  value and never sent an edit back.
- **A command the controller does not declare fails the view's compile**, naming the component, the event and the controller;
  a renamed command used to compile and fail only when someone pressed its button.
- **A binding path is checked for typos from the controller down whatever its scope**: a relative path in an item template is
  walked through the collection's element type and warned about like a root one. A property only a derived item type declares
  is not a typo, and an optional binding is not judged — the default templates bind a whole model contract that way, and the
  default group header's `Group` binding is optional now.
- **The plugin contract has a version.** `ContractVersion` in `plugin/ne-standard-ui.d.ts` and `GlobalApi.contractVersion` at
  run time; a package compiled against one contract refuses to register with a framework client of another, instead of
  working in part. `plugin-api-check.ts` holds the runtime's number to the declaration's.
- **`FlyoutRenderer` on the renderer foundation** draws the markup the flyout engine opens and places — the whole flyout, or
  its anchor and content parts — so a package renderer that wraps a flyout around parts of its own has a contract to call
  instead of the engine's class names. The flyout component draws through it too.
- **The packages bring the namespaces an application writes against as global usings.** Each package ships
  `buildTransitive/<id>.props` naming its own author-facing namespaces — the components, the models, the styling values, the
  controllers, the startup, the presets — and a `.targets` that turns them into `global using` lines, so a view or a
  controller needs no `using` for the framework at all; a screen of the demo carried seven on average and sixteen at most.
  `NEStandardUIImplicitUsings=false` in a project keeps them out. The contracts a package author builds on (`Compiled`,
  `Web.Abstractions`, the renderers' foundation) are not among them.
- **A session holds at most `UIPersistenceOptions.MaxRuntimesPerSession` runtimes** (64 by default): at the limit it gives up its
  longest-idle disconnected runtime for a new page, and is refused only when every one it holds has a page connected — a
  script opening pages under one session no longer makes the server keep a controller per page without end.
- **A session holds at most `UIFileOptions.MaxUploadBytesPerSession` bytes of uploads** (256 MB by default) until the sweep
  removes them; the upload that would cross the limit is refused with 413. `IUIFileStore.GetUploadedBytesAsync` answers what a
  session holds, with a default that answers zero, so a store of an application's own keeps compiling.
- **Metrics and traces under `UIDiagnostics.Name`** (`NE.Standard.UI`): `ne.ui.runtimes`, `ne.ui.runtimes.created`,
  `ne.ui.command.duration` tagged with the route template and the outcome, `ne.ui.flush.duration`, `ne.ui.flush.failures`, and a
  `ui.command` span around each command. The meter comes from the host's `IMeterFactory` when there is one.
- **A log line never carries a session id.** The id is the credential the cookie carries, and the sign-in rotation logged the
  new one at `Information`; every line that named a session now names a short fingerprint of it instead, computed only when the
  line is written. A failed runtime operation's line names the route, the tab and the user.
- **The options the builder copies are copied whole.** `MaxRuntimesPerSession` and `MaxUploadBytesPerSession` were dropped by
  the builder's field-by-field copy on the way in; a test now sets every property of every copied options type and demands it
  back.
- **A `NavigateEffect` goes to a path of this site and nowhere else.** The client followed any route it was handed, and a
  sign-in page that passes its `returnUrl` on — both example applications did, guarded by a leading `/` that `//host` passes —
  was an open redirect; the client now refuses a target that is not a local path, and `UIRoutePath.IsLocal` is the same check
  for a controller to make first. `NE.Standard.UI.Navigation` joins the namespaces the package brings as global usings.
- **A route compiled at `Startup` compiles at startup.** It compiled when the application object was first built, which was
  the first page request, so a view naming a missing command failed its first visitor; `MapStandardUIWebAsync` builds it now.
- **Every size limit answers `413`.** A file past `UIFileOptions.MaxFileSize` was answered `400` while a session past its
  upload limit and a staged value past `WebValueOptions.MaxValueSize` were answered `413`; all three are `413` now.
- **The generators come with the framework.** `NE.Standard.UI` depends on `NE.Standard.UI.Generators` and lets its analyzers
  through to the application, so installing `NE.Standard.UI.Web` and `NE.Standard.UI.Web.Renderers` is enough for a
  controller's `[RecursiveMember]` properties; an application that references the generators itself keeps working.
- **A bound path through an interface finds what its base interfaces declare**, which reflection on the interface alone does
  not show; the path check no longer warns about a model's `Visibility` or `Enabled` declared a level up.
- **A session signed out, or stripped of a role, stays that way.** The refresh of a session's last-seen time from hub
  traffic saved the session as the tab had attached with it, so another tab's next click brought back a signed-out session,
  a revoked role or a replaced theme; it now writes the stored session's time and nothing else, and nothing for a session
  that is gone.
- **A return address with a tab or a line break in it is not a path of this site.** A browser drops both from a URL, so
  `/\t/host` passed `UIRoutePath.IsLocal` and the client's check and then navigated to `//host`; both refuse a control
  character anywhere.
- **A file up to `UIFileOptions.MaxFileSize` uploads.** Kestrel's own request-body limit, 30 MB by default, sat below the
  framework's 32 MB and failed a large upload with an exception instead of the `413`; the upload endpoint raises it to
  what the request may carry.
- **A value batch that fails does not send the writer its own values back**, which could reset a field under the caret;
  the error path filters them as the success path does.
- **The generators load in every .NET 10 compiler.** They were built against Roslyn 5.9, which an older .NET 10 SDK does not
  load (CS9057), leaving every `[RecursiveMember]` and component property unimplemented; they build against 5.0 now.
- **A select redrawn while it was open gives the arrows back.** The engine kept the detached select as the open one and
  took every Up and Down on the page, and the first Escape went to its popup, until the next click.
- **A `DownloadFileEffect` never follows a `javascript:` or `data:` path**; any address a link may carry still downloads.
- **The web package names the SignalR client it bundles** in its third-party notices, with its MIT licence.
- **A clone of the mirror builds its demos with the same usings as here**: `Directory.Build.targets`, which collects them
  from project references, is part of every mirror.
- **The demo is Orvane Cloud's admin panel** — one fictional company's services, screens, people and files across every
  page — and every Examples group shows its source in a flyout.
- The README's licence link names the mirror, so it resolves on nuget.org too.
- **A lost connection offers a reload.** When the reconnect gave up, every later call waited for ever and the reader was
  told nothing; now calls fail at once and a notice with a Reload button stays on the page. An attach asked for while
  another runs is no longer lost.
- **One failing engine, value handler, update or effect is logged and skipped**; a package engine that threw on start
  kept the page from ever connecting.
- **Values reach the server in the order they were given, large ones included, and a command after them.** A value over
  8 KB waited for its POST while a command raised after it went ahead and ran against the old value.
- **A session's staged values are capped** (`WebValueOptions.MaxStagedBytesPerSession`, 64 MB), **and uploads count bytes
  as they arrive**, so parallel requests share the session's allowance; a selection that fails part-way keeps no files.
  **Breaking:** `IUIFileStore.RemoveSelectionAsync`.
- **A runtime is never disposed under a running command**, and the controller is built outside the runtime store's lock,
  which every attach, flush and cleanup waited on.
- **Content and downloads are inert when opened directly**: a restrictive CSP, and HTML, XML and SVG as attachments
  (`WebEndpointOptions.InertContent` to turn it off).
- **The render cache never fails a page or the host**, and defaults to the temp folder rather than the application's.
- **A session no client has used expires after `UISessionOptions.UnclaimedIdleTimeout`** (5 minutes), so crawlers and
  health checks no longer hold two hours of sessions; **a session's files go with it**, on sign-out and on expiry.
  **Breaking:** `IUserSessionStore.CleanupAsync` returns the removed ids and takes `UISessionOptions`;
  `UserSessionState.IsIdle(UISessionOptions, DateTime)`.
- **The packages carry their symbols and sources inside their assemblies**, so a debugger steps into them.
- **A `Background` command no longer blocks its own tab.** The server answers at once and pushes the result when the
  command ends (`UICommandRequest.RequestId`, `UICommandExecutionResult.Accepted`/`RequestId`), so values, list windows
  and other commands — a Cancel — go through while it runs; the button stays pending and its spinner on until the result
  arrives.
- **A command whose connection is lost ends its `OnClickShowingLoading` spinner** instead of leaving it on.
- **A command's failure reaches a registration's `completed` callback**: the client read a `message` the server never
  sends; it reads `error`.
- **An id travels only as a bare number and a property key only as a bare string**; the older `{value}` and `{name}`
  shapes are no longer read.
- **A session's files follow its id through the sign-in rotation**, so a file picked before signing in stays the
  reader's. **Breaking:** `IUIFileStore.MoveSessionAsync`.
- **An error page shown in place of a failed page attaches as itself.** The runtime attached to the address, so it built
  the failing controller again, found another compile and reloaded, then gave up with an error in the console. A page
  standing in for the one asked for (sign-in, not-found, error) now carries the navigation it was rendered for, route and
  parameters, on the shell's root (`data-ui-navigation`), and the runtime attaches to that — so a sign-in shown at a
  protected address still knows where to go back.
- **The demo's breadcrumbs page opens every time**: its steps were one shared set, which the second page to build them
  could not own.
- **A refusal is no longer logged as a failure.** Every anonymous visit to a protected page, and every command a
  session's rules refuse, wrote an error with its stack trace; both are now one debug line, since the reader was answered.
  A refusal the error handling cannot answer, and every real failure, is still an error.
- **Escape closes the popup opened inside another first**: a select's list, a picker or a menu open in a flyout closed
  the whole flyout and stayed open behind it; it now goes first, and the flyout with the next Escape.
- **Escape during a drag cancels the drag.** In a colour picker it closed the picker instead and the release sent a colour
  read off the hidden square.
- **A tooltip taken over by another control stops describing the first one to a screen reader**; it kept pointing at the
  page's one tooltip, whatever it said next.
- **A tree inside a list's or a table's row keeps its arrows**; the list around it took them.
- **Escape in a rename field or a key-value row being edited inside a dialog cancels the edit** and leaves the dialog open;
  the dialog closed first, and the rename was saved as its field lost focus.
- **`new UIColorPalette()` is the standard dark palette.** Its own defaults were a third palette, close to the dark one but
  not it (a warning's ink, the borders, the selection and focus colours); they now are exactly what `UIThemeDefaults.DarkPalette`
  was, and `DarkPalette` is `new()`. The shipped dark theme is unchanged.
- **A colour with both a role and an explicit colour travels as the explicit one**, as it renders: `UIThemeColor.ToCanonical`
  gave the role, so a colour input round-tripped `UIThemeColor.Primary with { Light = …, Dark = … }` back to the role.
- **A view with a placement, a size, a padding or a border that cannot hold is refused when it is built**: a `Placement` at
  column or row 0 or with a span of 0, a negative `Width`/`Height` (or their `Min`/`Max`) on a component or a dialog, and a
  negative side of a `Padding` or a `BorderThickness`, at any breakpoint, now throw naming the component, where the browser
  silently dropped them. A negative `Margin` is still let through — it is legitimate CSS.
- **A text sent for a fractional number is read without a group separator**: `"1,5"` for a `double`, `float` or `decimal`
  property is refused rather than read as fifteen.
- **Generators**: `GenerateBinder` follows `IsBindable` when it is not set, so `[UIComponentProperty(IsBindable = false)]` is
  enough (NEUI005 only for an explicit `GenerateBinder = true`); an init-only `[UIComponentProperty]` reports NEUI007 instead of
  generating a setter that does not compile; a carried attribute's type argument is written as `typeof(...)` and a negative enum
  default no member names as `(E)(-1)`; the generated `Set*`, `Bind*` and `*Property` members carry a summary.
- **Breaking:** `RecursivePath`'s `(PathSegment[], bool ownsArray)` constructor is internal — a caller keeping the array could
  change a path already used as a key; the `IEnumerable<PathSegment>` constructor stays.
- **A large value staged beside the hub no longer reserves memory before it arrives.** The value endpoint sized its buffer from
  the declared `Content-Length`, up to `MaxValueSize`, before a byte was counted, so slow requests could hold memory neither
  `MaxStagedBytesPerSession` nor `MaxStagedBytesTotal` saw; the buffer now starts at no more than 64 KB and grows as counted
  bytes arrive.
- **An asset whose precompression fails is served as it is.** The failure was kept and every later request for that asset
  answered 500 until its version changed; it is now logged once and the asset built again on its next request.
- **An upload refused part-way no longer counts against `MaxUploadBytesTotal`.** Its files are taken back out of the store,
  but the bytes of those saved before the refusal stayed counted for the whole retention, so one session could fill the
  process-wide limit with selections that each failed on their last file; a selection's bytes now count once it is kept.
- **A `Batch` runtime's answer to one tab no longer takes every tab's queued updates with it.** A command, a window read or a
  posted action that re-read a windowed list drained the whole queue into one answer: under `PerClient` the other tabs never saw
  a command's changes, a `Post` that changed a windowed host's filter reached no tab at all, and a window read could hand a tab
  back the value it had just typed. An answer now carries its caller's own copy and the flush sends the rest to every other tab;
  under `Direct`, a format refusal goes only to the tab that typed the value, and once.
- **A page load no longer writes back a role, a sign-in state or a language another request changed while it read the
  session**: with the stock resolver the write takes the store's identity and preferences, the claims source's principal aside.
- **A `Parent`-scoped `BindContext` on an item template's root reads the enclosing item**, as a `Parent`-scoped binding on the
  same component does; it read the level above that.
- **The default error page shows the latest failure's message**; a second failure in the same tab within the runtime's
  retention showed the first one's.
- **The default file store keeps each application's files apart.** With no `StorageRoot` it wrote under one shared
  `%TEMP%/ne.standard.ui.files`, and its sweep of files no entry claims deleted another application's uploads there; the
  default is now the application's own `ne.standard.ui.files/<entry assembly>-<hash of its base directory>`, derived as the
  render cache's folder is. Files a process left in the old shared folder are no longer swept.
- **Breaking:** `MinMaxInputComponentBase.ValidateOrderedRange` is gone; a derived input calls `OrderedRange.Validate`, which it
  only forwarded to.
- **Microsoft.Extensions dependencies at 10.0.12.** `NE.Standard.UI` requires `Microsoft.Extensions.DependencyInjection`
  and `Logging` 10.0.12, and `NE.Standard.UI.Shell` requires `Logging.Abstractions` 10.0.12, up from 10.0.11.
- **The demo's screens check on the server what their forms and buttons check in the browser** — Approve and Reject, a
  catalogue order, checkout, sign-up, subscribe, deleting a release — since a browser rule is feedback, not the rule; a pushed
  progress dialog is hidden even when the work fails; the sign-in page follows a new `returnUrl` when a kept page is opened
  again. Sample lists the pages shared are one `DemoSamples` class.
- **TeamRoom**: an administrator cannot reset their own password from the accounts page (it ended their own session); a reset
  lifts the sign-in throttle on that login; files stored for a message that was never sent are deleted rather than counted
  against the quota; a blocked account's session is ended through the framework, uploads and other tabs included; a new
  account's name keeps the rule a rename keeps; two folder moves at once cannot form a cycle.
- **Benchmarks**: the flush-selection and runtime-lookup benchmarks give each tab its own session, so their 100- and
  1000-runtime cases no longer fail at the per-session cap; the lookup times a real hit; setups are awaited.
- **The documentation site**: an extension setter (`SetMaxLength`, `SetDebounceMilliseconds`, `SetMaxFileSize`) stands in its
  property's row, signatures keep `?` on a nullable reference, every generic arity mark is stripped from a cross-reference,
  and a package site links no theming guide it lacks.

## 1.0.0-rc.3

The third candidate: what building the data grid, the charts and the graph asked of the core — the plugin surface
opened, a table that scrolls sideways with columns pinned, hidden and rearranged, a tree that filters — what a page
costs to serve, and values that do not fit on the hub, with editors that keep their edits until they are saved
(`docs/VALUES.md`).

### Values and the wire

- **A value over 8 KB no longer closes the connection.** It is posted beside the hub to `/_ne/values`, parsed with the
  hub's own options and staged for the session, and the hub update carries its token; a 105 KB text used to end the
  connection with *The maximum message size of 32768B was exceeded*. `WebValueOptions` sets the largest value (16 MB)
  and how long a staged one waits. The other way too: a large value the server sends is staged under a token the
  client fetches before it applies the change set, in order.
- **A client that writes a value is not sent it back.** The update the write produces is withheld from the tab that
  wrote it when the controller holds exactly what it sent, and every other tab still receives it. A setter that
  changes the value, or a later write, still reaches the writer. `IUIRuntime.ProcessChangeSetFromUIAsync` takes the
  invoking handle.
- **An `OnSubmit` field keeps its edit.** It is held from its first keystroke, and a value the server pushes meanwhile
  is not written into it. `DiscardFormEffect(formId)` lets a command that replaces the value win, and a package's event
  submits its field's form with `registerEvent(name, { submitsForm: true })`; one that knows its own unsaved work calls
  `values.hold` and `values.release`.
- **An ordering comparison orders two texts as text.** `Greater`, `Less` and their `OrEqual` forms compared numbers alone,
  so a filter on a date — ISO text on both sides — matched nothing. Two values neither of which reads as a number now
  order ordinally, on the client and in `UIComparisonEvaluator` alike, where a `DateTime` reads as the text the wire
  writes for it; a number against a non-number is still false.
- **A value a client sent is the property's latest.** The runtime records it as the property's state, so a later push of
  the value the server held before still reaches the component rather than being taken for no change.

### Components

- **A split button says what it is called.** One with an icon and no title is named by its tooltip, as a button is, and a
  menu button that carries a title is called by it rather than by "More".
- **A date picker stays open until it is told it is finished**, as a date and time one does: choosing a day writes the value, and
  Done or a press outside closes the popup. The wheel over a clock column turns one reading a notch, stepping over the readings
  `Min`/`Max` rule out.
- **Enter in a search chooses the option the arrows marked**, in a key-value row and a grid cell too; a split button's label follows
  `TextAlignment` and reads from its start beside a description, as a button's does.
- **Components scroll together.** `ScrollGroup` names a group on any component, and every member scrolls with the one
  the reader scrolls, on the client alone. Components that mark the source lines they show are kept line against line
  (`data-ui-scroll-lines`, `data-ui-source-line`), the rest by the share scrolled; a package names the element it
  scrolls with `data-ui-scroll-viewport`.
- **The framework's scrollbar is one bar everywhere, and it is the framework's.** Naming `scrollbar-color`
  switches an engine to the standard scrollbar and makes it ignore `::-webkit-scrollbar` outright, so the rounded
  12px thumb the stylesheet described was never drawn: every bar on the page was the platform's own, arrow
  buttons and all, merely tinted. `scrollbar-width: thin` says it in the language the engine is listening to, the
  pseudo-elements moved behind `@supports` for an engine that has neither, and the shell's own scrolling regions
  are covered along with everything else.
- **`Muted` no longer mutes the muted.** It was a fraction of `currentColor`, so inside a region already painted
  muted it compounded to 46% — a key-value row's key at 2.75:1, under the 4.5:1 line — and over an accent it
  faded the accent itself to 3.01:1. It now measures from the ground the element sits on (`--ui-faint-base`),
  which a filled surface sets to its own ink; muting twice lands where muting once does, at 6.3:1.
- **Chrome that draws no words says what it is.** The theme switcher, a collapse toggle, a colour swatch and
  chip, a picker's toggle and a file field's pick button carry an `aria-label` from `UIStrings`, as the rest of
  the chrome already did. A screen reader had nothing to announce for 630 controls across the demo's pages.
- **`ButtonComponent.OnClickWithLoading` is `OnClickShowingLoading`.** `With` names an argument the command
  receives everywhere else in this API (`OnItemClickWithItem`), and nothing is passed here.
- **The core's glyphs are one set at one scale.** They were already drawn in CSS so a host need install no icon
  pack, but split across two files and sized at each call site: one chevron was written seven ways, four of them
  in `em`, so the same wedge came out 7.7px in a number input's stepper and 12px in a menu — and a mask on a
  fraction of a pixel puts every edge between device pixels, which is why the stepper's two arrows did not match
  each other. One file now holds the set and one rem scale sizes it (`@ui-glyph-xs/sm/md/lg`, 8/10/12/16px), so
  every mark lands on whole pixels.
- **A field being edited says it is wrong with its edge, not with a dot.** The mark at a field's corner sat on
  top of whatever the control keeps there — a stepper's arrows, a picker's toggle — and read as part of it. The
  edge already wears the severity's colour and the whole control speaks the message in a tooltip, so the dot is
  left to the value's own line, where it is the only thing saying a closed row has something to answer.
- **A clear button clears a field nobody binds.** A filter box whose only reader was a rule on a list kept its text
  when its clear was pressed; the affordance now falls back to the field's own control.
- **A tooltip's arrow points at a small mark.** Over a validation dot the arrow stopped an inset short of the dot; the
  tooltip now moves so the arrow reaches the centre. A period's calendar toggle stands at the field's end, as on a
  single-moment field.
- **Chrome is never selectable.** A button's label, a tab's caption, a menu entry, a table header, a select's option and
  a breadcrumb no longer select on a press or a drag, even where the text inside them is `Selectable`; a loading button
  no longer flashes its ripple behind the label; a picture input's placeholder is an outlined frame. The button group
  is listed under Actions.
- **A loading button without an icon dims its label**, in place of a veil that Chrome painted behind the words rather
  than over them; a button label with a description reads from its start beside its icon; a dragged tab stays where
  it is dropped; `ImageInputComponent.MaxFileSize` refuses an oversized picture before it is uploaded.
- **A tree filters and sorts.** `FilterBy` on a tree keeps a matching node with its ancestors and holds those folders
  open while the box holds a word; `SortBy` orders every folder's children alike. The viewer's fold is painted by the
  boot script before the first frame. A menu bound inside a node — the entries travelling with the node — gets its
  rows: a composite's typed variant is now worn by the item's own kind (`DeclareCompositeSlot`), which also mends a
  collection bound inside a key-value list's typed editor.
- A table scrolls sideways as a whole: with `HorizontalScroll` on, the root is the scroller of both axes, the header sticks
  to its top, and the host names the root as its viewport (`data-ui-host-viewport`) for the window and virtualization
  engines, which read the scroll through it. A column may be pinned (`UITableColumn.Pinned`, `pinned:` on `AddColumn` and
  `AddTextColumn`; leading columns only): sticky at the sum of the pinned widths before it, which the columns engine keeps
  in `--ui-table-pin-N` on the root through every resize, on an opaque ground with the row's wash over it; the last pinned
  column draws the edge the rest scroll under, with a shadow once they have (`data-ui-table-scrolled`).
- A popup declares its own ground (`--ui-surface-fill` on `.ui-popup-surface()`), so a field inside one — a colour picker's
  hex and RGB boxes, a temporal picker's segments, a package's fields in a flyout — steps off the popup rather than off the
  page behind it. `TableComponent.AddColumn(UITableColumn, IVisualComponent)` is virtual: every verb that adds a column
  ends there, so a derived table hears about all of them.
- A column hides below a viewport tier — `HideColumnBelow(key, UIResponsiveTier.Md)`, `UITableColumn.HideBelow` — and a
  viewer may hide or show one through the columns engine, now on the plugin surface as `tables` (`isColumnHidden`,
  `setColumnHidden`). A hidden column keeps its track at zero, so every index stays true; the root lists the hidden
  indices (`data-ui-table-hidden`) and the stylesheet puts their cells out of sight. The viewer's choices are kept in the
  browser beside the widths, painted before the first frame with them; stored widths for a different column count are
  forgotten. `UIResponsiveTier` names the tiers of `UIResponsive<T>` on their own.
- **Regions, tab stops and two half pixels.** A flyout's content and a tab's page lay their content out on the
  twenty-four columns like a card does; every items host is a tab stop whatever its selection mode; a badge with an
  icon no longer ends on a half pixel, and an items host holding only its empty state no longer scrolls by one.
- **`UITextWrapMode.WrapEllipsis` is gone** (breaking). It was `Wrap` with `MaxLines` defaulting to two; `MaxLines`
  clamps a wrapping paragraph on its own, an ellipsis on the last line it keeps, so a clamped paragraph is now
  `SetMaxLines(n)` with the default wrap mode. The `ui-text--wrap-ellipsis` class and the `wrap-ellipsis` token went
  with it.
- **An icon-only button is named by its tooltip.** A button-shaped control with an icon and no title now carries its
  `Tooltip` as `aria-label`; a titled one keeps its title as the name. Nothing is invented: a control with neither
  stays as it was.
- **Several fields can send their words to one place.** `ValidationInto` targets collect a line per field: a field put
  right takes only its own line away, and a paragraph shows the lines one under the other. Two fixes came with it: a
  patch to an unbound property no longer lands on the component's root (the element holding a validation target is
  marked `data-ui-into-<property>`), and a paragraph's author-written newline now breaks the line as documented.
- **A grid splitter placed wrong fails the view's compilation.** A star track (it would share the room it divides),
  the container's first or last track (nothing to move on one side) or a row the container never defined is refused
  with the splitter and the container named, instead of a warning in the browser's console. Two authoring interfaces
  carry what the compiler reads: `IGridTracksComponent` (a container's `Columns`/`Rows`) and `IGridSplitterComponent`
  (`Orientation`).
- **A cancelled picture is gone.** A key-value row closing tells what is inside it that the draft is dropped
  (`ui-draft-dropped`); the picture input lets its preview go, shows the controller's picture again and hands the
  controller an empty handle, so the next save cannot take the picture that was cancelled.
- **A button stays down.** `Pressed` on a button, two-way, makes it a toggle: `aria-pressed`, flipped by a press and sent
  back, worn with the selected ground. Unset, it is an ordinary button.
- **Every input takes a `Size`, and a field its caption inside.** `UIInputSize` (`Small`, `Medium`, `Large`) is on every
  input, a toggle's box and a slider's handle stepped with it; `TitlePlacement` puts a field's caption at the leading edge
  of its own box (`UIInputTitlePlacement.Inside`); a select opens where `PopupPlacement` says. The image input is a field
  like the others — the same appearances, the same hover, the caption inside.
- **A dialog's panel is placed with a component's words**: `Width` to `MaxHeight`, the two alignments and `Margin`, per
  tier, with `Placement` kept as the shortcut for a sheet; a centred dialog on a phone is the screen less a thin margin.
- **A viewer arranges a table's columns by dragging a caption** (`ReorderableColumns`), kept in the browser beside the
  widths. A column's width is a floor and a share, so the columns fill the table and a hidden one's room goes to the rest,
  and a sortable column sorted neither way wears a mark of its own.
- **`BadgeComponent.Style` is `Type`** (breaking), as a button's is, and `OnItemClickWith` is on every items component
  templated on a button — `CommandBar`, `Breadcrumbs`, `ButtonGroup`.
- A ghost field's focus is the wash a ghost button answers with rather than a ring, and a box field's ring is its outline,
  inside the border. A circular progress centres in the width it is stretched to; a radio's dot stands before its text and
  its read-only state is live; pinned tabs stay the strip's head.

### Runtime, hosting and compilation

- **A windowed host's read and a value update allocate far less.** A lookup by controller path no longer builds a path
  template each time — one is kept per path shape — and a window read asks once per change whether collections are bound
  under its rows, reads each row one segment below its collection (`RecursiveObservable.TryGetRecursiveValue(PathSegment)`)
  and shares one visited set across a range. A hundred-row read went from 186 KB to 45 KB, a batch value update from
  2.2 KB to 1.0 KB.
- **Two renders of one page landing together no longer fail the second.** On Windows the render cache's replace of a file a
  reader still holds is refused while the replaced one is pending its delete; the cache now counts that as written — the first
  render is the same render — instead of answering the request with an error.
- **A page costs less to serve.** The render cache holds its entries in memory as well as on disk, so a page
  load no longer reads the whole cached shape off the file system only to drop it: a page with no controller is
  about twice as fast, one with a controller about 15% faster. A property's DOM operations reach the metadata as
  a span, so the collection expression every renderer writes stays on the stack rather than allocating an array
  per property per component. Measured on the demo in Release: a static route went from 2 050 to 3 475 requests
  a second, `/inputs/text-input` from 239 to 275 at eight threads.
- **A runtime the render built for a client that never arrives is dropped in half a minute**, not in ten
  (`UIPersistenceOptions.UnclaimedRenderRetention`). A page render reads its values off a runtime of its own and
  hands it to the attach that follows; one nothing claimed — a crawler, a health check, a tab closed before it
  connected — used to be kept as long as a real client's, at a controller's worth of memory each. A thousand such
  renders held about 700 MB for ten minutes.
- **The scheduler's tasks no longer queue behind one another.** The flush runs every 50 ms and the session, file
  and runtime sweeps run over whole stores, and waiting for them in turn made a slow sweep delay the flush for
  every session in the process. A task still running when its turn comes round is skipped rather than run twice.
- **Two options the builder quietly dropped are carried again**: `MaxParallelFlushes` and `ErrorPageMessage` were
  missing from the copy the application is built with, so setting either did nothing. Every option of all five
  option objects is now driven through a real build and read back by a test.
- **A bound path that names nothing is a compile warning.** The compiler already walked the controller's types;
  when the walk stops on a property no type on the way has, it says so instead of leaving the author a component
  that silently keeps what it was authored with. Only a path written from the controller root is judged — a
  default template binds a whole model contract relative to an item, and an item carrying part of it is normal.
- **The client's console is quiet.** It wrote three debug lines on every page load with no way to turn them off;
  it now says nothing below a warning, and `window.NEStandardUI.setLogLevel("debug")` turns it back on for as
  long as the browser keeps the setting. On the server, rendering a route and a runtime's comings and goings
  moved from Information to Debug: they are diagnostics, and the host already logs the request.
- **Work that takes a while can say so while it works.** A client effect used to travel only as a command's answer, so a
  long command — a network of nodes running one at a time, an import — said everything it had to say at the end.
  `UIContext.SendEffectsAsync(effects)` pushes effects to the connection outside any answer: they are resolved against the
  runtime exactly as a command's own are and sent through the update sink, which works whatever a route's update mode is.
- **Hydration waits for the page's package modules**, and a package's engines start after it; a component that takes its
  collection as values is refilled on attach; every built-in template binding is optional, so a row lacking a path is
  drawn without a warning.
- A dispatcher's queue leaves with its drain and the host disposes it, a direct runtime drains its item windows and wakes
  on a resync, a failed attach fails fast, and a cleanup pass skips a runtime whose command is still running.

### The plugin surface

- **The core's own marks are the `ne-` icon pack.** `UIGlyphs` names every one, a renderer draws it through
  `IconValueRenderer.RenderIcon` and the browser through `icons.apply`, with no icon pack installed — what a package's
  chrome is drawn with.
- **The contract has a Less half.** `Client/plugin/ne-standard-ui.less` — the tokens and the mixins (glyphs, motion,
  elevation, responsive, placement, focus, popup, field, selected, text, arc) — is generated on every build and copied
  into a package byte for byte, like `ne-standard-ui.d.ts`; a test refuses a copy that differs.
- **The engine context grew.** `icons`; `values` — a value read as the framework reads it, off the element a composed
  control marks (`data-ui-value-holder`), and `hold`/`release` for an editor's unsaved work; `badges.writeCount`;
  `properties.set` on a core component a package's renderer exposed (`RenderRegion`); `rows` — the item a row stands for,
  `readPath`, a template variant drawn when it is wanted; `selection`; `popups`; `roving`; `renames`; `dom.ensureId`;
  `temporal.parse`/`toDate`.
- On the server, for a package's renderer: `ReadRenderValue`, `ResolveCulture`, `ResolveItems`, `RenderTemplateVariant`,
  `RenderContextMenuRegion` for a further, named right-click menu, `ThemeColorRenderer.SeriesColorCss`,
  `WebPackageClient.AddPackageClient`, `WebPackageRegistration.GetOrAdd`, `UIChoice`/`UIChoices` and `UINaming.Humanize`;
  an effect aimed at one component derives `TargetedClientEffect`.
- `dom.insertText` is gone from the plugin surface: nothing called it. `window.NEStandardUI` loses the `add*` twins of its
  `register*` methods, which the contract never declared and nothing called.
- **A component that takes its collection as values hears a change to one of its items.** A chart's points and a
  canvas's nodes reach the browser through the collection sink rather than as rows, and a change to a property of one
  item used to go only to the components inside an item template — of which such a component has none, so the value
  never arrived. A component says so with `IItemValuesComponent.TakesItemValues`, and every change to one of its items
  is sent as a replace of that item.
- **A package can show the page's tooltip with words of its own.** A component that draws its own picture has an element
  per point but wants to speak about an x — a chart naming every series at the hour under the pointer. The plugin surface
  gained `tooltips.show(target, words)` and `hide()`, and a tooltip keeps the lines the words were written with, so there
  is still one tooltip on the page rather than a package's own beside it.
- **A command can read a key the event itself named.** A component that draws its own picture raises its own events, and
  what one means may be more than one key — the point pressed in a chart and the series it belongs to. The client could
  already name those keys; a command now reads them by their place in the chain with
  `UIAction.ArgEventKey(name, index)`, beside the item-scope arguments it already had.
- **A package hears what became of the command its event raised.** `completed` on a registered event is told whether a
  command ran at all, whether it answered successfully and what it said — so a component that sends a value can wait for it
  to land rather than assume it did. The node canvas marked a sheet saved the moment it sent it; now a failed save leaves
  the canvas unsaved, which is what the viewer needs to know.
- **The plugin surface: a package may send a file.** `uploads` on `PluginEngineContext` hands a package's engine the
  framework's own multipart POST and answers with the selection id a controller reads the file back by
  (`IUIUploadService.GetSelectionAsync`). It is the one thing the node canvas asked the surface for: without it a package
  would copy the endpoint's path and its answer's shape, and the copy would drift from the original on the first change.
- **The plugin surface, opened a little further for the data grid.** A package's engine gets `temporal` beside
  `numbers` — the temporal formatter and the culture pack off `data-ui-temporal-culture`, which
  `TemporalCultureRenderer` writes once on a root; the table's `AddColumn` and `AddTextColumn` are virtual and its
  header cell renders through `RenderHeaderCellContent`, `RenderCaption` and `RenderResizer`; a table that says
  `PublishItemValues` hands the client its static rows' values with no rule to read them. Two things found on the
  way: a client-built row warned once per row for every ability binding its item lacked (once per binding now), and a
  table row with a two-line cell in it overflowed its one-line height (`grid-auto-rows: max-content` on the host). For
  the grid's editor: a composite slot's wrapper carries attributes on both sides (`WrapperAttributes`), and an element
  inside a row may keep a double click for itself (`data-ui-no-row-open`); a derived table may put a column back with
  more said about it (`ReplaceColumn`). And a defect the grid's filter row exposed: the client took a component's items
  host as the first one under its root, so a component with another items component before its host — a select in a
  grid's filter band — registered no row values and answered no client rule; it takes its own host now, and a DOM
  operation's named target is the component's own part the same way. For the grid's pager: a windowed host marked
  `data-ui-window-paged` is read by a pager, never by its scroll, and a package asks for a window by offset through
  `windows` on its engine context; the table's `ConfigureHost` hook writes on the host. For the grid's footer: a window
  may carry `Aggregates` — what the source computed over every item its query leaves, by property — kept on the source
  and bound by the compiler to the host's `WindowAggregates`, carried as `data-ui-window-aggregates`.
- A composite row — every table row — went through no row decorator at all; it does now, so what a renderer puts beside a
  server-rendered row reaches a row the client builds.

### Presets and the demo

- **The demo's two overlay pages are at their own address.** `/overlays/dialog` and `/overlays/notification`
  answered 404; a component's first page is its own route now, whichever kind it is.
- **`NE.Standard.UI.Extensions` is no longer empty.** Presets over the components — a text in a role, a page's header
  band, section and card, a stack, a row, equal columns, a main part with a side part, a button per type, the pair at
  a form's foot, a field with a hint, a read-only details list — and the three rules a component is shown, hidden or
  enabled by from another component's value (`ShownWhen`, `HiddenWhen`, `EnabledWhen`). Nothing in it is a component:
  no renderer, no stylesheet, a server-only package.
- **The demo has six screens.** Pieces of an application rather than of a component, first in the sidebar: a
  sign-up, a checkout, workspace settings, a catalogue narrowed in the browser by four rules and three sorts, an inbox
  and an article — written on the presets, and the component pages point at them.
- **The security screens are back.** The Screens section gained the sign-in page, an account page behind
  `[UIAuthorize]` with a permission-gated command, an admin console behind a role, and the forbidden page, with an
  `[AuditCommand]` filter writing the trail both pages show.

## 1.0.0-rc.2

The second candidate: four passes by the owner over the first one, then a read back over everything they
touched. No new component and no new concept — what changed is how the ones already here behave under a real
pointer and a real keyboard.

- **Rows are chosen the way a file manager's are.** A plain press takes one row, Ctrl adds or removes one,
  Shift takes the range from the anchor — from the row the cursor stood on when no press has set one, so a
  list reached with Tab extends properly. Enter opens the row the cursor is on and leaves a chosen group
  standing, which is the group Delete reads. A press on a row hands the focus to its host, so the arrows carry
  on from there, and the keyboard's row is washed only while that host holds the focus.
- **A tab may be pinned** (`TabItem.Pinned`): it wears a pin in place of its close, and a drag leaves it where
  it is. A tree drags every chosen node with the one under the pointer, but never one folded out of sight.
- **A message a controller puts on an input is a mark inside a grid.** In a table's cell or a key-value row a
  line under the field would grow the whole row, so the message becomes a dot at the field's corner that speaks
  in a tooltip — including one that arrives already rendered, which used to stay a line until the next patch.
  `ValidationPresentation` asks for one or the other anywhere. A field's own tooltip is no longer lost when
  such a mark clears.
- **A key-value list edits in place.** The pencil opens the row, the editor is a filled box set back so its
  text starts where the value's did, and a typed input per row (`InputTemplate`) means the draft comes back as
  the input sent it. The pages moved under Items, where rows of a collection belong.
- **A field of a box kind draws its focus ring over its own content**, so an editor with a gutter of its own no
  longer shows the ring broken along that edge.
- **A field says what a browser may fill into it** (`TextInputComponent.Autocomplete`, `UIAutocomplete`), and a
  password field is no longer wrapped in a form of its own. That wrapper silenced a console warning and cost
  more than it was worth: a password manager saw a form with a password and no name in it and remembered the
  password with no login against it.
- **`WrapPanel` flows its children** (`UIItemsLayoutType.Wrap` on an items view), a slider's readings follow a
  pushed value, a file field opens on any press and lets go of its drop mark when the drag leaves the window,
  an image input keeps its shelf, and `PressRipple` is on by default.
- **A tab's page fills the room the strip leaves it**, so an editor in a tab reaches the bottom of its pane
  instead of stopping at a row count; a page with more content than that still grows.
- **A file a field cannot take is refused while it is still in the air**: the drop mark goes to the colour of a
  refusal and the browser draws its "no drop" cursor, where the field's rule is written in types rather than in
  file extensions, which a drag does not carry.
- **The documentation site reads like one.** Every page can be filtered from the sidebar, which opens on the
  page you are on; a property has an anchor of its own; a phone gets the navigation behind a button instead of
  in front of the content, and a property table scrolls inside its own box; the footer names the release the
  site was built from. The colour vocabulary is written down in the theming guide, and the reference links to
  `NE.Colors` for what each name is.

## 1.0.0-rc.1

The release candidate. The framework, the icon sets and the code input go out on one number from here, so
what a project installs is one decision rather than three.

- **The client's tests run from the project file, not from `npm run build`.** Nine of them read the parity
  corpora shared with the .NET tests, and those live under `eng/`, which is not part of a published tree — so
  `dotnet build` on a clone of this repository failed on nine missing files before it reached the bundle. The
  tests now run the way the .NET tests do, where the sources sit next to them; `npm run build` type-checks
  and bundles, and a clone builds.

## 1.0.0-preview.2

The second preview. Twelve more built-in components, one vocabulary across every host that shows rows, the
framework's own chrome translatable, and a client surface a component package can plug into — the first of
those, [`NE.Standard.UI.CodeInput`](https://github.com/AkiEvansDev/NE.Standard.UI.CodeInput), releases
alongside this one.

- **Twelve new components.** `Table` (columns as templates over the author's own rows, widths the viewer
  drags and an order the viewer arranges), `Tree` (a flat keyed list folded on the client, a template per node kind, children asked for once
  per unfold), `SplitButton`, `ButtonGroup`, `GridSplitter`, `ImageInput`, `ColorInput`, `Paragraph`,
  `Surface`, `Accordion`, `CollapsiblePanel` and `ThemeSwitcher`.
- **The plugin surface, opened for the next packages.** A component may take its bound collection as values
  through a client sink; a two-way value may be an object; a component registers its own dialogs; every items
  component has a viewer's `Query` beside its authored rules; the table's renderer and column are open to
  derive from; a series palette, tooltips on SVG shapes, and a number culture pack the client formats by.
- **Every host that shows rows speaks one vocabulary.** A host has one mode — plain, virtualized or windowed
  — and a virtualized one draws only the rows in view; the items view, the table and the tree share a keyboard
  row cursor; and what may be done to a row is the row's own bound property (`CanSelect`, `CanDrag`,
  `CanRemove`, `CanRename`, `CanShowContextMenu`), so a list can refuse one row what it allows the next.
- **A period on the temporal inputs.** A second field and `EndValue` beside `Value`, both ends chosen on one
  calendar, an end before the start swapping with it.
- **A sentence can fold.** `[caption]{text}` in the inline markup keeps its caption in the line and opens the
  text below it; a paragraph can set its description off with a quote line.
- **The framework's own words are translation keys.** Everything the library's chrome writes for itself is a
  `UIStrings` key with an English floor, translated through the application's own source; the client's share
  travels in the page. A new control's chrome word is a constant, never a literal.
- **New effects**: a copy to the clipboard, a collapse, a theme switch, and the tab and tree renames.
- **Validation has three severities** and a message the controller can write.
- **The application serves its own content.** `IUIContentProvider` answers by key, so a picture or a file a
  view shows comes from the application rather than from a URL it had to publish; the upload endpoint honours
  the default policy, and `IUIAuthorizationService` is the seam an application implements to answer for a
  view.
- **Sessions outlast the window.** The session cookie may carry a lifetime and it slides; an application's own
  endpoint can read the session behind the request.
- **Assets are cached by version**, and the version is a hash of the asset's content rather than a number that
  changes with the process.
- **A package brings its own client engine and words.** `window.NEStandardUI.registerEngine(start)` starts a
  package's engine after the built-in ones, with what a built-in engine gets plus the page's words and
  `observeComponents`; an `IUIStringsSource` registered as a service adds the words a package's chrome writes
  to the translator's English floor and to the page's `data-ui-strings` block, so an application translates
  them exactly as it translates the framework's own.
- **A field that is a box takes the chrome by class.** `ui-field-box` — `TextContentRendererBase.FieldBoxClassName` —
  gives a renderer outside the framework's stylesheet the field ground, the four appearances and the states,
  and `--ui-field-fill` says what the field paints at the moment; the text area wears it too.
- **A DOM operation may be a package's own.** `WebDomOperation.Kind` is the kind's name, and
  `WebDomOperation.Custom(kind, …)` names one the package's client registered through `registerDomOperation`.
- **The client's plugin contract is a file.** `Client/plugin/ne-standard-ui.d.ts` declares what a package's
  client may reach; a package keeps a copy, and the build refuses a copy that drifted.
- **The reference is generated now.** [akievansdev.github.io/NE.Standard](https://akievansdev.github.io/NE.Standard)
  carries a page per built-in component, read off the compiled components and their XML summaries, beside the
  hand-written guides.
- **What moved, and will keep moving while this is a preview:** the default not-found and error views ship
  from the core and `IUIDefaultErrorPagesProvider` is gone; a tab's `Closable` and `Reorderable` folded into
  the shared `CanRemove` and `Draggable`; virtualization is a host mode rather than
  `IVirtualizedItemsComponent`; `ItemContext` and the dynamic-parameter scope moved into
  `NE.Standard.UI.Compiled`; `UIApplication` is built in the host's own container.

### Review before the freeze

A final pass before the Web/framework freeze: nine independent read-only reviews, deduplicated and worked off
in one session.

**Breaking renames and removals:**

- The authoring foundation is a package of its own: `NE.Standard.UI.Components.Foundation` (the component
  bases, the template bindings, the input extension methods) under `NE.Standard.UI.Components`, and
  `NE.Standard.UI.Web.Renderers.Foundation` (`WebComponentRendererBase` and the shared helpers) under
  `NE.Standard.UI.Web.Renderers`. `.Required()`/`.OnChange()` and the other input extensions now live in
  `NE.Standard.UI.Components.Foundation.Inputs`, and `RowItemsComponentBase` takes the row template's type as a
  third parameter. A component package references the two foundations only.
- `UIViewBase` and `IUIViewDefinition` are both `NE.Standard.UI.Authoring.Views` now (from
  `NE.Standard.UI.Components.Views` and `NE.Standard.UI.Views`): one `using` per view file instead of two.
- `TabsView.OnItemClose` → `OnItemRemove` (the event `close` → `remove`; `ITabItemComponent.OnClose` →
  `OnRemove`), matching the verb `CanRemove`/`Removable` already use and Tree/Table raise.
- `TabItemComponent.RenamedCaption` → `RenamedTitle`, the tree's name for the same write-back.
- `ICollapsibleComponent.Collapsed` → `Expanded` (default `true`), the polarity `Expander`/`TreeNode` already
  use; the DOM attribute stays `data-ui-collapsed`.
- `UIRuntimeLifetime.PerTab` → `PerWindow`, `UIInstance.TabId` → `WindowId`,
  `UserSessionInitData.ClientTabId` → `ClientWindowId` — a window is one top-level surface showing one address
  (a browser tab or a desktop window), the neutral term a second platform needs.
- `UIItemsFilter` constructors now default to `LikeIgnoreCase`, matching `FilterBy`.
- Removed: `Card.SetHeader`/`Expander.SetHeader`, `OnChangeLiteral`/`OnBlurLiteral`,
  `InteractOnFocus`/`InteractOnBlur`, `UICompiledBindingSourceIndex.TryGetByComponentId`.

**New API:**

- `IVisualComponent.On(eventName, command, args)` — a general escape hatch for wiring an arbitrary event.
- `ItemsView.OnItemClick`/`WithItem`/`WithItemKey`, `OnItemOpen(WithItemKey)`, `OnItemRemove(WithItemKey)` and
  `RowHoverable`, matching Table/Tree.
- `UIDialog.OnClose(command, args)` — raised only when the viewer dismisses the dialog (Escape/backdrop).
- `TabsView.OnItemRename(command, argumentName)` convenience.
- `OnItemClickWithItem`/`OnItemClickLiteral` on Breadcrumbs/ButtonGroup/Menu/SplitButton.
- `UINavigationRequest.TryGetParameter(name, out string?)` / `TryGetParameter<T>`.
- `UITheme.PressRipple` — an opt-in press ripple on buttons, actions and menu entries (`data-ui-press-ripple`).
- `IItemAbilitiesComponent` and the `TreeNode` properties default their `Bind*` sugar to `Relative`.

**Notable fixes:**

- The error page's `message` carries the exception text only under `IncludeExceptionDetail`.
- `WebUrlSafety` gates every bound `href`/`src`/background `url()` on both the render and the patch path.
- `ArgCurrentItemKey` is verified against the collection it addresses; an unknown key is refused.
- `UITypography.Validate` refuses control characters and `< > { } ; " '` in `FontFamily`.
- `X-Content-Type-Options: nosniff` on the framework's responses, and the upload POST refuses a cross-site
  `Origin`/`Sec-Fetch-Site`.
- `ITranslator` registered in DI now wins over the built one; `UICommandInvoker` refuses undefined enum values;
  the runtime logs resolver/handler failures instead of swallowing them.
- `StandardUploadService`/`StandardDownloadService` moved into Core; a platform supplies only
  `IUIDownloadAddressProvider`. `UIContentAddress` is an instance the platform registers, not a static prefix.
  `UserSessionStoreExtensions.SetThemeModeAsync` is the theme persistence the hub calls.
- The client's `Property` DOM operation compares before writing, so a bound value replayed mid-typing no longer
  moves the caret to the end; `isComposing`/`defaultPrevented` guards across the keydown handlers that lacked
  them; Ctrl matches Cmd on a Mac for menu shortcuts; the cursor moves to the neighbour when its row is removed;
  a cancelled tab drag restores the order; the window engine realigns instead of scrolling on a re-attach;
  `pointer-drag` Escape cancels; `file-drop` reacts to `Files` only; the boot patch allows only
  `data-`/`aria-`/`class`/`hidden` attributes and `--` styles.
- `.ui-action` takes the button's corners, a horizontal menu's entries are square, and `.ui-button--surface`
  mixes its hover/active wash into its own fill.
- A bound menu's rows built by the client carry their sub-entries (`WebRenderItemsTemplateMetadata.RowDecorator`);
  a menu shortcut yields to a field that took the chord and stops at an open modal dialog; a page rendered from
  another compile of its view reloads at the attach instead of being fed updates it cannot address, and a page
  that reconnects after a restart gets its values back.

## 1.0.0-preview.1

Where this changelog starts: the first release cut after the packaging was settled. **The framework is
published now**, as a pre-release, instead of the two loose packages that used to go out on their own.

- **Twelve packages, one version.** The number lives once, as `<CoreVersion>` in the repository's
  `Directory.Build.props`, and `Release` refuses a tag that disagrees with it. There is no per-package number
  to forget and no way to install a mismatched pair.
- **The icon sets moved to a public face of their own**,
  [`NE.Standard.UI.Icons`](https://github.com/AkiEvansDev/NE.Standard.UI.Icons), on their own version and
  under MIT. They are still developed alongside the framework, so a set and the renderer it plugs into never
  drift apart; only the release is separate.
- **The package called `NE.Standard` is gone from this repository.** It was a library of general-purpose
  helpers that nothing under `src/` referenced, and it now lives on its own as
  [`NE.Common`](https://www.nuget.org/packages/NE.Common), MIT, with its own version line. It was never part
  of the framework, and a noncommercial licence on a bag of `string` and `DateTime` extensions helped
  nobody.
- **`NE.Standard.UI.Extensions`** is reserved for presets over the components, and is empty in this release.
- **The demo builds against the packages.** In the mirror `examples/DemoApp.Web` restores `NE.Standard.*` from
  nuget.org rather than referencing sources, so cloning it gives you a working application and the build here
  is a real test of what was published.
- **The licence is the [Prosperity Public License 3.0.0](LICENSE.md)**, not MIT: free for noncommercial use,
  with a thirty-day trial for commercial use. Personal projects, research, education, charities and public
  institutions are not commercial use.
- **Installs from nuget.org** — `dotnet add package NE.Standard.UI.Web --prerelease`, no credentials and no
  feed to add first.
- **The packages point only at the public mirror**, `github.com/AkiEvansDev/NE.Standard`. No commit hash
  travels in a nuspec or in an assembly's informational version: the sources live in a private repository, and
  a hash out of it resolves to nothing against the URL the packages carry.
- **`UIComparisonEvaluator` is public**, so an in-memory item source applying a `UIItemsQuery` by hand answers
  `Like`, `Required` and the rest the same way the server and the client do.
- **Fixed: a windowed filter's `Less` and `LessOrEqual` matched rows they should have excluded.** A value that
  is not a number compared through a sentinel that read as "smaller than everything", so `"abc" < 1` was true
  on the server and false in the browser. It converts to `NaN` now, as JavaScript does.
- **Documentation is at [akievansdev.github.io/NE.Standard](https://akievansdev.github.io/NE.Standard).**
  Hand-written pages today; the generated API reference is still to come.
- **The packages published under the old scheme are unlisted on nuget.org** — `NE.Standard` 1.0.0 and
  `NE.Standard.UI.Generators` 1.0.0. They were cut while the packaging was still being settled, and
  `NE.Standard.UI.Generators` 1.0.0 would otherwise outrank every `1.0.0-preview` that follows it.
