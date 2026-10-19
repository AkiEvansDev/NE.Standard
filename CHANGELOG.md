# Changelog

The framework's changelog — the `core` slice. Every package in the slice carries the same version and goes out together. This file
holds only what is not released yet, under `## X.Y.Z`: the release workflow cuts that section out as the body of the GitHub release
(a tag with no section fails the release), and the notes of every released version live there —
https://github.com/AkiEvansDev/NE.Standard/releases. Other slices keep their own beside their sources (`addons/<Name>/CHANGELOG.md`).

## 1.13.1

- A tree node renamed by a command that reads the tree again (`Clear()` and its `Add`s) shows the new name (#251, reopened), in
  however many change sets the rows come. 1.13.0's fix looked for the node's row by the scope the node's bindings name, which a tree
  row never answers to, so it found none and the edit still went into the row's item: the refill kept the row with its old name. It
  now finds the row by its keys as the edit itself does. NE.Home can read its tree again after every rename.
- An argument's path is refused at compile only where the walk is certain (#253): the component stands in a template every row is
  drawn with (a list's own, a table's columns) and the type walked is the one every press reads (the controller, a sealed item type,
  the items a list declares). In a template a row may never be drawn with — a variant chosen by a key, a group's header, a menu's
  entries and their submenu — or through a row type a derived item may extend, a path that type lacks is an advisory warning. A
  context menu's `UIAction.ArgParent("id", nameof(Item.Emoji))` in a row compiles again: the menu's `OnItemClick` also reaches its
  entries' submenu, where `Parent` is the entry, and that submenu is drawn only for an entry with sub-entries. A binding naming
  nothing follows the same rule: `UnresolvedBinding`, which a test page refuses, only in a template every row is drawn with and
  through the type every row reads; in a variant, a header, a menu's entries or a submenu it is `Advisory`, logged only.
- The extras an event shorthand adds beside what its command is for are offered (#254): a command that takes only what it needs
  is no longer warned of a move's `index` (`OnNodeMoveWithItemKey`, `OnRowMoveWithItemKey`, `OnItemMoveWithItemKey`) or a tab menu
  entry's `entry` and `tab`. The key or item a `…WithItemKey`/`…WithItem` form passes under the name you give it is the command's
  own and still warns where no parameter takes it — a misnamed parameter would get null — as does an argument written by hand. A
  test sweeps every shorthand of the core and the packages, so a new one cannot forget it.
- `UIPage.Empty` and `BoundEmpty` with no glyph centre their title and line, as the ways on under them are (#255): a short title
  no longer stands left of a longer line and off its own button. Beside a glyph the words keep the start.
