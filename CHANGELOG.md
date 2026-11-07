# Changelog

The framework's changelog — the `core` slice. Every package in the slice carries the same version and goes out together. This file
holds only what is not released yet, under `## X.Y.Z`: the release workflow cuts that section out as the body of the GitHub release
(a tag with no section fails the release), and the notes of every released version live there —
https://github.com/AkiEvansDev/NE.Standard/releases. Other slices keep their own beside their sources (`addons/<Name>/CHANGELOG.md`).

## 2.5.1

- Fixed popups (`ColorInput`, `Select`, `DateInput`, `Flyout`, `ContextMenu`, tooltips and strip overflow menus) opened inside `UIDialogs` (`ScrollFade` / `mask-image`), `clip-path`, `backdrop-filter` or layout/paint-contained ancestors being clipped at the container edge instead of lifting into the top layer.

## 2.6.0

- Added the WPF desktop platform (`NE.Standard.UI.Wpf.Abstractions`, `NE.Standard.UI.Wpf.Renderers.Foundation`, `NE.Standard.UI.Wpf.Renderers`, `NE.Standard.UI.Wpf`) built on `NE.Standard.UI.Client`: `WpfStartupBase`, `WpfStartupBuilder`, `WpfSessionHost`, `UIShellControl`, `UIWindow`, `WpfFileClientStorageProvider`, `WpfPaletteResources` over `NE.Colors`, and all built-in component and template renderers across layouts, contents, indicators, actions, inputs, items, navigation and regions, supporting both in-process (`WpfHostMode.InProcess`) and remote (`WpfHostMode.Remote` over `NE.Standard.UI.Server` or `NE.Standard.UI.Web`) execution (`examples/DemoApp.Wpf`).
