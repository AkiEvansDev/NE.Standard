# Changelog

The framework's changelog — the `core` slice. Every package in the slice carries the same version and goes out together. This file
holds only what is not released yet, under `## X.Y.Z`: the release workflow cuts that section out as the body of the GitHub release
(a tag with no section fails the release), and the notes of every released version live there —
https://github.com/AkiEvansDev/NE.Standard/releases. Other slices keep their own beside their sources (`addons/<Name>/CHANGELOG.md`).

## 2.4.1

- Fixed `-6px` leading hover pills and focus frames on `SwitchComponent`, `CheckboxComponent`, `RadioGroupComponent` items, and quiet `ExpanderComponent` (`UIPage.Fold` / `UIPage.BoundFold`) being clipped inside `UIDialogs.Create` / `UIDialogs.Form` scroll bodies (`.ui-dialog__surface > .ui-stack-panel > .ui-scroll` now compensates with `-8px` inline bleed and `+8px` inline padding inside the dialog surface's `16px` padding) and inside unscrolled `ItemsViewComponent` hosts (`.ui-scroll-x--disabled.ui-scroll-y--disabled` now uses `overflow: clip` with `overflow-clip-margin: 8px`) (#293).
- Raised the side-drawer pin viewport threshold (`PinsFrom`) from `md` (`768px`) to `xl` (`1280px`) in `side-drawer-width.ts`, `mixins/side-drawers.less`, and `core/side-drawers.less` so a desktop drawer pin stored in `localStorage` no longer holds side drawers in grid columns on tablet viewports (`768px–1279.98px`) (#294).
- Updated `skills/ne-standard` with exact breakpoint pixel values (`sm = 576px`, `md = 768px`, `lg = 992px`, `xl = 1280px`, `xxl = 1600px`), `xl` drawer pin behaviour, `UIDialogs.ScrollBody` / `IScrollableComponent.ScrollFade` dialog scrolling, `ColorInputComponent.AllowOpacity`, and scrollport hover reach rules (#295).
- Implemented `IReadOnlyList<T>` on `RecursiveCollection<T>`, excluded interface and abstract element types from model-collection coercion in `RecursiveValueCoercion`, registered `IMenuItemModel` wire JSON serialization in `CompiledViewWireSerializer`, and added `UIPlatformDefaults.DefaultViewCompilationMode`.

## 2.5.0

- Added the WPF desktop platform (`NE.Standard.UI.Wpf.Abstractions`, `NE.Standard.UI.Wpf.Renderers.Foundation`, `NE.Standard.UI.Wpf.Renderers`, `NE.Standard.UI.Wpf`) built on `NE.Standard.UI.Client`: `WpfStartupBase`, `WpfStartupBuilder`, `WpfSessionHost`, `UIShellControl`, `UIWindow`, `WpfFileClientStorageProvider`, `WpfPaletteResources` over `NE.Colors`, and all built-in component and template renderers across layouts, contents, indicators, actions, inputs, items, navigation and regions, supporting both in-process (`WpfHostMode.InProcess`) and remote (`WpfHostMode.Remote` over `NE.Standard.UI.Server` or `NE.Standard.UI.Web`) execution (`examples/DemoApp.Wpf`).
