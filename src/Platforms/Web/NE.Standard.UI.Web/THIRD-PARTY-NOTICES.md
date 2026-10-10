# Third-party notices

This package embeds and redistributes two font files and one script library.

## Geist

- **What:** `Client/fonts/GeistVariable.woff2` — Geist Sans, the variable-weight upright face (Latin and Cyrillic), as
  released by Vercel in the [`geist`](https://www.npmjs.com/package/geist) package 1.7.2 (`Geist-Variable.woff2`,
  <https://github.com/vercel/geist-font>), unmodified. It is the theme's default `FontFamily`, served at
  `/_ne/fonts/geist.woff2` and declared by the `ui-fonts.css` asset, so a page reads the same on a machine that has no Geist
  of its own.
- **Copyright:** Vercel, in collaboration with basement.studio (The Geist Project Authors).
- **Licence:** SIL Open Font License, Version 1.1 — the full text is in `LICENSE-geist.txt`, distributed with this
  package (`Client/fonts/LICENSE-geist.txt` in the repository). The OFL permits bundling and redistribution with software; it
  forbids selling the font on its own.

## Material Symbols

- **What:** `Client/fonts/NEGlyphs.woff2` — the glyphs of Material Symbols Rounded that the framework's own chrome and its
  component packages draw (a chevron, a cross, a pencil and the rest listed in `Client/glyphs/build.mjs`), subset by `Client/glyphs/build.mjs` from the
  [`material-symbols`](https://www.npmjs.com/package/material-symbols) package, which repackages Google's
  [material-design-icons](https://github.com/google/material-design-icons); the `wght`, `GRAD` and `opsz` axes are
  pinned. Served at `/_ne/fonts/ne-glyphs.woff2` and declared by the same `ui-fonts.css` asset.
- **Copyright:** Google LLC.
- **Licence:** Apache License 2.0 — the full text is in `LICENSE-material-symbols.txt`, distributed with this package
  as clause 4 requires (`Client/fonts/LICENSE-material-symbols.txt` in the repository).

## ASP.NET Core SignalR client

- **What:** [`@microsoft/signalr`](https://www.npmjs.com/package/@microsoft/signalr), the browser's hub client, bundled
  into `ui.js` by the client build.
- **Copyright:** .NET Foundation and Contributors.
- **Licence:** MIT:

  > The MIT License (MIT)
  >
  > Copyright (c) .NET Foundation and Contributors
  >
  > All rights reserved.
  >
  > Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
  > documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
  > rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
  > persons to whom the Software is furnished to do so, subject to the following conditions:
  >
  > The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
  > Software.
  >
  > THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
  > WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
  > COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  > OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
