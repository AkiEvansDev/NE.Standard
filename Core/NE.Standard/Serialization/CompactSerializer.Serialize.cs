using Microsoft.Extensions.Logging;
using NE.Standard.Extensions;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;

namespace NE.Standard.Serialization
{
    public partial class CompactSerializer
    {
        private string SerializeInternal(object obj, bool useBase64, bool ignoreReference)
        {
            Init();

            if (!ignoreReference)
                TrackReferences(obj);

            WriteObject(obj);
            AppendMetadata();

            var result = _builder.ToString();
            return useBase64 ? result.ToBase64() : result;
        }

        private void WriteObject(object obj)
        {
            var type = obj?.GetType();
            if (type == null)
                return;

            if (type.GetCustomAttribute<CompactSerializableAttribute>() != null)
            {
                _builder.Append($"({GetOrAddTypeId(type)})");
                foreach (var prop in type.GetProperties())
                {
                    if (prop.SetMethod == null || prop.GetCustomAttribute<CompactIgnoreAttribute>() != null)
                        continue;

                    var value = prop.GetValue(obj);
                    _builder.Append($"<[{prop.Name}]=");
                    WriteValue(value);
                    _builder.Append(">");
                }
            }
            else if (type == typeof(DateTime))
            {
                _builder.Append($"({GetOrAddTypeId(type)}){((DateTime)obj).ToFormat()}");
            }
            else if (type == typeof(TimeSpan))
            {
                _builder.Append($"({GetOrAddTypeId(type)}){((TimeSpan)obj).ToFormat()}");
            }
            else
            {
                _builder.Append($"({GetOrAddTypeId(type)}){obj}");
            }
        }

        private void WriteValue(object value)
        {
            if (value == null) return;
            var type = value.GetType();

            if (value is string s)
            {
                _builder.Append($"{STRING_T}{s.Length}]{s}");
            }
            else if (value is IDictionary dict)
            {
                _builder.Append($"({GetOrAddTypeId(type)})");
                int i = 0;
                foreach (DictionaryEntry entry in dict)
                {
                    _builder.Append($"<[{i++}]=");
                    WriteValue(entry.Key);
                    _builder.Append("|");
                    WriteValue(entry.Value);
                    _builder.Append(">");
                }
            }
            else if (value is IEnumerable enumerable && type != typeof(string))
            {
                _builder.Append($"({GetOrAddTypeId(type)})");
                int i = 0;
                foreach (var item in enumerable)
                {
                    _builder.Append($"<[{i++}]=");
                    WriteValue(item);
                    _builder.Append(">");
                }
            }
            else
            {
                var id = _referenceTracker.FirstOrDefault(r => ReferenceEquals(r.Obj, value))?.Id ?? -1;
                if (id >= 0)
                {
                    _builder.Append($"({GetOrAddTypeId(type)})ref{id}");
                }
                else
                {
                    WriteObject(value);
                }
            }
        }

        private void AppendMetadata()
        {
            var typeSection = string.Join("&", _typeIndex);
            var options = _typeIndex.Count > 0 ? "t" : "-";
            if (_referenceTracker.Count > 0 && _referenceTracker.Any(r => r.HasReference))
                options = "r" + options;

            _builder.Insert(0, typeSection.Length > 0 ? $"{typeSection.Length}&{typeSection}" : "");
            _builder.Insert(0, options);
        }
    }
}
