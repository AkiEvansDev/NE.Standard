# Changelog

The framework's changelog — the `core` slice. Every package in the slice carries the same version and goes out together. This file
holds only what is not released yet, under `## X.Y.Z`: the release workflow cuts that section out as the body of the GitHub release
(a tag with no section fails the release), and the notes of every released version live there —
https://github.com/AkiEvansDev/NE.Standard/releases. Other slices keep their own beside their sources (`addons/<Name>/CHANGELOG.md`).

## 1.11.0

- A text field's actions under it on a narrow screen (`SetActionsBelow`) stand on the field's own ground, inside its edge, under a
  hairline on every appearance: they stood on the page under the field, so on a Tonal or Filled field they read as another control.
- A menu's `Separator` is the rule alone and a `Header` a list row's caption in every form a menu takes (#225): on a phone's sheet
  each stood a finger's 48 px entry, the rule over an empty slot; in a collapsed menu a rule kept an entry's padding and a caption
  an empty line under its rule, and in a rail a caption's words stood under the rule it is drawn as. Every rule sizing a menu's
  entries leaves a caption and a rule out, as a rail's did (#218).
- An items view, a tree or a scroll container that grows with its rows keeps the overlay scrollbar's room only while it overflows
  (#223): one with no `Height`, `MaxHeight` or `Fill` in a page, a dialog or a drawer kept 12 px for a bar it never showed, so its
  rows ended 12 px short of the fields over it. One its own size bounds keeps the room always, as before.
- A text field's action can stand at the other end of the row under the field from its side beside it (#224):
  `AddLeadingAction(chats, belowAt: UIAlignment.End)` keeps it at the start beside the text, last there, and stands it at the row's
  end on a phone, before the trailing tools there; `AddTrailingAction(..., belowAt: UIAlignment.Start)` the other way round, on a
  text area and a text input alike. A Send and a Stop that replace each other are one in-field button, its icon and command bound.
- A theme can draw three marks in the text's colour rather than the brand's, each on its own: `UITheme.KeyboardMark` (the
  keyboard's frame), `FieldFocus` (a focused or open field's edge) and `SelectionMark` (the line under a chosen tab, beside a
  chosen menu entry or row, a chosen node's ring, and the line or edge where a dragged thing would land), each `UIMarkTone.Brand`
  by default or `Neutral` — near-white on a dark page.
- The keyboard's frame stands on a chosen line rather than curving off it: on a tab's caption it runs along the caption's edges,
  its foot square on the strip's line; on a menu's current entry and a chosen row it is straight on the line's side, and on a
  menu's entry it lies on the line, which beside it had read 3 px thick.
- A key-value row's editor is `Ghost` unless its input sets an appearance (`EnableEditing`'s text input and every
  `SetValueInputTemplate`/`AddValueInputTemplate` field): it opens focused as the row's next line, as a data grid's cell editor does,
  rather than a Tonal box on the row. A Ghost editor with a message keeps the message's edge while it has the focus.
- **Breaking:** `WebCultures` is gone: `UICultures.Resolve` (`NE.Standard.UI.Shell.Localization`) resolves an authored culture
  name, an unknown or empty one as the invariant culture, for the server's value parsing and the web platform alike.
- One shared piece where each place kept its own: `WebWireJson.Options` (the wire's JSON conventions, read-only, its type
  metadata built once), `UIScriptText.Of` (a value as the page's `String()` writes it), `UIPictureTypes.Sniff`/`ExtensionOf`
  (a picture's type by its first bytes), `UITemporalPattern.Walk` (a pattern's tokens without allocating),
  `WebNumberFormat.WithoutTrailingZeros`, and in Renderers.Foundation `NativeInputRendererBase.RenderDebounce`/`RenderMaxLength`,
  `OrientationStyleRenderer` and `ScrollStyleRenderer`; `HtmlContentBuilder` and the element builder share `HtmlChildrenBuilder`.
- A word's argument written on the server — a date, a time of no zone, a list — reads as the page writes it (`2026-10-17`, `1,2`)
  rather than in .NET's invariant form, as a rule's comparison already read it.
- **Breaking:** a view filter and a command filter are one `IUIFilter<TContext>` — `IUIViewFilter` and `IUICommandFilter` keep
  their names and carry its `Order` and `InvokeAsync`, their contexts are `IUIFilterContext` — and one internal chain runs both. A
  filter that implemented `IUICommandFilter.InvokeAsync` or `IUIViewFilter.InvokeAsync` explicitly names
  `IUIFilter<UICommandFilterContext>` or `IUIFilter<UIViewFilterContext>` instead.
- The server picks the template a row wears one way, `ItemTemplateSelection`, wherever it asks — the renderer, the runtime and
  the test page: the runtime read a variant's key itself, so a key property hidden with `new` threw, one named in another case or on
  a dictionary row read as none, and a number's key followed the server's culture — and a row's own lists could be sent for
  another variant than the page drew. `UIComponentStateIndex.GetStaticString` reads a host's static text.
- A binding template is read in one place: `RecursivePathTemplate` gives its steps (`Parts`, `RecursivePathTemplatePart`),
  `TryParse`, and builds on itself (`Append`, `AppendParameter`, `Take`); `CompiledUIBindingTemplate.Parsed` holds it parsed
  once, and the item walk, the initial lists, the compiler and the binding index read its parts. `PathSegment.ForParameter`,
  `UIRowKeys.IsKey`/`IsPathParameter` state what a key and a path's parameter may be.
- `UIActionArgument.Literals` maps named values to literal arguments, as every `*Literal` overload does;
  `UIRuntimeTypeJsonConverter<T>` and `UIJsonElementExtensions.TryGetPropertyIgnoreCase` are what the effect and update
  converters share.
- The plugin surface: `names.ghostButtonClass`/`smallButtonClass` for a button a package draws in the framework's small ghost
  look, and the mixins `.ui-popup-arrow()` (a popup's tail), `.ui-authored-border()` (a border an author's `BorderThickness` and
  `BorderRadius` reach), `.ui-text-clamp(@lines)`, `.ui-bare-button()` and `.ui-word-action()` (a Clear or a Today in the primary ink).
- A breadcrumb trail stands each line's first words on its holder's edge, as the text over and under it does: the first step's
  padding had set its words 4 px in.
- A panel's strip (`UIPage.Header(UIHeaderSize.Strip, …)`) draws its icon buttons small unless their size is said: a medium icon
  hung past the panel's padding, and its hover and keyboard frame were cut flat at the panel's edge.
- Tab meets a text field's buttons in the order they are drawn: the leading ones (`AddLeadingAction`, in the field or beside it)
  before the text, so Shift+Tab from the text reaches them, the trailing ones after it; on a narrow screen with the actions below
  (`SetActionsBelow`), the field's own row comes before the row of tools under it. They all followed the text before.
- A collapsible panel that draws no switch of its own (`SetShowCollapseToggle(false)`) folds to nothing: its fill, edge and padding
  stood as an empty strip where a switch would be.
- A folded right or bottom collapsible panel keeps its switch on its own edge: in a cell wider or taller than its rail, it stood at
  the cell's start, across from where the panel hangs.
- `UIText.Person` shows its name and caption whole in a row: shared out over 23 star columns, each rounded to a sub-pixel, they
  ended in an ellipsis a fraction of a pixel short ("Mika Lai…").
- In a horizontal `StackPanel` short of room, the row's last text gives way and ends in its ellipsis, rather than running under the
  panel's edge cut mid-letter; icons, badges, buttons and the texts before it keep their width.
- A pane carried in a `PaneContainer` shows whole on its way, shadow and all, over everything round it: it stands in the top layer
  while it moves, where its container's clip or a scroller's round it had cut it flat.
- A growing text area (`SetAutoGrow`) keeps its width as it is typed into, filling its room up to its `MaxWidth`: aligned Start, it
  was as wide as its text, narrowed to its placeholder when empty and widened with every key.
- A Ghost field shows the field it is under the pointer, a paler wash than its focus's and no edge — a text input, a number, a date
  or time, a select, a colour, a file, a text area, a picture's row and a key-value row's editor alike; in a row that washes itself
  under the pointer the row's wash is the one answer.
- Typing in a field the pointer put the caret in leaves the pointer the last input: Enter or Escape there gives the focus back
  without the keyboard's frame — a key-value row's Edit after its Save, a dialog's opener. Tab draws it, as before.
- A folded menu's entry with no icon shows its title's first letter where the icon would stand, at the icon's size, rather than an
  empty square: a menu of words alone still folds to something to press.
- A modal dialog opening over an action bar's host takes the bar away: a wire pulled from a canvas node's pin and let go opened
  the picker with the node's bar standing over it.
- The overlay scrollbar's arrows are blunt triangles as wide as the thumb, their flat side to it, rather than 6 by 4 px specks; the upright bar of a table runs beside its rows, under the header
  sticking over them and over a package's totals, as the scroller's `scroll-padding` says.
- A table that scrolls sideways fades what runs under its edges into its ground, as does the shade under a pinned column: the
  text's colour drew a light strip there on a dark page.
- A Small or Large split button's list draws its entries at a menu's own size: the button's size reached them too, a Small one's
  entries in caption type, smaller than every other menu's.
- A command bar on a row stands its commands on a line their own height, centred, however tall the bar is laid: in a bar stretched
  taller, its "…" was a square as tall as the bar, and the room it kept sent commands into the list that fitted on the bar.
- A command bar whose `Spacing` changes while it shows is fitted again, its last commands going behind the "…" if they no longer fit,
  rather than running past the bar's edge until the window was resized.
- A centred or end-aligned paragraph with an icon keeps its title whole: the icon's column took half the block and the title ended
  in an ellipsis with room to spare.
- A paragraph clamped by `MaxLines` stands its description as close to its title as one that runs on: it stood 3 px further off.
- A text's picture icon with no size of its own (`IconAlignment.Content`) is a square as tall as its title's line and one
  description line, centred when the words run on: it was as tall as the whole block, which at a phone's width it never settled
  on — the tile ran past its column and the words spilled under the next text.
- A look two places draw for one reason is one value (DECISIONS, *One share per meaning*): every scrollbar's thumb and arrows at
  32 % of the text and 48 % under the pointer (a native thumb was 24-28 %), a multi-select's chip at a tinted badge's 16 % (14 %),
  the plate over a picture at 50 % (a replaceable picture's glass 45 %, the lightbox's controls 55 %), a file tile's ground the ink
  of what it stands on at Markdown code's 7 % (the page's text at 8 %). The theme writes
  `--ui-wash-hover-share` and `--ui-wash-active-share`, which a surface button, a clickable surface, a Link button, an outline's
  press and the press wave mix into their own fill or hue: a Link button presses at 16 % (18 %), a clickable surface's hover on the
  dark theme is 9 % (10 %).
- A text's `[caption]{text}` fold is its words at 55 % (68 %) and at their weight, no longer bold; its chevron is the words' size on
  their small letters' middle, where a 12 px mark stood small and high.
- **Breaking:** a separator's line is the border's colour, as a card's edge and a row's rule beside it; the theme no longer writes
  `--ui-border-subtle` (the border at 75 %).
- A text area the reader can resize (`SetResize`) wears six small squares in a stair in its corner, the border's colour, lighter under the pointer, as
  a Graph node's corner does, rather than the browser's two lines (Chromium and Safari; Firefox keeps its own).
