# Changelog

The framework's changelog — the `core` slice. Every package in the slice carries the same version and goes out together. This file
holds only what is not released yet, under `## X.Y.Z`: the release workflow cuts that section out as the body of the GitHub release
(a tag with no section fails the release), and the notes of every released version live there —
https://github.com/AkiEvansDev/NE.Standard/releases. Other slices keep their own beside their sources (`addons/<Name>/CHANGELOG.md`).

## 2.3.0

- `ExpanderComponent` adds `HeaderAction`, `SetHeaderAction` and `SetHeaderActions` (`RegionNames.HeaderAction`), rendering a trailing
  action slot outside `<summary>` in the header row while expanded so interactive controls do not toggle the fold, and removes the
  negative margin bleed on `UIExpanderVariant.Quiet` headers to prevent left/top clipping and 4 px vertical scroll overflow inside
  `ItemsViewComponent` (#284).
- `DefaultMenuItemTemplate` binds all `ITextModel` and `IBadgeModel` properties (`BadgeTitle`, `BadgeColor`, `BadgeVariant`, etc.) on
  `UIMenuItemKind.Check` entries, and `ui-text.less` / `search-terms.ts` support badge-only menu and select items without `Title` (#282).
- `UIForm.Composer` keeps its leading and trailing actions on a single row beside the text by default on phones while omitting the
  dividing hairline on `.ui-input--ghost[data-ui-actions-below]` when `SetActionsBelow` places all buttons (including Send) on a second
  row below the text, and `FieldKeysEngine` lets the mobile virtual keyboard's Return key insert a newline in `<textarea>` controls with
  `SubmitOnEnter` / `OnEnter`.
- Web: `ColorInputComponent` renders a live numeric readout (`.ui-color-input__slider-value`) beside both the palette `Factor`
  (`-10`..`10`) and `Opacity` (`0`..`255`) sliders, uses a non-overlapping inset `2px solid #fff` (`outline-offset: -2px`) selection
  outline with `4px` grid gap on the active palette swatch, and supports arrow-key navigation (`ArrowLeft`, `ArrowRight`, `ArrowUp`,
  `ArrowDown`, `Home`, `End`) with roving `tabindex` across the 8-column palette (#280); uncolored
  `UIBadgeVariant.Surface` badges use `@ui-neutral-tint` fill and `var(--ui-color-mark)` inset border so they stay distinct inside filled
  inputs and beside colored badges (#281); `holdRegionOf` ignores `[data-ui-awaits-draw]` inside closed `<dialog>` elements and
  `WebUIRuntime` hydrates and releases regions synchronously before cross-document `@view-transition` capture (#283); `ReconnectLoop`,
  `ConnectionWatch` and `NotificationEngine` handle background tab sleep, wake grace and non-dismissible connection-lost banners cleanly.
