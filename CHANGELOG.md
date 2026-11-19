# Changelog

Each section below becomes the GitHub release body for that tag and is removed from this file after the release is cut; published history lives on the [Releases page](https://github.com/AkiEvansDev/NE.Standard/releases).

## 2.12.0

- **Default palette console log formatter and rolling file logging (`UIApplicationBuilder.ConfigureLogging`)**: `Web`, `Server`, and `Desktop` hosts now format console logs with 24-bit ANSI `UIColorPalette` dark-theme colors, `[HH:mm:ss.fff] [LVL]` bracketed timestamps, short category names, and single-line messages by default (`UIConsoleLogOptions`), and `logging.UseFile(...)` (`UIFileLogOptions`) adds a non-blocking rolling file logger with daily + size rotation, background retention cleanup (`Retention`), and automatic fallback to `%LocalAppData%/<AppName>/logs` when `<ContentRoot>/logs` is read-only.
- **SSR hydration word-table sequencing for `UIMoment` phrases**: `WebUIRuntime.hydrate()` now runs `rewritePageWritten()` (`scheduleHydratedPageWritten`) only after `applyChanges` and `/_ne/words/{language}.json` finish loading (and skips rewriting if the expected word table failed to load), and `ClientWords.revision` invalidates cached item search strings once the full language table arrives so parameterized `UIPhrase` values containing `UIMoment` never flash or stick on raw translation keys on reload.
