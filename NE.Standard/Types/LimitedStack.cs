using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Runtime.CompilerServices;

namespace NE.Standard.Types
{
    /// <summary>
    /// A bounded stack that holds only the most recent elements up to a specified maximum size.
    /// When the maximum size is reached, pushing a new item removes the oldest (bottom-most) one.
    /// </summary>
    /// <typeparam name="T">The type of elements in the stack.</typeparam>
    [Serializable]
    public class LimitedStack<T> : IEnumerable<T>, ICollection, IReadOnlyCollection<T>
    {
        private const int DEFAULT_CAPACITY = 4;

        private readonly int _maxSize;
        private T[] _array;
        private int _size;

        public LimitedStack(int maxSize)
        {
            if (maxSize <= 0)
                throw new ArgumentOutOfRangeException(nameof(maxSize));

            _maxSize = maxSize;
            _array = new T[Math.Min(DEFAULT_CAPACITY, _maxSize)];
        }
        
        /// <summary>
        /// Gets the number of elements contained in the stack.
        /// </summary>
        public int Count => _size;

        /// <summary>
        /// Gets a value indicating whether access to the stack is synchronized (thread-safe).
        /// </summary>
        bool ICollection.IsSynchronized => false;

        /// <summary>
        /// Gets an object that can be used to synchronize access to the stack.
        /// </summary>
        object ICollection.SyncRoot => this;

        /// <summary>
        /// Pushes an item onto the top of the stack. If the maximum size has been reached,
        /// the oldest item (bottom-most) is removed to make space.
        /// </summary>
        /// <param name="item">The item to push onto the stack.</param>
        public void Push(T item)
        {
            var size = _size;
            var array = _array;

            if ((uint)size < (uint)array.Length)
            {
                array[size] = item;
                _size = size + 1;
            }
            else
                PushWithResize(item);
        }

        [MethodImpl(MethodImplOptions.NoInlining)]
        private void PushWithResize(T item)
        {
            if (_size == _maxSize)
            {
                var newArray = new T[_maxSize];

                Array.Copy(_array, 1, newArray, 0, _maxSize - 1);
                _array = newArray;

                _array[_size - 1] = item;
            }
            else
            {
                Grow(_size + 1);

                _array[_size] = item;
                _size++;
            }
        }

        private void Grow(int capacity)
        {
            var newcapacity = _array.Length == 0 ? DEFAULT_CAPACITY : 2 * _array.Length;

            if ((uint)newcapacity > _maxSize) newcapacity = _maxSize;

            if (newcapacity < capacity)
                newcapacity = capacity;

            Array.Resize(ref _array, newcapacity);
        }

        /// <summary>
        /// Removes and returns the object at the top of the stack.
        /// </summary>
        /// <returns>The object removed from the top of the stack.</returns>
        /// <exception cref="InvalidOperationException">Thrown if the stack is empty.</exception>
        public T Pop()
        {
            var size = _size - 1;
            var array = _array;

            if ((uint)size >= (uint)array.Length)
                throw new InvalidOperationException("Empty stack");

            _size = size;
            var item = array[size];

            if (RuntimeHelpers.IsReferenceOrContainsReferences<T>())
                array[size] = default!;

            return item;
        }

        /// <summary>
        /// Attempts to remove and return the object at the top of the stack.
        /// </summary>
        /// <param name="result">When this method returns, contains the removed object, if successful; otherwise, the default value of <typeparamref name="T"/>.</param>
        /// <returns><c>true</c> if the object was successfully removed and returned; otherwise, <c>false</c>.</returns>
        public bool TryPop([MaybeNullWhen(false)] out T result)
        {
            var size = _size - 1;
            var array = _array;

            if ((uint)size >= (uint)array.Length)
            {
                result = default!;
                return false;
            }

            _size = size;
            result = array[size];

            if (RuntimeHelpers.IsReferenceOrContainsReferences<T>())
                array[size] = default!;

            return true;
        }

        /// <summary>
        /// Returns the object at the top of the stack without removing it.
        /// </summary>
        /// <returns>The object at the top of the stack.</returns>
        /// <exception cref="InvalidOperationException">Thrown if the stack is empty.</exception>
        public T Peek()
        {
            var size = _size - 1;
            var array = _array;

            if ((uint)size >= (uint)array.Length)
                throw new InvalidOperationException("Empty stack");

            return array[size];
        }

        /// <summary>
        /// Attempts to return the object at the top of the stack without removing it.
        /// </summary>
        /// <param name="result">When this method returns, contains the object at the top of the stack, if successful; otherwise, the default value of <typeparamref name="T"/>.</param>
        /// <returns><c>true</c> if an object was successfully returned; otherwise, <c>false</c>.</returns>
        public bool TryPeek([MaybeNullWhen(false)] out T result)
        {
            var size = _size - 1;
            var array = _array;

            if ((uint)size >= (uint)array.Length)
            {
                result = default!;
                return false;
            }

            result = array[size];
            return true;
        }

        /// <summary>
        /// Removes all objects from the stack.
        /// </summary>
        public void Clear()
        {
            if (RuntimeHelpers.IsReferenceOrContainsReferences<T>())
                Array.Clear(_array, 0, _size);

            _size = 0;
        }

        /// <summary>
        /// Determines whether an element exists in the stack.
        /// </summary>
        /// <param name="item">The object to locate in the stack.</param>
        /// <returns><c>true</c> if <paramref name="item"/> is found; otherwise, <c>false</c>.</returns>
        public bool Contains(T item)
        {
            return _size != 0 && Array.LastIndexOf(_array, item, _size - 1) != -1;
        }

        /// <summary>
        /// Copies the stack to a new array in LIFO (last-in, first-out) order.
        /// </summary>
        /// <returns>An array containing copies of the elements of the stack.</returns>
        public T[] ToArray()
        {
            if (_size == 0)
                return Array.Empty<T>();

            var objArray = new T[_size];
            var i = 0;

            while (i < _size)
            {
                objArray[i] = _array[_size - i - 1];
                i++;
            }

            return objArray;
        }

        /// <summary>
        /// Copies the stack elements to an existing one-dimensional array, starting at the specified index.
        /// </summary>
        /// <param name="array">The destination array.</param>
        /// <param name="arrayIndex">The zero-based index in the destination array at which copying begins.</param>
        /// <exception cref="ArgumentNullException">Thrown if <paramref name="array"/> is <c>null</c>.</exception>
        /// <exception cref="ArgumentOutOfRangeException">Thrown if <paramref name="arrayIndex"/> is invalid.</exception>
        /// <exception cref="ArgumentException">Thrown if the destination array is too small.</exception>
        public void CopyTo(T[] array, int arrayIndex)
        {
            if (array == null)
                throw new ArgumentNullException(nameof(array));

            if (arrayIndex < 0 || arrayIndex > array.Length)
                throw new ArgumentOutOfRangeException(nameof(arrayIndex), arrayIndex, "Index must be less or equal");

            if (array.Length - arrayIndex < _size)
                throw new ArgumentException("Invalid off len");

            var srcIndex = 0;
            var dstIndex = arrayIndex + _size;

            while (srcIndex < _size)
            {
                array[--dstIndex] = _array[srcIndex++];
            }
        }

        /// <summary>
        /// Copies the stack elements to a one-dimensional <see cref="Array"/>, starting at the specified index.
        /// </summary>
        /// <param name="array">The destination array.</param>
        /// <param name="arrayIndex">The starting index in the array.</param>
        /// <exception cref="ArgumentNullException">Thrown if <paramref name="array"/> is <c>null</c>.</exception>
        /// <exception cref="ArgumentException">Thrown if the array is multidimensional or has incompatible types.</exception>
        /// <exception cref="ArgumentOutOfRangeException">Thrown if <paramref name="arrayIndex"/> is invalid.</exception>
        void ICollection.CopyTo(Array array, int arrayIndex)
        {
            if (array == null)
                throw new ArgumentNullException(nameof(array));

            if (array.Rank != 1)
                throw new ArgumentException("Rank multi dim not supported", nameof(array));

            if (array.GetLowerBound(0) != 0)
                throw new ArgumentException("Non zero lower bound", nameof(array));

            if (arrayIndex < 0 || arrayIndex > array.Length)
                throw new ArgumentOutOfRangeException(nameof(arrayIndex), arrayIndex, "Index must be less or equal");

            if (array.Length - arrayIndex < _size)
                throw new ArgumentException("Invalid off len");

            try
            {
                Array.Copy(this._array, 0, array, arrayIndex, _size);
                Array.Reverse(array, arrayIndex, _size);
            }
            catch (ArrayTypeMismatchException)
            {
                throw new ArgumentException("Incompatible array type", nameof(array));
            }
        }

        /// <summary>
        /// Sets the capacity to the actual number of elements in the stack, if that number is less than 90% of current capacity.
        /// </summary>
        public void TrimExcess()
        {
            int threshold = (int)(_array.Length * 0.9);

            if (_size < threshold)
                Array.Resize(ref _array, _size);
        }

        /// <summary>
        /// Ensures that the stack has at least the specified capacity, growing the internal buffer if needed.
        /// </summary>
        /// <param name="capacity">The minimum required capacity.</param>
        /// <returns>The new internal array length.</returns>
        /// <exception cref="ArgumentOutOfRangeException">Thrown if the configured max size is less than or equal to zero.</exception>
        public int EnsureCapacity(int capacity)
        {
            if (_maxSize <= 0)
                throw new ArgumentOutOfRangeException(nameof(capacity));

            if (_array.Length < capacity)
                Grow(capacity);

            return _array.Length;
        }

        /// <internalonly/>
        IEnumerator<T> IEnumerable<T>.GetEnumerator() => Count == 0
            ? Enumerable.Empty<T>().GetEnumerator()
            : GetEnumerator();

        /// <summary>
        /// Returns an enumerator that iterates through the stack in LIFO order.
        /// </summary>
        /// <returns>An enumerator for the stack.</returns>
        IEnumerator IEnumerable.GetEnumerator() => ((IEnumerable<T>)this).GetEnumerator();

        /// <summary>
        /// Returns an enumerator that iterates through the stack in LIFO order.
        /// </summary>
        /// <returns>An enumerator for the stack.</returns>
        public IEnumerator<T> GetEnumerator()
        {
            for (int i = _size - 1; i >= 0; i--)
                yield return _array[i];
        }
    }
}
