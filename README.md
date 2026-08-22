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

**This is a pre-release.** Every package goes out on one repository version and they are only ever installed
at matching versions, so `--prerelease` is needed until the first stable release.

```
dotnet add package NE.Standard.UI.Web --prerelease
dotnet add package NE.Standard.UI.Web.Renderers --prerelease
```

Everything else in the framework arrives as a dependency of those two.

| Package | |
|---|---|
| [`NE.Standard.UI.Primitives`](https://www.nuget.org/packages/NE.Standard.UI.Primitives) | the bottom layer: enums, attributes and value types — `UIThickness`, `UIResponsive<T>`, the styling and binding vocabulary. No dependencies. |
| [`NE.Standard.UI.Abstractions`](https://www.nuget.org/packages/NE.Standard.UI.Abstractions) | the binding and addressing model, `RecursiveObservable`, the items and interaction contracts, the `ClientEffect` vocabulary. |
| [`NE.Standard.UI.Authoring`](https://www.nuget.org/packages/NE.Standard.UI.Authoring) | what an author writes against: the component, view and controller base contracts. |
| [`NE.Standard.UI.Compiled`](https://www.nuget.org/packages/NE.Standard.UI.Compiled) | the compiler's output: `CompiledView`, its indexes and the resolution over them. |
| [`NE.Standard.UI.Shell`](https://www.nuget.org/packages/NE.Standard.UI.Shell) | hosting and runtime contracts: `IUIHost`, `IUIRuntime`, `IUIUpdateSink`, sessions, services. |
| [`NE.Standard.UI`](https://www.nuget.org/packages/NE.Standard.UI) | the engine: view compilation, the two-way runtime, hosting, routing, scheduling. |
| [`NE.Standard.UI.Components`](https://www.nuget.org/packages/NE.Standard.UI.Components) | the built-in components and their default templates. |
| [`NE.Standard.UI.Generators`](https://www.nuget.org/packages/NE.Standard.UI.Generators) | the two Roslyn source generators the stack is built on, usable by anything defining its own components or observable models. |
| [`NE.Standard.UI.Web`](https://www.nuget.org/packages/NE.Standard.UI.Web) | the ASP.NET Core host: shell, SignalR channel, file transfer, and the embedded TypeScript client. |
| [`NE.Standard.UI.Web.Abstractions`](https://www.nuget.org/packages/NE.Standard.UI.Web.Abstractions) | the render contracts an add-on implements to render a component of its own. |
| [`NE.Standard.UI.Web.Renderers`](https://www.nuget.org/packages/NE.Standard.UI.Web.Renderers) | the HTML renderers for the built-in components. |
| [`NE.Standard.UI.Extensions`](https://www.nuget.org/packages/NE.Standard.UI.Extensions) | presets over the components. Reserved and empty in this pre-release. |

**Icons ship separately**, from [`NE.Standard.UI.Icons`](https://github.com/AkiEvansDev/NE.Standard.UI.Icons)
— `NE.Standard.UI.Icons.Lucide` and `NE.Standard.UI.Web.Icons.Lucide`, MIT, on their own version. They are
developed alongside the framework, so a set and the renderer it plugs into are never out of step. The demo
uses them.

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
            .SetPadding(new UIThickness(16))
            .AddChild(new TextComponent()
                .BindTitle(nameof(CounterController.Count))
                .SetPlacement(1, 1, 24, 1)
            )
            .AddChild(new ButtonComponent()
                .OnClick(nameof(CounterController.Increment))
                .ConfigureDefaultContent(c => c.SetTitle("Add one"))
                .SetPlacement(1, 2, 24, 1)
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
await app.MapStandardUIWebAsync();
await app.RunAsync();
```

## The demo

`examples/DemoApp` is the reference application: every built-in component across 103 routes, with a worked
authentication/authorization section. Each component has a live binding playground; a static example page
where it has variants worth putting side by side, and an interaction test where there is a server-side event
to watch.

```
dotnet run --project examples/DemoApp.Web    # http://localhost:5000
```

## Building

Requires the .NET 10 SDK, and Node for the TypeScript client — which builds **as part of** `dotnet build`, so
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
[LICENSE.md](LICENSE.md); it is one page.
