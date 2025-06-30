using System;
using System.Reflection;

namespace NE.Standard.Extensions
{
    /// <summary>
    /// Helper methods for working with reflection.
    /// </summary>
    public static class RefletionExtensions
    {
        /// <summary>
        /// Gets the value of a property with the specified name.
        /// </summary>
        /// <exception cref="ArgumentNullException">Thrown when <paramref name="obj"/> or <paramref name="propertyName"/> is null.</exception>
        /// <exception cref="ArgumentException">Thrown when the property is not found.</exception>
        public static object? GetPropertyValue(this object obj, string propertyName)
        {
            if (obj == null) throw new ArgumentNullException(nameof(obj));
            if (string.IsNullOrWhiteSpace(propertyName)) throw new ArgumentNullException(nameof(propertyName));

            var prop = obj.GetType().GetProperty(propertyName, BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic)
                ?? throw new ArgumentException($"Property '{propertyName}' not found on type '{obj.GetType().FullName}'.", nameof(propertyName));

            return prop.GetValue(obj);
        }

        /// <summary>
        /// Gets the strongly typed value of a property with the specified name.
        /// </summary>
        public static T GetPropertyValue<T>(this object obj, string propertyName)
        {
            var result = GetPropertyValue(obj, propertyName);
            return result is null ? default! : (T)result;
        }

        /// <summary>
        /// Sets the value of a property with the specified name.
        /// </summary>
        /// <exception cref="ArgumentNullException">Thrown when <paramref name="obj"/> or <paramref name="propertyName"/> is null.</exception>
        /// <exception cref="ArgumentException">Thrown when the property is not found.</exception>
        public static void SetPropertyValue(this object obj, string propertyName, object? value)
        {
            if (obj == null) throw new ArgumentNullException(nameof(obj));
            if (string.IsNullOrWhiteSpace(propertyName)) throw new ArgumentNullException(nameof(propertyName));

            var prop = obj.GetType().GetProperty(propertyName, BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic)
                ?? throw new ArgumentException($"Property '{propertyName}' not found on type '{obj.GetType().FullName}'.", nameof(propertyName));

            prop.SetValue(obj, value);
        }

        /// <summary>
        /// Gets the value of a field with the specified name.
        /// </summary>
        /// <exception cref="ArgumentNullException">Thrown when <paramref name="obj"/> or <paramref name="fieldName"/> is null.</exception>
        /// <exception cref="ArgumentException">Thrown when the field is not found.</exception>
        public static object? GetFieldValue(this object obj, string fieldName)
        {
            if (obj == null) throw new ArgumentNullException(nameof(obj));
            if (string.IsNullOrWhiteSpace(fieldName)) throw new ArgumentNullException(nameof(fieldName));

            var field = obj.GetType().GetField(fieldName, BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic)
                ?? throw new ArgumentException($"Field '{fieldName}' not found on type '{obj.GetType().FullName}'.", nameof(fieldName));

            return field.GetValue(obj);
        }

        /// <summary>
        /// Gets the strongly typed value of a field with the specified name.
        /// </summary>
        public static T GetFieldValue<T>(this object obj, string fieldName)
        {
            var result = GetFieldValue(obj, fieldName);
            return result is null ? default! : (T)result;
        }

        /// <summary>
        /// Sets the value of a field with the specified name.
        /// </summary>
        /// <exception cref="ArgumentNullException">Thrown when <paramref name="obj"/> or <paramref name="fieldName"/> is null.</exception>
        /// <exception cref="ArgumentException">Thrown when the field is not found.</exception>
        public static void SetFieldValue(this object obj, string fieldName, object? value)
        {
            if (obj == null) throw new ArgumentNullException(nameof(obj));
            if (string.IsNullOrWhiteSpace(fieldName)) throw new ArgumentNullException(nameof(fieldName));

            var field = obj.GetType().GetField(fieldName, BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic)
                ?? throw new ArgumentException($"Field '{fieldName}' not found on type '{obj.GetType().FullName}'.", nameof(fieldName));

            field.SetValue(obj, value);
        }

        /// <summary>
        /// Returns all properties of the given type.
        /// </summary>
        public static IEnumerable<PropertyInfo> GetProperties(this Type type, bool requireSetter = false)
        {
            if (type == null) throw new ArgumentNullException(nameof(type));

            var props = type.GetProperties(BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic);
            return requireSetter ? props.Where(p => p.SetMethod != null) : props;
        }

        /// <summary>
        /// Returns all properties of the given type which are marked with the specified attribute.
        /// </summary>
        public static IEnumerable<PropertyInfo> GetProperties<TAttribute>(this Type type, bool requireSetter = false) where TAttribute : Attribute
        {
            return type.GetProperties(requireSetter).Where(p => p.HasAttribute<TAttribute>());
        }

        /// <summary>
        /// Returns all fields of the given type.
        /// </summary>
        public static IEnumerable<FieldInfo> GetFields(this Type type)
        {
            if (type == null) throw new ArgumentNullException(nameof(type));

            return type.GetFields(BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic);
        }

        /// <summary>
        /// Returns all fields of the given type which are marked with the specified attribute.
        /// </summary>
        public static IEnumerable<FieldInfo> GetFields<TAttribute>(this Type type) where TAttribute : Attribute
        {
            return type.GetFields().Where(f => f.HasAttribute<TAttribute>());
        }

        /// <summary>
        /// Retrieves an attribute applied to the property.
        /// </summary>
        public static TAttribute GetAttribute<TAttribute>(this PropertyInfo property) where TAttribute : Attribute
        {
            if (property == null) throw new ArgumentNullException(nameof(property));
            return property.GetCustomAttribute<TAttribute>()!;
        }

        /// <summary>
        /// Retrieves an attribute applied to the field.
        /// </summary>
        public static TAttribute GetAttribute<TAttribute>(this FieldInfo field) where TAttribute : Attribute
        {
            if (field == null) throw new ArgumentNullException(nameof(field));
            return field.GetCustomAttribute<TAttribute>()!;
        }
    }
}
