# Changelog

The framework's changelog — the `core` slice. Every package in the slice carries the same version and goes out together. This file
holds only what is not released yet, under `## X.Y.Z`: the release workflow cuts that section out as the body of the GitHub release
(a tag with no section fails the release), and the notes of every released version live there —
https://github.com/AkiEvansDev/NE.Standard/releases. Other slices keep their own beside their sources (`addons/<Name>/CHANGELOG.md`).

## 2.6.1

- Extended inline text renaming (`SetRenamable`, `BindRenamedTitle`, `OnRename*`, `.Editable(...)`, and target-only `new RenameItemEffect(target)`) across every standalone `TextComponent<T>` region (`ExpanderHeaderRegion`, `CardHeaderRegion`, `TabCaptionRegion`, `DefaultTextTemplate<T>`) in Core, Web (`TextRegionRendererBase`, `TextRenameEngine`) and WPF (`WpfTextStyleHelper`), with `.ui-text__title` hit-target splitting and `Space` `keyup` suppression inside `<summary class="ui-expander__header">` so clicking or double-clicking a renamable expander title or typing spaces inside its inline field never toggles `<details>`, while clicking the empty header band or chevron folds and unfolds the section normally.
