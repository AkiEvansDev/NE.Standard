using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace NE.Standard.Extensions
{
    /// <summary>
    /// Extensions for working with collections and enumerables.
    /// </summary>
    public static class CollectionExtensions
    {
        public static IEnumerable<IEnumerable<T>> Groups<T>(this IEnumerable<T> source, int groupCount)
        {
            var count = source.Count();
            var e = (int)Math.Floor(count / (double)groupCount);
            var ae = count - e * groupCount;

            var skip = 0;
            for (var i = 0; i < groupCount; ++i)
            {
                var c = i < ae ? e + 1 : e;
                yield return source.Skip(skip).Take(c);

                skip += c;
            }
        }

        public static IEnumerable<IEnumerable<T>> Partition<T>(this IEnumerable<T> source, int partitionSize)
        {
            var i = 0;
            return source.GroupBy(x => i++ / partitionSize).Select(g => g.ToArray()).ToArray();
        }

        public static void InsertSorted<T>(this IList source, T item) where T : IComparable<T>
        {
            var index = source.OfType<T>().Count(i => i.CompareTo(item) < 0);
            source.Insert(index, item);
        }

        public static void InsertSortedDescending<T>(this IList source, T item) where T : IComparable<T>
        {
            var index = source.OfType<T>().Count(i => i.CompareTo(item) > 0);
            source.Insert(index, item);
        }
    }
}
