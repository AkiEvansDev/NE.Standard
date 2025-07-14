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
        /// Deserializes the specified string into an object of type <typeparamref name="T"/> using <see cref="NESerializer"/>.
        /// </summary>
        /// <typeparam name="T">The type of the object to deserialize. Must be a reference type.</typeparam>
        /// <param name="data">The serialized data string.</param>
        /// <param name="useBase64">Specifies whether the input is Base64 encoded. Defaults to <c>true</c>.</param>
        /// <returns>The deserialized object instance of type <typeparamref name="T"/>, or <c>null</c> if deserialization fails.</returns>
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
        /// Deserializes the specified JSON string into an object of type <typeparamref name="T"/> using <see cref="JsonSerializer"/>.
        /// </summary>
        /// <typeparam name="T">The target type to deserialize into. Must be a reference type.</typeparam>
        /// <param name="json">The JSON string to deserialize.</param>
        /// <param name="options">Optional <see cref="JsonSerializerOptions"/> for deserialization behavior.</param>
        /// <returns>The deserialized object of type <typeparamref name="T"/>, or <c>null</c> if deserialization fails.</returns>
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
        /// Deserializes the specified XML string into an object of type <typeparamref name="T"/> using <see cref="XmlSerializer"/>.
        /// </summary>
        /// <typeparam name="T">The target type to deserialize into. Must be a reference type.</typeparam>
        /// <param name="xml">The XML string to deserialize.</param>
        /// <returns>The deserialized object of type <typeparamref name="T"/>, or <c>null</c> if deserialization fails.</returns>
        /// <exception cref="ArgumentNullException">Thrown if <paramref name="xml"/> is <c>null</c>.</exception>
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
