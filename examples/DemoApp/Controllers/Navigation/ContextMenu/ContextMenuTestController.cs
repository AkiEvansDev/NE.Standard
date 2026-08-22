using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Navigation.ContextMenu;

internal sealed partial class DemoDeployItem : RecursiveObservable, IBindableItem
{
    [RecursiveMember(false)]
    public string Id { get; init; } = "";

    [RecursiveMember]
    public partial string Title { get; set; } = "";
}

internal sealed partial class ContextMenuTestGroupContext : DemoGroupContext
{
    [RecursiveMember(false)]
    public RecursiveCollection<DemoDeployItem> Deploys { get; } =
    [
        new() { Id = "481", Title = "nova-web · #481" },
        new() { Id = "482", Title = "nova-web · #482" },
        new() { Id = "483", Title = "nova-api · #483" }
    ];

    public void Record(string action, string id)
        => LogEvent($"{action} on deploy {id}");
}

internal sealed partial class ContextMenuTestController() : DemoController
{
    [RecursiveMember]
    public partial ContextMenuTestGroupContext TestGroup { get; set; } = new();

    [UICommand]
    public void Rename()
        => TestGroup.Record("Rename", "card");

    [UICommand]
    public void Duplicate()
        => TestGroup.Record("Duplicate", "card");

    /// <summary>
    /// Takes both scopes the click sits in: the row from the enclosing bound collection, and the menu entry.
    /// </summary>
    [UICommand]
    public void Promote(string row, string entry)
        => TestGroup.Record(entry, row);
}
