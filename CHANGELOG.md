# Changelog

Each section below becomes the GitHub release body for that tag and is removed from this file after the release is cut; published history lives on the [Releases page](https://github.com/AkiEvansDev/NE.Standard/releases).

## 2.15.2

### Changed

- **Lazy-mounted closed dialogs (`<template data-ui-dialog-template>`):** closed `UIDialog` surfaces now render inside an inert `<template data-ui-dialog-template>` (`WebAttributes.DialogTemplate`) with `content-visibility: hidden` on `.ui-dialog[hidden]` and closed side drawers so hidden dialog subtrees stay out of initial parse, style recalculation, and layout; on first open, `DialogEngine` mounts the template, replays recorded property patches, held collections, reactive sources, validation refusals, and reload-carried `UnsavedStash` values, and flushes queued subtree mutations synchronously before selecting initial focus.
- **Per-view add-on asset scoping, core engine gating, and single root `MutationObserver`:** `CompiledView.ComponentTypes` (`UsesAnyComponentType`), `WebAssetDescriptor.RequiredComponentTypes`, and `WebPackageClient.AddPackageClient(..., params string[] requiredComponentTypes)` omit unused add-on `<link>` and `<script>` tags on views that do not contain their component types while keeping asset endpoints mapped; `WebRenderMetadata.ComponentTypes` skips unused built-in client component engines on core-only views, and `observeComponents` / `observeMutations` multiplex onto one native `MutationObserver` per root.
- **Core stylesheet optimization and touch responsiveness:** registers verified self-only layout/state custom properties with `@property { syntax: "*"; inherits: false }`, consolidates responsive `[data-ui-id]` custom-property resets, deduplicates `.ui-row-hover-buttons()` across core list hosts while keeping `.ui-row-hover(@buttons: true)` backward-compatible on the plugin Less surface, and adds `touch-action: manipulation` across interactive triggers, toggles, tabs, menu entries, and clickable rows.
- **Wake socket liveness probing and faster pending marks:** adds `WebUIHub.PingAsync` and client wake probing (`visibilitychange`, `pageshow`, `online`, `resume`) racing a zero-work ping against `2 s` to reopen half-open sockets immediately after sleep or network switches, tightens SignalR keepalive/timeout to `10 s` / `24 s`, and lowers pending command/navigation feedback delay to `160 ms`.

### Fixed

- **Small and quiet `SelectComponent` optical alignment:** `.ui-select.ui-input--small` and `.ui-select--quiet` inherit trigger `line-height` (`16 px` on `UISize.Small`) and optically align `.ui-select__chevron` (`@ui-glyph-xs`, `translate: 0 1px`) with the trigger text.
- **`SplitButtonComponent` popup shortcut scoping and interaction guards:** `ShortcutEngine` ignores `aria-keyshortcuts` inside closed `.ui-split-button__menu` popups until opened; `NotificationEngine` resets hovered toast timers on `pointercancel` and window `blur`; `LeaveGuard` skips non-interceptable `NavigationEvent` entries (`canIntercept === false`) cleanly.
