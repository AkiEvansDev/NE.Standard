# Changelog

The framework's changelog — the `core` slice. Every package in the slice carries the same version and goes out together. This file
holds only what is not released yet, under `## X.Y.Z`: the release workflow cuts that section out as the body of the GitHub release
(a tag with no section fails the release), and the notes of every released version live there —
https://github.com/AkiEvansDev/NE.Standard/releases. Other slices keep their own beside their sources (`addons/<Name>/CHANGELOG.md`).

## 1.8.4

- `NE.Standard.UI.Web.Abstractions.Assets` is a global using of the web packages, so a host serving its own script (`WebAssetDescriptor`,
  `UIWebAssetKind`, `UIWebAssetSourceKind`) writes no `using` for it.
- An application draws a framework glyph with an icon of its own pack: `services.MapUIGlyph(UIGlyphs.Copy,
  MaterialIcons.Outlined(MaterialIcons.ContentCopy))` at startup, per glyph, wherever the glyph is an icon value — the standard
  actions, the tab menu, a key-value row's buttons, a dialog's ×, any `SetIcon(UIGlyphs.X)` — on the first paint and every patch
  alike (#179). The pack must be registered, the target need not be; a glyph that is not a `UIGlyphs` name, a picture or another
  `ne-` glyph as the target, and a target no registered pack draws fail the startup. A mark the stylesheet draws itself (a select's
  chevron) keeps the core's face. A pack answers through `IWebIconPack` (`NE.Standard.UI.Web.Abstractions.Theming`).
- A press that begins with the pointer no longer ends in a list row's keyboard look (#181): a press on a clickable part of a row let
  go beside it no longer flashes the row's wash as the list takes the focus back, and a context menu or any other list a long press
  or a click opened gives the focus back as the pointer's when Escape closes it, as a dialog already did — an items view's, a table's
  and a tree's rows alike.
- An image input's shelf shows exactly what its bound `SelectionIds` hold (#183). After a reload, or on going back to a runtime of a
  `route.Identity` route, it draws the files its controller still names, from what the server holds of them
  (`GET /_ne/files/selection/{id}`, and each picture from `GET /_ne/files/upload/{fileId}`, both to the session's own uploads alone);
  an id the server no longer holds — a restart, the retention run out — is taken off and the list written back, so `OnChange` runs
  and Send sends no file the reader cannot see. A runtime whose list is null no longer leaves another runtime's files on the shelf.
- Attaching a runtime — a page load, a switch to another runtime of a route — no longer holds the page for a pass over the whole page
  per collection update (#180). The client's component index reads again only the list a change set's update changed, so a set of
  hundreds of per-item inserts costs about one read of the page instead of one each (a synthetic page of 14 000 elements: 270 ms to
  4 ms). `DomRegistry.invalidate(scope)` marks one changed subtree; `invalidate()` still marks the whole page. A list a controller
  fills an `Add` at a time — between a render and its page's attach, or in one push — now leaves the server as one insert, so a
  `Clear()` and its `Add`s reach the page as one refill that keeps the rows that stayed, rows with lists of their own included.
- An items view tells the controller where the reader is (#182): `ItemsViewComponent.FirstVisibleKey`, bound one way from the page by
  `BindFirstVisibleKey(path)`, is the key of the row at its top — the first row showing below the scroll's edge, past its `Padding`
  and a group header held there. The page writes it once after the first layout and then as the reader's scroll comes to rest (150 ms,
  at least once a second through a scroll that never pauses), never while it stands still and never where it is not bound; windowed
  and end-anchored lists included. A controller follows it in the property's setter — a chat's pinned bar showing the latest pin at or
  above the reader.
- A picture shown full size over the page, drawn by the page itself (#184): `ShowImageEffect` fits it to the window over a darkened
  backdrop, and the bands beside a picture of another shape are that backdrop, so a press there closes it, as Escape and its × do; the
  focus is held in it and goes back where it was. A set — `new ShowImageEffect(["/a.jpg", "/b.jpg"], startIndex: 1)`, or
  `UILightboxImage`s with the words under each — walks by the arrows at the picture's foot (shown under the pointer, always on a
  touch screen), ← and → and a swipe, with a counter that keeps its width as it counts; the pictures slide as a strip, a finger's
  neighbour coming in from the side it is dragged toward; a single picture shows none. It runs in an interaction with no round trip, and
  reads its picture off the page where it is given a component: `ShowImageEffect.Of(id)`, or `AmongRows(id)` for the same component's
  pictures in its list's other drawn rows — a chat message's photos. `SurfaceComponent.OnClickShowImage(amongRows)` makes a surface
  round a picture pressable, by the keyboard too, and opens it. An address no picture may be fetched from is refused as the effect is
  made; the rule is `UIUrlSafety.IsSafeImageSource` (`NE.Standard.UI.Primitives.Text`), which `WebUrlSafety` now asks. New words:
  `ui.lightbox.label`, `.previous`, `.next`, `.counter`, in English, Russian and Chinese.
- A press on a dialog's backdrop no longer takes the focus off the dialog before it closes, so a dialog closed that way gives the
  focus back to what opened it, as Escape does; it went to the page's body.
- A press on a control of a row's own — a button, a link, a clickable picture — is the control's and no longer chooses the row: a
  tap on a photo in a chat message opens the photo without the message's action bar. A row that is one control as a whole (a tile
  that is a button) is still chosen by its press.
- **Breaking:** a number input with no `DisplayFormat` no longer groups its thousands (#186), so a count or a setting reads `32768` in
  every language rather than `32,768` or `32 768`. `AllowThousandsSeparator` is unset by default, and unset the format says: `N`, `C`
  and `P` (with or without a precision) group as the culture does, `F` and `D` do not. `true` groups whatever the format but `D` — a money
  field with no format, or an `F2` read as `N2` — and `false` never groups, a format's own grouping included, as before. The stepper
  stays off by default. A field told to group carries `data-ui-number-thousands` (`WebAttributes.NumberThousands`, new), one told not
  to `data-ui-number-no-thousands` as before, and a field left to its format neither.
- One way to build a search field (#200): `TextInputComponent.SetSearch(placeholder)` makes a text input a search box — the search
  type, the search glyph before the text (a glyph `MapUIGlyph` can draw from the application's pack), a clear button, and the given
  placeholder or the framework's word "Search" (`ui.search.field`). How soon it commits stays `SetDebounceMilliseconds`'. A menu's
  `SetSearch` is that same field, Tonal and small. **Breaking:** the word `ui.menu.search` (`UIStrings.MenuSearch`) is gone — a menu's
  search reads `ui.search.field`, as a search's list field does — so an application that translated the old key translates this one.
- A page load holds a region out of sight while it holds a part only a package's engine draws (#190): a renderer writes
  `WebAttributes.AwaitsDraw` (`data-ui-awaits-draw`) on such a part, the boot script marks its region as the page is parsed, and the
  runtime lets every region show once the engines have started — at most 1.5 s, reduced motion included; with scripting off nothing
  is held. The Markdown display uses it, so a chat feed of Markdown messages paints whole rather than as empty rows that then jump.
- A list's rows wash rounded, as a menu's entries do (#191): an items view's stack rows and a tree's rows take the list entry's
  corner on the pointer's wash, a press's wave, the keyboard's row and the chosen ground, so a list over a menu in one panel no longer
  washes square beside round. A chosen row is straight on the edge its mark stands on — the leading one, or where `SelectionStyle`
  moved it. A table's and a key-value list's rows stay square; a wrapped view's tiles keep their card's corner.
- A pinned side reads as a panel beside the page (#187): it keeps the drawer's fill and draws a 1 px `Border` hairline on the edge
  facing the page in place of the drawer's shadow; a side that is a column by width alone is unchanged. An application that draws its
  own edge on the side's root there sees two lines: it drops its own where the side is a drawer or pinned (under `UISideDrawers.Always`,
  everywhere).
- Three more standard actions (#185, #195): **Done** (`ui.action.done`, the check) ends an edit made in place — a message's words, a
  cell, a title — where Save keeps its disk for writing a document out; **Back** (`ui.action.back`) wears a new core glyph, an arrow
  back (`UIGlyphs.ArrowBack`, Material's `arrow_back`); **New** (`ui.action.new`) the plus. Each is in `UIStandardAction`,
  `UIIconButtons.Done()`/`Back()`/`New()` and `UIMenuItems.Done(id)`/`Back(id)`/`New(id)`, its word shipped in Russian and Chinese.
- A page's header led by an action (#192): `UIPage.Header(leading, title, description, trailing…)` puts `UIIconButtons.Back()` (or
  any component) before the title, on its row at every width, the title and the line starting after it and its glyph on the content's
  edge; on a phone it follows the shell's drawer toggle. `UIPage.BoundHeader(leading, titlePath, descriptionPath, trailing…)` binds
  the title and the line to the controller — a note's name and its status.
- Back as an effect (#192): `NavigateBackEffect(fallback = "/")` is the browser's Back where a page of this site stands behind — the
  Navigation API says so, or, without it, an entry the page wrote or a page of this site it was loaded from — so it is followed as
  Back is: told to the controller within the runtime, a switch to another runtime of a `route.Identity` route in place, a load
  otherwise, and the reader holding unsaved work asked first. With nothing of this site behind, it goes to `fallback` as a
  `NavigateEffect` would. It runs in an interaction, with no round trip:
  `UIIconButtons.Back().InteractOn(EventNames.Click, new NavigateBackEffect("/notes"))`.
- A confirmation in one call (#198): `UIDialogs.Confirm(key, question, body, confirmWord, confirmCommand, confirmType = Danger,
  cancelCommand, middle)` — the question (the dialog's name too), its words (a phrase, or a bound `ParagraphComponent`), Cancel in
  the framework's word, an optional middle answer ("Don't save") and one primary or danger button, in the framework's own leave
  dialog's measures. No header ×. Cancel and Escape close it as the viewer does and raise its `OnClose`, which runs `cancelCommand`;
  a press on the backdrop leaves it open.
- A fold (#197): `UIPage.Fold(title, expanded, content…)` is the quiet expander as a collapsible section — its name a caption, its
  content a stack — returned as the `ExpanderComponent`, so `BindExpanded` and a bound name through `ConfigureDefaultHeader` work as
  on any expander; a null title leaves the name to that binding.
- A quote (#199): `UIText.Quote(title, line, accent, clickCommand, closeCommand)` and a bound overload `(titlePath, linePath, scope,
  accentPath, …)` draw a reply or an edit as messengers do — a 3 px stroke at the start in the brand or the given colour, the title a
  caption in that colour, a muted line under it, both shown as written. A click command makes the whole quote pressable (a jump);
  a close command ends it in the standard ×.
- One quote stroke: a paragraph's quote line (`ShowQuoteLine`) is 3 px rather than 2, as wide as a Markdown blockquote and
  `UIText.Quote`, and its colour, unless `QuoteLineColor` names one, is the border colour a blockquote is drawn in rather than a
  quarter of its own ink. Both are tokens a package's stylesheet reads, `@ui-quote-stroke` and `@ui-quote-ink`.
- A rule reading another component's value — `ShownWhen`, `HiddenWhen`, `EnabledWhen`, any `Interact` from a property — now holds
  from the first paint where its source is the view's own (set or left at its default, not bound): a note under a switch that is
  off starts hidden, a button waiting for a ticked box starts disabled. Before, an unbound source's rule ran only at its first
  change, so the target stood in its written state until then. A bound source's rule runs as the page takes its painted values,
  as before. The server's refusals still read the written state.
- A wrapping title (`SetTitleWrap(true)`) breaks only between words: "Servers" in a narrow row no longer read "Serv / ers"; a single
  word longer than its line ends in an ellipsis. `UIPage.Header` on a phone stands buttons with words (a `ButtonComponent` with a
  title) on a row of their own under the line, at the far edge, so the name keeps the row; icons (a switcher, a person) stay
  beside the name as before.
- A drawer's button stands on the page header's title line from the medium breakpoint too: 22 px down there (12 on a phone), so
  between md and the width the sides become columns its middle meets the title's, a header's Back and its far end, where it stood
  10 px higher; an open drawer's own switch follows it.
- A round picture with no picture draws a glyph (#196): an `ImageComponent` with `Shape` Circle, and a picture icon with
  `IconShape` Circle on a text, a menu entry, a table cell's text, a badge or an `IconComponent`, that has no address, is given an
  empty one or one that fails to load shows `UIGlyphs.Person` on a neutral circle in its place, from the first paint and on every
  patch; a good address given later brings the picture back. No visibility bindings in the controller. `IconFallback` (item models,
  text bodies, `BadgeComponent`) and `FallbackIcon` (`ImageComponent`, `IconComponent`) name another glyph; `MapUIGlyph` redraws
  the fallback as it does the glyph. An image tries its `FallbackSource` first. A picture that is missing or failed no longer opens
  in the lightbox. **Breaking:** an `ImageComponent` renders as a box (`span.ui-image`, which takes the size, shape and corners)
  round its `img.ui-image__picture`; a stylesheet or script that read `img.ui-image` reads the picture inside.
- The theme and the language switchers as a settings form's fields (#189): `AsField()` (`ISwitcherComponent.Variant`,
  `UISwitcherVariant.Field`) draws either as a select-shaped field — its caption (`Title`, "Theme" or "Language" unless set, decided
  at render), a box in the form's `Appearance` (Tonal unless set) and the list — by the same renderer and engine as the button, and
  `UIForm.Field` gives it a note as any field. The theme field offers **Light**, **Dark** and **System**, System raising
  `SetThemeEffect(null)`: the session forgets its theme and the page follows the platform's preference again. Its current choice is
  marked by the page from the theme the page is set to — as the body is parsed and on every switch, whoever made it — never by the
  server, whose shell is cached outside the theme. The language field shows the languages by name and opens its list for two as for
  more. The compact button keeps its one-press flip. New words: `ui.theme.field`, `ui.theme.light`, `ui.theme.dark`,
  `ui.theme.system`, `ui.language.field`. A renderer drawing two shapes picks its root per render (`ResolveRoot`), and
  `.ui-choice-entry(@chosen)` takes the state that marks the chosen entry.
- A `UIMessage`'s mark stands on the middle of its words rather than on the first line; the × stays at the top.
- The safe answer of the framework's own dialogs — Stay when leaving with unsaved changes, Cancel in the picture crop — is a Ghost
  button, as `UIDialogs.Confirm`'s Cancel already was. `UIButtons.Secondary` (Outline) is for where a bare button would read as
  words: an action on a message's colour, an alternative stretched under a stretched primary, a choice drawn as a card.
- A toast's action stands at the toast's end under its message, flush with the × above it, rather than short of the ×'s column.
