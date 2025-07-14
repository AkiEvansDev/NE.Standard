using System;
using System.Collections;

namespace NE.Standard.Types
{
    /// <summary>
    /// Provides data for changes that occur within a recursive data structure,
    /// such as nested collections or object trees.
    /// </summary>
    public class RecursiveChangedEventArgs : EventArgs
    {
        /// <summary>
        /// Gets the type of change that occurred.
        /// </summary>
        public RecursiveChangedAction Action { get; }

        /// <summary>
        /// Gets or sets the logical path to the affected node or property within the recursive structure.
        /// </summary>
        public string Path { get; internal set; } = default!;

        /// <summary>
        /// Gets the value that was set during a <see cref="RecursiveChangedAction.Set"/> operation.
        /// May be <c>null</c> for other actions.
        /// </summary>
        public object? Value { get; }

        /// <summary>
        /// Gets the starting index for the new items in an add, move, or replace operation.
        /// </summary>
        public int? NewStartingIndex { get; }

        /// <summary>
        /// Gets the collection of newly added or moved items.
        /// </summary>
        public IList? NewItems { get; }

        /// <summary>
        /// Gets the starting index for the old items in a remove, move, or replace operation.
        /// </summary>
        public int? OldStartingIndex { get; }

        /// <summary>
        /// Gets the collection of removed or replaced items.
        /// </summary>
        public IList? OldItems { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="RecursiveChangedEventArgs"/> class for a <see cref="RecursiveChangedAction.Set"/> operation.
        /// </summary>
        /// <param name="path">The logical path of the changed property or node.</param>
        /// <param name="value">The new value that was set.</param>
        public RecursiveChangedEventArgs(string path, object? value)
        {
            Action = RecursiveChangedAction.Set;
            Path = path;
            Value = value;
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="RecursiveChangedEventArgs"/> class with detailed change information.
        /// </summary>
        /// <param name="action">The type of change that occurred.</param>
        /// <param name="path">The logical path to the affected node or collection.</param>
        /// <param name="newStartingIndex">The starting index of the new items, if applicable.</param>
        /// <param name="newItems">The new items involved in the change, if applicable.</param>
        /// <param name="oldStartingIndex">The starting index of the old items, if applicable.</param>
        /// <param name="oldItems">The old items involved in the change, if applicable.</param>
        public RecursiveChangedEventArgs(RecursiveChangedAction action, string path, int? newStartingIndex, IList? newItems, int? oldStartingIndex, IList? oldItems)
        {
            Action = action;
            Path = path;
            NewStartingIndex = newStartingIndex;
            NewItems = newItems;
            OldStartingIndex = oldStartingIndex;
            OldItems = oldItems;
        }
    }
}
