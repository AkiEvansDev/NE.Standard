using System;
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
        public static T? GetPropertyValue<T>(this object obj, string propertyName)
            => (T?)GetPropertyValue(obj, propertyName);

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
        public static T? GetFieldValue<T>(this object obj, string fieldName)
            => (T?)GetFieldValue(obj, fieldName);

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
        /// Retrieves the first attribute of the specified type applied to the member.
        /// </summary>
        public static TAttribute? GetAttribute<TAttribute>(this MemberInfo member, bool inherit = false) where TAttribute : Attribute
        {
            if (member == null) throw new ArgumentNullException(nameof(member));
            return (TAttribute?)member.GetCustomAttributes(typeof(TAttribute), inherit).FirstOrDefault();
        }
    }
}
