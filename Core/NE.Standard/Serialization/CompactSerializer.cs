using Microsoft.Extensions.Logging;
using NE.Standard.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace NE.Standard.Serialization
{

    [AttributeUsage(AttributeTargets.Class)]
    public sealed class CompactSerializableAttribute : Attribute { }

    [AttributeUsage(AttributeTargets.Property)]
    public sealed class CompactIgnoreAttribute : Attribute { }

    public partial class CompactSerializer : IDisposable
    {
        private const string STRING_T = "~[";

        private StringBuilder _builder = new StringBuilder();
        private List<string> _typeIndex = new List<string>();

        private class ReferenceEntry
        {
            public int Id { get; set; }
            public object Obj { get; set; } = default!;
            public bool HasReference { get; set; }
        }

        private List<ReferenceEntry> _referenceTracker = new List<ReferenceEntry>();

        public string Serialize(object obj, bool useBase64 = true)
            => SerializeInternal(obj, useBase64, false);

        public string SerializeCopy(object obj, bool useBase64 = true)
            => SerializeInternal(obj, useBase64, true);

        public T Deserialize<T>(string data, bool useBase64 = true)
        {
            return (T)Deserialize(data, useBase64);
        }

        public object? Deserialize(string data, bool useBase64 = true)
        {
            if (useBase64)
                data = Encoding.UTF8.GetString(Convert.FromBase64String(data));

            if (data.Length < 2)
                throw new FormatException("Corrupt data header.");

            var flags = data[..2];
            data = data[2..];

            if (flags.Contains("t"))
            {
                var idx = data.IndexOf('&');
                if (int.TryParse(data[..idx], out int len))
                {
                    var headerLen = idx + 1;
                    var typeBlock = data[headerLen..(headerLen + len - 1)];
                    _typeIndex = typeBlock.Split('&').ToList();
                    data = data[(headerLen + typeBlock.Length)..];
                }
            }

            return ReadObject(data);
        }

        private void Init()
        {
            _builder = new StringBuilder();
            _typeIndex = new List<string>();
            _referenceTracker = new List<ReferenceEntry>();
        }

        private void TrackReferences(object obj)
        {
            if (_referenceTracker.Exists(r => ReferenceEquals(r.Obj, obj))) return;

            _referenceTracker.Add(new ReferenceEntry
            {
                Id = _referenceTracker.Count,
                Obj = obj,
                HasReference = false
            });
        }

        public void Dispose()
        {
            _builder.Clear();
            _typeIndex.Clear();
            _referenceTracker.Clear();
        }

        private Type ResolveCompactType(string id)
        {
            int index = id.ToInt(_typeIndex.Count);
            if (index < _typeIndex.Count)
                id = _typeIndex[index];

            return id.ResolveType();
        }

        private int GetOrAddTypeId(Type type)
        {
            var name = type.FullName!;
            if (!_typeIndex.Contains(name))
                _typeIndex.Add(name);
            return _typeIndex.IndexOf(name);
        }
    }
}
