using NE.Standard.Serialization;
using System;
using System.IO;
using System.Text.Json;
using System.Xml.Serialization;

namespace NE.Standard.Extensions
{
    /// <summary>
    /// Extension methods for serializing objects using different serializers.
    /// </summary>
    public static class SerializationExtensions
    {
        #region ObjectSerializer

        /// <summary>
        /// Serializes an object using <see cref="ObjectSerializer"/>.
        /// </summary>
        public static string SerializeObject(this object obj, bool useBase64 = true)
        {
            using var serializer = new ObjectSerializer();
            return serializer.Serialize(obj, useBase64);
        }

        /// <summary>
        /// Deserializes a string into an object using <see cref="ObjectSerializer"/>.
        /// </summary>
        public static T DeserializeObject<T>(this string data, bool useBase64 = true)
        {
            using var serializer = new ObjectSerializer();
            return serializer.Deserialize<T>(data, useBase64);
        }

        #endregion

        #region JsonSerializer

        /// <summary>
        /// Serializes an object to JSON using <see cref="JsonSerializer"/>.
        /// </summary>
        public static string SerializeJson<T>(this T obj, JsonSerializerOptions? options = null)
            => JsonSerializer.Serialize(obj, options);

        /// <summary>
        /// Deserializes JSON into an object using <see cref="JsonSerializer"/>.
        /// </summary>
        public static T? DeserializeJson<T>(this string json, JsonSerializerOptions? options = null)
            => JsonSerializer.Deserialize<T>(json, options);

        #endregion

        #region XmlSerializer

        /// <summary>
        /// Serializes an object to XML using <see cref="XmlSerializer"/>.
        /// </summary>
        public static string SerializeXml<T>(this T obj)
        {
            if (obj == null)
                throw new ArgumentNullException(nameof(obj));

            var serializer = new XmlSerializer(typeof(T));
            using var writer = new StringWriter();
            serializer.Serialize(writer, obj);
            return writer.ToString();
        }

        /// <summary>
        /// Deserializes XML into an object using <see cref="XmlSerializer"/>.
        /// </summary>
        public static T? DeserializeXml<T>(this string xml)
        {
            if (xml == null)
                throw new ArgumentNullException(nameof(xml));

            var serializer = new XmlSerializer(typeof(T));
            using var reader = new StringReader(xml);
            return (T?)serializer.Deserialize(reader);
        }

        #endregion
    }
}
