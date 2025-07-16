using NE.Standard.Serialization;
using System;
using System.IO;
using System.Text.Json;
using System.Xml.Serialization;

namespace NE.Standard.Extensions
{
    /// <summary>
    /// Provides extension methods for serializing and deserializing objects using various formats,
    /// including custom binary-like serialization (<see cref="NESerializer"/>), JSON, and XML.
    /// </summary>
    public static class SerializationExtensions
    {
        #region NESerializer

        /// <summary>
        /// Serializes the specified <paramref name="obj"/> using <see cref="NESerializer"/>.
        /// </summary>
        /// <param name="obj">The object to serialize.</param>
        /// <param name="useBase64">Indicates whether to encode the result using Base64. Defaults to <c>true</c>.</param>
        /// <returns>A serialized string representation of the object.</returns>
        public static string SerializeObject(this object obj, bool useBase64 = true)
        {
            using var serializer = new NESerializer();
            return serializer.Serialize(obj, useBase64);
        }

        /// <summary>
        /// Returns the deserialized object of type <typeparamref name="T"/>, or <c>null</c> if deserialization fails.
        /// </summary>
        public static T? DeserializeObject<T>(this string data, bool useBase64 = true) where T : class
        {
            using var serializer = new NESerializer();
            return serializer.Deserialize<T>(data, useBase64);
        }

        #endregion

        #region JsonSerializer

        /// <summary>
        /// Serializes the specified object into a JSON string using <see cref="JsonSerializer"/>.
        /// </summary>
        /// <typeparam name="T">The type of the object to serialize.</typeparam>
        /// <param name="obj">The object to serialize.</param>
        /// <param name="options">Optional <see cref="JsonSerializerOptions"/> to customize the output.</param>
        /// <returns>A JSON string representing the object.</returns>
        public static string SerializeJson<T>(this T obj, JsonSerializerOptions? options = null)
            => JsonSerializer.Serialize(obj, options);

        /// <summary>
        /// Returns the deserialized object of type <typeparamref name="T"/>, or <c>null</c> if deserialization fails.
        /// </summary>
        public static T? DeserializeJson<T>(this string json, JsonSerializerOptions? options = null) where T : class
            => JsonSerializer.Deserialize<T>(json, options);

        #endregion

        #region XmlSerializer

        /// <summary>
        /// Serializes the specified object into an XML string using <see cref="XmlSerializer"/>.
        /// </summary>
        /// <typeparam name="T">The type of the object to serialize.</typeparam>
        /// <param name="obj">The object to serialize. Must not be <c>null</c>.</param>
        /// <returns>An XML string representing the object.</returns>
        /// <exception cref="ArgumentNullException">Thrown if <paramref name="obj"/> is <c>null</c>.</exception>
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
        /// Returns the deserialized object of type <typeparamref name="T"/>, or <c>null</c> if deserialization fails.
        /// </summary>
        public static T? DeserializeXml<T>(this string xml) where T : class
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
