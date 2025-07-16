using System;
using System.Collections;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NE.Standard.Extensions
{
    /// <summary>
    /// Provides extension methods for working with collections, enumerables, and lists, 
    /// including filtering, grouping, sorting, and parallel processing.
    /// </summary>
    public static class CollectionExtensions
    {
        private static readonly Random _random = new Random();

        #region Filtering

        /// <summary>
        /// Determines whether the specified sequence is <c>null</c> or contains no elements.
        /// Optimized for <see cref="ICollection{T}"/>.
        /// </summary>
        public static bool IsNullOrEmpty<T>(this IEnumerable<T>? source)
            => source == null || (source is ICollection<T> col ? col.Count == 0 : !source.Any());

        /// <summary>
        /// Filters out <c>null</c> references from a sequence of reference types.
        /// </summary>
        public static IEnumerable<T> WhereNotNull<T>(this IEnumerable<T?> source) where T : class
            => source.OfType<T>();

        /// <summary>
        /// Filters out <c>null</c> values from a sequence of nullable value types.
        /// </summary>
        public static IEnumerable<T> WhereNotNull<T>(this IEnumerable<T?> source) where T : struct
        {
            foreach (var item in source)
            {
                if (item.HasValue)
                    yield return item.Value;
            }
        }

        #endregion

        #region Grouping

        /// <summary>
        /// Splits the <paramref name="source"/> sequence into a specified number of groups with approximately equal sizes.
        /// </summary>
        /// <typeparam name="T">The type of elements in the source sequence.</typeparam>
        /// <param name="source">The sequence to be grouped.</param>
        /// <param name="groupCount">The number of groups to create.</param>
        /// <returns>An enumerable of groups, each containing a portion of the original sequence.</returns>
        /// <exception cref="ArgumentNullException">Thrown if <paramref name="source"/> is <c>null</c>.</exception>
        /// <exception cref="ArgumentOutOfRangeException">Thrown if <paramref name="groupCount"/> is less than or equal to zero.</exception>
        public static IEnumerable<IEnumerable<T>> Groups<T>(this IEnumerable<T> source, int groupCount)
        {
            if (source == null) throw new ArgumentNullException(nameof(source));
            if (groupCount <= 0) throw new ArgumentOutOfRangeException(nameof(groupCount));

            var list = source as IList<T> ?? source.ToList();
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
        /// Divides the <paramref name="source"/> sequence into partitions of a specified maximum size.
        /// </summary>
        /// <typeparam name="T">The type of elements in the source sequence.</typeparam>
        /// <param name="source">The sequence to partition.</param>
        /// <param name="partitionSize">The maximum size of each partition.</param>
        /// <returns>A sequence of partitions, where each is a subsequence of the original.</returns>
        /// <exception cref="ArgumentOutOfRangeException">Thrown if <paramref name="partitionSize"/> is less than or equal to zero.</exception>
        public static IEnumerable<IEnumerable<T>> Partition<T>(this IEnumerable<T> source, int partitionSize)
        {
            if (partitionSize <= 0) throw new ArgumentOutOfRangeException(nameof(partitionSize));
            List<T> buffer = new List<T>(partitionSize);

            foreach (var item in source)
            {
                buffer.Add(item);
                if (buffer.Count == partitionSize)
                {
                    yield return buffer;
                    buffer = new List<T>(partitionSize);
                }
            }
            if (buffer.Count > 0)
                yield return buffer;
        }

        #endregion

        #region Collection operations

        #region InsertSorted (Ascending)

        /// <summary>
        /// Inserts an item into a <see cref="List{T}"/> while preserving ascending sort order.
        /// </summary>
        public static void InsertSorted<T>(this List<T> list, T item) where T : IComparable<T>
        {
            InsertSorted(list, item, Comparer<T>.Default);
        }

        /// <summary>
        /// Inserts an item into a <see cref="List{T}"/> using a specified comparer, while preserving ascending sort order.
        /// </summary>
        public static void InsertSorted<T>(this List<T> list, T item, IComparer<T> comparer)
        {
            int index = list.BinarySearch(item, comparer);
            if (index < 0) index = ~index;
            list.Insert(index, item);
        }

        /// <summary>
        /// Inserts an item into an <see cref="IList{T}"/> while preserving ascending sort order.
        /// </summary>
        public static void InsertSorted<T>(this IList<T> list, T item) where T : IComparable<T>
        {
            InsertSorted(list, item, Comparer<T>.Default);
        }

        /// <summary>
        /// Inserts an item into an <see cref="IList{T}"/> using a specified comparer, while preserving ascending sort order.
        /// </summary>
        public static void InsertSorted<T>(this IList<T> list, T item, IComparer<T> comparer)
        {
            if (list is List<T> concreteList)
            {
                concreteList.InsertSorted(item, comparer);
                return;
            }

            int i = 0;
            while (i < list.Count && comparer.Compare(list[i], item) < 0) i++;
            list.Insert(i, item);
        }

        /// <summary>
        /// Inserts an item into a non-generic <see cref="IList"/> while preserving ascending sort order.
        /// </summary>
        /// <exception cref="InvalidOperationException">Thrown if the list is not a compatible <see cref="IList{T}"/>.</exception>
        public static void InsertSorted<T>(this IList list, T item) where T : IComparable<T>
        {
            if (list is IList<T> genericList)
            {
                genericList.InsertSorted(item);
                return;
            }

            throw new InvalidOperationException("InsertSorted supports only IList<T> or List<T>.");
        }

        /// <summary>
        /// Inserts an item into a non-generic <see cref="IList"/> using a specified comparer, while preserving ascending sort order.
        /// </summary>
        /// <exception cref="InvalidOperationException">Thrown if the list is not a compatible <see cref="IList{T}"/>.</exception>
        public static void InsertSorted<T>(this IList list, T item, IComparer<T> comparer)
        {
            if (list is IList<T> genericList)
            {
                genericList.InsertSorted(item, comparer);
                return;
            }

            throw new InvalidOperationException("InsertSorted supports only IList<T> or List<T>.");
        }

        #endregion

        #region InsertSorted (Descending)

        /// <summary>
        /// Inserts an item into a <see cref="List{T}"/> while preserving descending sort order.
        /// </summary>
        /// <typeparam name="T">The type of elements, which must implement <see cref="IComparable{T}"/>.</typeparam>
        /// <param name="list">The list into which the item will be inserted.</param>
        /// <param name="item">The item to insert.</param>
        public static void InsertSortedDescending<T>(this List<T> list, T item) where T : IComparable<T>
        {
            InsertSortedDescending(list, item, Comparer<T>.Default);
        }

        /// <summary>
        /// Inserts an item into a <see cref="List{T}"/> using a specified comparer, while preserving descending sort order.
        /// </summary>
        /// <typeparam name="T">The type of elements.</typeparam>
        /// <param name="list">The list into which the item will be inserted.</param>
        /// <param name="item">The item to insert.</param>
        /// <param name="comparer">The comparer to determine the sort order.</param>
        public static void InsertSortedDescending<T>(this List<T> list, T item, IComparer<T> comparer)
        {
            var descendingComparer = Comparer<T>.Create((a, b) => comparer.Compare(b, a));
            int index = list.BinarySearch(item, descendingComparer);
            if (index < 0) index = ~index;
            list.Insert(index, item);
        }

        /// <summary>
        /// Inserts an item into an <see cref="IList{T}"/> while preserving descending sort order.
        /// </summary>
        /// <typeparam name="T">The type of elements, which must implement <see cref="IComparable{T}"/>.</typeparam>
        /// <param name="list">The list into which the item will be inserted.</param>
        /// <param name="item">The item to insert.</param>
        public static void InsertSortedDescending<T>(this IList<T> list, T item) where T : IComparable<T>
        {
            InsertSortedDescending(list, item, Comparer<T>.Default);
        }

        /// <summary>
        /// Inserts an item into an <see cref="IList{T}"/> using a specified comparer, while preserving descending sort order.
        /// </summary>
        /// <typeparam name="T">The type of elements.</typeparam>
        /// <param name="list">The list into which the item will be inserted.</param>
        /// <param name="item">The item to insert.</param>
        /// <param name="comparer">The comparer to determine the sort order.</param>
        public static void InsertSortedDescending<T>(this IList<T> list, T item, IComparer<T> comparer)
        {
            if (list is List<T> concreteList)
            {
                concreteList.InsertSortedDescending(item, comparer);
                return;
            }

            int i = 0;
            while (i < list.Count && comparer.Compare(list[i], item) > 0) i++;
            list.Insert(i, item);
        }

        /// <summary>
        /// Inserts an item into a non-generic <see cref="IList"/> while preserving descending sort order.
        /// </summary>
        /// <typeparam name="T">The type of the item, which must implement <see cref="IComparable{T}"/>.</typeparam>
        /// <param name="list">The list into which the item will be inserted.</param>
        /// <param name="item">The item to insert.</param>
        /// <exception cref="InvalidOperationException">Thrown if the list is not a compatible <see cref="IList{T}"/>.</exception>
        public static void InsertSortedDescending<T>(this IList list, T item) where T : IComparable<T>
        {
            if (list is IList<T> genericList)
            {
                genericList.InsertSortedDescending(item);
                return;
            }

            throw new InvalidOperationException("InsertSortedDescending supports only IList<T> or List<T>.");
        }

        /// <summary>
        /// Inserts an item into a non-generic <see cref="IList"/> using a specified comparer, while preserving descending sort order.
        /// </summary>
        /// <typeparam name="T">The type of the item.</typeparam>
        /// <param name="list">The list into which the item will be inserted.</param>
        /// <param name="item">The item to insert.</param>
        /// <param name="comparer">The comparer to determine the sort order.</param>
        /// <exception cref="InvalidOperationException">Thrown if the list is not a compatible <see cref="IList{T}"/>.</exception>
        public static void InsertSortedDescending<T>(this IList list, T item, IComparer<T> comparer)
        {
            if (list is IList<T> genericList)
            {
                genericList.InsertSortedDescending(item, comparer);
                return;
            }

            throw new InvalidOperationException("InsertSortedDescending supports only IList<T> or List<T>.");
        }

        #endregion

        /// <summary>
        /// Performs the specified <paramref name="action"/> on each element of the <paramref name="source"/> sequence.
        /// </summary>
        public static void ForEach<T>(this IEnumerable<T> source, Action<T> action)
        {
            foreach (var item in source)
                action(item);
        }

        #endregion

        #region Parallel operations

        /// <summary>
        /// Performs the specified <paramref name="action"/> on each element of the <paramref name="source"/> sequence in parallel.
        /// </summary>
        public static void ParallelForEach<T>(this IEnumerable<T> source, Action<T> action)
        {
            Parallel.ForEach(source, action);
        }

        /// <summary>
        /// Projects each element of a sequence into a new form in parallel using the provided <paramref name="selector"/>.
        /// </summary>
        /// <typeparam name="T">The type of the input elements.</typeparam>
        /// <typeparam name="TResult">The type of the result elements.</typeparam>
        /// <param name="source">The sequence of input elements.</param>
        /// <param name="selector">A transform function to apply to each source element.</param>
        /// <returns>An enumerable containing the transformed elements.</returns>
        public static IEnumerable<TResult> ParallelSelect<T, TResult>(this IEnumerable<T> source, Func<T, TResult> selector)
        {
            return source.AsParallel().Select(selector);
        }

        /// <summary>
        /// Divides the source sequence into <paramref name="degree"/> partitions and processes each partition in parallel using the specified <paramref name="partitionAction"/>.
        /// </summary>
        /// <typeparam name="T">The type of elements in the source.</typeparam>
        /// <param name="source">The source sequence to partition and process.</param>
        /// <param name="degree">The number of parallel partitions.</param>
        /// <param name="partitionAction">The action to perform on each partition.</param>
        public static void ParallelForEachPartitioned<T>(this IEnumerable<T> source, int degree, Action<IEnumerable<T>> partitionAction)
        {
            Parallel.ForEach(source.Partition(degree), partitionAction);
        }

        /// <summary>
        /// Processes each element of the source sequence in parallel using the specified <paramref name="processor"/> and collects the results in a <see cref="ConcurrentBag{TResult}"/>.
        /// </summary>
        /// <typeparam name="T">The type of input elements.</typeparam>
        /// <typeparam name="TResult">The type of results produced by the processor.</typeparam>
        /// <param name="source">The source sequence of elements to process.</param>
        /// <param name="processor">A function to process each element.</param>
        /// <returns>A <see cref="ConcurrentBag{TResult}"/> containing the processed results.</returns>
        public static ConcurrentBag<TResult> ParallelProcess<T, TResult>(this IEnumerable<T> source, Func<T, TResult> processor)
        {
            var result = new ConcurrentBag<TResult>();
            Parallel.ForEach(source, item => result.Add(processor(item)));
            return result;
        }

        #endregion
    }
}
