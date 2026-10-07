# NE.Standard.UI.Testing

Tests for an [NE.Standard](https://github.com/AkiEvansDev/NE.Standard) UI application without a browser. The whole UI
contract of a server-driven page lives on the server — the view's bindings, its rules, its filters, authorization — so
a test can check it there: boot the application's own startup, open a page through the host's real path, act on its
components as a reader does and read what the page received.

```csharp
await using UITestApp app = UITestApp.Create<AppStartup>(services => services.AddSingleton<IClock>(fake));
UITestPage page = await app.OpenAsync("/sign-up", session => session.SignIn("robin", roles: ["admin"]));

UITestComponent email = page.ComponentBoundTo(nameof(SignUpController.Email));

await email.SetValueAsync("not-an-email");
UITestCommandResult submit = await page.ComponentNamed("Create account").ClickAsync();

Assert.Equal("That does not look like an email address.", email.ValidationMessage);
Assert.False(submit.Sent);
Assert.False(page.Controller<SignUpController>().Submitted);
```

No test framework and no assertion library come with it: a page answers with plain values, and a misuse — a component
that is not there, a press on a button a reader could not press — throws `InvalidOperationException`. xUnit, NUnit and
MSTest read it alike.

## Install

```
dotnet add package NE.Standard.UI.Testing
```

It brings its namespace, `NE.Standard.UI.Testing`, as a global using; a project that sets `NEStandardUIImplicitUsings`
to `false` writes its own. It needs no platform: the web host is not installed, and the application's own project is
all a test project references beside it.

## The application

`UITestApp.Create<TStartup>()` builds the application from its `UIStartupBase` exactly as its host would, with no
platform under it: the test is the platform. `configureServices` runs after the startup's own registrations, so a fake
registered there replaces the real service; `configureApplication` adds to the application as the startup does.

The scheduler is parked. A `Batch` runtime answers a command with the changes it made for the page that asked, and keeps
what it owes the rest — a posted action's writes, `OnAttachedAsync`'s — for the flush, which only `page.FlushAsync()`
runs: what a command answered and what waits for the flush are told apart without timing.

## A page

`app.OpenAsync(address, session)` resolves the address through the view filters and the route's authorization — a
refusal lands on the sign-in or the forbidden page, as in a browser, and `page.Route` says where — then attaches a
runtime and starts the page from the snapshot a connecting page is sent. An address may carry a query
(`"/catalogue?role=db"`); `page.Address` is what the address bar shows, after every address effect the page received.

The session is the application's own: `session.SignIn(userId, roles, permissions)`, `InLanguage("ru")` and
`InTimeZone(...)` are stored in its session store before the page opens and presented as a cookie would present them,
so the resolver, authorization and filters read them as they read a real session. `WithNotificationPermission(...)` is
what its pages' browser reports. `page.OpenAsync(address)` opens another page in the same session.

## Finding a component

- `page.Component("chat-conversation")` — by the id the view gave it.
- `page.ComponentBoundTo(nameof(SignUpController.Email))` — by the controller path its value, else another property, is
  bound to.
- `page.ComponentNamed("Create account")` — by what a reader knows it by: its title, accessible name or tooltip, as
  written or in the page's language.

A list's rows are `component.Rows` and `component.Row(key)`; a row's components are found the same way inside it
(`row.Component(id)`, `row.ComponentBoundTo("Text")`), and `row.ContextMenu` is what a right click on it shows.

## Reading it

What a component shows is read off the change sets the page received, applied the way the client applies them:
`Value`, `Title`, `Get(property)`, `Text(property)`, `IsVisible` and `IsEnabled` (an ancestor collapsed, disabled or
loading counts, as does a dialog not open), and `ValidationMessage` — the strongest of the field's failing rules, the
controller's bound message and the server's refusal, as the page shows it. A row's binding is read off the row's item.
The client interactions a view declares run too: a part shown while a switch is on appears when the switch is written.

`page.Effects` and `page.EffectsOf<ShowNotificationEffect>()` are every effect the page received; dialogs open and close
with theirs (`page.IsDialogOpen(key)`). `page.Downloads` holds the files sent to it. `page.Controller<T>()` is the
controller, for what the screen does not show.

## Acting on it

Each act goes through the host's own entry points, the ones the web hub calls — the gates, the bounds, the command
filters and authorization all run:

- `SetValueAsync(value)` types and leaves a field: its change rules, the interactions reading it, the write to the
  server (or, under `OnSubmit`, held for its form), its change command, its blur rules.
- `ClickAsync()` presses: a button submitting a form is refused while a field of the form is in error, as the browser
  refuses it, and the result says so (`Sent` false).
- `DispatchAsync(eventName, eventKeys)` raises any event a component declares.
- `row.ClickAsync()` and `row.ChooseAsync()` press or choose a row.
- `page.PressNotificationActionAsync(toast)` presses a notification's action — its Undo.
- `page.HideAsync()` / `ShowAsync()` take the page off screen and back (`HasVisibleViewers`), and
  `ReportNotificationPermissionAsync(...)` reports the browser's answer to the prompt.

Every act answers with a `UITestCommandResult`: whether a command reached the server, whether it succeeded, its error,
and the effects the page received while it ran.

## What it does not model

Layout and styling; a responsive value at any width but the widest; a plain list's own filter and sort rules (rows
stand in the order the server sent them); item windows read on scroll; popups other than dialogs (a context menu and a
flyout stand open); a validation message sent into another component; the trimming and debouncing a field does in the
browser; fields in a list's rows on a submit; what the web hub adds of its own — its call budget, a large value staged
beside it. A row's item is the server's own object, so a property the server changed
shows there before a `Batch` runtime's flush sends it. A page's DOM, focus and keyboard are the browser's — for those,
drive a browser.

## Licence

The framework's: **the Prosperity Public License 3.0.0** — free for noncommercial use, with a thirty-day trial
for commercial use. See [LICENSE.md](https://github.com/AkiEvansDev/NE.Standard/blob/main/LICENSE.md).
