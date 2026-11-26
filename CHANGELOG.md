# Changelog

Each section below becomes the GitHub release body for that tag and is removed from this file after the release is cut; published history lives on the [Releases page](https://github.com/AkiEvansDev/NE.Standard/releases).

## 2.15.1

### Changed

- **`UIStandardAction.Send` uses `UIGlyphs.ArrowUp` and circular icon buttons optically center right-pointing triangles:** `UIStandardAction.Send` (`UIIconButtons.Send` and `UIMenuItems.Send`) switches from the horizontal paper-plane glyph to the symmetric upward arrow (`UIGlyphs.ArrowUp`), while explicit `ne-send`, `ne-play`, `ms-send`, and `ms-play-arrow` marks inside `.ui-button--circle` shift `0.0625em` right so their triangular ink mass sits on the circle's vertical axis.
- **`UIPage.Drawer` frames header and footer bands with `1 px` `Border` dividers and `UILayout.Panes(..., stacked: true)` fades cleanly:** `UIPage.Drawer` / `BoundDrawer` add a `1 px` `UIThemeColor.Border` bottom rule under the fixed header (`12 px` bottom inset), uniform `12 px` padding on the scrolling body, and a `1 px` top rule above an optional footer, while single-column stacked panes (`data-ui-panes-stacked`) use a `120 ms` `@starting-style` opacity fade without horizontal scrollport overhang.

### Fixed

- **`UISize.Small` and `UISize.Large` `ButtonGroupComponent` segment typography and height:** `.ui-button-group--small` steps default `Body` segment labels down to `Caption` (`12/16 px`) with `0.125rem` (`2 px`) vertical padding and `@ui-glyph-md` icon-only squares so a `Small` strip measures `28 px` instead of `34 px`, while `.ui-button-group--large` steps default labels up to `Subtitle` with `@ui-glyph-xl` icon-only squares.
