# Changelog

The framework's changelog — the `core` slice. Every package in the slice carries the same version and goes out together. This file
holds only what is not released yet, under `## X.Y.Z`: the release workflow cuts that section out as the body of the GitHub release
(a tag with no section fails the release), and the notes of every released version live there —
https://github.com/AkiEvansDev/NE.Standard/releases. Other slices keep their own beside their sources (`addons/<Name>/CHANGELOG.md`).

## 1.13.0

- **Breaking:** the built-in templates and header regions are global usings (#249): `NE.Standard.UI.Components.BuiltIns.Templates`
  (`DefaultEmptyTemplate`, `DefaultRowTemplate`, `DefaultTextTemplate`, ...) and `NE.Standard.UI.Components.BuiltIns.Regions`
  (`CardHeaderRegion`, `ExpanderHeaderRegion`, `TabCaptionRegion`) come with the package as the other component namespaces do. A
  file that writes `using` for either now fails IDE0005 under warnings-as-errors: delete the line.
- **Breaking:** `ActionComponent.SetAction`, `TextInputComponent.SetSearch`, `MenuComponent.SetSearch` and `TabsComponent.AddTab`
  take their words as `UIPhrase`, so a key with arguments fits where a string did; a string still converts, so source compiles
  as it was. A package built against 1.12 that calls one is rebuilt against 1.13.
- **Breaking:** captions are phrases too: `TableComponent.AddColumn`/`AddTextColumn` and `UITableColumn.Caption`, the
  `StatusComponent` title and line, `UIChoice.Caption` and `UIChoices.Boolean`. A string still converts as the author's text;
  code that reads a column's or a choice's `Caption` as a string reads `.Key` of the text, or translates the phrase. A key with
  arguments in a column caption is looked up even on a column marked content. `UITableColumn.HasCaption` says whether a column
  has words to be named by.
- **Breaking:** words that say nothing are refused wherever words are required, a blank text through a string and a phrase
  alike: `UIValidationMessage`, `Required`/`Regex`/`RegexEach`/`Validate`/`ValidateAgainst`, a `ShowSystemNotificationEffect`'s
  title, a `ShowNotificationEffect`'s words and an `AnnounceEffect`'s now throw on `""` or `UIPhrase.Text(" ")`, and so do a tab's
  caption (`AddTab`), an action's words (`SetAction`), a search's placeholder (`SetSearch`) and a `StatusComponent`'s line where
  given. Pass words, or leave out a rule, an effect or an optional word that has none to say.
- **Breaking:** every preset's words are refused blank, through a string and a phrase alike, where 1.12 took them: `UIPage`'s
  (`Header`'s title and line at every size, `Section`'s, `Heading`'s, `Labelled`'s label, `Status`'s and `Outcome`'s line),
  `UIMessage.*`'s title and body, `UICard.Create`'s line, `UIDialogs.Form`'s line and `Confirm`'s body, `UIDetails.List`'s and `Row`'s
  names, `UIForm.Field`'s hint, and `UIText`'s roles, `Quote`, `Person` and `WithBadges`. For none, leave the argument out
  (`Confirm(key, question, word, command)`, `Outcome(icon, tone, title, actions)`) or pass null where nothing else takes it; a
  `UIText` role's words are `UIPhrase? … = null`, bound after — `UIText.Note().BindDescription(path)`, where `string.Empty` throws.
- **Breaking:** an event's arguments are checked when the view compiles (#248): an argument whose path the types it walks do not
  have — `UIAction.ArgParent("id", "Id")` on a button straight in an item template reads the controller, the scope around the row —
  an item's key, group or current item on a component standing in no row, and a value-type parameter (`int index`) no argument
  supplies are refused, where each failed every press with a line in the log alone. Write the row's own as `ArgRelative` or
  `ArgCurrentItemKey`; give a parameter that may be absent a default or a nullable type. An argument the command has no parameter
  for is a compile warning.
- **Breaking:** an interaction naming a dialog the view does not declare fails the compile (#235), a `CloseDialogEffect` with
  `RaisesClose` included, and the test page refuses one: declare the dialog in `CreateDialogs`, or drop the effect.
- **Breaking:** a dialog is named by the title it shows (#238): `UIDialog.TitleId` names the component inside its content whose
  words name it (`aria-labelledby`), so a bound title names it as it changes. The `UIDialogs` presets set it and no longer set
  `Label`; a test reading a preset dialog's `Label` reads `TitleId` (`UIDialogs.TitleId(key)`), and a dialog built around
  `UIDialogs.Content`/`Header` names itself with `TitleId = UIDialogs.TitleId(key)` in place of `Label`. `UIDialog` is a record:
  a preset's dialog takes what it does not set itself with `with { CloseOnBackdrop = false }`.
- **Breaking:** `UIDialogs.Form` is a form: every field of its content with no `FormId` of its own joins the dialog's key as its
  form, and the primary submits it, so Enter in a one-line field presses the primary, the press judges the fields' `Submit` rules
  and waits for their uploads, and a field bound `OnSubmit` is held until it. Give the primary its command with `OnClick` (or
  `OnClickShowingLoading`); a form already wired with `SetFormId` and `OnSubmit` keeps its own id. `IInputComponent.FormId` is
  settable through the contract.
- **Breaking:** the presets take their words as `UIPhrase` — `UIDialogs`, `UIButtons`, `UIPage`, `UIText`, `UIForm`, `UIDetails`
  and `UICard` — so a key with arguments fits (`UIButtons.Primary(UIPhrase.Of("cart.pay", ("total", total)))`); a string still
  converts, and a package calling them, or a message with its new `dismissCommand`, is rebuilt against 1.13. `UIDetails.List` takes
  `(UIPhrase Key, UIPhrase Value)` rows: a tuple written in the call converts, a `(string, string)[]` built beforehand does not.
  Words the controller holds go through a `Bound*` twin, which takes its paths, then `UIBindingScope scope` (a dialog's, at the
  view's root, none), and draws them plain — data, never markup; the `UIBindingScope` overloads are such twins now:
  `UIText.Quote(titlePath, linePath, scope, …)` is `UIText.BoundQuote(…)`, `UIText.Person(avatarPath, namePath, linePath, scope,
  size)` is `UIText.BoundPerson(…)` (its avatar path optional), `UIText.WithBadges(TextComponent title, badgesPath, …)` is
  `UIText.BoundWithBadges(titlePath, badgesPath, …)`. A component overload is for content beyond words, a body with a link or an
  emphasis: `UIMessage.Create(severity, TextComponent?, ParagraphComponent?, …)`, `UIDialogs.Confirm(…, ParagraphComponent? body,
  …)`, `UIForm.Field(input, ParagraphComponent)`, `UIPage.Outcome(…, ParagraphComponent?)`. A glyph and a name the controller holds
  are bound on the button `UIButtons.Icon` returns (`.BindIcon(path).BindTooltip(path)`), the written ones the fallback while the
  paths hold nothing.
- **Breaking:** a surface, a card or a file tile with a click of its own is clickable with no `SetClickable(true)`: an `OnClick`
  command, an interaction on its click (`OnClickShowImage`, a row's `OnItemClick`) or an address (`Url`). A set or bound
  `Clickable` stays the gate, so one meant to stay inert under a click says `SetClickable(false)`, and `OnClickShowImage` no longer
  overrides it. `Clickable` is `IClickableComponent`'s (`SurfaceComponent.ClickableProperty` still names it); the test page refuses
  a press on a component whose `Clickable` is false, as the browser lets it go by. Drop `SetClickable(true)` beside an `OnClick`.
- **Breaking:** `IconValueRenderer.RenderStandInGlyph(parent, fallback, round)` takes the picture's shape: a package's renderer
  calling it passes `round: true` for the person it drew before.
- **Breaking:** `ITabItemComponent` gains `OnRemoveLiteral` and `OnRenameLiteral`: a class of an application's implementing it
  adds the two (the core's `TabItemComponent` has them).
- **Breaking:** `IVisualComponent` gains `InteractOnRow(eventName, rowKey, effect)` — one row's effect, written on a template — with
  no default body, `IInputComponent.FormId` a setter and `ITextBaseComponent` `TooltipPlain`: a class of an application's
  implementing one adds them (the core's components have them).
- **Breaking:** for a package's renderer, the attribute naming what a painted phrase holds for the page to write is
  `WebAttributes.PageWritten` (`data-ui-page-written`, written by `WebWords.PageWritten(phrase)`), and it names file sizes beside
  moments; `WebAttributes.Moments` and `WebMoments.MomentsAttribute` are gone: read `WebAttributes.PageWritten` instead.
- **Breaking:** `UIPage.Empty(icon, title, line, action)` takes `params IVisualComponent[] actions`, in a row centred under the
  words, each as wide as it is (a call naming `action:` passes it unnamed); its icon may be null (#239): words alone, the list's own
  empty state.
- **Breaking:** a bound line of `UIPage.BoundHeader` is the thing's own words, as its name is: a key the controller holds as a
  string is shown as written — hold a `UIPhrase` to have it translated.
- **Breaking:** a quiet button at a band's end stands its words on the content's edge as an icon stands its glyph: a ghost or a
  link with words at the end of a header, `UILayout.Ends`, a quote or a card's header hangs past the edge by its padding (8, 16 or
  24 px), and the theme and language switchers hang too; an icon-only button with an `IconSize` of its own hangs by that glyph. A
  card's header action is an edge in any card, `UILayout.Ends` marks its start, `UIButtons.Toolbar` its first button, a dialog
  header's × stands its glyph on the content's edge, and a `UIMessage`'s × on the message's far edge (its right padding 16 now, as
  its left). A host wants that much padding there; one with less puts it off with `--ui-glyph-hang-start` or `-end` at 0.
- **Breaking:** `StackPanelComponent.AlignWithFieldBoxes` on a column stands its first child alone on the box and the rest under
  it — a control and its hint — where it centred them together; a panel that wants the two centred sets its own padding.
- **Breaking:** an interaction on an event its source also runs a command on fails the compile: the page sent the command and never
  ran the interaction. An effect beside a command goes around it: `InteractBefore`/`InteractAfter(eventName, effect)`, the click's
  `InteractBeforeClick(effect)`/`InteractAfterClick(effect)`, each with a source-id overload — a Send that puts the caret back
  in its composer is `.OnClick(nameof(Send)).InteractAfterClick(new FocusEffect(composerId))`. The after-pair runs on any answer,
  a failure and a dropped connection included, so a Save that closes its dialog returns `new CloseDialogEffect(key)` from the
  command instead.
- **Breaking:** a rule reading a property its source does not have fails the compile — `ShownWhen(id)` over a toggle button, whose
  state is `Pressed`, not `Value`, kept its target as authored for ever. Name the property the source declares.
- **Breaking:** a form nothing submits fails the compile: a field bound `OnSubmit` whose `FormId` no button's `OnSubmit(formId, …)`
  (nor a field's own submitting event) submits held its edits for ever, and a `SubmitOnEnter` area with no such button pressed
  nothing on Enter. A Save written `OnClick` beside such fields becomes `OnSubmit(formId, command)`.
- **Breaking:** an effect aimed at a component it cannot act on fails the compile in an interaction: `OpenPickerEffect` opens a
  file or image input's chooser, `ScrollToItemEffect` shows a list's, table's or tree's row, `RenameNodeEffect` renames in a tree,
  `RenameTabEffect` in a tabs view and `InsertTextEffect` types into a field the reader types into (`ICaretFieldComponent`: a text
  input, a text area, a number input, a search's field, the code editor) — a component derived from one (a data grid from a
  table) takes the same, and a package's own caret field implements the marker. An interaction's `SetLanguageEffect` naming a language the application does not
  translate into fails the view's compile. Aim each at a component of its kind.
- **Breaking:** a command's effect the page could not carry out — naming a dialog the view does not declare, a component it lacks
  or one of the wrong kind, a language not translated, an `InsertTextEffect.CurrentItemKey`, which no press answers, or a
  `ShowImageEffect` naming a picture in a row by fewer keys than its row's, which would open the first row's — is
  dropped and logged as an error, rather than sent to find nothing beside a success; in Development the page's console says so
  too (`DevelopmentReportEffect`). The command's result stands, and a toast whose action could not be offered still shows its
  words. Fix the effect the log names; a row's key goes into a field as text (`InsertTextEffect.Literal`).
- **Breaking:** `UITestApp.OpenAsync` refuses a page whose view binds what names nothing, naming each binding: it showed only as a
  blank control and a line in the log. Fix them, or set `app.AllowsCompileWarnings = true`. Advice — an argument the command has no
  parameter for, a `Root` binding a row's item shadows — is logged, not refused, and an argument the framework adds itself (a
  drop's `drop`, an edited row's `id`, a grid cell's `column`; `UIAction.Offered`) never warns. `CompiledView.Warnings` holds
  `UICompileWarning`s, each with its `Kind` (`UnresolvedBinding`, `Advisory`): code reading one as a string reads `.Message`.
  `UITestPage.CompileWarnings` lists them; a page in Development writes them to its console too.
- **Breaking:** the server no longer refuses a press or a value of a component an interaction opens: a panel authored hidden and
  shown by `ShownWhen` or `InteractOnHoverStart` (a hover card), a button authored disabled and enabled by `EnabledWhen`.
  Its authored value is only where the page starts. A command's `ShowEffect` opens a component authored hidden for the page it
  reaches alone — another tab of the runtime keeps it closed — and a `HideEffect`/`CollapseEffect` sent to that page closes it
  again, as does the page attaching anew. What such a rule guarded is the command's to check (the terms accepted),
  or a gate bound to the controller's (`BindEnabled`), which the server reads.
- **Breaking:** an effect's address that is a query or a fragment alone (`"?page=2"`, `"#top"`) — a `NavigateEffect`'s route, a
  `NavigateBackEffect`'s fallback, a `ConfirmLeaveEffect`'s target, a system notification's `Address` — throws as it is made: the page
  went nowhere. A query of the page's own is `ReplaceAddressEffect`/`PushAddressEffect`, a part of it brought into view `ScrollToEffect`.
- **Breaking:** an item source's `Offset`, `TotalCount`, `HasMoreBefore`, `HasMoreAfter` and `GroupBefore` are written by the
  source itself, under the lock that guards its window (#236): a derived source answers them in the `UIItemWindow` its read
  returns, and one that wrote `Items`, `Offset` or `TotalCount` by hand calls `Replace`, `Insert` and `Move` (below) instead.
- **Breaking:** `UIPage.Heading` stands its far end on the title's first line and its note under both, as a page header does,
  where it centred the far end on the whole heading; a heading that set its far end down by hand drops the margin.
- **Breaking:** a quote's × (`closeCommand`) hides the quote at once and runs the command beside the hide, as a message's × does,
  where the quote stayed until the command's answer; the quote's end keeps the ×'s hang inside its box. A close command still
  writes the quote's bound `Visibility` as it did, as a message's does: unwritten, the next reply's `Visible` is no change and the
  quote stays hidden.
- **Breaking:** `UILayout.Ends` stands its far end level with a titled start's box (#245) — a titled select and its New and Copy —
  and `UILayout.Row` stands a thing with no caption level with a titled field's box at every width (the filters in a band), in a
  cell of its own (a `StackPanelComponent` shown as the thing is): code reading the row's `Children` finds the cell. `UIForm.Row`
  counts `UIPage.Labelled` and a row or grid holding a titled field as captioned, and stands a control with its hint
  (`UIForm.Field`) on the box, the hint under it. Drop a hand-made grid or margin that levelled them.
- **Breaking:** a page header's name on a phone and a dismissible `UIMessage`'s first line beside its × stand on a button's middle
  by the stylesheet (`StackPanelComponent.FirstLineOnControl`), whatever line a theme gives the role: the message's words stand
  that much lower rather than the × higher. A label over a control stands in a field's caption row
  (`StackPanelComponent.FirstChildAsCaption`, which `UIPage.Labelled` uses), so the control stands level with captioned fields'
  boxes under any theme's lines. A margin that set either by hand goes.
- **Breaking:** a page header's leading cell is shown as its action is: `Back().ShownBelow(UIResponsiveTier.Md)` leaves the title on
  the content's edge from `md`, where it stood 11 px in; a margin that pulled the title back goes.
- **Breaking:** a strip's menu button (`UIIconButtons.More`), its switchers and its buttons in a row are small unless their size is
  said, as its icon buttons were; a medium ⋮ hung past the panel's padding and was cut. One meant medium says `SetSize`.
- **Breaking:** a centred component in a room shorter or narrower than it keeps its start in view and runs on past the room's end,
  where it was cut at both: the stylesheet centres safely (`safe center`) — an empty state in a short pane, a centred field in a
  short row. A start alignment set to keep such a thing in view can go back to centred.
- **Breaking:** two rules of one field alike in trigger, operator and severity — two patterns — both reach the page, where the
  second was dropped: drop a rule that was meant to replace the first.
- **Breaking:** `IUIViewHost` gains `ResolvePresentedViewAsync` and `IUIClientEndpoint` gains `HearBeforeRenderAsync`,
  `TakeRenderKey`, `NamesRuntimeOf`, `ReportClientState`, `ApplySessionChangeAsync` and `ReachSessionAsync` — what a platform
  calls the host for in a page's life, until now reached by the web alone. Only a class implementing `IUIHost` of its own breaks:
  it implements them.
- `UIPage.Heading(component, trailing)` takes a heading of your own.
- Words the controller holds have their `Bound*` twin (the idiom above): `UIPage.BoundSection`, `BoundHeading`, `BoundLabelled`,
  `BoundEmpty`, `BoundOutcome`, `UIForm.BoundField`, `UIDetails.BoundAmount` and `BoundTotal`, and `UIMessage.BoundCreate`, a
  message whose words the controller holds — a status the server rewrites, read out in place; one with things after its paths
  (`UIPage.BoundHeader`'s far end too) has an overload with the scope and one without. `UIDetails.Amount` and `Total` take a scope
  too. `UIForm.Field`'s hint is optional or a `ParagraphComponent`; `UICard.Create` takes a null title, leaving the name to
  `ConfigureDefaultHeader`; `UIText.Person(avatar, words, size)` stands words of your own beside the picture.
- `UIText.Quote(content, accent, clickCommand, closeCommand)` quotes anything (#246) — a paragraph, a picture and its caption — in
  the neutral stroke a quotation inside text takes unless given a colour. A quote's × stands its glyph on the quote's end.
- `UIPage.Column(width, content, centered: true)` stands the column in the middle, and `UIPage.Header(…).InColumn(width)` gives the
  band over it the column's width with its own padding (#250); `band.InPanesList()` gives a band over the `UILayout.Panes` list the
  list's width. Drop a column width mirrored by hand for the head, and the head's hand-made padding.
- `ContainerComponent.ScrollbarRoom` (12) is a scroller's bar room, the air to leave beside a list for its bar.
- A file's size outside a file tile is written as the tile writes it (#252): `UIFileSize` is a phrase argument the page writes in
  the reader's language — "45 bytes", "1.5 kB", "1,5 МБ" — before the first paint and again after a language switch, and
  `new UIFileSize(bytes).Phrase()` is the size alone (the framework's `ui.file.size`). Replace a size formatted by hand on the
  server, and its words, with it. A package passes `{ fileSize }` to `strings.format`. A file tile's own size is now written
  before the first paint too, rather than appearing once the page starts.
- A package's script reads words its model carries as the server wrote them — an author's text or a key with its arguments —
  through `strings.resolve(value)` (`ClientStrings.resolve`, `WrittenWords` in `ne-standard-ui.d.ts`), the page's twin of
  `Translate(UIPhrase)`. The contract's number stays; a package that calls it needs the framework's 1.13.
- A tree whose `OnNodeRename` command clears and refills its list shows the new name after Enter (#251), as does a tab strip
  renamed the same way, or any row where a field the reader edits and another part show the same item value: a refill of the
  same items kept the row with its old words. A list read again after a rename keeps it.
- A dialog's standard Cancel comes with it (#247): `UIDialogs.Form(key, title, description, content, primary)` ends in Cancel
  beside the primary, and `UIDialogs.CloseButton(key, action, type)` is the dialog's own Cancel, Close or Done anywhere — the
  viewer's close, raising `OnClose` as Escape does, after putting back the held edits of the dialog's form so it opens again as
  the server holds it. The ×, `Confirm`'s Cancel and `Form`'s do the same, and so do Escape, the backdrop and a sheet's swipe
  down. Drop every hand-built Cancel,
  `UIButtons.Ghost(UIStandardAction.Cancel.Word).InteractOn(EventNames.Click, new CloseDialogEffect(key) { RaisesClose = true })`.
- A dialog's words may be the controller's (#238): `UIDialogs.BoundForm(key, titlePath, descriptionPath, content, primary)`
  — "Add a phrase" or "Edit the phrase", the folder an import goes into — and `BoundCreate`, `BoundContent` and `BoundHeader`
  with a bound title, each bound as the controller's own words and still naming the dialog.
- `UIDialogs.Create(…, width)` keeps a dialog's content to a named column (`UIColumnWidth.Form`, `Reading`; `Wide` from the
  extra-large breakpoint), the screen's width on a phone, as `Form` does — a dialog rebuilt around `UIDialogs.Content` for a
  width of its own goes.
- `UIButtons.Primary`, `Accent`, `Outline`, `Ghost`, `Danger` and `Link` take a `UIStandardAction`: the action's words, its glyph
  where asked, Delete in the danger colour (`UIButtons.Outline(UIStandardAction.Copy, glyph: true)`), where
  `UIButtons.Ghost(UIStandardAction.Cancel.Word)` was written by hand. `UIIconButtons.More()` takes bound
  entries (`.BindItems(path)`) where `More([])` was written, and `UIMenuItems.More(id)` a submenu entry filled later.
- A message's × may run a command (`dismissCommand` on `UIMessage.*`): the message still goes at the press, and the command
  records it, for one the server should stop showing.
- `RecursiveCollection<T>` reaches a row by its key through its own index (#237): `TryGet(key, out item)`, `Remove(key)` and
  `Move(key, index)`, the index clamped to the list. A command that receives a row's key drops its loop over the collection;
  a collection of items with no key refuses all three.
- `UIItemSourceBase<TItem>` writes every change of its window itself (#236): `Replace(item)` puts a held row's new shape where the
  reader has it, as one replace of that row (false, changing nothing, for a key outside the window) — an edit, a pin or a
  reaction no longer copies every property into the held item; `Insert(item, sourceIndex)` takes an item in anywhere in the
  source, joining the window, moving its start or only counting it; `Move(item, oldSourceIndex, newSourceIndex)` moves a row
  inside the window as one move, or out of it and into it with the start and counts kept. `Invalidate` has the page read the
  window again from the host's own edge, so the reader's place is not kept.
- Every list host words its empty state (#249): `ConfigureDefaultEmptyTemplate` on `TabsViewComponent`, the selects
  (`SelectComponent`, `MultiSelectComponent`, `BadgeSelectComponent`, `SearchComponent`) and `RadioGroupComponent`, with
  `ConfigureDefaultGroupTemplate` on the selects and the radio group; on `MenuComponent` and `KeyValueActionComponent`, which draw
  no empty state of their own, the same call puts the built-in one in — `SetEmptyTemplate(new DefaultEmptyTemplate()...)` goes.
  `SetShowEmptyTemplate(false)` hides it on the tabs view, the menu, the radio group and the key-value list too, as on the items
  view, table and tree; a select's and a search's list is worded, never hidden: it answers a list the reader opened.
- A tooltip may be shown as written, as a description may (`SetTooltipPlain(true)`): `UIPage.BoundHeader`'s phone line and a pane's
  or a strip's name, the controller's words, no longer read their brackets as a link. A details list (`UIDetails.List`) tells rows
  apart by their whole name, so one key with two arguments ("VAT, 21 %", "VAT, 9 %") is two rows.
- A popup closes when its opener goes out of sight: hidden (a dialog closed round it, a folded panel, a tier's `Visibility`) or
  scrolled wholly out of its box, as a tooltip goes, where it stayed open unseen or pinned at the window's edge; a right-click menu
  goes when its row scrolls away. A flyout only hidden stays open — its `IsOpen` untouched, no `OnClose` — and shows again with its
  place; one scrolled away closes as on a press outside. The keyboard a popup held goes to its owner drawn anew, never the page's
  body.
- Crossing 640 px in either direction closes an open list (a select's, a menu's, a split button's, a context menu's) and a menu
  standing at the pointer, and a popup keeps the form it opened in: a phone turned upright no longer keeps a list beside its
  anchor, and a list that closed as a sheet opens beside its anchor on a wide window.
- A non-modal dialog (`Modal = false`) closes on Escape only from inside itself, as a modeless side does: Escape in the page it
  leaves working (a composer beside a settings panel) is the page's, and one in the dialog it was opened from is that dialog's.
- A dialog opened from another stands on top whatever order `CreateDialogs` lists them in; one declared before the dialog that
  opened it stood underneath it, its keyboard trapped back into the first.
- An action bar over a row, and a toast holding the keyboard, take the Escape before the dialog or the drawer around them, which
  closes on the next one.
- A press opens a dialog the view declares with no round trip (#235): `InteractOn(EventNames.Click, new OpenDialogEffect(key))`.
  A command that only returned `OpenDialogEffect` goes; one that fills the dialog first stays.
- A rule may compare a field with another field's value (#242): `ValidateAgainst(otherId, UIComparisonOperator.Equal, message)` —
  "Password again" against "New password" — judged in the browser as either field changes, and by the test page alike. The field
  compared with is another input in the same row or in none; the server does not judge it again, so a command keeps any check
  its data depends on.
- A picture of any shape that fails shows its fallback glyph (#241): a square image or picture icon draws `UIGlyphs.Image` on the
  wash over a clear box that keeps its size, as a round one draws the person, and `FallbackIcon`/`IconFallback` names another for
  either; `MapUIGlyph` reaches it. A failed square picture icon showed nothing, and an image input's stored picture that no longer
  loads showed an empty box: it shows the input's placeholder. An application's own placeholder picture passed as `FallbackSource`
  only for a failed load can go.
- A surface, a card, a button or an action row may be a link (#243): `SetUrl(address)` or `BindUrl` draws its root as an anchor, so
  the address opens in a new tab, copies as a link and is followed in place with no round trip, behind the page's leave guard; a
  button and an action row keep their look on it. A link with a command on its click, a toggle's or a drawer's press, or a
  control inside it — anything with a click of its own, a picture `OnClickShowImage` opens included, and a host whose own parts
  are presses: tabs, a pager, a theme or language switcher, an expander, a panel with its fold toggle, a tree, rows chosen by
  selection, a splitter, a command bar, a button group, breadcrumbs or a menu, and a package's component that says so through
  `IPressablePartsComponent` (`HasPressableParts`, true unless it answers otherwise) — fails the compile. Its
  context menu and action bar are its own: a press there follows no link, and an input in that menu fails the compile (its own
  tick or chooser would be kept with the link's press). A link written in a description inside it, or an
  address read as one, shows as its words: the press is the card's, and the page no longer splits the card in two.
- A form's button shows itself busy in one call (#240): `OnSubmitShowingLoading(formId, command)`, with arguments and
  `OnSubmitShowingLoadingLiteral`, where `.OnSubmit(…).ShowLoadingDuring(EventNames.Click)` was written; a form failing its rules
  shows nothing.
- A row's own press passes its key in one call on a button, a surface and a file tile: `OnClickWithItemKey(command)`. Every core
  event takes literal arguments as `OnClick` does: an input's `OnChangeLiteral`/`OnBlurLiteral`; the items view's
  `OnItemOpenLiteral`/`OnItemMoveLiteral`/`OnItemRemoveLiteral`; the tree's `OnNodeOpenLiteral`, `OnNodeMoveLiteral`,
  `OnNodeRemoveLiteral`, `OnNodeRenameLiteral`, `OnNodeUnfoldLiteral`; a table's and a tree's `OnRowOpenLiteral`/`OnRowRemoveLiteral`
  and the table's `OnRowMoveLiteral`; the tabs view's `OnItemRemoveLiteral`/`OnItemRenameLiteral`/`OnTabMenuEntryLiteral`, a tab's
  `OnRemoveLiteral`/`OnRenameLiteral` (also on `ITabItemComponent`); a dialog's `OnCloseLiteral`. A standard action is a command
  bar's or a button group's item as it is a menu's entry: `UIStandardAction.Delete.ToButtonItem(id, type, iconOnly)`, its danger
  by `ButtonType(type)` and `ButtonInk(type)`, the one rule the Extensions' buttons follow too.
- A toast with no action and a form's discard run in an interaction, with no round trip: `InteractOn(EventNames.Click, new
  ShowNotificationEffect("Copied."))`, `new DiscardFormEffect(formId)` on a Cancel or a Discard.
- `CopyToClipboardEffect.ValueOf` of a component that holds no value copies the words it shows — a message's text, by its row's own
  button, with no command; of a text showing a description, that line alone, its title being a label over it (a message's author).
- One menu entry runs an effect on the page in place of the entries' command: `OnItemClick(entryKey, effect)` on a menu, a split
  button, a command bar, a button group, breadcrumbs or an items view, `OnRowClick(key, effect)` on a table, `OnNodeClick` on a
  tree, `OnActionClick` on a key-value action — declared entries and bound ones alike, from a click, the keyboard, a shortcut, a
  long press's strip or an action bar; the other keys keep the command. A menu's Copy is `.OnItemClick("copy",
  CopyToClipboardEffect.ValueOf(textId))`, with no round trip.
  The test page's `UITestComponent.Menu` reaches a split button's entries.
- `ShowLoadingDuring(sourceComponentId, eventName)` shows this component loading while another runs its command — a form's panel
  while its button saves.
- An address an effect goes to is read as the route registry reads a route: a `NavigateEffect`'s route, a `NavigateBackEffect`'s
  fallback, a `ConfirmLeaveEffect`'s target and a system notification's `Address` without a leading `/` gain it, so the constant a
  route was registered under (`"settings"`) leads there; the page dropped it. The space around an address goes.
- A view warns at compile, beside a binding naming nothing, of one the server cannot read (a computed or plain controller property,
  or a path through a record — make each step a `[RecursiveMember]` of a `RecursiveObservable`), of a row's `Root` binding the row's
  item has too (bind it `Relative`), of a declared list's row binding what none of its items has, and of a `BindContext` path as
  of a property's.
- The test page runs effects as the browser does: the viewer's close of a dialog (`CloseDialogEffect` with `RaisesClose`) lets the
  edit of a form under its key go and raises its `OnClose`, `DismissDialogAsync(key)` closes one as Escape or a press beside it
  does, a show, hide or collapse writes its target's visibility, and a language or theme the page switches to reaches its session
  and controller.
- `UIPhrase.HasWords(words)` is the one rule for words that say something — a key, or an author's text that is not blank — which
  every place requiring words follows (a table column's `HasCaption` now reads a blank caption as none, as the rest do).
  `CompiledView.FindDialog(key)` finds a view's dialog as `FindRegion` finds a region.
- A platform builds on the core's public seams alone: the web is granted none of its internals, and what it used is public —
  `IUISessionKeyHandover` (hand a page the key its sign-in moved it to; in `NE.Standard.UI.Shell.Sessions`, beside
  `IUISessionSignIn`), `UIPlatformDefaults` (the platform's say over an option left
  unset), `UIAllowanceCharge` (what an upload or a staged value counts against the session's allowance),
  `StoredUserSessionResolver` with `ApplyClaims` (the host's principal over a session read outside a page) and
  `UIApplicationStorage` (the application's own folder under the temp folder). A second platform registers and calls them as
  the web does (docs: Platforms).

