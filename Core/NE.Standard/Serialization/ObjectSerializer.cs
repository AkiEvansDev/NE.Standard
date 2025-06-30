using NE.Standard.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;

namespace NE.Standard.Serialization
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Struct)]
    public sealed class ObjectSerializableAttribute : Attribute { }

    [AttributeUsage(AttributeTargets.Property)]
    public sealed class ObjectSerializerIgnoreAttribute : Attribute { }

    public partial class ObjectSerializer : IDisposable
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

        public string Serialize(object obj, bool useBase64 = true)
            => SerializeInternal(obj, useBase64, false);

        public string SerializeCopy(object obj, bool useBase64 = true)
            => SerializeInternal(obj, useBase64, true);

        public T Deserialize<T>(string data, bool useBase64 = true)
        {
            var result = Deserialize(data, useBase64);
            return result is null ? default! : (T)result;
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

        public void Dispose()
        {
            _typeIndex.Clear();
            _typeMap.Clear();
            _referenceTracker.Clear();
            _referenceLookup.Clear();
        }
    }
}
