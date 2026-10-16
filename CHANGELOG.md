# Changelog

The framework's changelog — the `core` slice. Every package in the slice carries the same version and goes out together. This file
holds only what is not released yet, under `## X.Y.Z`: the release workflow cuts that section out as the body of the GitHub release
(a tag with no section fails the release), and the notes of every released version live there —
https://github.com/AkiEvansDev/NE.Standard/releases. Other slices keep their own beside their sources (`addons/<Name>/CHANGELOG.md`).

## 1.9.0

- A scroll container lent the air after its container (`ScrollbarAir`) hangs its bar's room into it (#208): placed in a container or
  a stack, it was held at its cell's width, so the hung room ate its content and its rows ended 12 px short of the field over them;
  its fill and its cap now widen by what it hangs. An items view's or a tree's list, one level down, was not affected.
- `FileItem` and `DefaultFileTemplate`: a list of files drawn as tiles — `new ItemsViewComponent().SetTemplate(new DefaultFileTemplate())`
  over `FileItem`s with a name, size, type, glyph and `Loading` — instead of a model and a hand-bound tile per page.
- `UIText.Caption(title, description)` writes its line as small as the caption, in the muted ink: it stood in the body size, larger
  than the caption it explains.
- A quiet expander in an accordion stays a line with no edge: from the second section on, the accordion's shared edge and corners
  drew a frame round it.
- A dragged row of a tree, an items view or a table, and a dragged tab, is drawn by the page: a copy of it, whole and opaque, lifted
  over the page and following the pointer from where the press took it. The browser's own picture floated above the pointer (Chrome
  measured its offset with the press's wave in the row, hundreds of pixels above a wide row), and Windows faded one wider than about
  300 px into nothing towards its edges after Chrome had dimmed all of it.
- A grouped items view puts a group it did not hold where the source has it (#213): rows inserted at the head under a new group
  went to the very end of the list — under some 600 rows in NE.Home's emoji panel, or out of a virtualized view — and only a reload
  put them back at the head. The page now orders groups by their first row in the source, as the server does.
- A menu split button (`UIIconButtons.More`, `UISplitButtonMode.Menu`) answers the pointer as the icon button beside it (#212): its
  wash is on the whole button, 28 × 28 where it was 26 × 26 inside the border, and a field's action or a hovered row's quiet button
  takes it back to the ink alone, as theirs. A split button of two presses still washes the part under the pointer.
- A surface stroked on one side alone — `UIText.Quote`, or any surface or card with a one-sided `BorderThickness` — stands straight
  along the stroke and rounds its far corners as a list's entry does (#210): a pressable quote's wash was square at its end, and a
  surface's own radius bent the stroke at both ends. The corner follows the theme; an authored radius still wins.
- `SurfaceComponent.QuietHover` (cards too): a clickable surface the pointer crosses on its way elsewhere — a pinned bar, a banner —
  takes half the wash under the pointer and no lift (#211); its press is any surface's.
- An icon button at either end of a band stands its glyph on the content's edge, not its box (#214): `UIPage.Header`'s trailing
  actions, the Pane and Strip headers at both ends, and `UILayout.Ends` (a panel's head, `UIPage.Heading`) now do what a page
  header's leading action did, for every size — a small × and a medium pencil in one column line up. A new
  `StackPanelComponent.GlyphEdge` (`Start` or `End`) marks a panel of one's own; the wash runs into the padding.
- `TabsComponent.AddAction` and `AddTabAction(key, …)`: actions at the strip's end, for every tab or only while one is in front
  (#215) — a button or a flyout opening from one, sized to the captions and on their line, the captions and their "…" keeping the
  room the actions leave; a tab's own switch with it on the page, no round trip.
- The server judges a request by the row it lands on. A value written from the page reaches the gates with the row keys its
  component stands in and no more: a forged extra key had them judge another row than the one written, so a choice could reach a
  row its abilities refuse. A command's `ArgCurrentItemKey`, `ArgGroupKey`, `ArgCurrentItem` or any bound argument whose row comes
  as an index rather than its key is refused: it took an outer row's key or item.
- A tab left open past `Sessions.IdleTimeout` no longer keeps its session: the hub's touch brought back a session idle past its
  timeout that the sweep had not reached yet, and a command still ran on it. The touch now reads the session first and ends one
  idle or gone, with its pages, and a command on an idle session is refused.
- A session id the store does not hold is never taken on, whatever resolver is installed: one that keeps the id it is offered, as
  `UserSessionResolverBase.ResolveSessionId` does, had the client's own pick stored as its session. A page load goes on under a
  new id; an attach answers a reload.
- A windowed source whose read writes a rule's source its own list reads, through `InvokeAsync`, no longer hangs its page: the
  list's reload waited for the very read that asked for it. That reload is left for the next drain.
- A windowed list scrolled while a sort or a search replaced its window no longer joins rows that do not follow on: a read asked
  from the old window's edge reads nothing, and the page asks again from the window it now holds.
- `IRecursiveCollection.IndexOf(object)`: a `RecursiveCollection<T>`'s place of an item from its own index, without the item
  type. The runtime finds a changed item that way — a chart's or a graph's value change scanned the whole list. With it,
  `RecursiveCollection.Move` reindexes only between the two places, a windowed source finds its rows by key, a nested list's
  update outside a host's template variants answers from one lookup, and a selection's gate reads the current choice into a set
  only for a write of many keys.
- `UIComparisonEvaluator` reads a `DateTime` as its text without an exception — a date filter over many rows threw and caught one
  per row — and a `char` as its one-character text, as the page reads it: it was neither a number nor text, and ordered against
  nothing.
- A field's placeholder has an ink of its own, `--ui-text-placeholder`, the page's ink at 60 %: in the muted ink of captions it
  read as a value. One ink in every field — a caret field, a text area (a bare one wore the browser's grey), a select, an empty
  time's parts and the mark between them, the inline picture row.
- Long lists do less work on the page. A change set brings each list in step — its rules, empty state and groups — once, at its
  end, not after every change in it (a set of a hundred removes ran them a hundred times); inserting many rows no longer reads the
  list's templates through every row drawn, which was quadratic; removing many plans the keyboard's cursor and the order once; an
  arrow in a single-choice list writes `aria-selected` only where it changes and reads no row's controls again; a drag reads the
  rows it stands over once, not at each of some twenty `dragover`s a second; a patch to one of thousands of virtualized rows finds
  it by key.
- A server patch to a value the viewer sorts or filters a list by — a header's sort, a filter row — puts the row where it now
  belongs: only an authored `FilterBy`/`SortBy` re-placed a row, so it kept its old place under the viewer's own.
- Deleting the row under the keyboard's cursor moves the cursor to the row that followed it: it skipped that row for the next. The
  row it lands on is scrolled into view only where the removed one was in view, so a windowed list trimmed from its top no longer
  jumps back there.
- A row inserted into a tree or moved in it while one of its folders loads lands in its place: the folder's row of waiting was
  counted as a node, putting everything past it one place off.
- A windowed list keeps the first row its reader sees where it stands through every change and layout — rows read in or trimmed
  above, a picture loaded above, the rows' estimated height moving — but at the very top of the source, where a row put in above
  stays in view unless a read upwards brought it. The estimate is the mean of every row measured, each counted once and learnt
  again at a new width or a read from the start; it was the current window's alone, so the spacers and the view moved at each read.
- A validation message shown in a mark's tooltip — a field in a table cell, a closed key-value row's dot — reads as written: it
  was read as inline markup, so `[a-z]` lost its brackets and a value quoted in it could become a link.
- A progress with no value is drawn as under way: a segment sweeping the bar, a quarter turning round the ring, the number hidden.
  It stood empty, its unit alone where the number goes. Under reduced motion the ring keeps turning, as every loading ring does,
  and the bar stands still.
- Smaller visual fixes: a vertical slider's scale reads bottom to top, the minimum under the track, as the upright input runs; a
  toast's close button shows the keyboard's frame and is named by the shared "Close"; in forced colours the language and theme
  switchers keep their chosen entry outlined; a validation message wraps a long unbroken word, a file's or a link's name, rather
  than widening its field; a checkbox's and a switch's description is a caption, as a radio option's, not body text as large as
  the label. The plugin stylesheet gains `@ui-field-padding-sm` and `@ui-severity-stroke`, and `@ui-loading-label-opacity` fades
  a tree's waiting chevron too.
- `UIContext.SignInAsync` moves the session to a new id at once, and a sign-in no longer has to end in a navigation: the old id
  is gone from the store, the signing page goes on under the new one and trades a one-time token, pushed ahead of its command's
  answer, for the new cookie (`POST /_ne/session/key`) before it loads another page or sends a file or a large value, and every
  other page of the old id ends silently. The id rotated only at the next page load, which handed the signed-in key to whichever
  load of the old id came first — one a sibling subdomain could have planted. A sign-in made while a render runs the controller's
  code is handed out by that render's response.
- `HttpContext.EndUISessionAsync()` ends the UI session behind a request, for a host's own sign-out under
  `IdentitySource = Claims`: a page's connection keeps the principal it connected with, so an open page went on acting as the
  user who had signed out.
- A file the framework serves inert is never a page's script, stylesheet or WebAssembly: the JavaScript family, `text/css`,
  `application/wasm` and a type that does not parse go as `application/octet-stream`, as an attachment. Under `nosniff` an upload
  served back could otherwise run as a `<script src>` that a host's `script-src 'self'` lets through.
- `UISecurityOptions.RefusalWarningsPerMinute` (10 by default) caps the refusals a runtime logs as warnings each minute, the rest
  at `Debug`: a page writing to a hidden field in a loop flooded the log. An unknown event id, or a write no binding of the page
  takes (`UICompiledBindingIndex.TryResolveWrite`), is a refusal logged at `Debug` rather than a failure with a stack.
- `RecursiveCollection<T>.RemoveAll(predicate)` removes every match in one pass and sends one remove per run of neighbouring rows,
  never a reset, which reads as emptied; back-to-back removes on one list leave as one, as inserts already did.
- A list rewritten row by row no longer reads the runtime's whole queue once a row under its lock: what a row withdraws is found
  in one pass, and a host with more than 512 updates queued and more than it has rows is sent whole.
- A row whose property only its host's filter or sort reads is sent again when the property changes, so the host re-places it:
  the change reached no rule. Names compare ignoring case; a host standing inside rows whose rules are bound is not covered.
- A windowed list's trim is told from a removal (`RecursiveCollection.TrimRange`, `RecursiveChange.Trimmed`, sent as `trimmed`):
  the keyboard's cursor on a trimmed row waits for it to be read in again, where it moved on as from a deleted one.
- Posted work runs in no caller's flow: `Context.Handle` in it is the attached page, where it was the page whose command started
  the queue — under `PerClient` another tab's, its command perhaps over.
- `InteractBefore(eventName, …)`/`InteractAfter(eventName, …)` and `ShowLoadingDuring(eventName)` give any event's command the
  click's pair — a submit, a change once its value reached the server, Enter or Escape in a field, an expander's or a flyout's;
  `OnClickShowingLoading` takes `OnClick`'s overloads (`OnClickShowingLoadingLiteral`, `OnClickShowingLoadingWithItemKey`), and
  `EventNames.BeforePrefix`/`AfterPrefix` name the pair.
- A reader's own edit of a field in a list's row reaches the row's item once its answer takes it: a row drawn again showed the value
  from before, and a sort, filter or group reading the field ignored it. The list re-places the row a moment after the focus leaves
  it, never under the caret; an edit the server refused stays the server's.
- A virtualized list keeps the row holding the focus drawn when it scrolls out of range or its item is refilled, replaced or
  emptied, until the focus leaves it: a grid's open editor and its draft went with it.
- A lazy tree folder folded and unfolded again while its children are on their way no longer asks twice and gets them twice; once
  its ask has settled, the next unfold asks again, after one that brought none too.
- A tree's fold is kept per folder and painted before the first paint by walking the rows' parents, so a folder of ten thousand
  children is one key, not a selector per row; every folder on the page and at most 200 others are kept, the oldest let go. A fold
  stored in the earlier shape is not painted and is cleared.
- Delete on a chosen row removes only the chosen rows shown: one folded away or filtered out stayed out of sight and went too.
- A row put into a long list no longer has the engines read the whole list again: each reads the rows put in alone.
- Smaller client fixes: a windowed list learns its rows' size again when the server refills it unasked (a rule changed); the
  host's `aria-activedescendant` goes with the cursor's row; the language switcher keeps an author's tooltip that says what its
  name says. The plugin's `rows.itemsVersion(host)` moves whenever `itemsOf` may answer otherwise, never on a scroll.
- `ITextComponent.DescriptionPlain` shows a description as written, its asterisks and brackets as characters — words a person
  typed, bound to it. `DefaultErrorView` writes the address's message so: an application's `ErrorPageMessage` holding markup now
  shows as written.
- A NaN or an infinity travels as null and reads as null on the server too (`UIScriptNumber.ReadsAsNull`): a phrase fills nothing
  for it and picks no plural by it, a rule compares it as null, `WebNumberFormat` and `UITestPage.Words` write nothing. Written as
  a number it threw, and the dropped connection's reattach sent it again. A `double` or `float` member's own
  `[JsonNumberHandling]` is honoured on the wire — a number read from text, `NaN`, `Infinity` and `-Infinity` among them, where
  it allows; not on a collection's elements, and `WriteAsString` is not written — and a `decimal` reads as the double nearest
  its digits (`UIScriptNumber.Read(decimal)`), as the page reads it.
- `StackPanelComponent.AlignWithFieldBoxes` (`UIFieldBoxAlignment`) stands a panel level with the boxes of captioned fields
  beside it — a caption line down, centred on the box — at the widths it is set for. `UIForm.Row` sets it for a control with no
  caption among captioned fields (a switch, a checkbox, a button), which stood level with their captions.
- Small controls take a 24 px press without growing (`.ui-hit-area()`, `@ui-hit-target` in the plugin stylesheet): a field's
  adornments, a stepper's arrows up to the field's edge, a select's clear, a chip's × within its chip, a tab's close, a tree's
  chevron. A toast's × is the dialog's small ghost button, with its wash, its press and its tooltip.
- A tab's caption shows the keyboard's frame, set in, its bottom on the chosen line (`.ui-keyboard-frame-inset()`): it had none.
- A table that scrolls sideways shades each edge it can still scroll toward: the overlay bar is hidden until hovered, and on a
  phone nothing said the table scrolls.
- Smaller visual fixes: down a menu where some entries carry an icon, every entry's words start on one edge, and a section's start
  under its group's; a list's empty state writes its title in the text's own ink and its description muted (`UIPage.Empty` too),
  where a muted title read weaker than the line under it; a badge's words give way after the title, down to half the line, and
  beside a count the title gives way alone, where the badge cut a card's title to its first letters; a select's options are list
  rows, 28 px (24 on a small field), their content centred where a template's words stood at the row's top.
- `StatusComponent` and `UIPage.Status`: a page's state standing in for all of it — not found, refused, failed — as the mark on a
  faint disc of its tone, the centred title and line, and the ways on under them. The default not-found and error pages are drawn
  with it, each with a way back to the application's root (`UIStrings.StatusHome`), where they were a bare heading in the corner
  with no way on; the error page's tab read `DefaultErrorView`.
- A glyph icon with `Shape` `Circle` stands on a faint disc of its colour, twice its size; the shape was a picture's alone.
- `UIPage.Outcome` keeps its line close under its title, the room between the words and the ways on: one 16 px step stood
  between all three.
- A badge select's chip of two characters ("P1") keeps a pill's start padding: drawn as a round badge, its words stood against its
  edge.
- An expander's header answers a press in the chevron's ink alone: the wave across the card's band is gone, as the quiet one's was.
- **Breaking:** `UIStrings.NotFoundTitle` reads "Page not found" (and in Russian and Chinese) where it read "404".
- **Breaking:** `WebClassNames.BorderNone` is `BorderEdge`, naming a one-sided stroke beside no edge; the converter
  `borderNoneClass` is `borderEdgeClass`.
- **Breaking:** `UIStrings.NotificationClose` (`ui.notification.close`) is gone: a toast's close button says `UIStrings.ActionClose`
  (`ui.action.close`), and an application's own words for the old key are no longer read.
- **Breaking:** `SignInAsync` called outside a running command — posted work, a job, a call from outside — throws while another
  page shares the runtime (`PerClient`): which page signs in is then not known, and the key would go to the last one attached. Sign
  in from the page's own command.
- **Breaking:** over HTTPS the session cookie is `__Host-<ClientKey>` — `Secure`, `Path=/`, no `Domain` — so a sibling subdomain
  can neither set nor shadow it. Every reader is signed out once; the plain name is not read over HTTPS, and a `ClientKey` starting
  `__Host-` or `__Secure-` is refused at startup. Behind a proxy that ends TLS, `UseForwardedHeaders` must run before the framework,
  or the request reads as HTTP and the cookie goes out under the plain name without `Secure`.
- **Breaking:** a page may be framed by its own origin only: the shell sends `X-Frame-Options: SAMEORIGIN` where the host sent
  none and appends `Content-Security-Policy: frame-ancestors 'self'` beside the host's own policy, and a cross-site frame's request
  for a page is a `404`. A sibling site framing a signed-in page could steer the reader's presses. An application framed by another
  site names it in `WebEndpointOptions.FrameAncestors` (sent as the policy alone) or turns `RestrictFraming` off.
- **Breaking:** a page loads only as a document: a request whose `Sec-Fetch-Dest` says it is not one (an `<img>`, a script, a
  `fetch`) is a `404` before any session, filter or hook runs — a sibling site's content fetching a page ran its navigation hooks as
  whoever viewed it. An application's service worker that precaches pages with `fetch(url)` caches that `404`; pass a navigation's
  own request on instead.
- **Breaking:** a `Batch` runtime's answer reaches its tab through the runtime's send queue, after every change set drained before
  it and ahead of every one drained after: it could overtake a push already on its way, or be overtaken by the next flush. The
  answer holds its command's turn until its copy is sent, and `UICommandExecutionResult.Changes` and a window read's returned set
  no longer carry the changes: code reading them reads what the page was sent.
- **Breaking:** `IRecursiveCollection` gains `Count`; a collection of one's own implementing it adds it.
- **Breaking:** `UIItemSourceBase.Prepend` is `Append`'s mirror — an item new in the source where the window starts: the offset
  stays and `TotalCount` grows by one. It lowered the offset as if the window had moved up, and the next read upward skipped a
  row. A source removing an item outside its window calls the new `Remove(key, sourceIndex)`, which moves the window's start back
  for one before it and keeps `HasMoreBefore`, `GroupBefore` and `HasMoreAfter` true to the source.
- **Breaking:** a `[UIAuthorize]` that a `[UIAllowAnonymous]` would quietly open is refused at startup — both on one type or
  command, one on a base type or the declaration a command overrides, or one on a route's view and the other on its controller:
  the anonymous one won, and the route or command took anyone. Keep the one meant; a derived type or an override declaring
  `[UIAllowAnonymous]` over its base's `[UIAuthorize]` still opens it.
- **Breaking:** a before- or after- interaction whose source runs no command on that event no longer compiles — a button with no
  `OnClick` given `InteractBeforeClick`, an event named in another case, an item's event asked of its host rather than its
  template: it rendered and never fired.
- **Breaking:** a phrase's arguments written as text are data where its words read as inline markup — a description, a tooltip: a
  string, an author's text after its lookup and any other value's text are escaped, so a name typed as `[a](b)` shows as typed,
  where it could become a link; the template's own words, a nested key's words, numbers, flags and moments stay markup. A
  renderer's property whose operations read its words both as markup and as text is refused at render: give the text a property
  of its own. A package escapes the same through `WebRenderContext.Translate(…, markup)` and the `ResolveRenderValue` overload
  taking `markup`; the plugin's `strings.write` escapes string arguments on the tooltip, and `strings.format(key, values, markup)`
  where asked.
- **Breaking:** a validation rule other than `Required` passes an empty value: a field left empty — tabbed through, never typed
  in — says only that it is required; `UITestPage` judges alike. A rule that must refuse an empty field adds `Required`.
- **Breaking:** renames — `ImageComponent.CornerRadius` is `BorderRadius`, as every bordered component's; `ImageInputComponent.Shape`
  and `UIImageInputShape` are `Variant` and `UIImageInputVariant`; `TabHeaderComponent` is `TabCaptionComponent` (type key
  `standard.tab-caption`, `TabRegionNames.Caption`, region prefix `tab-caption:`), its classes `ui-tab-caption*` where they were
  `ui-tab-header*`; the plugin mixin `.ui-tab-caption()` is `.ui-tab-caption-box()`.
