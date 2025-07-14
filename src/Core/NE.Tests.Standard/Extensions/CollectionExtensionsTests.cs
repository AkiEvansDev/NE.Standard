using NE.Standard.Extensions;
using System.Collections.Concurrent;

namespace NE.Tests.Standard.Extensions;

public class CollectionExtensionsTests
{
    [Fact]
    public void IsNullOrEmpty_ReturnsTrue_WhenSourceIsNull()
    {
        IEnumerable<int>? source = null;
        Assert.True(source.IsNullOrEmpty());
    }

    [Fact]
    public void IsNullOrEmpty_ReturnsTrue_WhenSourceIsEmpty()
    {
        IEnumerable<int> source = [];
        Assert.True(source.IsNullOrEmpty());
    }

    [Fact]
    public void IsNullOrEmpty_ReturnsFalse_WhenSourceIsNotEmpty()
    {
        IEnumerable<int> source = [1];
        Assert.False(source.IsNullOrEmpty());
    }

    [Fact]
    public void WhereNotNull_RemovesNulls_FromReferenceTypes()
    {
        var source = new string?[] { "a", null, "b" };
        var result = source.WhereNotNull().ToList();

        Assert.Equal(2, result.Count);
        Assert.Contains("a", result);
        Assert.Contains("b", result);
    }

    [Fact]
    public void WhereNotNull_RemovesNulls_FromNullableValueTypes()
    {
        var source = new int?[] { 1, null, 2 };
        var result = source.WhereNotNull().ToList();

        Assert.Equal(2, result.Count);
        Assert.Contains(1, result);
        Assert.Contains(2, result);
    }

    [Fact]
    public void Groups_SplitsSequenceIntoRoughlyEqualGroups()
    {
        var source = Enumerable.Range(1, 10).ToList();
        var result = source.Groups(3).Select(g => g.ToList()).ToList();

        Assert.Equal(3, result.Count);
        Assert.Equal(4, result[0].Count); // 10 -> 4 + 3 + 3
    }

    [Fact]
    public void Partition_SplitsSequenceIntoPartitionsOfGivenSize()
    {
        var source = Enumerable.Range(1, 10).ToList();
        var result = source.Partition(3).Select(g => g.ToList()).ToList();

        Assert.Equal(4, result.Count); // 3+3+3+1
        Assert.Contains(result, p => p.Count == 1);
    }

    [Fact]
    public void InsertSorted_InsertsInOrder()
    {
        var list = new List<int> { 1, 3, 5 };
        list.InsertSorted(4);
        Assert.Equal([1, 3, 4, 5], list);
    }

    [Fact]
    public void InsertSortedDescending_InsertsInDescendingOrder()
    {
        var list = new List<int> { 5, 3, 1 };
        list.InsertSortedDescending(4);
        Assert.Equal([5, 4, 3, 1], list);
    }

    [Fact]
    public void ForEach_PerformsActionOnEachElement()
    {
        var source = new[] { 1, 2, 3 };
        var sum = 0;
        source.ForEach(x => sum += x);
        Assert.Equal(6, sum);
    }

    [Fact]
    public void ShuffleInPlace_ShufflesElements()
    {
        var list = Enumerable.Range(1, 100).ToList();
        var original = list.ToList();

        list.ShuffleInPlace();

        Assert.Equal(100, list.Count);
        Assert.True(list.All(original.Contains));
        Assert.NotEqual(original, list); // Could be same by chance, but very rare
    }

    [Fact]
    public void ParallelForEach_PerformsActionOnEachElement()
    {
        var source = Enumerable.Range(1, 100);
        var bag = new ConcurrentBag<int>();
        source.ParallelForEach(x => bag.Add(x));
        Assert.Equal(100, bag.Count);
    }

    [Fact]
    public void ParallelSelect_ProjectsElementsInParallel()
    {
        var source = Enumerable.Range(1, 10);
        var result = source.ParallelSelect(x => x * 2).ToList();

        Assert.Equal(10, result.Count);
        Assert.All(result, x => Assert.Equal(0, x % 2));
    }

    [Fact]
    public void ParallelForEachPartitioned_ProcessesInParallel()
    {
        var source = Enumerable.Range(1, 10);
        var processed = new ConcurrentBag<int>();

        source.ParallelForEachPartitioned(2, partition =>
        {
            foreach (var item in partition)
                processed.Add(item);
        });

        Assert.Equal(10, processed.Count);
    }

    [Fact]
    public void ParallelProcess_ProcessesElementsAndReturnsResults()
    {
        var source = Enumerable.Range(1, 10);
        var result = source.ParallelProcess(x => x * 2);

        Assert.Equal(10, result.Count);
        Assert.All(result, x => Assert.Equal(0, x % 2));
    }
}
