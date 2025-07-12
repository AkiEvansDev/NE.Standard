using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace NE.Standard.Extensions
{
    /// <summary>
    /// Extensions for working with reflection.
    /// </summary>
    public static class ReflectionExtensions
    {
        public const BindingFlags Flags = BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic;

        #region Invoke

        /// <summary>
        /// Invokes a method on the object by name with optional parameters.
        /// </summary>
        public static object? InvokeMethod(this object obj, string methodName, params object[] parameters)
        {
            if (obj == null) throw new ArgumentNullException(nameof(obj));
            return obj.GetType().InvokeMethod(obj, methodName, parameters);
        }

        /// <summary>
        /// Invokes a method on the object and returns a strongly typed result.
        /// </summary>
        public static T InvokeMethod<T>(this object obj, string methodName, params object[] parameters)
        {
            var result = InvokeMethod(obj, methodName, parameters);
            return result is null ? default! : (T)result;
        }

        /// <summary>
        /// Invokes a method on the given type instance and object by name with optional parameters.
        /// </summary>
        public static object? InvokeMethod(this Type type, object obj, string methodName, params object[] parameters)
        {
            if (type == null) throw new ArgumentNullException(nameof(type));
            if (obj == null) throw new ArgumentNullException(nameof(obj));
            if (string.IsNullOrWhiteSpace(methodName)) throw new ArgumentNullException(nameof(methodName));

            var method = type.GetMethod(methodName, Flags)
                ?? throw new ArgumentException($"Method '{methodName}' not found on type '{type.FullName}'.", nameof(methodName));

            return method.Invoke(obj, parameters);
        }

        /// <summary>
        /// Invokes a method on the given type instance and returns a strongly typed result.
        /// </summary>
        public static T InvokeMethod<T>(this Type type, object obj, string methodName, params object[] parameters)
        {
            var result = InvokeMethod(type, obj, methodName, parameters);
            return result is null ? default! : (T)result;
        }

        #endregion

        #region Properties

        /// <summary>
        /// Gets the value of a property from the object by name.
        /// </summary>
        public static object? GetPropertyValue(this object obj, string propertyName)
        {
            if (obj == null) throw new ArgumentNullException(nameof(obj));
            return obj.GetType().GetPropertyValue(obj, propertyName);
        }

        /// <summary>
        /// Gets the strongly typed value of a property from the object by name.
        /// </summary>
        public static T GetPropertyValue<T>(this object obj, string propertyName)
        {
            var result = GetPropertyValue(obj, propertyName);
            return result is null ? default! : (T)result;
        }

        /// <summary>
        /// Gets the value of a property from the object using the specified type.
        /// </summary>
        public static object? GetPropertyValue(this Type type, object obj, string propertyName)
        {
            if (type == null) throw new ArgumentNullException(nameof(type));
            if (obj == null) throw new ArgumentNullException(nameof(obj));
            if (string.IsNullOrWhiteSpace(propertyName)) throw new ArgumentNullException(nameof(propertyName));

            var prop = type.GetProperty(propertyName, Flags)
                ?? throw new ArgumentException($"Property '{propertyName}' not found on type '{type.FullName}'.", nameof(propertyName));

            return prop.GetValue(obj);
        }

        /// <summary>
        /// Sets the value of a property on the object by name.
        /// </summary>
        public static void SetPropertyValue(this object obj, string propertyName, object? value)
        {
            if (obj == null) throw new ArgumentNullException(nameof(obj));
            obj.GetType().SetPropertyValue(obj, propertyName, value);
        }

        /// <summary>
        /// Sets the value of a property on the object using the specified type.
        /// </summary>
        public static void SetPropertyValue(this Type type, object obj, string propertyName, object? value)
        {
            if (type == null) throw new ArgumentNullException(nameof(type));
            if (obj == null) throw new ArgumentNullException(nameof(obj));
            if (string.IsNullOrWhiteSpace(propertyName)) throw new ArgumentNullException(nameof(propertyName));

            var prop = type.GetProperty(propertyName, Flags)
                ?? throw new ArgumentException($"Property '{propertyName}' not found on type '{type.FullName}'.", nameof(propertyName));

            prop.SetValue(obj, value);
        }

        /// <summary>
        /// Gets all instance properties of a type, optionally requiring a setter.
        /// </summary>
        public static IEnumerable<PropertyInfo> GetAllProperties(this Type type, bool requireSetter = false)
        {
            if (type == null) throw new ArgumentNullException(nameof(type));

            var props = type.GetProperties(Flags);
            return requireSetter ? props.Where(p => p.SetMethod != null) : props;
        }

        /// <summary>
        /// Gets all instance properties marked with the specified attribute.
        /// </summary>
        public static IEnumerable<PropertyInfo> GetPropertiesWithAttribute<TAttribute>(this Type type, bool requireSetter = false)
            where TAttribute : Attribute
        {
            return type.GetAllProperties(requireSetter).Where(p => p.HasAttribute<TAttribute>());
        }

        /// <summary>
        /// Gets all instance properties not marked with the specified attribute.
        /// </summary>
        public static IEnumerable<PropertyInfo> GetPropertiesWithoutAttribute<TAttribute>(this Type type, bool requireSetter = false)
            where TAttribute : Attribute
        {
            return type.GetAllProperties(requireSetter).Where(p => !p.HasAttribute<TAttribute>());
        }

        #endregion

        #region Fields

        /// <summary>
        /// Gets the value of a field from the object by name.
        /// </summary>
        public static object? GetFieldValue(this object obj, string fieldName)
        {
            if (obj == null) throw new ArgumentNullException(nameof(obj));
            return obj.GetType().GetFieldValue(obj, fieldName);
        }

        /// <summary>
        /// Gets the strongly typed value of a field from the object by name.
        /// </summary>
        public static T GetFieldValue<T>(this object obj, string fieldName)
        {
            var result = GetFieldValue(obj, fieldName);
            return result is null ? default! : (T)result;
        }

        /// <summary>
        /// Gets the value of a field from the object using the specified type.
        /// </summary>
        public static object? GetFieldValue(this Type type, object obj, string fieldName)
        {
            if (type == null) throw new ArgumentNullException(nameof(type));
            if (obj == null) throw new ArgumentNullException(nameof(obj));
            if (string.IsNullOrWhiteSpace(fieldName)) throw new ArgumentNullException(nameof(fieldName));

            var field = type.GetField(fieldName, Flags)
                ?? throw new ArgumentException($"Field '{fieldName}' not found on type '{type.FullName}'.", nameof(fieldName));

            return field.GetValue(obj);
        }

        /// <summary>
        /// Sets the value of a field on the object by name.
        /// </summary>
        public static void SetFieldValue(this object obj, string fieldName, object? value)
        {
            if (obj == null) throw new ArgumentNullException(nameof(obj));
            obj.GetType().SetFieldValue(obj, fieldName, value);
        }

        /// <summary>
        /// Sets the value of a field on the object using the specified type.
        /// </summary>
        public static void SetFieldValue(this Type type, object obj, string fieldName, object? value)
        {
            if (type == null) throw new ArgumentNullException(nameof(type));
            if (obj == null) throw new ArgumentNullException(nameof(obj));
            if (string.IsNullOrWhiteSpace(fieldName)) throw new ArgumentNullException(nameof(fieldName));

            var field = type.GetField(fieldName, Flags)
                ?? throw new ArgumentException($"Field '{fieldName}' not found on type '{type.FullName}'.", nameof(fieldName));

            field.SetValue(obj, value);
        }

        /// <summary>
        /// Gets all instance fields of a type.
        /// </summary>
        public static IEnumerable<FieldInfo> GetAllFields(this Type type)
        {
            if (type == null) throw new ArgumentNullException(nameof(type));
            return type.GetFields(Flags);
        }

        /// <summary>
        /// Gets all instance fields marked with the specified attribute.
        /// </summary>
        public static IEnumerable<FieldInfo> GetFieldsWithAttribute<TAttribute>(this Type type)
            where TAttribute : Attribute
        {
            return type.GetAllFields().Where(f => f.HasAttribute<TAttribute>());
        }

        /// <summary>
        /// Gets all instance fields not marked with the specified attribute.
        /// </summary>
        public static IEnumerable<FieldInfo> GetFieldsWithoutAttribute<TAttribute>(this Type type)
            where TAttribute : Attribute
        {
            return type.GetAllFields().Where(f => !f.HasAttribute<TAttribute>());
        }

        #endregion

        #region Methods

        /// <summary>
        /// Gets all instance methods of a type.
        /// </summary>
        public static IEnumerable<MethodInfo> GetAllMethods(this Type type)
        {
            if (type == null) throw new ArgumentNullException(nameof(type));
            return type.GetMethods(Flags);
        }

        /// <summary>
        /// Gets all instance methods marked with the specified attribute.
        /// </summary>
        public static IEnumerable<MethodInfo> GetMethodsWithAttribute<TAttribute>(this Type type)
            where TAttribute : Attribute
        {
            return type.GetAllMethods().Where(m => m.HasAttribute<TAttribute>());
        }

        /// <summary>
        /// Gets all instance methods not marked with the specified attribute.
        /// </summary>
        public static IEnumerable<MethodInfo> GetMethodsWithoutAttribute<TAttribute>(this Type type)
            where TAttribute : Attribute
        {
            return type.GetAllMethods().Where(m => !m.HasAttribute<TAttribute>());
        }

        #endregion

        #region Attributes

        /// <summary>
        /// Determines whether a member has the specified attribute applied.
        /// </summary>
        public static bool HasAttribute<TAttribute>(this MemberInfo member, bool inherit = false)
            where TAttribute : Attribute
        {
            if (member == null) throw new ArgumentNullException(nameof(member));
            return Attribute.IsDefined(member, typeof(TAttribute), inherit);
        }

        #endregion
    }
}
