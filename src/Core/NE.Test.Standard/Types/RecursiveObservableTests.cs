using CommunityToolkit.Mvvm.ComponentModel;
using NE.Standard.Types;

namespace NE.Test.Standard.Types;

public partial class TestNode(string name) : RecursiveObservable
{
    [ObservableProperty]
    private string _name = name;

    [ObservableProperty]
    private TestNode? _child = null;
}

public class RecursiveObservableTests
{
    [Fact]
    public void Notifier_TriggersOnPropertyChange()
    {
        var changedPath = "";
        var changedValue = "";

        var node = new TestNode("initial");
        node.SetNotifier(args => {
            changedPath = args.Path;
            changedValue = args.Value?.ToString() ?? "";
        });

        node.Name = "updated";

        Assert.Equal("Name", changedPath);
        Assert.Equal("updated", changedValue);
    }

    [Fact]
    public void ClearNotifier_PreventsFurtherNotifications()
    {
        var wasCalled = false;

        var node = new TestNode("start");
        node.SetNotifier(_ => wasCalled = true);

        node.ClearNotifier();
        node.Name = "new";

        Assert.False(wasCalled);
    }

    [Fact]
    public void NestedNode_ChangeTriggersPrefixedPath()
    {
        string? observedPath = null;
        string? observedValue = null;

        var root = new TestNode("root")
        {
            Child = new TestNode("child")
        };

        root.SetNotifier(evt =>
        {
            observedPath = evt.Path;
            observedValue = evt.Value?.ToString();
        });

        root.Child.Name = "newName";

        Assert.Equal("Child.Name", observedPath);
        Assert.Equal("newName", observedValue);
    }

    [Fact]
    public void RecursiveCollection_ItemChangeShouldIncludeIndexInPath()
    {
        string? receivedPath = null;
        string? receivedValue = null;

        var item1 = new TestNode("one");
        var item2 = new TestNode("two");

        var collection = new RecursiveCollection<TestNode> { item1, item2 };
        collection.SetNotifier(evt =>
        {
            receivedPath = evt.Path;
            receivedValue = evt.Value?.ToString();
        }, "Items");

        item2.Name = "updated";

        Assert.Equal("Items.[1].Name", receivedPath);
        Assert.Equal("updated", receivedValue);
    }

    [Fact]
    public void RecursiveCollection_ReplaceShouldUpdateNotifierPath()
    {
        string? updatedPath = null;
        string? updatedValue = null;

        var oldItem = new TestNode("old");
        var newItem = new TestNode("new");

        var collection = new RecursiveCollection<TestNode> { oldItem };
        collection.SetNotifier(evt =>
        {
            updatedPath = evt.Path;
            updatedValue = evt.Value?.ToString();
        }, "List");

        collection[0] = newItem;
        newItem.Name = "fresh";

        Assert.Equal("List.[0].Name", updatedPath);
        Assert.Equal("fresh", updatedValue);
    }
}
