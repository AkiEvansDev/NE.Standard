# Changelog

The framework's changelog — the `core` slice. Every package in the slice carries the same version and goes out together. This file
holds only what is not released yet, under `## X.Y.Z`: the release workflow cuts that section out as the body of the GitHub release
(a tag with no section fails the release), and the notes of every released version live there —
https://github.com/AkiEvansDev/NE.Standard/releases. Other slices keep their own beside their sources (`addons/<Name>/CHANGELOG.md`).

## 2.4.2

- Excluded popup menus (`.ui-context-menu`, `.ui-split-button__menu`, `.ui-flyout__content` and `[data-ui-menu-flyout]`) from the inline-accordion `block-size` / `padding-top` / `display allow-discrete` transition and slow chevron transition in `ui-menu.less`, so switching hover between submenu groups inside a popup menu never triggers a `200ms` in-flow collapse jump when `dropClosedFlyouts` strips `data-ui-menu-flyout` synchronously (#296).

## 2.5.0

- Added the WPF desktop platform (`NE.Standard.UI.Wpf.Abstractions`, `NE.Standard.UI.Wpf.Renderers.Foundation`, `NE.Standard.UI.Wpf.Renderers`, `NE.Standard.UI.Wpf`) built on `NE.Standard.UI.Client`: `WpfStartupBase`, `WpfStartupBuilder`, `WpfSessionHost`, `UIShellControl`, `UIWindow`, `WpfFileClientStorageProvider`, `WpfPaletteResources` over `NE.Colors`, and all built-in component and template renderers across layouts, contents, indicators, actions, inputs, items, navigation and regions, supporting both in-process (`WpfHostMode.InProcess`) and remote (`WpfHostMode.Remote` over `NE.Standard.UI.Server` or `NE.Standard.UI.Web`) execution (`examples/DemoApp.Wpf`).
