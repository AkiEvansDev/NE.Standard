using NE.Standard.Models;

namespace NE.Tests.Standard;

public class LimitedStackTests
{
    [Fact]
    public void PushBeyondCapacity_DropsOldestItem()
    {
        var stack = new LimitedStack<int>(3);
        stack.Push(1);
        stack.Push(2);
        stack.Push(3);
        stack.Push(4); // exceeds capacity

        Assert.Equal(3, stack.Count);
        Assert.Equal([4, 3, 2], [.. stack]);
    }

    [Fact]
    public void Pop_ReturnsItemsInLifoOrder()
    {
        var stack = new LimitedStack<int>(3);
        stack.Push(1);
        stack.Push(2);

        int value = stack.Pop();
        Assert.Equal(2, value);
        Assert.Single(stack);
        Assert.Equal([1], [.. stack]);
    }
}
