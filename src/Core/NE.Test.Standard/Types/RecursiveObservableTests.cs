using CommunityToolkit.Mvvm.ComponentModel;
using NE.Standard.Types;

namespace NE.Test.Standard.Types;

public class TestObservable : RecursiveObservable
{
    public List<RecursiveChangedEventArgs> Notifications { get; } = [];

    protected override void OnNotify(RecursiveChangedEventArgs e)
    {
        Notifications.Add(e);
    }

    public void ClearNotifications() => Notifications.Clear();
}

public partial class TestItem(string name) : TestObservable
{
    [ObservableProperty]
    private string _name = name;
}

public class TestCollection : RecursiveCollection<TestItem>
{
    public List<RecursiveChangedEventArgs> Notifications { get; } = [];

    protected override void OnNotify(RecursiveChangedEventArgs e)
    {
        Notifications.Add(e);
    }

    public void ClearNotifications() => Notifications.Clear();
}

public class RecursiveObservableTests
{
    [Fact]
    public void AddItem_ShouldRaiseRecursiveAddNotification()
    {
        var collection = new TestCollection();
        var item = new TestItem("A");

        collection.Add(item);

        Assert.Single(collection.Notifications);
        var notification = collection.Notifications[0];
        Assert.Equal(RecursiveChangedAction.Add, notification.Action);
        Assert.Equal("[0]", notification.Path);
        Assert.Equal(0, notification.Index);
        Assert.Equal(1, notification.Count);
    }

    [Fact]
    public void RemoveItem_ShouldRaiseRecursiveRemoveNotification()
    {
        var collection = new TestCollection();
        var item = new TestItem("A");

        collection.Add(item);
        collection.ClearNotifications();

        collection.Remove(item);

        Assert.Single(collection.Notifications);
        var notification = collection.Notifications[0];
        Assert.Equal(RecursiveChangedAction.Remove, notification.Action);
        Assert.Equal("[0]", notification.Path);
    }

    [Fact]
    public void SetPropertyInItem_ShouldRaiseRecursiveSetNotification()
    {
        var collection = new TestCollection();
        var item = new TestItem("Initial");

        collection.Add(item);
        collection.ClearNotifications();

        item.SetValue("Name", "Updated");

        Assert.Single(collection.Notifications);
        var notification = collection.Notifications[0];
        Assert.Equal(RecursiveChangedAction.Set, notification.Action);
        Assert.Equal("[0].Name", notification.Path);
    }

    [Fact]
    public void ReplaceItem_ShouldRaiseReplaceNotification()
    {
        var collection = new TestCollection
        {
            new TestItem("A")
        };
        collection.ClearNotifications();

        collection[0] = new TestItem("B");

        Assert.Single(collection.Notifications);
        var notification = collection.Notifications[0];
        Assert.Equal(RecursiveChangedAction.Replace, notification.Action);
        Assert.Equal("[0]", notification.Path);
    }

    [Fact]
    public void Clear_ShouldRaiseResetNotification()
    {
        var collection = new TestCollection
        {
            new TestItem("X")
        };
        collection.ClearNotifications();

        collection.Clear();

        Assert.Single(collection.Notifications);
        var notification = collection.Notifications[0];
        Assert.Equal(RecursiveChangedAction.Reset, notification.Action);
    }

    [Fact]
    public void AddRange_RaisesRecursiveAddNotification_WithCorrectCount()
    {
        var collection = new TestCollection();
        var items = new[] { new TestItem("A"), new TestItem("B") };

        collection.AddRange(items);

        Assert.Single(collection.Notifications);
        var notification = collection.Notifications[0];
        Assert.Equal(RecursiveChangedAction.Add, notification.Action);
        Assert.Equal("[0]", notification.Path);
        Assert.Equal(0, notification.Index);
        Assert.Equal(2, notification.Count);
    }

    [Fact]
    public void RemoveRange_RaisesRecursiveRemoveNotification_WithCorrectCount()
    {
        var collection = new TestCollection();
        var items = new[] { new TestItem("A"), new TestItem("B"), new TestItem("C") };
        collection.AddRange(items);
        collection.ClearNotifications();

        collection.RemoveRange(0, 2);

        Assert.Single(collection.Notifications);
        var notification = collection.Notifications[0];
        Assert.Equal(RecursiveChangedAction.Remove, notification.Action);
        Assert.Equal("[0]", notification.Path);
        Assert.Equal(0, notification.Index);
        Assert.Equal(2, notification.Count);
    }

    [Fact]
    public void Insert_RaisesAddNotification_WithCorrectIndex()
    {
        var collection = new TestCollection
        {
            new TestItem("A")
        };
        collection.ClearNotifications();

        collection.Insert(0, new TestItem("B"));

        Assert.Single(collection.Notifications);
        var notification = collection.Notifications[0];
        Assert.Equal(RecursiveChangedAction.Add, notification.Action);
        Assert.Equal("[0]", notification.Path);
        Assert.Equal(0, notification.Index);
    }
}
