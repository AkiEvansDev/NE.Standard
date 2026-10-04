# Changelog

The framework's changelog — the `core` slice. Every package in the slice carries the same version and goes out together. This file
holds only what is not released yet, under `## X.Y.Z`: the release workflow cuts that section out as the body of the GitHub release
(a tag with no section fails the release), and the notes of every released version live there —
https://github.com/AkiEvansDev/NE.Standard/releases. Other slices keep their own beside their sources (`addons/<Name>/CHANGELOG.md`).

## 1.6.1

What NE.ProjectC's roster editor met on 1.6.0 (GitHub issues #102–#105).

- **Posted work waits for a command** (#102). `Post`, a broadcast post, `OnDetachedAsync` and a posted session change ran on the
  thread pool beside an exclusive command's body, so a page redrawn by posts could redraw in the middle of its own command; they now
  run between exclusive commands. A `Background` command, a value from the page, an attach and an `InvokeAsync` from outside still
  run beside a command, as the guide now says — and the hooks' summaries no longer claim to run "under the runtime's lock" as a
  command does, which a command never did.
- **A class written by a row the server drew is replaced, not joined** (#103). The first live change of a badge's style, a theme
  colour, a button's look or any other class-valued property on a server-drawn row added the new class beside the server's, and
  the stylesheet's later rule kept winning — a phase stayed green after it filled. Every class converter now knows its own classes
  and clears the server's on its first write, as icons already did.
- **A fixed index or key read from the controller is refused when the view compiles** (#104). `BindContext("Phases[0]")`,
  `BindTitle("Orders[\"o1\"].Total")` or items under such a path rendered empty or never changed, with no warning; the error names the component
  and the path, and one element per row is an item template. Inside a row's item (`Lines[1].Price`), and in a command's argument,
  read once as it runs, a fixed index or key still works. **Breaking** for a view that compiled such a binding (it never showed
  a value).
- **A row template's own abilities count in an items view** (#105). `CanDrag`, `CanSelect`, `CanRemove` and `CanRename` set or
  bound on an items view's row template were written where no engine read them; a row now refuses what its item or its template
  refuses, so a Root-bound `CanDrag` on the template is a page's switch for who may drag. `DragKind` and `DragEffects` stay static.
- **A move between lists that the server refuses puts the row back as it was** (#105): it came back still faded as a dragged row.
