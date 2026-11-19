# Hosting, Routing, Security, Files, Localization, and Testing Reference

Full guides:
- https://akievansdev.github.io/NE.Standard/web-hosting.html
- https://akievansdev.github.io/NE.Standard/routing.html
- https://akievansdev.github.io/NE.Standard/security.html
- https://akievansdev.github.io/NE.Standard/testing.html

## Startup & Web Host Wiring

1. **Platform-independent startup (`UIStartupBase`)**:
   ```csharp
   public sealed class AppStartup : UIStartupBase
   {
       protected override void ConfigureServices(IServiceCollection services) { ... }
       protected override void ConfigureApplication(UIApplicationBuilder app)
       {
           app.Route<HomeView, HomeController>("/");
           app.AddFrameworkWords("ru", "zh-Hans");
           // Optional: app.SetIcon("/brand/icon.svg") or app.SetNoIcon(); defaults to the shipped NE mark.
           // Optional: app.ConfigureLogging(log => log.UseFile("logs", TimeSpan.FromDays(14), TimeSpan.FromHours(2)));
       }
   }
   ```
2. **Web host startup (`WebStartupBase<AppStartup>`)**:
   ```csharp
   public sealed class AppWebStartup : WebStartupBase<AppStartup>
   {
       protected override void ConfigureServices(IServiceCollection services)
       {
           services.AddStandardRenderers();
           // Add-ons: services.AddMaterialWebIcons(...); services.AddCharts(); services.AddDataGrid(); etc.
       }
   }
   ```
3. **`Program.cs` pipeline order**:
   `WebStartupBuilder.Configure<AppWebStartup, AppStartup>(builder.Services);`
    then `app.UseStaticFiles();`, `app.UseRouting();`, `await app.MapStandardUIWebAsync();` (never `MapStaticAssets()`). Set `WebEndpointOptions.EnableClientViewEndpoint = true` when a browser web host also accepts remote `NE.Standard.UI.Client` connections via `GET /_ne/view`. For an API-only remote server without HTML/Web assets (`NE.Standard.UI.Server`), use `UIServerStartupBase<AppStartup>`, `UIServerStartupBuilder.Configure<AppServerStartup, AppStartup>(builder.Services)`, and `await app.MapStandardUIServerAsync();`.
4. **Windows `WebView2` Desktop host (`NE.Standard.UI.Desktop` + `NE.Standard.UI.Web.Renderers`, `net11.0-windows` + `UseWPF=true`)**:
   `AppDesktopStartup : DesktopStartupBase<AppStartup>` registers the exact same Web renderers and add-ons in `ConfigureServices` and window/host settings in `ConfigureHost(DesktopHostOptions options)` (`WindowTitle`, `Icon`, `AppUserModelId`, `InitialWidth`, `InitialHeight`, `WebRootPath`, `DownloadMode`, `Mode = DesktopHostMode.InProcess | Remote`, `ServerUri`); `[STAThread] static int Main(string[] args) => DesktopStartupBuilder.Run<AppDesktopStartup, AppStartup>(args);` runs a single in-process HTTPS `HTTP/2` loopback host (`BaseUri == BrowserBaseUri`, per-process `HttpOnly` cookie gate, `InMemoryWebViewRenderCache`, `4 GB` file limits, zero-copy local uploads and direct file downloads, native Windows Toast system notifications with `Minimized || !IsActive` visibility tracking) or connects to `--server <url>` (applying `UIStartupBuilder.ReadShellDefaults<AppStartup>()` for `Theme` and `Icon`).

## Routing & Authorization

- Route registration:
  `app.Route<OrderView, OrderController>("/orders", route => route.Identity("id").Require(rule));`
  - `.Identity("id")` gives each query parameter value (`/orders?id=42`) its own controller runtime instance.
  - Read query parameters in `OnNavigatedAsync(UINavigationRequest request)` via `request.TryGetParameter("id", out var id)`.
- Declarative security:
  - `[UIAuthorize("Admin,Support", Permissions = "orders.write", RolesMode = UIAccessMode.Any)]` on views, controllers, or `[UICommand]` methods.
  - `[UIAllowAnonymous]` opens a public view (such as SignIn) when `DefaultPolicy = UIAuthorizationDefault.Authenticated`.
  - Sign in / out inside a command: `await Context.SignInAsync(userId, roles, permissions);` and `await Context.SignOutAsync();`.
  - Validate redirect targets with `UIRoutePath.IsLocal(returnUrl)`.

## Uploads, Downloads, and Localization

- **Uploads**: bind `SelectionId` / `SelectionIds` on `FileInputComponent` or `ImageInputComponent`; read selection metadata in the command via `await Context.Uploads.GetSelectionAsync(Context.Handle, SelectionId, token)` and open file streams via `await Context.Uploads.OpenAsync(Context.Handle, file.FileId, token)`. Set `.SetFormId(...)` so form submission waits for active uploads.
- **Downloads**: `await Context.Downloads.DownloadAsync(Context.Handle, "report.csv", "text/csv", bytes, token);` or streaming `await Context.Downloads.DownloadAsync(Context.Handle, "report.csv", "text/csv", (stream, ct) => UIDataGridCsv.WriteAsync(stream, rows, columns, ct), token);` (single-use downloads bounded by `UIFileOptions.MaxDownloadBytesPerSession` and `MaxDownloadBytesTotal`, configured alongside `MaxFileSize` and `MaxUploadBytes*` in `ConfigureFiles`).
- **Localization (`UIPhrase`)**:
  - Every `[Translatable]` property treats plain strings as translation keys unless `.AsContent()` (or `IsContent = true` on items) is used.
  - Interpolated/pluralized translations use `UIPhrase.Of("items.count", ("count", count))` — never `string.Format`.
  - Format dates and file sizes in the reader's locale/timezone with `new UIMoment(utc)` and `new UIFileSize(bytes).Phrase()`.

## Headless Integration Testing (`NE.Standard.UI.Testing`)

Test views and controllers end-to-end without a browser:

```csharp
await using UITestApp app = UITestApp.Create<AppStartup>();
UITestPage page = await app.OpenAsync("/orders?id=42", session => session.SignIn("u1", roles: ["Admin"]));

await page.ComponentBoundTo<OrderController>(c => c.Notes).SetValueAsync("Priority");
await page.ComponentNamed("Save").ClickAsync();

Assert.Equal("Priority", page.Controller<OrderController>().Notes);
```

- Lookup methods: `page.Component(id)`, `page.ComponentBoundTo(c => c.Prop)`, `page.ComponentNamed(accessibleNameOrTitle)`, `list.Rows`, `list.Row(key)`, `row.ComponentBoundTo<TRow>(x => x.Prop)`.
- Client capabilities (`NE.Standard.UI.Client`): `RenameAsync(title)` on `UITestComponent` and `UITestRow`, `ValidationInto` target evaluation, `page.Session`, `page.SetResponsiveTier(tier)` / `page.SetViewportWidth(px)`, `page.GoBackAsync()` / `page.GoForwardAsync()` (`CanGoBack`, `CanGoForward`), `list.RequestItemWindowAsync(anchor, count, mode)`, `page.Store` (`UIClientStore`), `page.ClearEffects()` / `page.ClearDownloads()`, plain-host `FilterBy`/`SortBy`/`UIItemsQuery` evaluation on `list.Rows`, and row-field `OnSubmit` validation and submission.
- `OpenAsync` automatically verifies view compilation and fails on any binding/command compile warning unless `app.AllowsCompileWarnings = true`.
