using System.Collections;
using System.Collections.Concurrent;
using NE.Standard.Extensions;

namespace NE.Tests.Standard;

public class CollectionExtensionsTests
{
    [Fact]
    public void IsNullOrEmpty_ReturnsExpected()
    {
        IEnumerable<int>? nullSeq = null;
        Assert.True(nullSeq.IsNullOrEmpty());
        Assert.True(Array.Empty<int>().IsNullOrEmpty());
        Assert.False(new[] {1}.IsNullOrEmpty());
    }

    [Fact]
    public void WhereNotNull_FiltersReferenceTypes()
    {
        string?[] data = {"a", null, "b"};
        var result = data.WhereNotNull();
        Assert.Equal(new[] {"a","b"}, result);
    }

    [Fact]
    public void Groups_SplitsIntoNearlyEqualSizes()
    {
        var groups = Enumerable.Range(1,8).Groups(3).Select(g => g.Count()).ToArray();
        Assert.Equal(new[]{3,3,2}, groups);
    }

    [Fact]
    public void Partition_SplitsSequenceBySize()
    {
        var partitions = Enumerable.Range(1,5).Partition(2).Select(p => p.ToArray()).ToArray();
        Assert.Equal(new[]{new[]{1,2}, new[]{3,4}, new[]{5}}, partitions);
    }

    [Fact]
    public void Chunk_SplitsSequenceIntoChunks()
    {
        var chunks = Enumerable.Range(1,5).Chunk(2).Select(c => c.ToArray()).ToArray();
        Assert.Equal(new[]{new[]{1,2}, new[]{3,4}, new[]{5}}, chunks);
    }

    [Fact]
    public void InsertSorted_InsertsKeepingAscendingOrder()
    {
        IList list = new List<int>{1,3,5};
        list.InsertSorted(4);
        Assert.Equal(new[]{1,3,4,5}, list.Cast<int>());
    }

    [Fact]
    public void InsertSortedDescending_InsertsKeepingDescendingOrder()
    {
        IList list = new List<int>{5,3,1};
        list.InsertSortedDescending(4);
        Assert.Equal(new[]{5,4,3,1}, list.Cast<int>());
    }

    [Fact]
    public void InsertSorted_ListOverload_Works()
    {
        var list = new List<int>{1,3,5};
        list.InsertSorted(2);
        Assert.Equal(new[]{1,2,3,5}, list);
    }

    [Fact]
    public void InsertSortedDescending_ListOverload_Works()
    {
        var list = new List<int>{5,3,1};
        list.InsertSortedDescending(4);
        Assert.Equal(new[]{5,4,3,1}, list);
    }

    [Fact]
    public void ForEach_ExecutesActionForEachItem()
    {
        int sum = 0;
        new[]{1,2,3}.ForEach(x => sum += x);
        Assert.Equal(6, sum);
    }

    [Fact]
    public void ShuffleInPlace_MaintainsElements()
    {
        var list = Enumerable.Range(1,5).ToList();
        list.ShuffleInPlace();
        Assert.Equal(Enumerable.Range(1,5), list.OrderBy(x => x));
    }

    [Fact]
    public void DistinctBy_ReturnsItemsWithDistinctKeys()
    {
        var data = new[]{ new{Id=1,Val="A"}, new{Id=1,Val="B"}, new{Id=2,Val="C"} };
        var result = data.DistinctBy(d => d.Id).Select(d => d.Val);
        Assert.Equal(new[]{"A","C"}, result);
    }

    [Fact]
    public void GetValueOrDefault_ReturnsValueOrDefault()
    {
        var dict = new Dictionary<string,int>{{"a",1}};
        Assert.Equal(1, dict.GetValueOrDefault("a",0));
        Assert.Equal(5, dict.GetValueOrDefault("b",5));
    }

    [Fact]
    public void ParallelForEach_ProcessesAllItems()
    {
        object gate = new();
        int sum = 0;
        Enumerable.Range(1,5).ParallelForEach(i => { lock(gate){ sum += i; }});
        Assert.Equal(15, sum);
    }

    [Fact]
    public void ParallelSelect_ProjectsItems()
    {
        var result = Enumerable.Range(1,5).ParallelSelect(i => i*2).OrderBy(i=>i).ToArray();
        Assert.Equal(new[]{2,4,6,8,10}, result);
    }

    [Fact]
    public void ParallelForEachPartitioned_SumsPartitions()
    {
        object gate = new();
        int total = 0;
        Enumerable.Range(1,5).ParallelForEachPartitioned(2, part =>
        {
            int partial = part.Sum();
            lock(gate) total += partial;
        });
        Assert.Equal(15, total);
    }

    [Fact]
    public void ParallelProcess_ReturnsResults()
    {
        var bag = Enumerable.Range(1,5).ParallelProcess(i => i*2);
        Assert.Equal(new[]{2,4,6,8,10}, bag.OrderBy(i=>i));
    }
}
