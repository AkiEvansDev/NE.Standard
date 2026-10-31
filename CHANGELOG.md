# Changelog

The framework's changelog — the `core` slice. Every package in the slice carries the same version and goes out together. This file
holds only what is not released yet, under `## X.Y.Z`: the release workflow cuts that section out as the body of the GitHub release
(a tag with no section fails the release), and the notes of every released version live there —
https://github.com/AkiEvansDev/NE.Standard/releases. Other slices keep their own beside their sources (`addons/<Name>/CHANGELOG.md`).

## 2.1.0

- Typed `Expression<Func<TSource, object?>>` overloads across every path-taking preset in `NE.Standard.UI.Extensions` (`Bound*`,
  `UILayout.Panes`), `TemplatedComponentBase.SetTemplateKeyProperty`, `ItemsComponentBase` (`FilterBy`, `SortBy`, `AddItemReads`),
  and `NE.Standard.UI.Testing` (`UITestPage.ComponentBoundTo`, `UITestComponent.ComponentBoundTo`, `UITestRow.ComponentBoundTo`).
- `TemplateKeyProperty` supports dotted paths (`"Meta.Kind"`) across compile checks, server rendering, runtime nested-item
  `Replace` updates, and client template selection.
- `NE.Standard.UI.Testing`: `UITestApp` registers a default `/_ne/content` `IUIContentAddressResolver` unless overridden in
  `configureServices`; `ComponentBoundTo` matches collection bindings (`BindItems` and `BindSource`); `UITestRow.Rows` /
  `UITestRow.Row(key)` and `UITestComponent.Row(key)` address and click nested `MenuItem.Items` sub-entries.
- `UIDialogs`: column-sized dialogs (`Create`, `BoundCreate`, `Form`, `BoundForm`) fill the sheet width below `md` while capping
  content to the column from `sm` up; responsive CSS size emission writes `"auto"` when an explicit wider `Auto` tier resets a
  narrower length.
- Web: `MenuComponent` lazily mounts and tears down nested `.ui-menu__submenu` flyouts when a `MenuItem.Items` collection
  transitions between empty and non-empty after attach; `FileTileComponent` and clickable `SurfaceComponent` washes use surface ink
  (`@ui-text-muted` / `@ui-text-ink`); `RecursiveValueCoercion` unwraps `JsonElement` values through
  `ObjectToInferredTypesConverter.ToInferredValue`.
