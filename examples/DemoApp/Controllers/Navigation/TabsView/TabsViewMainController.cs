using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Navigation.TabsView;

/// <summary>
/// One strip over a collection of documents, and every property that can be bound to it or to one tab.
/// </summary>
internal sealed partial class TabsViewMainController : DemoStandardController
{
    /// <summary>
    /// The documents the strip is over; on the controller because two sections act on the same objects.
    /// </summary>
    [RecursiveMember(false)]
    public RecursiveCollection<DemoDocumentItem> Documents { get; } =
    [
        new()
        {
            Id = TabsViewGroupContext.ReadmeKey,
            Title = "README.md",
            Icon = DemoIcons.Outline(DemoIcons.FileText),
            Order = 1,
            Body = "A server-driven UI framework for .NET. The view is a component tree written in C#, the controller is an observable object graph, and the client never holds application state."
        },
        new()
        {
            Id = TabsViewGroupContext.ProgramKey,
            Title = "Program.cs",
            Icon = DemoIcons.Outline(DemoIcons.File),
            Order = 2,
            Body = "WebStartupBuilder.Configure<DemoAppWebStartup, DemoAppStartup>(builder.Services);\n\nawait app.MapStandardUIWebAsync();\nawait app.RunAsync();"
        },
        new()
        {
            Id = TabsViewGroupContext.SettingsKey,
            Title = "appsettings.json",
            Icon = DemoIcons.Outline(DemoIcons.Settings),
            Order = 3,
            Body = /*lang=json,strict*/ "{\n  \"Logging\": { \"LogLevel\": { \"Default\": \"Information\" } },\n  \"AllowedHosts\": \"*\"\n}"
        }
    ];

    [RecursiveMember]
    public partial TabsViewGroupContext TabsViewGroup { get; set; } = new();

    [RecursiveMember]
    public partial TabsViewItemGroupContext FirstTabGroup { get; set; }

    public TabsViewMainController()
    {
        FirstTabGroup = new TabsViewItemGroupContext(Documents[0]);
    }

    [UICommand]
    public void CycleTabsViewGroupOption(string id)
        => TabsViewGroup.CycleOption(id);

    [UICommand]
    public void CycleFirstTabGroupOption(string id)
        => FirstTabGroup.CycleOption(id);
}
