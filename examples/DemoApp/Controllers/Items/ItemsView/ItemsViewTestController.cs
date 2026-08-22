using System;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Items.ItemsView;

internal sealed partial class DemoMessageItem : RecursiveObservable, IBindableItem
{
    public string Id { get; init; } = Guid.NewGuid().ToString("N");

    [RecursiveMember]
    public partial string Kind { get; set; } = "text";

    [RecursiveMember]
    public partial string Author { get; set; } = "";

    [RecursiveMember]
    public partial string Text { get; set; } = "";

    [RecursiveMember]
    public partial string ImageUrl { get; set; } = "";
}

internal sealed partial class MessageFeedGroupContext : DemoGroupContext
{
    private static readonly string[] Authors = ["Aki", "Robin", "Sam"];
    private static readonly string[] ImageUrls =
    [
        "https://picsum.photos/id/1015/480/240",
        "https://picsum.photos/id/1025/480/240",
        "https://picsum.photos/id/1039/480/240",
        "https://picsum.photos/id/1043/480/240",
    ];

    [RecursiveMember(false)]
    public RecursiveCollection<DemoMessageItem> Messages { get; } =
    [
        new() { Kind = "text", Author = "Robin", Text = "Morning! The nightly build just went green." },
        new() { Kind = "image", Author = "Aki", Text = "First draft of the new palette page.", ImageUrl = "https://picsum.photos/id/1015/480/240" },
        new() { Kind = "text", Author = "Sam", Text = "Nice. Are we shipping the theme override today?" },
    ];

    private int _counter;

    public void AddTextMessage()
    {
        _counter++;

        DemoMessageItem message = new() { Kind = "text", Author = NextAuthor(), Text = $"Reply #{_counter} — plain text renders through the 'text' template." };
        Messages.Add(message);

        LogEvent($"{message.Author} sent a text message");
    }

    public void AddImageMessage()
    {
        _counter++;

        DemoMessageItem message = new()
        {
            Kind = "image",
            Author = NextAuthor(),
            Text = $"Photo #{_counter} — images render through the 'image' template.",
            ImageUrl = ImageUrls[_counter % ImageUrls.Length]
        };
        Messages.Add(message);

        LogEvent($"{message.Author} sent a photo");
    }

    private string NextAuthor()
        => Authors[_counter % Authors.Length];

    public void ToggleMessageKind(DemoMessageItem message)
    {
        message.Kind = message.Kind == "text" ? "image" : "text";

        if (message.Kind == "image" && message.ImageUrl.Length == 0)
            message.ImageUrl = ImageUrls[++_counter % ImageUrls.Length];

        LogEvent($"Switched {message.Author}'s message to the '{message.Kind}' template");
    }

    public void RemoveMessage(DemoMessageItem message)
    {
        _ = Messages.Remove(message);
        LogEvent($"Removed {message.Author}'s message");
    }
}

internal sealed partial class DemoGroupedItem : RecursiveObservable, IBindableGroup
{
    public string Id { get; init; } = Guid.NewGuid().ToString("N");

    [RecursiveMember]
    public partial string Group { get; set; } = "Group A";

    [RecursiveMember]
    public partial string Title { get; set; } = "";
}

internal sealed partial class GroupingTestGroupContext : DemoGroupContext
{
    [RecursiveMember(false)]
    public RecursiveCollection<DemoGroupedItem> Items { get; } = [];

    private int _counter;

    public void AddItem()
    {
        _counter++;

        var group = CycleValue(Items.Count == 0 ? "Group C" : Items[^1].Group, "Group A", "Group B", "Group C");
        DemoGroupedItem item = new() { Group = group, Title = $"Item {_counter}" };
        Items.Add(item);

        LogEvent($"Added '{item.Title}' to '{group}'");
    }

    public void MoveToNextGroup(DemoGroupedItem item)
    {
        item.Group = CycleValue(item.Group, "Group A", "Group B", "Group C");
        LogEvent($"Moved '{item.Title}' to '{item.Group}'");
    }

    public void RemoveItem(DemoGroupedItem item)
    {
        _ = Items.Remove(item);
        LogEvent($"Removed '{item.Title}'");
    }
}

internal sealed partial class DemoFilterItem(string title) : RecursiveObservable, IBindableItem
{
    public string Id { get; init; } = Guid.NewGuid().ToString("N");

    [RecursiveMember]
    public partial string Title { get; set; } = title;
}

internal sealed partial class FilterTestGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string SearchText { get; set; } = "";

    [RecursiveMember(false)]
    public RecursiveCollection<DemoFilterItem> Items { get; } =
    [
        new("Apples"),
        new("Bananas"),
        new("Cherries"),
        new("Dates"),
        new("Eggplant"),
    ];

    private int _counter;

    public void AddItem()
    {
        _counter++;

        DemoFilterItem item = new($"Extra item {_counter}");
        Items.Add(item);

        LogEvent($"Added '{item.Title}'");
    }

    public void RemoveItem(DemoFilterItem item)
    {
        _ = Items.Remove(item);
        LogEvent($"Removed '{item.Title}'");
    }
}

internal sealed partial class DemoScopeChildItem(string title) : RecursiveObservable, IBindableItem
{
    public string Id { get; init; } = Guid.NewGuid().ToString("N");

    [RecursiveMember]
    public partial string Title { get; set; } = title;
}

internal sealed partial class DemoScopeParentItem(string title) : RecursiveObservable, IBindableItem
{
    public string Id { get; init; } = Guid.NewGuid().ToString("N");

    [RecursiveMember]
    public partial string Title { get; set; } = title;

    [RecursiveMember(false)]
    public RecursiveCollection<DemoScopeChildItem> Children { get; } = [];
}

internal sealed partial class ScopeTestGroupContext : DemoGroupContext
{
    [RecursiveMember(false)]
    public RecursiveCollection<DemoScopeParentItem> Items { get; } = [];

    private int _parentCounter;
    private int _childCounter;

    public void AddParent()
    {
        _parentCounter++;

        DemoScopeParentItem item = new($"Parent {_parentCounter}");
        Items.Add(item);

        LogEvent($"Added '{item.Title}'");
    }

    public void AddChild(DemoScopeParentItem parent)
    {
        _childCounter++;

        DemoScopeChildItem child = new($"Child {_childCounter}");
        parent.Children.Add(child);

        LogEvent($"Added '{child.Title}' to '{parent.Title}'");
    }

    public void RemoveParent(DemoScopeParentItem parent)
    {
        _ = Items.Remove(parent);
        LogEvent($"Removed '{parent.Title}'");
    }
}

internal sealed partial class ItemsViewTestController() : DemoController
{
    [RecursiveMember]
    public partial string GlobalLabel { get; set; } = "Global updates: 0";

    private int _globalCounter;

    [RecursiveMember]
    public partial MessageFeedGroupContext MessageGroup { get; set; } = new();

    [RecursiveMember]
    public partial GroupingTestGroupContext GroupingGroup { get; set; } = new();

    [RecursiveMember]
    public partial FilterTestGroupContext FilterGroup { get; set; } = new();

    [RecursiveMember]
    public partial ScopeTestGroupContext ScopeGroup { get; set; } = new();

    [UICommand]
    public void IncrementGlobalLabel()
        => GlobalLabel = $"Global updates: {++_globalCounter}";

    [UICommand]
    public void AddTextMessage()
        => MessageGroup.AddTextMessage();

    [UICommand]
    public void AddImageMessage()
        => MessageGroup.AddImageMessage();

    [UICommand]
    public void ToggleMessageKind(DemoMessageItem message)
        => MessageGroup.ToggleMessageKind(message);

    [UICommand]
    public void RemoveMessage(DemoMessageItem message)
        => MessageGroup.RemoveMessage(message);

    [UICommand]
    public void AddGroupedItem()
        => GroupingGroup.AddItem();

    [UICommand]
    public void MoveToNextGroup(DemoGroupedItem item)
        => GroupingGroup.MoveToNextGroup(item);

    [UICommand]
    public void RemoveGroupedItem(DemoGroupedItem item)
        => GroupingGroup.RemoveItem(item);

    [UICommand]
    public void AddFilterItem()
        => FilterGroup.AddItem();

    [UICommand]
    public void RemoveFilterItem(DemoFilterItem item)
        => FilterGroup.RemoveItem(item);

    [UICommand]
    public void AddScopeParent()
        => ScopeGroup.AddParent();

    [UICommand]
    public void AddScopeChild(DemoScopeParentItem parent)
        => ScopeGroup.AddChild(parent);

    [UICommand]
    public void RemoveScopeParent(DemoScopeParentItem parent)
        => ScopeGroup.RemoveParent(parent);
}
