using NE.Standard.Extensions;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;

namespace NE.Standard.Serialization
{
    /// <summary>
    /// See <see cref="ObjectSerializer"/> for type information.
    /// </summary>
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

                foreach (var prop in type.GetPropertiesWithoutAttribute<IgnoreAttribute>(true))
                {
                    var value = prop.GetValue(obj);

                    if (value is IDictionary dictionary)
                    {
                        foreach (DictionaryEntry entry in dictionary)
                        {
                            TrackObject(entry.Key);
                            TrackObject(entry.Value);
                        }
                        continue;
                    }
                    else if (value is IEnumerable enumerable && !(value is string))
                    {
                        foreach (var item in enumerable)
                        {
                            TrackObject(item);
                        }
                        continue;
                    }

                    TrackObject(value);
                }
            }
        }

        private void AppendMetadata(StringBuilder builder)
        {
            var optionsBuilder = new StringBuilder(2);
            var typesBuilder = new StringBuilder();
            var referenceSegments = new Stack<string>();

            int index = _referenceTracker.Count - 1;

            while (index >= 0)
            {
                var reference = _referenceTracker[index];
                if (!reference.HasReference || reference.Id <= 0)
                {
                    index--;
                    continue;
                }

                var objBuilder = new StringBuilder();
                WriteObject(reference.Obj, objBuilder);

                var segment = $"{objBuilder.Length + reference.Id.ToString().Length + 2}&{reference.Id}&" + objBuilder;
                referenceSegments.Push(segment);

                _referenceTracker.RemoveAt(index);
                _referenceLookup.Remove(reference.Obj);

                index = _referenceTracker.Count - 1;
            }

            if (referenceSegments.Count > 0)
            {
                optionsBuilder.Append('r');

                var allReferences = string.Concat(referenceSegments);
                var header = $"{allReferences.Length + 1}&";

                builder.Insert(0, allReferences);
                builder.Insert(0, header);
            }
            else
            {
                optionsBuilder.Append('-');
            }

            if (_typeIndex.Count > 0)
            {
                optionsBuilder.Append('t');

                foreach (var t in _typeIndex)
                    typesBuilder.Append('&').Append(t);

                builder.Insert(0, typesBuilder.ToString());
                builder.Insert(0, typesBuilder.Length.ToString());
            }
            else
            {
                optionsBuilder.Append('-');
            }

            if (builder.Length > 0)
                builder.Insert(0, optionsBuilder.ToString());

            //var options = "";
            //var types = "";
            //var referenceBuilder = new StringBuilder();

            //var prevCount = -1;
            //var newCount = 0;

            //while (prevCount != newCount)
            //{
            //    prevCount = _referenceTracker.Count;

            //    foreach (var reference in _referenceTracker.Where(r => r.HasReference && r.Id > 0).Reverse().ToList())
            //    {
            //        var objBuilder = new StringBuilder();
            //        WriteObject(reference.Obj, objBuilder);

            //        referenceBuilder.Insert(0, objBuilder);
            //        referenceBuilder.Insert(0, $"{objBuilder.Length + reference.Id.ToString().Length + 2}&{reference.Id}&");

            //        _referenceTracker.Remove(reference);
            //        _referenceLookup.Remove(reference.Obj);
            //    }

            //    newCount = _referenceTracker.Count;
            //}

            //if (referenceBuilder.Length > 0)
            //{
            //    options += "r";

            //    referenceBuilder.Insert(0, $"{referenceBuilder.Length + 1}&");
            //    builder.Insert(0, referenceBuilder);
            //}
            //else
            //    options += "-";

            //foreach (var t in _typeIndex)
            //    types += $"&{t}";

            //if (types.Length > 0)
            //{
            //    options += "t";

            //    builder.Insert(0, types.Length.ToString() + types);
            //}
            //else
            //    options += "-";

            //if (builder.Length > 0)
            //    builder.Insert(0, options);
        }

        private void WriteObject(object obj, StringBuilder builder)
        {
            var type = obj?.GetType();
            if (type == null)
                return;

            if (type.HasAttribute<ObjectSerializableAttribute>())
            {
                builder.Append($"({GetOrAddTypeId(type)})");

                foreach (var prop in type.GetPropertiesWithoutAttribute<IgnoreAttribute>(true))
                {
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
            {
                builder.Append($"{STRING_T}{str.Length}]{str}");
            }
            else if (value is IDictionary dictionary)
            {
                builder.Append($"({GetOrAddTypeId(value.GetType())})");

                int index = 0;
                foreach (DictionaryEntry entry in dictionary)
                {
                    builder.Append($"<[{index}]=");
                    WriteValue(entry.Key, builder);
                    builder.Append("|");
                    WriteValue(entry.Value, builder);
                    builder.Append(">");

                    index++;
                }
            }
            else if (value is IEnumerable enumerable)
            {
                builder.Append($"({GetOrAddTypeId(value.GetType())})");

                int index = 0;
                foreach (var item in enumerable)
                {
                    builder.Append($"<[{index}]=");
                    WriteValue(item, builder);
                    builder.Append(">");

                    index++;
                }
            }
            else
            {
                var id = GetReferenceId(value);
                if (id != -1)
                {
                    builder.Append($"({GetOrAddTypeId(value.GetType())})ref{id}");
                }
                else
                {
                    WriteObject(value, builder);
                }
            }
        }
    }
}
