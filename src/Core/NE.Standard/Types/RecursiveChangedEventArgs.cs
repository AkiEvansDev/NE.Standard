using System;

namespace NE.Standard.Types
{
    /// <summary>
    /// Describes the type of change that occurred in a recursive structure (e.g., observable hierarchy).
    /// </summary>
    public enum RecursiveChangedAction
    {
        /// <summary>
        /// Indicates that a property or value was directly set.
        /// </summary>
        Set = -1,

        /// <summary>
        /// An item or items were added.
        /// </summary>
        Add = 0,

        /// <summary>
        /// An item or items were removed.
        /// </summary>
        Remove = 1,

        /// <summary>
        /// An item or items were replaced.
        /// </summary>
        Replace = 2,

        /// <summary>
        /// An item was moved from one index to another.
        /// </summary>
        Move = 3,

        /// <summary>
        /// The entire structure was reset (e.g., cleared or reassigned).
        /// </summary>
        Reset = 4
    }

    /// <summary>
    /// Provides data for changes that occur within a recursive data structure,
    /// such as nested collections or object trees.
    /// </summary>
    public class RecursiveChangedEventArgs : EventArgs
    {
        /// <summary>
        /// Gets the type of change that occurred within the structure.
        /// </summary>
        /// <remarks>
        /// This can indicate a property assignment (<see cref="RecursiveChangedAction.Set"/>),
        /// collection addition or removal, or a structural reset.
        /// </remarks>
        public RecursiveChangedAction Action { get; }

        /// <summary>
        /// Gets the logical path to the affected node or property within the recursive structure.
        /// </summary>
        /// <remarks>
        /// The path is typically dot-separated (e.g., "Person.Address.Street" or "Orders.[3].Quantity"),
        /// and may include collection indices.
        /// </remarks>
        public string Path { get; }

        /// <summary>
        /// Gets the starting index of the affected element(s) in a collection operation.
        /// </summary>
        /// <remarks>
        /// For example, during an Add/Remove operation in a list, this represents the index where the change occurred.
        /// Returns -1 if not applicable (e.g., property set).
        /// </remarks>
        public int Index { get; }

        /// <summary>
        /// Gets the number of elements affected by the change.
        /// </summary>
        /// <remarks>
        /// For property set operations, this will be 0. For collection operations, this reflects the number of items added, removed, or replaced.
        /// </remarks>
        public int Count { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="RecursiveChangedEventArgs"/> class
        /// for a <see cref="RecursiveChangedAction.Set"/> operation with no index context.
        /// </summary>
        /// <param name="path">The path to the property that was changed.</param>
        public RecursiveChangedEventArgs(string path) : this(RecursiveChangedAction.Set, path, null, null) { }

        /// <summary>
        /// Initializes a new instance of the <see cref="RecursiveChangedEventArgs"/> class with full context.
        /// </summary>
        /// <param name="action">The type of change that occurred.</param>
        /// <param name="path">The path to the affected property or collection element.</param>
        /// <param name="index">The index of the change, if applicable. Otherwise, null.</param>
        /// <param name="count">The number of affected elements, if applicable. Otherwise, null.</param>
        public RecursiveChangedEventArgs(RecursiveChangedAction action, string path, int? index = null, int? count = null)
        {
            Action = action;
            Path = path;
            Index = index ?? -1;
            Count = count ?? 0;
        }
    }
}
