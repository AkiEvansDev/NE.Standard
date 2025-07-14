using NE.Standard.Types;
using System.Collections;

namespace NE.Test.Standard.Types;

public class RecursiveChangedEventArgsTests
{
    [Fact]
    public void Constructor_SetAction_CreatesWithCorrectProperties()
    {
        var args = new RecursiveChangedEventArgs("MyPath", 42);

        Assert.Equal(RecursiveChangedAction.Set, args.Action);
        Assert.Equal("MyPath", args.Path);
        Assert.Equal(42, args.Value);
        Assert.Null(args.NewStartingIndex);
        Assert.Null(args.NewItems);
        Assert.Null(args.OldStartingIndex);
        Assert.Null(args.OldItems);
    }

    [Fact]
    public void Constructor_WithDetailedChange_SetsAllProperties()
    {
        IList newItems = new[] { "new" };
        IList oldItems = new[] { "old" };

        var args = new RecursiveChangedEventArgs(
            RecursiveChangedAction.Replace,
            "Node.Property",
            1,
            newItems,
            0,
            oldItems
        );

        Assert.Equal(RecursiveChangedAction.Replace, args.Action);
        Assert.Equal("Node.Property", args.Path);
        Assert.Equal(1, args.NewStartingIndex);
        Assert.Equal(newItems, args.NewItems);
        Assert.Equal(0, args.OldStartingIndex);
        Assert.Equal(oldItems, args.OldItems);
    }
}
