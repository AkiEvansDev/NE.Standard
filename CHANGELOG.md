# Changelog

The framework's changelog — the `core` slice. Every package in the slice carries the same version and goes out together. This file
holds only what is not released yet, under `## X.Y.Z`: the release workflow cuts that section out as the body of the GitHub release
(a tag with no section fails the release), and the notes of every released version live there —
https://github.com/AkiEvansDev/NE.Standard/releases. Other slices keep their own beside their sources (`addons/<Name>/CHANGELOG.md`).

## 1.10.0

- A glyph edge passes over a drawer's own button the shell hides for its side's state (#216): beside a pinned side, its close
  (`OpensDrawer`) counted as the last thing shown, so the pin before it stood its box, 6 px in, on the edge; and a row on the edge — a
  pane header's leading Back and avatar — passes the edge on to its own first or last button, where Back's glyph stood 11 px in.
- A rail's `Separator` entry is the rule alone, and a caption the rule it stands for (#218): both took a whole entry's height, the
  line on top and an empty slot under it.
- A horizontal menu's current entry is marked by its bottom line alone, as a tab strip's caption is: it wore the list's ground
  under the line too. A group on the bar holding it drops its faint ground and keeps its short mark; a rail and a bar's flyout are
  unchanged, and an authored `SelectionStyle` ground still shows.
- A period on a calendar is one band along each week, from the start's middle to the end's, under the days and across the gaps
  between them, rounded where a week breaks it — the preview up to the pointer's day too: each day within was a pill of its own,
  and the period read as dots.
- The overlay scrollbar has arrows at its ends, shown as the pointer nears it: a press scrolls 40 px, held it repeats. Their room
  is kept whether they show or not, so the thumb at an end stands clear of a rounded corner; a track shorter than 80 px keeps none.
- A pane container's pane can keep its own size: `AddPane(…, keepsSize: true)` takes its tracks along to a place lined up beside its
  own, the other pane taking what is left, so a 280 px column carried across a wide one stays 280 px; elsewhere — across a gap, along
  an axis a splitter sizes — it takes the place's size, as every pane does. `UIPanePlace` carries `KeepsSize`.
- A component of an application's own with a property named `Target` compiles: the view took it for a pager and refused a
  `Target` that named no paged list. A pager is known by its type now (`IPagerComponent`).
- A colour swatch (`ColorInputComponent.AsSwatch()`) keeps to the `Width` and `Height` set on it (#221): its least width was its
  text's, so a narrow swatch drew over what stood after it. Narrower than its value, it is the colour alone.
- A small text field's icon-only action fits its line: it kept a medium button's 18 px glyph and padding, stood 28 px tall and
  stretched the small field from 24 px to 30.
- A finger held on a part with a context menu shows the hold (#220): past 150 ms the press wave grows from the finger and fills as
  the menu opens, so a reader knows to keep holding; let go early, it goes. Under reduced motion or `UITheme.PressRipple = false`
  the part shows the pressed wash alone. A right click shows nothing new.
- A press the server is slow to answer shows it is working: past 300 ms with no answer, the element a click raised its command
  from is marked (`data-ui-pending`, `aria-busy`) until the command ends — a button wears its loading look, its icon turning into
  the ring, a row or a card under the loading veil and ring — and at once while the page waits to re-attach. No author opt-in; an element shown
  loading by its author is not marked again. `[UICommand(ShowsPending = false)]` turns it off for one command.
- A text area's or a text input's actions can stand in a row under it on a narrow screen (#219): `SetActionsBelow(UIResponsiveTier.Md)`
  lays the leading ones at the row's start and the trailing ones at its end below that width (under a hairline where the field draws no edge of its own),
  each end under the field's own buttons. One action at each end can be flagged to stay in the field —
  `AddLeadingAction(emoji, inField: true)` first at its start, `AddTrailingAction(send, inField: true)` last at its end
  (`LeadingInFieldAction`, `TrailingInFieldAction`) — at every width. The same buttons move, so a flyout or a split button among
  them keeps its one popup. A ghost button with words at a field's end lines its words up with the text, as a glyph does. The
  demo's chat composer reads so on a phone, its emoji in the field, and the Text Input page has a comment field whose Post does.
- `WebHubOptions.SimulatedLatency` holds every hub call that long before it is handled, to try a page over a slow link; Development
  only, ignored with a warning elsewhere. Set it without code through `NE:Hub:SimulatedLatency` (a time span or milliseconds) — the
  demo has a `DemoApp.Web (slow network)` launch profile at 800 ms.
- A load the page starts itself shows a thin bar in the brand's colour along the window's top once it takes past 200 ms — a link of
  the site that leaves the page here, a `NavigateEffect`, a switch to another runtime of the route — where the old page stood live
  with no sign. It stands still under reduced motion and is gone when the page comes back from the browser's page cache.
- A pager marks the page pressed at once, and the old rows shimmer as a windowed list's unread rows do until the new ones land; a
  read that fails puts the mark back. A second press, Page Up and Page Down go on from the page marked.
- A windowed table draws the rows it has not read as an items view does, grey bars shimmering while a window is read; it showed
  blank space.
- A search whose list `OnSearch` answers turns its glyph into the loading ring while a query is unanswered past 300 ms, until the
  last one asked is answered; its list is `aria-busy` meanwhile.
- Dependencies: `Microsoft.Extensions.DependencyInjection`, `Logging` and their abstractions are 10.0.13, so an application's
  own references to them are at least that; the client's build tools are on their latest releases, and the core glyphs are cut
  from Material Symbols 0.48.0.
