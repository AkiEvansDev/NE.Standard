# Changelog

The framework's changelog — the `core` slice. Every package in the slice carries the same version and goes out together. This file
holds only what is not released yet, under `## X.Y.Z`: the release workflow cuts that section out as the body of the GitHub release
(a tag with no section fails the release), and the notes of every released version live there —
https://github.com/AkiEvansDev/NE.Standard/releases. Other slices keep their own beside their sources (`addons/<Name>/CHANGELOG.md`).

## 1.8.3

- A switch to another runtime of the route holds an end-anchored windowed feed at its end, as a page load does: left at its top,
  only a window starting past the source's first row was placed, and a change after the switch (a padding, rows drawn late) left it
  wherever it stood (#178).
