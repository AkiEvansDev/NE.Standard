using System;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Contents.KeyValueAction;

internal sealed partial class KeyValueActionArgumentGroupContext : DemoGroupContext
{
    [RecursiveMember(false)]
    public RecursiveCollection<KeyValueActionItem> Items { get; } =
    [
        CreateItem("owner", "Owner", "platform-team"),
        CreateItem("created", "Created", "2026-04-02"),
        CreateItem("visibility", "Visibility", "internal"),
    ];

    public void RecordItem(KeyValueActionItem item)
    {
        ArgumentNullException.ThrowIfNull(item);

        LogEvent($"item -> Id={item.Id}, Value={item.Value.Title}");
    }

    public void RecordKey(string id)
        => LogEvent($"item key -> {id}");

    private static KeyValueActionItem CreateItem(string id, string key, string value)
        => new()
        {
            Id = id,
            Key = new TextItem { Title = key, TitleColor = UIThemeColor.Muted },
            Value = new TextItem { Title = value },
            Action = new ButtonItem { Id = id, Icon = LucideIcons.Edit, Type = UIButtonType.Ghost }
        };
}

internal sealed partial class KeyValueActionTestController() : DemoController
{
    [RecursiveMember]
    public partial KeyValueActionArgumentGroupContext RowGroup { get; set; } = new();

    [RecursiveMember]
    public partial KeyValueActionArgumentGroupContext ActionGroup { get; set; } = new();

    [UICommand]
    public void ClickRowWithItem(KeyValueActionItem item)
        => RowGroup.RecordItem(item);

    [UICommand]
    public void ClickActionWithKey(string id)
        => ActionGroup.RecordKey(id);
}
