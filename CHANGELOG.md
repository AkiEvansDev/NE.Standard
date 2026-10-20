# Changelog

The framework's changelog — the `core` slice. Every package in the slice carries the same version and goes out together. This file
holds only what is not released yet, under `## X.Y.Z`: the release workflow cuts that section out as the body of the GitHub release
(a tag with no section fails the release), and the notes of every released version live there —
https://github.com/AkiEvansDev/NE.Standard/releases. Other slices keep their own beside their sources (`addons/<Name>/CHANGELOG.md`).

## 1.13.2

- A template the compile can prove is never drawn says nothing (#253): a list bound to one property of its row — a menu's submenu,
  bound to an entry's `Items` — whose host declares its items and none of them holds anything there is walked for no argument or
  binding warning. A context menu of declared entries in a row no longer warns at every start that its submenu's `ArgParent` reads the
  entry; a declared entry with sub-entries, and a menu of bound entries, keep the walk.
- `UIMarkTone.Neutral` draws its marks in the muted text colour, a grey, rather than the text's own near-white or near-black.
- An image input shelf's drop edge stands round its thumbnails again, where a picture no longer covers it: the field's own edge had
  outweighed the shelf's offset.
