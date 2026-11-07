# Changelog

The framework's changelog — the `core` slice. Every package in the slice carries the same version and goes out together. This file
holds only what is not released yet, under `## X.Y.Z`: the release workflow cuts that section out as the body of the GitHub release
(a tag with no section fails the release), and the notes of every released version live there —
https://github.com/AkiEvansDev/NE.Standard/releases. Other slices keep their own beside their sources (`addons/<Name>/CHANGELOG.md`).

## 2.5.0

- Collapsed the clear button (`display: none` instead of `visibility: hidden`) on empty `TitlePlacement = Inside` (`UIInputTitlePlacement.Inside`) clearable fields (`TextInputComponent`, `NumberInputComponent`, `TemporalInputComponent`, `SelectComponent`, `SearchComponent`) in `field.less` so placeholders and values stay flush against the trailing edge or divider (#297).
- Aligned `TitlePlacement = Inside` `<input class="ui-field">` and `MultiSelectComponent` entries to the trailing edge when showing a placeholder (`&:placeholder-shown { text-align: end; }`) with `text-overflow: ellipsis` and `margin-inline-end: auto` header spacing, unified symmetric horizontal padding (`padding-inline: @ui-space-2`) and collapsed empty `.ui-color-input__text:empty` on `ColorInputComponent` and sidebar menu search rows, collapsed empty `.ui-action__trailing` when `ShowChevron = false` without trailing text or icon while preserving row padding on icon-only `ActionComponent` and `MenuItem`, matched `Small` trailing padding on range `TemporalInputComponent` rows with picker toggles, and collapsed empty standalone `TextComponent` and `ParagraphComponent` roots in flow.

## 2.6.0

- Added the WPF desktop platform (`NE.Standard.UI.Wpf.Abstractions`, `NE.Standard.UI.Wpf.Renderers.Foundation`, `NE.Standard.UI.Wpf.Renderers`, `NE.Standard.UI.Wpf`) built on `NE.Standard.UI.Client`: `WpfStartupBase`, `WpfStartupBuilder`, `WpfSessionHost`, `UIShellControl`, `UIWindow`, `WpfFileClientStorageProvider`, `WpfPaletteResources` over `NE.Colors`, and all built-in component and template renderers across layouts, contents, indicators, actions, inputs, items, navigation and regions, supporting both in-process (`WpfHostMode.InProcess`) and remote (`WpfHostMode.Remote` over `NE.Standard.UI.Server` or `NE.Standard.UI.Web`) execution (`examples/DemoApp.Wpf`).
