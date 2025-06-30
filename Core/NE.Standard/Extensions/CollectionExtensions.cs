using System;
using System.Collections;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NE.Standard.Extensions
{
    /// <summary>
    /// Extensions for working with collections and enumerables.
    /// </summary>
    public static class CollectionExtensions
    {
        public static bool IsNullOrEmpty<T>(this IEnumerable<T>? source) => source == null || !source.Any();

        public static IEnumerable<T> WhereNotNull<T>(this IEnumerable<T?> source) where T : class
        {
            return source.Where(x => x != null)!;
        }

        public static IEnumerable<T> WhereNotNull<T>(this IEnumerable<T?> source) where T : struct
        {
            return source.Where(x => x.HasValue).Select(x => x.Value);
        }

        public static IEnumerable<IEnumerable<T>> Groups<T>(this IEnumerable<T> source, int groupCount)
        {
            if (source == null) throw new ArgumentNullException(nameof(source));
            if (groupCount <= 0) throw new ArgumentOutOfRangeException(nameof(groupCount));

            var list = source.ToList();
            int total = list.Count;
            int baseSize = total / groupCount;
            int remainder = total % groupCount;

            int index = 0;
            for (int i = 0; i < groupCount; i++)
            {
                int size = baseSize + (i < remainder ? 1 : 0);
                yield return list.Skip(index).Take(size);
                index += size;
            }
        }

        public static IEnumerable<IEnumerable<T>> Partition<T>(this IEnumerable<T> source, int partitionSize)
        {
            if (partitionSize <= 0) throw new ArgumentOutOfRangeException(nameof(partitionSize));

            return source
                .Select((x, i) => new { x, i })
                .GroupBy(p => p.i / partitionSize)
                .Select(g => g.Select(p => p.x));
        }

        public static IEnumerable<IEnumerable<T>> Chunk<T>(this IEnumerable<T> source, int chunkSize)
        {
            if (chunkSize <= 0) throw new ArgumentOutOfRangeException(nameof(chunkSize));

            using var enumerator = source.GetEnumerator();
            while (enumerator.MoveNext())
                yield return YieldChunkElements(enumerator, chunkSize);
        }

        private static IEnumerable<T> YieldChunkElements<T>(IEnumerator<T> enumerator, int size)
        {
            int count = 0;
            do
            {
                yield return enumerator.Current;
            } while (++count < size && enumerator.MoveNext());
        }

        public static void InsertSorted<T>(this IList list, T item) where T : IComparable<T>
        {
            int index = list.OfType<T>().TakeWhile(x => x.CompareTo(item) < 0).Count();
            list.Insert(index, item);
        }

        public static void InsertSortedDescending<T>(this IList list, T item) where T : IComparable<T>
        {
            int index = list.OfType<T>().TakeWhile(x => x.CompareTo(item) > 0).Count();
            list.Insert(index, item);
        }

        public static void ForEach<T>(this IEnumerable<T> source, Action<T> action)
        {
            foreach (var item in source)
                action(item);
        }

        public static void ShuffleInPlace<T>(this IList<T> list)
        {
            var rnd = new Random();
            for (int i = list.Count - 1; i > 0; i--)
            {
                int j = rnd.Next(i + 1);
                (list[i], list[j]) = (list[j], list[i]);
            }
        }

        public static IEnumerable<T> DistinctBy<T, TKey>(this IEnumerable<T> source, Func<T, TKey> keySelector)
        {
            var seen = new HashSet<TKey>();
            foreach (var item in source)
                if (seen.Add(keySelector(item)))
                    yield return item;
        }

        public static TValue GetValueOrDefault<TKey, TValue>(this IDictionary<TKey, TValue> dict, TKey key, TValue defaultValue)
        {
            return dict.TryGetValue(key, out var value) ? value : defaultValue;
        }

        public static void AddOrUpdate<TKey, TValue>(this IDictionary<TKey, TValue> dict, TKey key, TValue value)
        {
            if (dict.ContainsKey(key)) 
                dict[key] = value;
            else 
                dict.Add(key, value);
        }

        public static void ParallelForEach<T>(this IEnumerable<T> source, Action<T> action)
        {
            Parallel.ForEach(source, action);
        }

        public static IEnumerable<TResult> ParallelSelect<T, TResult>(this IEnumerable<T> source, Func<T, TResult> selector)
        {
            return source.AsParallel().Select(selector);
        }

        public static void ParallelForEachPartitioned<T>(this IEnumerable<T> source, int degree, Action<IEnumerable<T>> partitionAction)
        {
            var partitions = source.Partition(degree).ToList();
            Parallel.ForEach(partitions, partitionAction);
        }

        public static ConcurrentBag<TResult> ParallelProcess<T, TResult>(this IEnumerable<T> source, Func<T, TResult> processor)
        {
            var result = new ConcurrentBag<TResult>();
            Parallel.ForEach(source, item => result.Add(processor(item)));
            return result;
        }
    }
}
