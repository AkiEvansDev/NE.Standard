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
       public override void ConfigureServices(IServiceCollection services) { ... }
       public override void ConfigureApplication(UIApplicationBuilder app)
       {
           app.Route<HomeView, HomeController>("/");
           app.AddFrameworkWords();
       }
   }
   ```
2. **Web host startup (`WebStartupBase<AppStartup>`)**:
   ```csharp
   public sealed class AppWebStartup : WebStartupBase<AppStartup>
   {
       public override void ConfigureWebServices(IServiceCollection services)
       {
           services.AddStandardRenderers();
           // Add-ons: services.AddMaterialWebIcons(...); services.AddCharts(); services.AddDataGrid(); etc.
       }
   }
   ```
3. **`Program.cs` pipeline order**:
   `WebStartupBuilder.Configure<AppWebStartup, AppStartup>(builder.Services);`
   then `app.UseStaticFiles();`, `app.UseRouting();`, `await app.MapStandardUIWebAsync();` (never `MapStaticAssets()`). For an API-only remote server without HTML/Web assets (`NE.Standard.UI.Server`), use `UIServerStartupBase<AppStartup>`, `UIServerStartupBuilder.Configure<AppServerStartup, AppStartup>(builder.Services)`, and `await app.MapStandardUIServerAsync();`.

## Routing & Authorization

- Route registration:
  `app.Route<OrderView, OrderController>("/orders/{id}", route => route.Identity("id").Require(rule));`
  - `.Identity("id")` gives each route parameter value its own controller runtime instance.
  - Read route/query parameters in `OnNavigatedAsync(UINavigationRequest request)` via `request.TryGetParameter("id", out var id)`.
- Declarative security:
  - `[UIAuthorize("Admin,Support", Permissions = "orders.write", RolesMode = UIAccessMode.Any)]` on views, controllers, or `[UICommand]` methods.
  - `[UIAllowAnonymous]` opens a public view (such as SignIn) when `DefaultPolicy = UIAuthorizationDefault.Authenticated`.
  - Sign in / out inside a command: `await Context.SignInAsync(userId, roles, permissions);` and `await Context.SignOutAsync();`.
  - Validate redirect targets with `UIRoutePath.IsLocal(returnUrl)`.

## Uploads, Downloads, and Localization

- **Uploads**: bind `SelectionId` / `SelectionIds` on `FileInputComponent` or `ImageInputComponent`; read bytes in the command via `await Context.Uploads.GetSelectionAsync(SelectionId, token)`. Set `.SetFormId(...)` so form submission waits for active uploads.
- **Downloads**: `await Context.Downloads.DownloadAsync(Context.Handle, "report.csv", "text/csv", bytes, token);`.
- **Localization (`UIPhrase`)**:
  - Every `[Translatable]` property treats plain strings as translation keys unless `.AsContent()` (or `IsContent = true` on items) is used.
  - Interpolated/pluralized translations use `UIPhrase.Of("items.count", ("count", count))` — never `string.Format`.
  - Format dates and file sizes in the reader's locale/timezone with `new UIMoment(utc)` and `new UIFileSize(bytes).Phrase()`.

## Headless Integration Testing (`NE.Standard.UI.Testing`)

Test views and controllers end-to-end without a browser:

```csharp
await using UITestApp app = UITestApp.Create<AppStartup>();
UITestPage page = await app.OpenAsync("/orders/42", session => session.SignIn("u1", roles: ["Admin"]));

await page.ComponentBoundTo<OrderController>(c => c.Notes).SetValueAsync("Priority");
await page.ComponentNamed("Save").ClickAsync();

Assert.Equal("Priority", page.Controller<OrderController>().Notes);
```

- Lookup methods: `page.Component(id)`, `page.ComponentBoundTo(c => c.Prop)`, `page.ComponentNamed(accessibleNameOrTitle)`, `list.Rows`, `list.Row(key)`, `row.ComponentBoundTo<TRow>(x => x.Prop)`.
- Client capabilities (`NE.Standard.UI.Client`): `page.SetResponsiveTier(tier)` / `page.SetViewportWidth(px)`, `page.GoBackAsync()` / `page.GoForwardAsync()` (`CanGoBack`, `CanGoForward`), `list.RequestItemWindowAsync(anchor, count, mode)`, `page.Store` (`UIClientStore`), plain-host `FilterBy`/`SortBy`/`UIItemsQuery` evaluation on `list.Rows`, and row-field `OnSubmit` validation and submission.
- `OpenAsync` automatically verifies view compilation and fails on any binding/command compile warning unless `app.AllowsCompileWarnings = true`.
