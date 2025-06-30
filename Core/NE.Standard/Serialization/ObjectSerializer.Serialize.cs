using NE.Standard.Extensions;
using System;
using System.Collections;
using System.Linq;
using System.Reflection;
using System.Text;

namespace NE.Standard.Serialization
{
    public partial class ObjectSerializer
    {
        private string SerializeInternal(object obj, bool useBase64 = true, bool ignoreReference = false)
        {
            Init();

            if (!ignoreReference)
                TrackObject(obj);

            var builder = new StringBuilder();

            WriteObject(obj, builder);
            AppendMetadata(builder);

            var result = builder.ToString();
            return useBase64 ? result.ToBase64() : result;
        }

        private void TrackObject(object obj)
        {
            var type = obj?.GetType();
            if (type == null)
                return;

            if (type.HasAttribute<ObjectSerializableAttribute>())
            {
                if (!type.IsValueType && !TrackReference(obj))
                    return;

                foreach (var prop in type.GetProperties())
                {
                    if (prop.SetMethod == null || prop.HasAttribute<ObjectSerializerIgnoreAttribute>())
                        continue;

                    var value = prop.GetValue(obj);

                    if (value is IDictionary dictionary)
                    {
                        var keys = dictionary.Keys.GetEnumerator();
                        var values = dictionary.Values.GetEnumerator();

                        for (var i = 0; i < dictionary.Count; ++i)
                        {
                            keys.MoveNext();
                            values.MoveNext();

                            TrackObject(keys.Current);
                            TrackObject(values.Current);
                        }

                        continue;
                    }
                    else if (!(value is string) && value is IEnumerable enumerable)
                    {
                        foreach (var item in enumerable)
                            TrackObject(item);

                        continue;
                    }

                    TrackObject(value);
                }
            }
        }

        private void AppendMetadata(StringBuilder builder)
        {
            var options = "";
            var types = "";
            var referenceBuilder = new StringBuilder();

            var prevCount = -1;
            var newCount = 0;

            while (prevCount != newCount)
            {
                prevCount = _referenceTracker.Count;

                foreach (var reference in _referenceTracker.Where(r => r.HasReference && r.Id > 0).Reverse().ToList())
                {
                    var objBuilder = new StringBuilder();
                    WriteObject(reference.Obj, objBuilder);

                    referenceBuilder.Insert(0, objBuilder);
                    referenceBuilder.Insert(0, $"{objBuilder.Length + reference.Id.ToString().Length + 2}&{reference.Id}&");

                    _referenceTracker.Remove(reference);
                }

                newCount = _referenceTracker.Count;
            }

            if (referenceBuilder.Length > 0)
            {
                options += "r";

                referenceBuilder.Insert(0, $"{referenceBuilder.Length + 1}&");
                builder.Insert(0, referenceBuilder);
            }
            else
                options += "-";

            foreach (var t in _typeIndex)
                types += $"&{t}";

            if (types.Length > 0)
            {
                options += "t";

                builder.Insert(0, types.Length.ToString() + types);
            }
            else
                options += "-";

            if (builder.Length > 0)
                builder.Insert(0, options);
        }

        private void WriteObject(object obj, StringBuilder builder)
        {
            var type = obj?.GetType();
            if (type == null)
                return;

            if (type.HasAttribute<ObjectSerializableAttribute>())
            {
                builder.Append($"({GetOrAddTypeId(type)})");

                foreach (var prop in type.GetProperties())
                {
                    if (prop.SetMethod == null || prop.HasAttribute<ObjectSerializerIgnoreAttribute>())
                        continue;

                    var value = prop.GetValue(obj);

                    builder.Append($"<[{prop.Name}]=");
                    WriteValue(value, builder);
                    builder.Append(">");
                }
            }
            else if (type == typeof(DateTime) && obj is DateTime dateTime)
                builder.Append($"({GetOrAddTypeId(type)}){dateTime.ToFormat()}");
            else if (type == typeof(TimeSpan) && obj is TimeSpan timeSpan)
                builder.Append($"({GetOrAddTypeId(type)}){timeSpan.ToFormat()}");
            else if (type.IsPrimitive || type.IsEnum || (type.IsValueType && type.IsSerializable))
                builder.Append($"({GetOrAddTypeId(type)}){obj}");
        }

        private void WriteValue(object value, StringBuilder builder)
        {
            if (value == null)
                return;

            if (value is string str)
                builder.Append($"{STRING_T}{str.Length}]{str}");
            else if (value is IDictionary dictionary)
            {
                builder.Append($"({GetOrAddTypeId(value.GetType())})");

                var keys = dictionary.Keys.GetEnumerator();
                var values = dictionary.Values.GetEnumerator();

                for (var index = 0; index < dictionary.Count; ++index)
                {
                    keys.MoveNext();
                    values.MoveNext();

                    builder.Append($"<[{index}]=");
                    WriteValue(keys.Current, builder);
                    builder.Append("|");
                    WriteValue(values.Current, builder);
                    builder.Append(">");
                }
            }
            else if (value is IEnumerable enumerable)
            {
                builder.Append($"({GetOrAddTypeId(value.GetType())})");
                var index = 0;

                foreach (var item in enumerable)
                {
                    builder.Append($"<[{index++}]=");
                    WriteValue(item, builder);
                    builder.Append(">");
                }
            }
            else
            {
                var id = GetReferenceId(value);
                if (id != -1)
                    builder.Append($"({GetOrAddTypeId(value.GetType())})ref{id}");
                else
                    WriteObject(value, builder);
            }
        }
    }
}
