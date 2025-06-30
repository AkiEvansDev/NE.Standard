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
        #region Filtering

        /// <summary>
        /// Determines whether the <paramref name="source"/> sequence is null or empty.
        /// </summary>
        public static bool IsNullOrEmpty<T>(this IEnumerable<T>? source) => source == null || !source.Any();

        /// <summary>
        /// Returns only non-null reference items from the sequence.
        /// </summary>
        public static IEnumerable<T> WhereNotNull<T>(this IEnumerable<T?> source) where T : class
        {
            return source.Where(x => x != null)!;
        }

        /// <summary>
        /// Returns only non-null value type items from the sequence.
        /// </summary>
        public static IEnumerable<T> WhereNotNull<T>(this IEnumerable<T?> source) where T : struct
        {
            return source.Where(x => x.HasValue).Select(x => x.Value);
        }
        
        #endregion

        #region Grouping

        /// <summary>
        /// Splits the source into the specified number of groups with nearly equal sizes.
        /// </summary>
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

        /// <summary>
        /// Partitions the sequence into sets of the given <paramref name="partitionSize"/>.
        /// </summary>
        public static IEnumerable<IEnumerable<T>> Partition<T>(this IEnumerable<T> source, int partitionSize)
        {
            if (partitionSize <= 0) throw new ArgumentOutOfRangeException(nameof(partitionSize));

            return source
                .Select((x, i) => new { x, i })
                .GroupBy(p => p.i / partitionSize)
                .Select(g => g.Select(p => p.x));
        }

        /// <summary>
        /// Splits the sequence into chunks of the specified <paramref name="chunkSize"/>.
        /// </summary>
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
        
        #endregion

        #region Collection operations

        /// <summary>
        /// Inserts an item into the list while keeping elements in ascending order.
        /// </summary>
        public static void InsertSorted<T>(this IList list, T item) where T : IComparable<T>
        {
            int index = list.OfType<T>().TakeWhile(x => x.CompareTo(item) < 0).Count();
            list.Insert(index, item);
        }

        /// <summary>
        /// Inserts an item into the list while keeping elements in descending order.
        /// </summary>
        public static void InsertSortedDescending<T>(this IList list, T item) where T : IComparable<T>
        {
            int index = list.OfType<T>().TakeWhile(x => x.CompareTo(item) > 0).Count();
            list.Insert(index, item);
        }

        /// <summary>
        /// Executes an action for each item in the sequence.
        /// </summary>
        public static void ForEach<T>(this IEnumerable<T> source, Action<T> action)
        {
            foreach (var item in source)
                action(item);
        }

        /// <summary>
        /// Randomly shuffles the contents of the list in place.
        /// </summary>
        public static void ShuffleInPlace<T>(this IList<T> list)
        {
            var rnd = new Random();
            for (int i = list.Count - 1; i > 0; i--)
            {
                int j = rnd.Next(i + 1);
                (list[i], list[j]) = (list[j], list[i]);
            }
        }

        /// <summary>
        /// Returns distinct elements from a sequence according to a key selector.
        /// </summary>
        public static IEnumerable<T> DistinctBy<T, TKey>(this IEnumerable<T> source, Func<T, TKey> keySelector)
        {
            var seen = new HashSet<TKey>();
            foreach (var item in source)
                if (seen.Add(keySelector(item)))
                    yield return item;
        }

        /// <summary>
        /// Retrieves a value from the dictionary or returns the provided default.
        /// </summary>
        public static TValue GetValueOrDefault<TKey, TValue>(this IDictionary<TKey, TValue> dict, TKey key, TValue defaultValue)
        {
            return dict.TryGetValue(key, out var value) ? value : defaultValue;
        }

        /// <summary>
        /// Adds a key/value pair to the dictionary or updates it if the key exists.
        /// </summary>
        public static void AddOrUpdate<TKey, TValue>(this IDictionary<TKey, TValue> dict, TKey key, TValue value)
        {
            if (dict.ContainsKey(key))
                dict[key] = value;
            else
                dict.Add(key, value);
        }
        
        #endregion

        #region Parallel operations

        /// <summary>
        /// Executes the specified action for each element of the sequence in parallel.
        /// </summary>
        public static void ParallelForEach<T>(this IEnumerable<T> source, Action<T> action)
        {
            Parallel.ForEach(source, action);
        }

        /// <summary>
        /// Projects each element of the sequence into a new form in parallel.
        /// </summary>
        public static IEnumerable<TResult> ParallelSelect<T, TResult>(this IEnumerable<T> source, Func<T, TResult> selector)
        {
            return source.AsParallel().Select(selector);
        }

        /// <summary>
        /// Processes partitions of the source collection in parallel using the provided action.
        /// </summary>
        public static void ParallelForEachPartitioned<T>(this IEnumerable<T> source, int degree, Action<IEnumerable<T>> partitionAction)
        {
            var partitions = source.Partition(degree).ToList();
            Parallel.ForEach(partitions, partitionAction);
        }

        /// <summary>
        /// Processes each element in parallel and collects the results in a <see cref="ConcurrentBag{TResult}"/>.
        /// </summary>
        public static ConcurrentBag<TResult> ParallelProcess<T, TResult>(this IEnumerable<T> source, Func<T, TResult> processor)
        {
            var result = new ConcurrentBag<TResult>();
            Parallel.ForEach(source, item => result.Add(processor(item)));
            return result;
        }
        
        #endregion
    }
}
