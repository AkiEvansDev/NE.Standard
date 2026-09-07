using System.Globalization;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Contents.KeyValueAction;

/// <summary>
/// The properties that answer for the whole list rather than for one row.
/// </summary>
internal sealed partial class KeyValueActionListGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UISurfaceStyle? Surface { get; set; } = UISurfaceStyle.Background;

    [RecursiveMember]
    public partial bool ShowRowSeparators { get; set; } = true;

    [RecursiveMember]
    public partial bool StretchValue { get; set; } = true;

    [RecursiveMember]
    public partial bool ShowActions { get; set; } = true;

    [RecursiveMember]
    public partial bool RowHoverable { get; set; }

    [RecursiveMember]
    public partial UIOverflow? Overflow { get; set; } = UIOverflow.Hidden;

    public KeyValueActionListGroupContext()
    {
        AddOption(nameof(Surface), CycleSurface, () => Surface);
        AddOption(nameof(ShowRowSeparators), ToggleShowRowSeparators, () => ShowRowSeparators);
        AddOption(nameof(StretchValue), ToggleStretchValue, () => StretchValue);
        AddOption(nameof(ShowActions), ToggleShowActions, () => ShowActions);
        AddOption(nameof(RowHoverable), ToggleRowHoverable, () => RowHoverable);
        AddOption(nameof(Overflow), CycleOverflow, () => Overflow);
    }

    public void CycleSurface()
        => SetLastChange(nameof(Surface), Surface = CycleEnum(Surface));

    public void ToggleShowRowSeparators()
        => SetLastChange(nameof(ShowRowSeparators), ShowRowSeparators = !ShowRowSeparators);

    public void ToggleStretchValue()
        => SetLastChange(nameof(StretchValue), StretchValue = !StretchValue);

    public void ToggleShowActions()
        => SetLastChange(nameof(ShowActions), ShowActions = !ShowActions);

    public void ToggleRowHoverable()
        => SetLastChange(nameof(RowHoverable), RowHoverable = !RowHoverable);

    public void CycleOverflow()
        => SetLastChange(nameof(Overflow), Overflow = CycleEnum(Overflow));
}

/// <summary>
/// The rows themselves: each option prints the collection's state, and pressing it moves the collection.
/// </summary>
internal sealed partial class KeyValueActionRowsGroupContext : DemoGroupContext
{
    private int _added;

    [RecursiveMember(false)]
    public RecursiveCollection<KeyValueActionItem> Items { get; } =
    [
        CreateItem("region", "Region", "eu-west-1"),
        CreateItem("replicas", "Replicas", "3"),
        CreateItem("visibility", "Visibility", "internal"),
    ];

    public KeyValueActionRowsGroupContext()
    {
        AddOption("Add", AddItem, () => Items.Count);
        AddOption("Remove", RemoveItem, () => Items.Count);
        AddOption("Rename last", RenameLast, () => Items.Count == 0 ? null : ((TextItem)Items[^1].Value).Title);
    }

    public void AddItem()
    {
        var id = string.Create(CultureInfo.InvariantCulture, $"flag-{++_added}");

        Items.Add(CreateItem(id, string.Create(CultureInfo.InvariantCulture, $"Feature {_added}"), "enabled"));
    }

    public void RemoveItem()
    {
        if (Items.Count > 0)
            _ = Items.Remove(Items[^1]);
    }

    /// <summary>
    /// Mutates the last row's value in place, which shows the cloned template slot's bindings are live.
    /// </summary>
    public void RenameLast()
    {
        if (Items.Count == 0)
            return;

        TextItem value = (TextItem)Items[^1].Value;

        value.Title = value.Title?.EndsWith('*') == true
            ? value.Title.TrimEnd('*')
            : $"{value.Title}*";
    }

    private static KeyValueActionItem CreateItem(string id, string key, string value)
        => new()
        {
            Id = id,
            Key = new TextItem { Title = key },
            Value = new TextItem { Title = value, TitleColor = UIThemeColor.Muted },
            Action = new ButtonItem { Id = id, Icon = DemoIcons.Outline(DemoIcons.Edit), Type = UIButtonType.Ghost, Size = UIButtonSize.Small }
        };
}

internal sealed partial class KeyValueActionMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial KeyValueActionListGroupContext ListGroup { get; set; } = new();

    [RecursiveMember]
    public partial KeyValueActionRowsGroupContext ItemsGroup { get; set; } = new();

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();

    [UICommand]
    public void CycleListOption(string id)
        => ListGroup.CycleOption(id);

    [UICommand]
    public void CycleItemsOption(string id)
        => ItemsGroup.CycleOption(id);

    [UICommand]
    public void CycleBorderOption(string id)
        => BorderGroup.CycleOption(id);
}
