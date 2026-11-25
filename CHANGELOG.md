# Changelog

Each section below becomes the GitHub release body for that tag and is removed from this file after the release is cut; published history lives on the [Releases page](https://github.com/AkiEvansDev/NE.Standard/releases).

## 2.13.2

- **Deferred `SplitButtonComponent` menus in item rows and links**: `SplitButtonComponentRenderer` now renders `.ui-split-button__menu` inside item templates and links into a shared `<template data-ui-split-menu-template>` (`WebAttributes.SplitMenuLater` / `SplitMenuTemplate`), materializing each row's popup menu on first open through slot-keyed `RowMenus` (`setLaterSplitMenus` in `split-button-engine.ts`) without colliding with `SetContextMenu`.
- **Side-drawer transition sequencing, containment, and touch responsiveness**: `.ui-button` and `.ui-shell__drawer-toggle` declare `touch-action: manipulation`; closed fixed side drawers apply `contain: layout paint style` (`contain: style` while open so fixed popups are not confined); `SideDrawerEngine` measures opener bounds prior to mutating `data-ui-drawer-open` and defers `OnDrawerOpen` (`open`) until the slide-in CSS transition completes (`whenTransitionsEnd`, or synchronously under `prefers-reduced-motion: reduce`), cancelling if closed early.
- **Popup positioning, focus-within tracking, and `ActionBar` scroll coalescing**: `markFocusWithin` short-circuits unchanged focus ancestor chains, `anchored-popup` fast-paths `confinesFixed` and shares a single `visibleBand` read per positioning pass, `readActionBarEntries` caches ancestor layout checks, and `ActionBarEngine` uses `{ capture: true, passive: true }` `requestAnimationFrame`-coalesced scroll updates while suppressing self-triggered `MutationObserver` redraws.
