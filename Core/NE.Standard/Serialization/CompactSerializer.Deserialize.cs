using NE.Standard.Extensions;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Text;

namespace NE.Standard.Serialization
{
    public partial class CompactSerializer
    {
        private object? ReadObject(string data)
        {
            if (string.IsNullOrWhiteSpace(data)) return null;

            if (!data.StartsWith("("))
                throw new FormatException("Missing type descriptor.");

            var typeClose = data.IndexOf(')');
            var typeId = data[1..typeClose];
            var type = ResolveCompactType(typeId);
            data = data[(typeClose + 1)..];

            Type? underlyingType = Nullable.GetUnderlyingType(type);
            if (underlyingType != null && string.IsNullOrWhiteSpace(data)) return null;
            var targetType = underlyingType ?? type;

            if (targetType == typeof(string) && data.StartsWith(STRING_T))
            {
                var lenEnd = data.IndexOf(']');
                var lenStr = data[STRING_T.Length..lenEnd];
                int len = int.Parse(lenStr);
                return data[(lenEnd + 1)..(lenEnd + 1 + len)];
            }

            if (data.StartsWith("ref") && int.TryParse(data[3..], out int refId))
                return _referenceTracker.FirstOrDefault(r => r.Id == refId)?.Obj;
            
            if (targetType == typeof(Guid)) return new Guid(data);
            if (targetType == typeof(DateTime)) return data.ToDate();
            if (targetType == typeof(TimeSpan)) return data.ToTime();
            if (targetType == typeof(bool)) return data.ToBool();
            if (targetType == typeof(byte)) return data.ToByte();
            if (targetType == typeof(short)) return data.ToShort();
            if (targetType == typeof(int)) return data.ToInt();
            if (targetType == typeof(long)) return data.ToLong();
            if (targetType == typeof(float)) return data.ToFloat();
            if (targetType == typeof(double)) return data.ToDouble();
            if (targetType == typeof(decimal)) return data.ToDecimal();
            if (targetType.IsEnum) return data.ToEnum(targetType);

            var instance = targetType.CreateInstance();
            if (instance == null) return null;

            if (targetType.GetInterfaces().Any(i => i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IDictionary<,>)))
            {
                var dict = (IDictionary)instance;
                var segments = ExtractSegments(data);
                foreach (var (keyData, valueData) in segments)
                {
                    var key = ReadObject(keyData);
                    var value = ReadObject(valueData);
                    dict.Add(key, value);
                }
                return dict;
            }

            if (targetType.GetInterfaces().Any(i => i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IEnumerable<>)))
            {
                var itemType = targetType.IsArray ? targetType.GetElementType() : targetType.GetGenericArguments().First();
                var segments = ExtractSegments(data).Select(p => ReadObject(p.Item2)).ToList();
                var enumerableType = typeof(Enumerable);
                var casted = enumerableType.GetMethod(nameof(Enumerable.Cast))?.MakeGenericMethod(itemType!)
                                .Invoke(null, new object[] { segments });
                if (targetType.IsArray)
                    return enumerableType.GetMethod(nameof(Enumerable.ToArray))?.MakeGenericMethod(itemType!)
                        .Invoke(null, new object[] { casted });
                if (targetType.IsGenericType && targetType.GetGenericTypeDefinition() == typeof(ObservableCollection<>))
                    return targetType.CreateInstance(new object[] { casted });
                return enumerableType.GetMethod(nameof(Enumerable.ToList))?.MakeGenericMethod(itemType!)
                    .Invoke(null, new object[] { casted });
            }

            if (targetType.GetCustomAttribute<CompactSerializableAttribute>() == null)
                return Convert.ChangeType(data, targetType);

            var props = targetType.GetProperties()
                .Where(p => p.SetMethod != null && p.GetCustomAttribute<CompactIgnoreAttribute>() == null);
            int cursor = 0;
            while (cursor < data.Length)
            {
                if (data[cursor] != '<') break;
                var keyStart = data.IndexOf("[", cursor) + 1;
                var keyEnd = data.IndexOf("]", keyStart);
                var key = data[keyStart..keyEnd];
                var eqIndex = data.IndexOf('=', keyEnd);
                var valStart = eqIndex + 1;
                var valEnd = data.IndexOf('>', valStart);
                var valueData = data[valStart..valEnd];
                var prop = props.FirstOrDefault(p => p.Name == key);
                if (prop != null)
                {
                    var val = ReadObject(valueData);
                    prop.SetValue(instance, val);
                }
                cursor = valEnd + 1;
            }
            return instance;
        }

        private List<(string, string)> ExtractSegments(string data)
        {
            var result = new List<(string, string)>();
            int cursor = 0;
            while (cursor < data.Length)
            {
                if (data[cursor] == '<')
                {
                    var keyStart = data.IndexOf("[", cursor) + 1;
                    var keyEnd = data.IndexOf("]", keyStart);
                    var eqIndex = data.IndexOf('=', keyEnd);
                    var valStart = eqIndex + 1;
                    var sepIndex = data.IndexOf('|', valStart);
                    var endIndex = data.IndexOf('>', sepIndex);
                    var keyData = data[valStart..sepIndex];
                    var valueData = data[(sepIndex + 1)..endIndex];
                    result.Add((keyData, valueData));
                    cursor = endIndex + 1;
                }
                else break;
            }
            return result;
        }
    }
}
