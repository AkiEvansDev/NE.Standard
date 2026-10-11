# Changelog

The framework's changelog — the `core` slice. Every package in the slice carries the same version and goes out together. This file
holds only what is not released yet, under `## X.Y.Z`: the release workflow cuts that section out as the body of the GitHub release
(a tag with no section fails the release), and the notes of every released version live there —
https://github.com/AkiEvansDev/NE.Standard/releases. Other slices keep their own beside their sources (`addons/<Name>/CHANGELOG.md`).

## 1.8.1

- `UIThemeColor.Muted` is the muted text colour wherever a colour is written inline — a border, a surface, a quote's line, a
  selection's ground, a badge, a Markdown display's styles — where it was an empty style; a ground of it reads the surface colour (#166).
- A drawer's pin held down keeps the hover's light wash under it and its glyph's filled drawing. A page's own pin
  (`ButtonComponent.PinsDrawer`) is a toggle whose `Pressed` is the side's pin, announced when the page comes back pinned too, so an
  interaction on it can give it an icon for pinned.
- A rule on an unbound toggle button's `Pressed` follows it; it heard only a bound one.
- A splitter's side with a floor (`min`) folds too: the bar goes under the floor as it is dragged, the side's content hidden there, and
  let go under 48 px the side folds, anywhere else under the floor it springs back to the floor; a key's step under the floor folds it
  and one from folded opens it to the floor. The floor stopped the drag, so such a side could never fold (#167).
- The docs ask for an id on a side's root: a pin is kept under the first authored id in the side.
- A touch screen — where nothing hovers — draws no scrollbar, as a phone's own apps scroll; a phone's browser kept its thumb drawn
  over a region it had scrolled (#168).
- A shelf's square for a file that is no picture shows the file's size under its name (#170).
- A value the server refuses because its component, or a container around it, is hidden at every width is a warning in the log
  naming the component; the field only went back to its value, so a hidden file input opened from a button failed silently.
- A timestamp and a moment in a phrase's words are written in the reader's zone before the page is first painted: "5 minutes ago",
  "Today" and the reader's own clock from the start, where every page load showed the UTC date and time for 30–140 ms first. The
  head carries the page's language's date and time patterns, and an element a phrase holding moments was painted into names them
  (`data-ui-moments`) (#169).
