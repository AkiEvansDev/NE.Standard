using NE.Standard.Types;

namespace NE.Test.Standard.Types;

public class LimitedStackTests
{
    [Fact]
    public void Push_AddsItems_UntilLimit()
    {
        var stack = new LimitedStack<int>(3);
        stack.Push(1);
        stack.Push(2);
        stack.Push(3);
        Assert.Equal(3, stack.Count);
        Assert.Equal(3, stack.Peek());
    }

    [Fact]
    public void Push_ExceedsLimit_RemovesOldest()
    {
        var stack = new LimitedStack<int>(3);
        stack.Push(1);
        stack.Push(2);
        stack.Push(3);
        stack.Push(4);

        Assert.Equal(3, stack.Count);
        Assert.Equal(4, stack.Peek());
        Assert.False(stack.Contains(1));
    }

    [Fact]
    public void Pop_RemovesAndReturnsTop()
    {
        var stack = new LimitedStack<string>(2);
        stack.Push("a");
        stack.Push("b");

        var popped = stack.Pop();
        Assert.Equal("b", popped);
        Assert.Single(stack);
    }

    [Fact]
    public void TryPop_WorksCorrectly()
    {
        var stack = new LimitedStack<string>(1);
        stack.Push("test");

        Assert.True(stack.TryPop(out var result));
        Assert.Equal("test", result);
        Assert.False(stack.TryPop(out _));
    }

    [Fact]
    public void Peek_ReturnsTopWithoutRemoving()
    {
        var stack = new LimitedStack<int>(2);
        stack.Push(42);
        var peeked = stack.Peek();
        Assert.Equal(42, peeked);
        Assert.Single(stack);
    }

    [Fact]
    public void TryPeek_WorksCorrectly()
    {
        var stack = new LimitedStack<int>(1);
        Assert.False(stack.TryPeek(out _));

        stack.Push(99);
        Assert.True(stack.TryPeek(out var result));
        Assert.Equal(99, result);
    }

    [Fact]
    public void Clear_ResetsStack()
    {
        var stack = new LimitedStack<int>(5);
        stack.Push(1);
        stack.Push(2);
        stack.Clear();

        Assert.Empty(stack);
        Assert.False(stack.Contains(1));
    }

    [Fact]
    public void ToArray_ReturnsLifoOrder()
    {
        var stack = new LimitedStack<int>(3);
        stack.Push(1);
        stack.Push(2);
        stack.Push(3);

        var arr = stack.ToArray();
        Assert.Equal([3, 2, 1], arr);
    }

    [Fact]
    public void CopyTo_CopiesToArrayCorrectly()
    {
        var stack = new LimitedStack<string>(3);
        stack.Push("one");
        stack.Push("two");

        var arr = new string[3];
        stack.CopyTo(arr, 1);
        Assert.Equal("two", arr[1]);
        Assert.Equal("one", arr[2]);
    }

    [Fact]
    public void TrimExcess_ShrinksBuffer_WhenUnderThreshold()
    {
        var stack = new LimitedStack<int>(10);
        for (int i = 0; i < 3; i++) stack.Push(i);

        int before = stack.EnsureCapacity(3);
        stack.TrimExcess();
        int after = stack.EnsureCapacity(0);

        Assert.True(after <= before);
    }

    [Fact]
    public void Enumerator_IteratesInLifoOrder()
    {
        var stack = new LimitedStack<string>(3);
        stack.Push("a");
        stack.Push("b");
        stack.Push("c");

        var result = string.Join(",", stack);
        Assert.Equal("c,b,a", result);
    }
}
