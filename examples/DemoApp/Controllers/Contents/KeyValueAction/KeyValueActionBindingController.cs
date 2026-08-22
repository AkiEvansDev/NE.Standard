using System.Globalization;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Contents.KeyValueAction;

internal sealed partial class KeyValueActionRowGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial bool ShowRowSeparators { get; set; } = true;

    [RecursiveMember]
    public partial bool StretchValue { get; set; } = true;

    [RecursiveMember]
    public partial bool ShowActions { get; set; } = true;

    [RecursiveMember]
    public partial bool ShowBorder { get; set; } = true;

    [RecursiveMember]
    public partial bool RowHoverable { get; set; }

    public void ToggleShowRowSeparators()
        => SetLastChange(nameof(ShowRowSeparators), ShowRowSeparators = !ShowRowSeparators);

    public void ToggleStretchValue()
        => SetLastChange(nameof(StretchValue), StretchValue = !StretchValue);

    public void ToggleShowActions()
        => SetLastChange(nameof(ShowActions), ShowActions = !ShowActions);

    public void ToggleShowBorder()
        => SetLastChange(nameof(ShowBorder), ShowBorder = !ShowBorder);

    public void ToggleRowHoverable()
        => SetLastChange(nameof(RowHoverable), RowHoverable = !RowHoverable);
}

internal sealed partial class KeyValueActionItemsGroupContext : DemoGroupContext
{
    private int _added;

    [RecursiveMember(false)]
    public RecursiveCollection<KeyValueActionItem> Items { get; } =
    [
        CreateItem("region", "Region", "eu-west-1"),
        CreateItem("replicas", "Replicas", "3"),
    ];

    public void AddItem()
    {
        var id = string.Create(CultureInfo.InvariantCulture, $"flag-{++_added}");

        Items.Add(CreateItem(id, string.Create(CultureInfo.InvariantCulture, $"Feature {_added}"), "enabled"));

        SetLastChange(nameof(Items), id);
    }

    public void RemoveItem()
    {
        if (Items.Count == 0)
        {
            SetLastChange(nameof(Items), "empty");
            return;
        }

        KeyValueActionItem removed = Items[^1];
        _ = Items.Remove(removed);

        SetLastChange(nameof(Items), string.Create(CultureInfo.InvariantCulture, $"removed {removed.Id}"));
    }

    /// <summary>
    /// Mutates the last row's value text in place rather than replacing the item, for the reason recorded
    /// on <c>ItemsViewBindingController</c> — and it is the sharper test here anyway: the value lives in
    /// its own cloned template slot, so a value that changes proves the slot's bindings are live, not just
    /// that the row was assembled once.
    /// </summary>
    public void RenameLast()
    {
        if (Items.Count == 0)
        {
            SetLastChange(nameof(Items), "empty");
            return;
        }

        // Value is declared as ITextModel, so this rename exercises nested path resolution through an
        // interface-typed member — the case that once updated the model and blanked the row.
        TextItem value = (TextItem)Items[^1].Value;

        value.Title = value.Title?.EndsWith('*') == true
            ? value.Title.TrimEnd('*')
            : $"{value.Title}*";

        SetLastChange(nameof(Items), value.Title ?? "");
    }

    private static KeyValueActionItem CreateItem(string id, string key, string value)
        => new()
        {
            Id = id,
            Key = new TextItem { Title = key, TitleColor = UIThemeColor.Muted },
            Value = new TextItem { Title = value },
            Action = new ButtonItem { Id = id, Icon = LucideIcons.Edit, Type = UIButtonType.Ghost }
        };
}

internal sealed partial class KeyValueActionBindingController() : DemoBindingController
{
    [RecursiveMember]
    public partial KeyValueActionRowGroupContext RowGroup { get; set; } = new();

    [RecursiveMember]
    public partial KeyValueActionItemsGroupContext ItemsGroup { get; set; } = new();

    [UICommand]
    public void ToggleShowRowSeparators()
        => RowGroup.ToggleShowRowSeparators();

    [UICommand]
    public void ToggleStretchValue()
        => RowGroup.ToggleStretchValue();

    [UICommand]
    public void ToggleShowActions()
        => RowGroup.ToggleShowActions();

    [UICommand]
    public void ToggleShowBorder()
        => RowGroup.ToggleShowBorder();

    [UICommand]
    public void ToggleRowHoverable()
        => RowGroup.ToggleRowHoverable();

    [UICommand]
    public void AddItem()
        => ItemsGroup.AddItem();

    [UICommand]
    public void RemoveItem()
        => ItemsGroup.RemoveItem();

    [UICommand]
    public void RenameLast()
        => ItemsGroup.RenameLast();
}
