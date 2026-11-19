# Changelog

Each section below becomes the GitHub release body for that tag and is removed from this file after the release is cut; published history lives on the [Releases page](https://github.com/AkiEvansDev/NE.Standard/releases).

## 2.11.1

- **Passive `MenuComponent` rows rendered without button chrome**: `UIMenuItemKind.Header` and `UIMenuItemKind.Separator` now render as plain `<div class="ui-menu-header">` and `<div class="ui-menu-separator">` blocks without `<a>`, `.ui-menu-item`, or `.ui-button*` classes (`WebClassNames.MenuHeader`, `WebClassNames.MenuSeparator`), reserving `.ui-menu-item` strictly for interactive entries while `MenuRowEntrySelector` covers all menu row entries in client layout and search engines.
