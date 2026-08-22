using System.Globalization;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Actions.CommandBar;

internal sealed partial class CommandBarGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UIOrientation Orientation { get; set; } = UIOrientation.Horizontal;

    /// <summary>
    /// Starts wrapped on purpose. The bar it drives carries a MaxWidth so Wrap has something to act
    /// against, and flex items shrink before they wrap — so with <c>Wrap = false</c> the page opens with
    /// every button squeezed down to a single letter, which reads as broken rather than as a neutral
    /// starting state. Toggling to false still shows that difference, just as a deliberate step.
    /// </summary>
    [RecursiveMember]
    public partial bool Wrap { get; set; } = true;

    [RecursiveMember]
    public partial double Spacing { get; set; } = 8d;

    public void CycleOrientation()
        => SetLastChange(nameof(Orientation), Orientation = CycleEnum(Orientation));

    public void ToggleWrap()
        => SetLastChange(nameof(Wrap), Wrap = !Wrap);

    public void CycleSpacing()
        => SetLastChange(nameof(Spacing), Spacing = CycleValue(Spacing, 0d, 4d, 8d, 16d, 32d));
}

internal sealed partial class CommandBarItemsGroupContext : DemoGroupContext
{
    private int _added;

    [RecursiveMember(false)]
    public RecursiveCollection<ButtonItem> Items { get; } =
    [
        new ButtonItem { Id = "deploy", Icon = LucideIcons.Upload, Title = "Deploy", Type = UIButtonType.Primary },
        new ButtonItem { Id = "rollback", Icon = LucideIcons.Undo, Title = "Rollback", Type = UIButtonType.Outline },
    ];

    public void AddItem()
    {
        var id = string.Create(CultureInfo.InvariantCulture, $"step-{++_added}");

        Items.Add(new ButtonItem
        {
            Id = id,
            Icon = LucideIcons.Play,
            Title = string.Create(CultureInfo.InvariantCulture, $"Step {_added}"),
            Type = UIButtonType.Ghost
        });

        SetLastChange(nameof(Items), id);
    }

    public void RemoveItem()
    {
        if (Items.Count == 0)
        {
            SetLastChange(nameof(Items), "empty");
            return;
        }

        ButtonItem removed = Items[^1];
        _ = Items.Remove(removed);

        SetLastChange(nameof(Items), string.Create(CultureInfo.InvariantCulture, $"removed {removed.Id}"));
    }

    /// <summary>
    /// Renames in place rather than replacing the item, for the reason recorded on
    /// <c>ItemsViewBindingController</c>: replacing emits a Replace/ContextRebuild the web client does not
    /// apply yet, so an in-place mutation is the only reliably-rendering option today.
    /// </summary>
    public void RenameLast()
    {
        if (Items.Count == 0)
        {
            SetLastChange(nameof(Items), "empty");
            return;
        }

        ButtonItem last = Items[^1];

        last.Title = last.Title?.EndsWith('*') == true
            ? last.Title.TrimEnd('*')
            : $"{last.Title}*";

        SetLastChange(nameof(Items), last.Title ?? "");
    }
}

internal sealed partial class CommandBarBindingController() : DemoBindingController
{
    [RecursiveMember]
    public partial CommandBarGroupContext CommandBarGroup { get; set; } = new();

    [RecursiveMember]
    public partial CommandBarItemsGroupContext ItemsGroup { get; set; } = new();

    [UICommand]
    public void CycleOrientation()
        => CommandBarGroup.CycleOrientation();

    [UICommand]
    public void ToggleWrap()
        => CommandBarGroup.ToggleWrap();

    [UICommand]
    public void CycleSpacing()
        => CommandBarGroup.CycleSpacing();

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
