using System;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Actions.CommandBar;

internal sealed partial class CommandBarArgumentGroupContext : DemoGroupContext
{
    [RecursiveMember(false)]
    public RecursiveCollection<ButtonItem> Items { get; } =
    [
        new ButtonItem { Id = "build", Icon = LucideIcons.Wrench, Title = "Build", Type = UIButtonType.Outline },
        new ButtonItem { Id = "test", Icon = LucideIcons.BadgeCheck, Title = "Test", Type = UIButtonType.Outline },
        new ButtonItem { Id = "deploy", Icon = LucideIcons.Upload, Title = "Deploy", Type = UIButtonType.Outline },
    ];

    public void RecordItem(ButtonItem item)
    {
        ArgumentNullException.ThrowIfNull(item);

        LogEvent($"item -> Id={item.Id}, Title={item.Title}");
    }

    public void RecordKey(string id)
        => LogEvent($"item key -> {id}");
}

internal sealed partial class CommandBarTestController() : DemoController
{
    [RecursiveMember]
    public partial CommandBarArgumentGroupContext ItemGroup { get; set; } = new();

    [RecursiveMember]
    public partial CommandBarArgumentGroupContext KeyGroup { get; set; } = new();

    /// <summary>
    /// The whole item arrives as its model type — the argument the compiler resolves from the click site's
    /// own dynamic-parameter stack, not from anything the view had to pass explicitly.
    /// </summary>
    [UICommand]
    public void ClickWithItem(ButtonItem item)
        => ItemGroup.RecordItem(item);

    [UICommand]
    public void ClickWithKey(string id)
        => KeyGroup.RecordKey(id);
}
