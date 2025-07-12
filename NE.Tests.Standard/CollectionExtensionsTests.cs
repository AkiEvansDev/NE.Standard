using NE.Standard.Extensions;
using System.Collections;

namespace NE.Tests.Standard;

public class CollectionExtensionsTests
{
    private static readonly int[] sourceArray = [1, 2, 3];

    [Fact]
    public void IsNullOrEmpty_ReturnsExpected()
    {
        IEnumerable<int>? nullSeq = null;
        Assert.True(nullSeq.IsNullOrEmpty());
        Assert.True(Array.Empty<int>().IsNullOrEmpty());
        Assert.False(sourceArray.IsNullOrEmpty());
    }

    [Fact]
    public void WhereNotNull_FiltersReferenceTypes()
    {
        string?[] data = ["a", null, "b"];
        var result = data.WhereNotNull();
        Assert.Equal(["a", "b"], result);
    }

    [Fact]
    public void Groups_SplitsIntoNearlyEqualSizes()
    {
        var groups = Enumerable.Range(1, 8).Groups(3).Select(g => g.Count()).ToArray();
        Assert.Equal([3, 3, 2], groups);
    }

    [Fact]
    public void Partition_SplitsSequenceBySize()
    {
        var partitions = Enumerable.Range(1, 5).Partition(2).Select(p => p.ToArray()).ToArray();
        Assert.Equal([[1, 2], [3, 4], [5]], partitions);
    }

    [Fact]
    public void InsertSorted_InsertsKeepingAscendingOrder()
    {
        IList list = new List<int> { 1, 3, 5 };
        list.InsertSorted(4);
        Assert.Equal([1, 3, 4, 5], list.Cast<int>());
    }

    [Fact]
    public void InsertSortedDescending_InsertsKeepingDescendingOrder()
    {
        IList list = new List<int> { 5, 3, 1 };
        list.InsertSortedDescending(4);
        Assert.Equal([5, 4, 3, 1], list.Cast<int>());
    }

    [Fact]
    public void InsertSorted_ListOverload_Works()
    {
        var list = new List<int> { 1, 3, 5 };
        list.InsertSorted(2);
        Assert.Equal([1, 2, 3, 5], list);
    }

    [Fact]
    public void InsertSortedDescending_ListOverload_Works()
    {
        var list = new List<int> { 5, 3, 1 };
        list.InsertSortedDescending(4);
        Assert.Equal([5, 4, 3, 1], list);
    }

    [Fact]
    public void ForEach_ExecutesActionForEachItem()
    {
        int sum = 0;
        sourceArray.ForEach(x => sum += x);
        Assert.Equal(6, sum);
    }

    [Fact]
    public void ShuffleInPlace_MaintainsElements()
    {
        var list = Enumerable.Range(1, 5).ToList();
        list.ShuffleInPlace();
        Assert.Equal(Enumerable.Range(1, 5), list.OrderBy(x => x));
    }

    [Fact]
    public void ParallelForEach_ProcessesAllItems()
    {
        object gate = new();
        int sum = 0;
        Enumerable.Range(1, 5).ParallelForEach(i => { lock (gate) { sum += i; } });
        Assert.Equal(15, sum);
    }

    [Fact]
    public void ParallelSelect_ProjectsItems()
    {
        var result = Enumerable.Range(1, 5).ParallelSelect(i => i * 2).OrderBy(i => i).ToArray();
        Assert.Equal([2, 4, 6, 8, 10], result);
    }

    [Fact]
    public void ParallelForEachPartitioned_SumsPartitions()
    {
        object gate = new();
        int total = 0;
        Enumerable.Range(1, 5).ParallelForEachPartitioned(2, part =>
        {
            int partial = part.Sum();
            lock (gate) total += partial;
        });
        Assert.Equal(15, total);
    }

    [Fact]
    public void ParallelProcess_ReturnsResults()
    {
        var bag = Enumerable.Range(1, 5).ParallelProcess(i => i * 2);
        Assert.Equal([2, 4, 6, 8, 10], bag.OrderBy(i => i));
    }
}
