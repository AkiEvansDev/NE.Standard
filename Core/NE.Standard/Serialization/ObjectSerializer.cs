using NE.Standard.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;

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

        private List<string> _typeIndex = new List<string>();
        private List<ReferenceEntry> _referenceTracker = new List<ReferenceEntry>();

        private void Init()
        {
            _typeIndex = new List<string>();
            _referenceTracker = new List<ReferenceEntry>();
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
            return _referenceTracker.FirstOrDefault(r => r.Id == id)?.Obj;
        }

        private int GetReferenceId(object obj)
        {
            var reference = _referenceTracker.FirstOrDefault(r => ReferenceEquals(r.Obj, obj));

            if (reference == null)
                return -1;

            reference.HasReference = true;
            return reference.Id;
        }

        private bool TrackReference(object? obj)
        {
            if (obj == null)
                return false;

            if (_referenceTracker.Exists(r => ReferenceEquals(r.Obj, obj))) 
                return false;

            TrackReference(_referenceTracker.Count, obj);

            return true;
        }

        private void TrackReference(int id, object obj)
        {
            _referenceTracker.Add(new ReferenceEntry
            {
                Id = id,
                Obj = obj,
                HasReference = false
            });
        }

        private int GetOrAddTypeId(Type type)
        {
            var name = type.FullName!;
            if (!_typeIndex.Contains(name))
                _typeIndex.Add(name);
            return _typeIndex.IndexOf(name);
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
            _referenceTracker.Clear();
        }
    }
}
