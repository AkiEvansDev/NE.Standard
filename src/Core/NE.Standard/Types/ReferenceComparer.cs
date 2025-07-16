using System.Collections.Generic;
using System.Runtime.CompilerServices;

namespace NE.Standard.Types
{
    /// <summary>
    /// Provides a reference-based equality comparer for reference types.
    /// Compares objects by their reference identity rather than value equality.
    /// </summary>
    /// <typeparam name="T">The reference type to compare.</typeparam>
    public sealed class ReferenceComparer<T> : IEqualityComparer<T>
        where T : class
    {
        /// <summary>
        /// Gets the singleton instance of the <see cref="ReferenceComparer{T}"/>.
        /// </summary>
        public static ReferenceComparer<T> Instance { get; } = new ReferenceComparer<T>();

        private ReferenceComparer() { }

        /// <summary>
        /// Determines whether the specified objects are the same instance.
        /// </summary>
        /// <param name="x">The first object to compare.</param>
        /// <param name="y">The second object to compare.</param>
        /// <returns><c>true</c> if both references point to the same instance; otherwise, <c>false</c>.</returns>
        public bool Equals(T x, T y) => ReferenceEquals(x, y);

        /// <summary>
        /// Returns a hash code based on the object's reference identity.
        /// </summary>
        /// <param name="obj">The object for which to get the hash code.</param>
        /// <returns>A hash code that represents the object's identity.</returns>
        public int GetHashCode(T obj) => RuntimeHelpers.GetHashCode(obj);
    }
}
