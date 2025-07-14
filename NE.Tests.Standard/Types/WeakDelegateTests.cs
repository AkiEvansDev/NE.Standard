using NE.Standard.Types;

namespace NE.Tests.Standard.Types;

public class TestTarget
{
    public int Value { get; set; } = 42;

    public void DoWork() => Value++;
    public void DoWorkWithArg(int amount) => Value += amount;
    public void DoWorkWithTwoArgs(int a, int b) => Value += a + b;
    public void DoWorkWithThreeArgs(int a, int b, int c) => Value += a + b + c;
    public int GetValue() => Value;
    public int Multiply(int a) => a * 2;
    public int Sum(int a, int b) => a + b;
    public int SumThree(int a, int b, int c) => a + b + c;
}

public class WeakDelegateTests
{
    [Fact]
    public void WeakAction_Execute_Works_WhenTargetAlive()
    {
        var obj = new TestTarget();
        var weak = new WeakAction(obj.DoWork);

        Assert.True(weak.IsAlive);
        weak.Execute();
        Assert.Equal(43, obj.Value);
    }

    [Fact]
    public void WeakAction_TryExecute_ReturnsFalse_WhenTargetCollected()
    {
        WeakAction? weak = null;
        new Action(() =>
        {
            var temp = new TestTarget();
            weak = new WeakAction(temp.DoWork);
        })();

        GC.Collect();
        GC.WaitForPendingFinalizers();

        Assert.NotNull(weak);
        Assert.False(weak!.TryExecute());
    }

    [Fact]
    public void WeakActionT_Execute_CallsMethod()
    {
        var obj = new TestTarget();
        var weak = new WeakAction<int>(obj.DoWorkWithArg);

        weak.Execute(10);
        Assert.Equal(52, obj.Value);
    }

    [Fact]
    public void WeakActionT2_Execute_CallsMethod()
    {
        var obj = new TestTarget();
        var weak = new WeakAction<int, int>(obj.DoWorkWithTwoArgs);

        weak.Execute(3, 4);
        Assert.Equal(49, obj.Value);
    }

    [Fact]
    public void WeakActionT3_Execute_CallsMethod()
    {
        var obj = new TestTarget();
        var weak = new WeakAction<int, int, int>(obj.DoWorkWithThreeArgs);

        weak.Execute(1, 1, 1);
        Assert.Equal(45, obj.Value);
    }

    [Fact]
    public void WeakFunc_Execute_ReturnsValue()
    {
        var obj = new TestTarget();
        var weak = new WeakFunc<int>(obj.GetValue);

        var result = weak.Execute();
        Assert.Equal(42, result);
    }

    [Fact]
    public void WeakFuncT_Execute_ReturnsValue()
    {
        var obj = new TestTarget();
        var weak = new WeakFunc<int, int>(obj.Multiply);

        var result = weak.Execute(3);
        Assert.Equal(6, result);
    }

    [Fact]
    public void WeakFuncT2_Execute_ReturnsSum()
    {
        var obj = new TestTarget();
        var weak = new WeakFunc<int, int, int>(obj.Sum);

        var result = weak.Execute(4, 5);
        Assert.Equal(9, result);
    }

    [Fact]
    public void WeakFuncT3_Execute_ReturnsSum()
    {
        var obj = new TestTarget();
        var weak = new WeakFunc<int, int, int, int>(obj.SumThree);

        var result = weak.Execute(1, 2, 3);
        Assert.Equal(6, result);
    }

    [Fact]
    public void WeakFunc_TryExecute_ReturnsFalse_WhenTargetCollected()
    {
        WeakFunc<int>? weak = null;

        new Action(() =>
        {
            var obj = new TestTarget();
            weak = new WeakFunc<int>(obj.GetValue);
        })();

        GC.Collect();
        GC.WaitForPendingFinalizers();

        Assert.NotNull(weak);
        var success = weak!.TryExecute(out var result);
        Assert.False(success);
    }
}
