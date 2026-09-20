# Third-party notices

This package embeds and redistributes two font files.

## Inter

- **What:** `Client/fonts/InterVariable.woff2` — Inter, the variable-weight upright face, as released by the Inter
  Project (<https://rsms.me/inter/>, <https://github.com/rsms/inter>), unmodified. It is the theme's default
  `FontFamily`, served at `/fonts/inter.woff2` and declared by the `ui-fonts.css` asset, so a page reads the same on a
  machine that has no Inter of its own.
- **Copyright:** The Inter Project Authors.
- **Licence:** SIL Open Font License, Version 1.1 — the full text is in `LICENSE-inter.txt`, distributed with this
  package (`Client/fonts/LICENSE.txt` in the repository). The OFL permits bundling and redistribution with software; it
  forbids selling the font on its own.

## Material Symbols

- **What:** `Client/fonts/NEGlyphs.woff2` — fifteen glyphs of Material Symbols Rounded (a chevron, a cross, a pencil and
  the other marks the framework's own chrome draws), subset by `Client/glyphs/build.mjs` from the
  [`material-symbols`](https://www.npmjs.com/package/material-symbols) package, which repackages Google's
  [material-design-icons](https://github.com/google/material-design-icons); the `wght`, `GRAD` and `opsz` axes are
  pinned. Served at `/fonts/ne-glyphs.woff2` and declared by the same `ui-fonts.css` asset.
- **Copyright:** Google LLC.
- **Licence:** Apache License 2.0 — the full text is in `LICENSE-material-symbols.txt`, distributed with this package
  as clause 4 requires (`Client/fonts/LICENSE-material-symbols.txt` in the repository).
