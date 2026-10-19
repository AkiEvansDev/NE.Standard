# Changelog

The framework's changelog — the `core` slice. Every package in the slice carries the same version and goes out together. This file
holds only what is not released yet, under `## X.Y.Z`: the release workflow cuts that section out as the body of the GitHub release
(a tag with no section fails the release), and the notes of every released version live there —
https://github.com/AkiEvansDev/NE.Standard/releases. Other slices keep their own beside their sources (`addons/<Name>/CHANGELOG.md`).

## 1.12.0

- **Breaking:** `UILayout.Panes` takes one state object, `UIPanesState`, in place of three visibility paths and a share path
  (#229): `Panes(list, detail, statePath, placeholder, splitter)` over a controller's `UIPanesState` moved by `ShowDetail()`,
  `ShowList()` and `ShowNothing()`; its `Share` is the splitter's, seeded by `SeedShare` and reported by `ShareChanged`. A page drops its
  three visibilities, their helpers' calls and the share it watched in `OnNotify`; `new UIPanesState(chosen: true)` for panes with no
  placeholder. `PanesListVisibility`, `PanesDetailVisibility` and `PanesPlaceholderVisibility` stay, for a part that follows a pane.
- **Breaking:** `MenuComponent.Display` takes a value per breakpoint (#234): `SetDisplay(UIMenuDisplay.Rail, xl: UIMenuDisplay.List)`
  is one menu, a rail below xl and a list from it, its toggle only where it is a list, the shape right from the first paint. In a
  drawer the base tier alone decides: a rail there is drawn as a list, or is the phone's bottom bar. `SetDisplay(UIMenuDisplay.Rail)`
  still compiles; a shell that kept two or three menus for it keeps one.
- A form's submit waits for the uploads its form's pickers have on their way, then reads the selection with them (#233): Enter in
  a composer whose shelf was still uploading sent the words alone and left the file for the next message. The wait stands ahead of
  the page's command turn, so other presses do not queue behind it, and ends with the upload: a stalled one holds the submit until
  the browser gives up on it. An `OnSubmit` field goes as it stood at the press, so words typed meanwhile wait for the next submit,
  and words typed after the press stay in a text field when the answer empties the draft, written after what it pushed;
  a press that left the page or turned inert meanwhile sends nothing; a failed upload, a removed square or a picker taken off the
  page lets the submit go without that file. A shelf now carries its `FormId` (give it the composer's) and takes part in its form
  like any field — submit validation, `OnSubmit` buffering, the form's release and discard — and names a file whose upload failed,
  under the pick's size refusal where there is one, instead of dropping it in silence. The plugin's `uploads.uploadAsync` takes the
  field: a package's picker that passes it holds its form's submit.
- A description can link a bare http(s) address (#232): `SetDescriptionAutolinks(true)` on any text component draws one as the
  `[words](address)` link is drawn, by GFM's extended autolink (after anything but a letter or digit, so in quotes or
  guillemets too; a domain of two labels or more; trailing punctuation, closing quotes and an unbalanced `)` or `]` left out) and under the same scheme check. Off by default; `DescriptionPlain` wins; `ToPlainText` keeps the address.
- An items view's, a tree's and a table's empty state takes the host's whole box (#231): a centring template such as `UIPage.Empty`
  stands in the middle of a list given the region's height, as it does in the panes' placeholder; the default line keeps the top.
- A tree's or a tab's rename started out of sight is placed and takes the focus once it is shown (#228): it measured the hidden
  title, 0 px, and kept that width with no caret until a reload.
- An item source's `Invalidate` from a job's `InvokeAsync` makes the page ask for its window again (#230): only a command's answer
  had the client decide again, so a window a pushed change set emptied stayed empty until a reload. A window a change set empties
  is now asked for at once, and an emptied window anchored to its end (`AnchorToEnd`, a chat) is read from its end, as a command's
  answer read it from its start.
- The framework's map for an agent ships as a Claude Code plugin from this repository: an application registers it in its
  `.claude/settings.json` (`extraKnownMarketplaces` `ne-standard` from `AkiEvansDev/NE.Standard`, `enabledPlugins`
  `ne-standard@ne-standard`), and its agents learn what the framework already has, with a link per guide.
- A window's foot keeps the system bar's colour on a page reached by a link (#227): the load's view transition stood over the page
  and took every hit, so the colour was read off nothing and dropped until a reload or a resize. It is read again once the
  transition has faded.
