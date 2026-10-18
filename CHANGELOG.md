# Changelog

The framework's changelog — the `core` slice. Every package in the slice carries the same version and goes out together. This file
holds only what is not released yet, under `## X.Y.Z`: the release workflow cuts that section out as the body of the GitHub release
(a tag with no section fails the release), and the notes of every released version live there —
https://github.com/AkiEvansDev/NE.Standard/releases. Other slices keep their own beside their sources (`addons/<Name>/CHANGELOG.md`).

## 1.11.1

- The page runs under a phone's system bars (`viewport-fit=cover`), and the shell keeps clear of them where it meets the window's
  edges (#226): the bottom bar and a sheet asked for that room already, and got none (`env(safe-area-inset-*)` is zero without
  it); now the toasts stand over the bar too, a drawer keeps its foot and its side clear, and on a phone turned on its side the page
  stands off the camera's cut-out.
- `SetWindowFoot(true)` marks a component as the window's foot — a chat's composer, a pane's last row: where it stands on the
  window's bottom edge, the phone's system bar under the page takes its colour rather than the page's ground (a browser paints that
  bar in the document's background, never in what stands over it), and where the page runs under the bar it keeps clear of it by
  an edge in its own colour. The page's bottom bar is one by itself.
- **Breaking:** `NE.Standard.UI.Abstractions.Styling.Theme` is a global using with the package's others (`UITheme`,
  `UIMarkTone`): a project that names it in a `using` of its own fails IDE0005 and drops the line.
