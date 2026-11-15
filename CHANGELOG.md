# Changelog

Each section below becomes the GitHub release body for that tag and is removed from this file after the release is cut; published history lives on the [Releases page](https://github.com/AkiEvansDev/NE.Standard/releases).

## 2.8.0

- **`NE.Standard.UI.Desktop` (`2.8.0-preview.1`)**: new Windows `WebView2` desktop host (`DesktopStartupBase<TStartup>`, `DesktopStartupBuilder`, `DesktopBuiltHost`, `DesktopWebHost`, `DesktopWindow`, `DesktopShellControl`, `DesktopHostOptions`, `DesktopDownloadMode`) running the full `NE.Standard.UI.Web` stack inside a native desktop window over an in-process Kestrel loopback server (`127.0.0.1:0`) or a remote server (`--server`), with Win32 DWM dark/light window chrome synchronization, native `SaveFileDialog` / folder download handling, leave-guard close confirmation, and `DemoApp.Desktop`.
- **`UIKeyChord`, `NE.Standard.UI.Client` content/session sync, and `[UIAuthorize]` stand-in addresses**: public `UIKeyChord` parser and formatter in `NE.Standard.UI.Abstractions.Interaction`; `IUIClientTransport.ResolveContentStreamAsync` (`InProcessUIClientTransport` and `RemoteUIClientTransport`) for session-scoped `/_ne/content` streams alongside client-side `SetThemeEffect`, `SetThemeColorsEffect`, and `SetLanguageEffect` state updates on `UIClientPage`; and `UIHost` / `WebViewEndpoint` preserving the redirected sign-in or forbidden `UINavigationRequest` (`returnUrl` / `deniedUrl`) when `ResolveViewAsync` renders an authorization stand-in view.
- **Quiet `ExpanderComponent` header alignment**: removed leading left margin on quiet expander chevrons so headers align flush with surrounding content.
