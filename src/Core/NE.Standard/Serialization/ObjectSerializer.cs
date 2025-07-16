using NE.Standard.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;

namespace NE.Standard.Serialization
{
    /// <summary>
    /// Marks a class or struct as serializable by <see cref="NESerializer"/>.
    /// Only types with this attribute are eligible for object graph serialization.
    /// </summary>
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Struct)]
    public sealed class NEObjectAttribute : Attribute { }

    /// <summary>
    /// Excludes a property from serialization and deserialization in <see cref="NESerializer"/>.
    /// </summary>
    [AttributeUsage(AttributeTargets.Property)]
    public sealed class NEIgnoreAttribute : Attribute { }

    /// <summary>
    /// Provides methods for serializing and deserializing object graphs.
    /// Supports nested collections, dictionaries, value types, strings,
    /// and preserves references between objects during the process.
    /// </summary>
    public partial class NESerializer : IDisposable
    {
        private const char FIRST_ST = '~';
        private const string STRING_T = "~[";

        private class ReferenceEntry
        {
            public int Id { get; set; }
            public object Obj { get; set; } = default!;
            public bool HasReference { get; set; }
        }

        private sealed class ReferenceEqualityComparer : IEqualityComparer<object>
        {
            bool IEqualityComparer<object>.Equals(object? x, object? y) => ReferenceEquals(x, y);
            int IEqualityComparer<object>.GetHashCode(object obj) => RuntimeHelpers.GetHashCode(obj);
        }

        private List<string> _typeIndex = new List<string>();
        private Dictionary<string, int> _typeMap = new Dictionary<string, int>();
        private List<ReferenceEntry> _referenceTracker = new List<ReferenceEntry>();
        private Dictionary<object, ReferenceEntry> _referenceLookup = new Dictionary<object, ReferenceEntry>(new ReferenceEqualityComparer());

        private void Init()
        {
            _typeIndex = new List<string>();
            _typeMap = new Dictionary<string, int>();
            _referenceTracker = new List<ReferenceEntry>();
            _referenceLookup = new Dictionary<object, ReferenceEntry>(new ReferenceEqualityComparer());
        }

        /// <summary>
        /// Serializes the specified object into a compact string format with preserved references and type metadata.
        /// </summary>
        /// <param name="obj">The object to serialize.</param>
        /// <param name="useBase64">
        /// Indicates whether the output should be encoded using Base64. Defaults to <c>true</c>.
        /// </param>
        /// <returns>The serialized string representation of the object.</returns>
        public string Serialize(object obj, bool useBase64 = true)
            => SerializeInternal(obj, useBase64, false);

        /// <summary>
        /// Serializes the specified object into a copy-safe string format by ignoring reference tracking.
        /// </summary>
        /// <param name="obj">The object to serialize.</param>
        /// <param name="useBase64">Indicates whether the result should be Base64 encoded.</param>
        /// <returns>A serialized representation of the object, without reference links.</returns>
        public string SerializeCopy(object obj, bool useBase64 = true)
            => SerializeInternal(obj, useBase64, true);

        /// <summary>
        /// Deserializes the given data string into an object of type <typeparamref name="T"/>.
        /// </summary>
        /// <typeparam name="T">The target type, which must be a reference type.</typeparam>
        /// <param name="data">The serialized data string.</param>
        /// <param name="useBase64">Indicates whether the input string is Base64 encoded.</param>
        /// <returns>The deserialized object of type <typeparamref name="T"/>.</returns>
        /// <exception cref="FormatException">Thrown when the input is not a valid Base64 string.</exception>
        /// <exception cref="Exception">Thrown when data is malformed or missing expected structure.</exception>
        public T? Deserialize<T>(string data, bool useBase64 = true) where T : class
        {
            return (T?)Deserialize(data, useBase64);
        }

        private object? GetReference(string refId)
        {
            int id = refId.ToInt(-1);
            var reference = _referenceTracker.FirstOrDefault(r => r.Id == id);
            return reference?.Obj;
        }

        private int GetReferenceId(object obj)
        {
            if (_referenceLookup.TryGetValue(obj, out var reference))
            {
                reference.HasReference = true;
                return reference.Id;
            }
            return -1;
        }

        private bool TrackReference(object? obj)
        {
            if (obj == null)
                return false;

            if (_referenceLookup.ContainsKey(obj))
                return false;

            TrackReference(_referenceTracker.Count, obj);

            return true;
        }

        private void TrackReference(int id, object obj)
        {
            var entry = new ReferenceEntry
            {
                Id = id,
                Obj = obj,
                HasReference = false
            };
            _referenceTracker.Add(entry);
            _referenceLookup[obj] = entry;
        }

        private int GetOrAddTypeId(Type type)
        {
            var name = type.FullName!;
            if (!_typeMap.TryGetValue(name, out int id))
            {
                id = _typeIndex.Count;
                _typeIndex.Add(name);
                _typeMap[name] = id;
            }
            return id;
        }

        private Type ResolveCompactType(string id)
        {
            int index = id.ToInt(_typeIndex.Count);
            if (index < _typeIndex.Count)
                id = _typeIndex[index];

            return id.ResolveType();
        }

        /// <summary>
        /// Releases internal resources and clears reference and type tracking state.
        /// </summary>
        public void Dispose()
        {
            _typeIndex.Clear();
            _typeMap.Clear();
            _referenceTracker.Clear();
            _referenceLookup.Clear();
        }
    }
}
