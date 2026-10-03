# NE.Standard

A server-driven UI framework for .NET.

You write a **view** — a component tree, in C# fluent builders — and a **controller** — an observable object
graph. The framework compiles that pair once into an immutable, indexed description, renders it to a platform,
and then keeps the rendered surface in sync with the controller in both directions. The client never holds
application state and never decides what to draw.

Web is the platform implemented today: ASP.NET Core for the shell and the transport, SignalR for the live
channel, and a TypeScript client that ships embedded in the assembly — there is no separate front-end deploy
step.

Documentation: [akievansdev.github.io/NE.Standard](https://akievansdev.github.io/NE.Standard).

## Install

The framework's packages share one version and are installed together at it. A component package shares its first two
digits — `1.1.x` goes with the framework's `1.1` — and moves its last digit on its own between framework releases. Until
2.0.0 the public surface may still move between versions; each changelog marks what breaks.

```
dotnet add package NE.Standard.UI.Web
dotnet add package NE.Standard.UI.Web.Renderers
```

The rest of the table arrives as a dependency of those two — the generators that write a controller's observable
members included — except `NE.Standard.UI.Extensions`, the presets, and `NE.Standard.UI.Testing`, for an
application's tests: separate installs for an application that wants them. Each package
brings the namespaces an application writes against as global usings, so the code below needs no `using` line.

| Package | |
|---|---|
| [`NE.Standard.UI.Primitives`](https://www.nuget.org/packages/NE.Standard.UI.Primitives) | the bottom layer: enums, attributes and constants — `UIAlignment`, `UIOrientation`, the styling and binding vocabulary. No dependencies. |
| [`NE.Standard.UI.Abstractions`](https://www.nuget.org/packages/NE.Standard.UI.Abstractions) | the binding and addressing model, `RecursiveObservable`, the styling value types (`UIThickness`, `UIResponsive<T>`), the items and interaction contracts, the `ClientEffect` vocabulary. |
| [`NE.Standard.UI.Authoring`](https://www.nuget.org/packages/NE.Standard.UI.Authoring) | what an author writes against: the component, view and controller base contracts. |
| [`NE.Standard.UI.Compiled`](https://www.nuget.org/packages/NE.Standard.UI.Compiled) | the compiler's output: `CompiledView`, its indexes and the resolution over them. |
| [`NE.Standard.UI.Shell`](https://www.nuget.org/packages/NE.Standard.UI.Shell) | hosting and runtime contracts: `IUIHost`, `IUIRuntime`, `IUIUpdateSink`, sessions, services. |
| [`NE.Standard.UI`](https://www.nuget.org/packages/NE.Standard.UI) | the engine: view compilation, the two-way runtime, hosting, routing, scheduling. |
| [`NE.Standard.UI.Components.Foundation`](https://www.nuget.org/packages/NE.Standard.UI.Components.Foundation) | the component bases and the template bindings a package's own component builds on — none of the built-ins. |
| [`NE.Standard.UI.Components`](https://www.nuget.org/packages/NE.Standard.UI.Components) | the built-in components and their default templates, over the foundation. |
| [`NE.Standard.UI.Generators`](https://www.nuget.org/packages/NE.Standard.UI.Generators) | the two Roslyn source generators the stack is built on, usable by anything defining its own components or observable models. |
| [`NE.Standard.UI.Web`](https://www.nuget.org/packages/NE.Standard.UI.Web) | the ASP.NET Core host: shell, SignalR channel, file transfer, and the embedded TypeScript client. |
| [`NE.Standard.UI.Web.Abstractions`](https://www.nuget.org/packages/NE.Standard.UI.Web.Abstractions) | the render contracts an add-on implements to render a component of its own. |
| [`NE.Standard.UI.Web.Renderers.Foundation`](https://www.nuget.org/packages/NE.Standard.UI.Web.Renderers.Foundation) | the renderer base and the shared style, text and input helpers an add-on's own renderer builds on. |
| [`NE.Standard.UI.Web.Renderers`](https://www.nuget.org/packages/NE.Standard.UI.Web.Renderers) | the HTML renderers for the built-in components, over the foundation. |
| [`NE.Standard.UI.Extensions`](https://www.nuget.org/packages/NE.Standard.UI.Extensions) | presets over the components: a text in a role, a page's header band and sections, an inline message and a banner, a stack and a row, a button per type, a field with its hint, a read-only key-value list, and one interaction from another component's value. Server-only, nothing new to render. |
| [`NE.Standard.UI.Testing`](https://www.nuget.org/packages/NE.Standard.UI.Testing) | an application's tests without a browser: its own startup booted with no platform under it, a page opened through the host's real path, its components found, written to and pressed, and what the page received read back. No test framework or assertion library. |

**Icons ship separately**, from [`NE.Standard.UI.Icons`](https://github.com/AkiEvansDev/NE.Standard.UI.Icons)
— Material Symbols, a name package and a web package, MIT, released together with the framework on the same
version. They are developed alongside the framework, so the set and the renderer it plugs into are never out of
step.

**Components can ship separately too.** A component package is a component like the built-in ones — the same
generator, the same binding, its own renderer on `NE.Standard.UI.Web.Renderers.Foundation` (the data grid, which
extends the table, on `NE.Standard.UI.Web.Renderers`) — under the framework's own licence, released with every framework
version and on their own between them, each in a repository of its own:

- [`NE.Standard.UI.CodeInput`](https://github.com/AkiEvansDev/NE.Standard.UI.CodeInput) — a code editor with
  syntax highlighting, line numbers, several carets and find and replace.
- [`NE.Standard.UI.DataGrid`](https://github.com/AkiEvansDev/NE.Standard.UI.DataGrid) — a data grid over the
  table: typed columns, editing in place, filters, paging, totals, pinned columns, a detail row and CSV export.
- [`NE.Standard.UI.Charts`](https://github.com/AkiEvansDev/NE.Standard.UI.Charts) — line, area, bar, pie and
  scatter charts, a sparkline and a gauge, as SVG the browser keeps.
- [`NE.Standard.UI.Graph`](https://github.com/AkiEvansDev/NE.Standard.UI.Graph) — a canvas of typed nodes, and
  the layered graph of an application's own nodes or of its resources and crafts; a calculator's node kinds come
  ready made in `NE.Standard.UI.Graph.Calculator`, picture kinds in `NE.Standard.UI.Graph.Image`.

The colour palette is [`NE.Colors`](https://www.nuget.org/packages/NE.Colors), a repository of its own because
more than this framework needs it. It is MIT, and it arrives as a dependency of
`NE.Standard.UI.Abstractions`.

If you installed the package `NE.Standard` — the general-purpose helpers that used to ship from here — it is
[`NE.Common`](https://www.nuget.org/packages/NE.Common) now, MIT and in its own repository. It was never part
of the framework, and nothing here depends on it.

## A first look

A view declares the tree and what each part binds to:

```csharp
internal sealed class CounterView : UIViewBase, IUIViewDefinition
{
    public static string ViewKey => "counter";

    protected override IVisualComponent CreateContent()
        => new ContainerComponent()
            .SetPadding(UIThickness.Uniform(16))
            .AddChild(new TextComponent().BindTitle(nameof(CounterController.Count)))
            .AddChild(new ButtonComponent()
                .OnClick(nameof(CounterController.Increment))
                .SetTitle("Add one")
            );
}
```

A controller holds the state, and changing it is what updates the screen — `[RecursiveMember]` generates the
notifying setter and the path segment the binding resolves against:

```csharp
internal sealed partial class CounterController : UIControllerBase
{
    [RecursiveMember]
    public partial int Count { get; set; }

    [UICommand]
    public void Increment() => Count++;
}
```

Hosting is an ASP.NET Core application:

```csharp
WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

WebStartupBuilder.Configure<AppWebStartup, AppStartup>(builder.Services);

WebApplication app = builder.Build();
app.UseStaticFiles();
app.UseRouting();
await app.MapStandardUIWebAsync();
await app.RunAsync();
```

## The demo

`examples/DemoApp` is the reference application, 75 routes in all: screens that compose many components into a piece of an
application (a sign-up, a checkout, a chat, a file editor, the sign-in, account, admin and forbidden pages of the security
mechanism), pages for what the framework does across components (words, commands, values and validation, large lists, colours),
and one page per component — a preview beside every bindable property, each row stepping its value, then examples of it in use,
each with its source.

```
dotnet run --project examples/DemoApp.Web    # http://localhost:5000
```

## Building

Requires the .NET 10 SDK, 10.0.400 or later (`global.json`; an older 10.0.1xx SDK's analyzers report false build errors), and
Node 24 or later for the TypeScript client — which builds **as part of** `dotnet build`, so
a TypeScript type error fails the .NET build.

```
dotnet build
dotnet build -p:SkipWebClientBuild=true      # skip npm/vite when node is unavailable
```

## Contributing

This repository is a read-only mirror of a private one, so a merged pull request here would be erased by the
next release — pull requests are switched off. Please open an issue instead: the change is made upstream and
appears here with the next release.

## License

**The Prosperity Public License 3.0.0** — free for noncommercial use, with a thirty-day trial for commercial
use. Personal projects, research, education, charities and public institutions are not commercial use. See
[LICENSE.md](https://github.com/AkiEvansDev/NE.Standard/blob/main/LICENSE.md); it is one page.
