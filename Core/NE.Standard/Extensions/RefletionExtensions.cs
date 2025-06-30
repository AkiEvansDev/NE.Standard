using System;
using System.Collections.Generic;
using System.Linq;
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
        public static IEnumerable<PropertyInfo> GetAllProperties(this Type type, bool requireSetter = false)
        {
            if (type == null) throw new ArgumentNullException(nameof(type));

            var props = type.GetProperties(BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic);
            return requireSetter ? props.Where(p => p.SetMethod != null) : props;
        }

        /// <summary>
        /// Returns all properties of the given type which are marked with the specified attribute.
        /// </summary>
        public static IEnumerable<PropertyInfo> GetPropertiesWithAttribute<TAttribute>(this Type type, bool requireSetter = false) where TAttribute : Attribute
        {
            return type.GetAllProperties(requireSetter).Where(p => p.HasAttribute<TAttribute>());
        }

        /// <summary>
        /// Returns all properties of the given type which are marked without the specified attribute.
        /// </summary>
        public static IEnumerable<PropertyInfo> GetPropertiesWithoutAttribute<TAttribute>(this Type type, bool requireSetter = false) where TAttribute : Attribute
        {
            return type.GetAllProperties(requireSetter).Where(p => !p.HasAttribute<TAttribute>());
        }

        /// <summary>
        /// Returns all fields of the given type.
        /// </summary>
        public static IEnumerable<FieldInfo> GetAllFields(this Type type)
        {
            if (type == null) throw new ArgumentNullException(nameof(type));

            return type.GetFields(BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic);
        }

        /// <summary>
        /// Returns all fields of the given type which are marked with the specified attribute.
        /// </summary>
        public static IEnumerable<FieldInfo> GetFieldsWithAttribute<TAttribute>(this Type type) where TAttribute : Attribute
        {
            return type.GetAllFields().Where(f => f.HasAttribute<TAttribute>());
        }

        /// <summary>
        /// Returns all fields of the given type which are marked without the specified attribute.
        /// </summary>
        public static IEnumerable<FieldInfo> GetFieldsWithoutAttribute<TAttribute>(this Type type) where TAttribute : Attribute
        {
            return type.GetAllFields().Where(f => !f.HasAttribute<TAttribute>());
        }

        /// <summary>
        /// Determines whether the member has the specified attribute applied.
        /// </summary>
        public static bool HasAttribute<TAttribute>(this MemberInfo member, bool inherit = false) where TAttribute : Attribute
        {
            if (member == null)
                throw new ArgumentNullException(nameof(member));

            return Attribute.IsDefined(member, typeof(TAttribute), inherit);
        }
    }
}
