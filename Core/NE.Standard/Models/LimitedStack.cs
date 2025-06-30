using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Runtime.CompilerServices;

namespace NE.Standard.Models
{
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

        public int Count => _size;

        bool ICollection.IsSynchronized => false;

        object ICollection.SyncRoot => this;

        public IEnumerator<T> GetEnumerator()
        {
            for (int i = _size - 1; i >= 0; i--)
                yield return _array[i];
        }

        public bool Contains(T item)
        {
            return _size != 0 && Array.LastIndexOf(_array, item, _size - 1) != -1;
        }

        public void Clear()
        {
            if (RuntimeHelpers.IsReferenceOrContainsReferences<T>())
                Array.Clear(_array, 0, _size);

            _size = 0;
        }

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

        /// <internalonly/>
        IEnumerator<T> IEnumerable<T>.GetEnumerator() => Count == 0
            ? Enumerable.Empty<T>().GetEnumerator()
            : GetEnumerator();

        IEnumerator IEnumerable.GetEnumerator() => ((IEnumerable<T>)this).GetEnumerator();

        public void TrimExcess()
        {
            int threshold = (int)(_array.Length * 0.9);

            if (_size < threshold)
                Array.Resize(ref _array, _size);
        }

        public T Peek()
        {
            var size = _size - 1;
            var array = _array;

            if ((uint)size >= (uint)array.Length)
                throw new InvalidOperationException("Empty stack");

            return array[size];
        }

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

        public int EnsureCapacity(int capacity)
        {
            if (_maxSize <= 0)
                throw new ArgumentOutOfRangeException(nameof(capacity));

            if (_array.Length < capacity)
                Grow(capacity);

            return _array.Length;
        }

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
    }
}
