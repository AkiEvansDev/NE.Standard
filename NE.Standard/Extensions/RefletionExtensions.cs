using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace NE.Standard.Extensions
{
    /// <summary>
    /// Provides extension methods for working with reflection, including invocation,
    /// property and field access, and metadata inspection on types and members.
    /// </summary>
    public static class ReflectionExtensions
    {
        /// <summary>
        /// Default binding flags for instance-level, public and non-public member access.
        /// </summary>
        public const BindingFlags Flags = BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic;

        #region Invoke

        /// <summary>
        /// Invokes a method by name on the specified <paramref name="obj"/> with the given parameters.
        /// </summary>
        /// <param name="obj">The target object.</param>
        /// <param name="methodName">The name of the method to invoke.</param>
        /// <param name="parameters">An array of parameters to pass to the method.</param>
        /// <returns>The return value of the invoked method, or <c>null</c> if void.</returns>
        public static object? InvokeMethod(this object obj, string methodName, params object[] parameters)
        {
            if (obj == null) throw new ArgumentNullException(nameof(obj));
            return obj.GetType().InvokeMethod(obj, methodName, parameters);
        }

        /// <summary>
        /// Invokes a method by name on the specified <paramref name="obj"/> and returns the result as type <typeparamref name="T"/>.
        /// </summary>
        /// <typeparam name="T">The expected return type.</typeparam>
        /// <param name="obj">The target object.</param>
        /// <param name="methodName">The name of the method to invoke.</param>
        /// <param name="parameters">An array of parameters to pass to the method.</param>
        /// <returns>The result cast to <typeparamref name="T"/>.</returns>
        public static T InvokeMethod<T>(this object obj, string methodName, params object[] parameters)
        {
            var result = InvokeMethod(obj, methodName, parameters);
            return result is null ? default! : (T)result;
        }

        /// <summary>
        /// Invokes a method by name on the given <paramref name="obj"/>, using the provided <paramref name="type"/>.
        /// </summary>
        /// <param name="type">The type containing the method definition.</param>
        /// <param name="obj">The instance on which to invoke the method.</param>
        /// <param name="methodName">The name of the method to invoke.</param>
        /// <param name="parameters">Optional parameters for the method.</param>
        /// <returns>The return value of the method, or <c>null</c> if void.</returns>
        /// <exception cref="ArgumentException">Thrown if the method cannot be found.</exception>
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
        /// Invokes a method by name using the given <paramref name="type"/> and <paramref name="obj"/> and returns the result as type <typeparamref name="T"/>.
        /// </summary>
        /// <typeparam name="T">The expected return type.</typeparam>
        /// <param name="type">The type containing the method.</param>
        /// <param name="obj">The object to invoke the method on.</param>
        /// <param name="methodName">The name of the method.</param>
        /// <param name="parameters">Method parameters.</param>
        /// <returns>The result cast to <typeparamref name="T"/>.</returns>
        public static T InvokeMethod<T>(this Type type, object obj, string methodName, params object[] parameters)
        {
            var result = InvokeMethod(type, obj, methodName, parameters);
            return result is null ? default! : (T)result;
        }

        #endregion

        #region Properties

        /// <summary>
        /// Retrieves the value of a property by name from the specified <paramref name="obj"/>.
        /// </summary>
        /// <param name="obj">The object instance.</param>
        /// <param name="propertyName">The name of the property.</param>
        /// <returns>The property value, or <c>null</c> if not found.</returns>
        public static object? GetPropertyValue(this object obj, string propertyName)
        {
            if (obj == null) throw new ArgumentNullException(nameof(obj));
            return obj.GetType().GetPropertyValue(obj, propertyName);
        }

        /// <summary>
        /// Retrieves the value of a property by name and casts it to type <typeparamref name="T"/>.
        /// </summary>
        /// <typeparam name="T">The expected type of the property value.</typeparam>
        /// <param name="obj">The object instance.</param>
        /// <param name="propertyName">The property name.</param>
        /// <returns>The property value as <typeparamref name="T"/>.</returns>
        public static T GetPropertyValue<T>(this object obj, string propertyName)
        {
            var result = GetPropertyValue(obj, propertyName);
            return result is null ? default! : (T)result;
        }

        /// <summary>
        /// Retrieves the value of a property from the specified <paramref name="obj"/> using the specified <paramref name="type"/>.
        /// </summary>
        /// <param name="type">The type that defines the property.</param>
        /// <param name="obj">The object instance to read from.</param>
        /// <param name="propertyName">The property name.</param>
        /// <returns>The property value.</returns>
        /// <exception cref="ArgumentException">Thrown if the property is not found.</exception>
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
        /// Sets the value of a property by name on the specified <paramref name="obj"/>.
        /// </summary>
        /// <param name="obj">The object instance.</param>
        /// <param name="propertyName">The property name.</param>
        /// <param name="value">The new value to assign.</param>
        public static void SetPropertyValue(this object obj, string propertyName, object? value)
        {
            if (obj == null) throw new ArgumentNullException(nameof(obj));
            obj.GetType().SetPropertyValue(obj, propertyName, value);
        }

        /// <summary>
        /// Sets the value of a property using the specified <paramref name="type"/> on the provided <paramref name="obj"/>.
        /// </summary>
        /// <param name="type">The type that defines the property.</param>
        /// <param name="obj">The object instance to modify.</param>
        /// <param name="propertyName">The property name.</param>
        /// <param name="value">The value to assign.</param>
        /// <exception cref="ArgumentException">Thrown if the property is not found.</exception>
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
        /// Retrieves all instance properties of the given <paramref name="type"/>.
        /// Optionally filters to properties with a setter.
        /// </summary>
        /// <param name="type">The type to inspect.</param>
        /// <param name="requireSetter">If <c>true</c>, only returns properties with a setter.</param>
        /// <returns>A sequence of matching <see cref="PropertyInfo"/> instances.</returns>

        public static IEnumerable<PropertyInfo> GetAllProperties(this Type type, bool requireSetter = false)
        {
            if (type == null) throw new ArgumentNullException(nameof(type));

            var props = type.GetProperties(Flags);
            return requireSetter ? props.Where(p => p.SetMethod != null) : props;
        }

        /// <summary>
        /// Retrieves all instance properties of a type that are decorated with the specified <typeparamref name="TAttribute"/>.
        /// </summary>
        /// <typeparam name="TAttribute">The attribute type to filter by.</typeparam>
        /// <param name="type">The type to inspect.</param>
        /// <param name="requireSetter">Whether to require a property setter.</param>
        /// <returns>A sequence of <see cref="PropertyInfo"/> objects that match.</returns>
        public static IEnumerable<PropertyInfo> GetPropertiesWithAttribute<TAttribute>(this Type type, bool requireSetter = false)
            where TAttribute : Attribute
        {
            return type.GetAllProperties(requireSetter).Where(p => p.HasAttribute<TAttribute>());
        }

        /// <summary>
        /// Retrieves all instance properties of a type that are not decorated with the specified <typeparamref name="TAttribute"/>.
        /// </summary>
        /// <typeparam name="TAttribute">The attribute type to exclude.</typeparam>
        /// <param name="type">The type to inspect.</param>
        /// <param name="requireSetter">Whether to require a property setter.</param>
        /// <returns>A sequence of <see cref="PropertyInfo"/> objects that match.</returns>
        public static IEnumerable<PropertyInfo> GetPropertiesWithoutAttribute<TAttribute>(this Type type, bool requireSetter = false)
            where TAttribute : Attribute
        {
            return type.GetAllProperties(requireSetter).Where(p => !p.HasAttribute<TAttribute>());
        }

        #endregion

        #region Fields

        /// <summary>
        /// Retrieves the value of a field by name from the specified <paramref name="obj"/>.
        /// </summary>
        /// <param name="obj">The object instance to read from.</param>
        /// <param name="fieldName">The name of the field to retrieve.</param>
        /// <returns>The value of the field, or <c>null</c> if not found.</returns>
        public static object? GetFieldValue(this object obj, string fieldName)
        {
            if (obj == null) throw new ArgumentNullException(nameof(obj));
            return obj.GetType().GetFieldValue(obj, fieldName);
        }

        /// <summary>
        /// Retrieves the value of a field by name from the specified <paramref name="obj"/> and casts it to type <typeparamref name="T"/>.
        /// </summary>
        /// <typeparam name="T">The expected type of the field value.</typeparam>
        /// <param name="obj">The object instance to read from.</param>
        /// <param name="fieldName">The name of the field to retrieve.</param>
        /// <returns>The field value cast to <typeparamref name="T"/>.</returns>
        public static T GetFieldValue<T>(this object obj, string fieldName)
        {
            var result = GetFieldValue(obj, fieldName);
            return result is null ? default! : (T)result;
        }

        /// <summary>
        /// Retrieves the value of a field from the specified <paramref name="obj"/>, using the provided <paramref name="type"/>.
        /// </summary>
        /// <param name="type">The type that defines the field.</param>
        /// <param name="obj">The object instance to read from.</param>
        /// <param name="fieldName">The name of the field.</param>
        /// <returns>The value of the field.</returns>
        /// <exception cref="ArgumentException">Thrown if the field is not found on the type.</exception>
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
        /// Sets the value of a field by name on the specified <paramref name="obj"/>.
        /// </summary>
        /// <param name="obj">The object instance to modify.</param>
        /// <param name="fieldName">The name of the field to set.</param>
        /// <param name="value">The value to assign to the field.</param>
        public static void SetFieldValue(this object obj, string fieldName, object? value)
        {
            if (obj == null) throw new ArgumentNullException(nameof(obj));
            obj.GetType().SetFieldValue(obj, fieldName, value);
        }

        /// <summary>
        /// Sets the value of a field by name on the specified <paramref name="obj"/>, using the provided <paramref name="type"/>.
        /// </summary>
        /// <param name="type">The type that declares the field.</param>
        /// <param name="obj">The object instance to modify.</param>
        /// <param name="fieldName">The name of the field to set.</param>
        /// <param name="value">The value to assign to the field.</param>
        /// <exception cref="ArgumentException">Thrown if the field is not found on the type.</exception>
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
        /// Retrieves all instance-level fields (public and non-public) declared on the specified <paramref name="type"/>.
        /// </summary>
        /// <param name="type">The type whose fields will be retrieved.</param>
        /// <returns>A collection of <see cref="FieldInfo"/> objects representing the fields.</returns>
        public static IEnumerable<FieldInfo> GetAllFields(this Type type)
        {
            if (type == null) throw new ArgumentNullException(nameof(type));
            return type.GetFields(Flags);
        }

        /// <summary>
        /// Retrieves all instance-level fields of the specified <paramref name="type"/> that are decorated with <typeparamref name="TAttribute"/>.
        /// </summary>
        /// <typeparam name="TAttribute">The type of attribute to filter by.</typeparam>
        /// <param name="type">The type whose fields will be inspected.</param>
        /// <returns>A sequence of <see cref="FieldInfo"/> objects that have the specified attribute.</returns>
        public static IEnumerable<FieldInfo> GetFieldsWithAttribute<TAttribute>(this Type type)
            where TAttribute : Attribute
        {
            return type.GetAllFields().Where(f => f.HasAttribute<TAttribute>());
        }

        /// <summary>
        /// Retrieves all instance-level fields of the specified <paramref name="type"/> that are not decorated with <typeparamref name="TAttribute"/>.
        /// </summary>
        /// <typeparam name="TAttribute">The type of attribute to exclude.</typeparam>
        /// <param name="type">The type whose fields will be inspected.</param>
        /// <returns>A sequence of <see cref="FieldInfo"/> objects without the specified attribute.</returns>
        public static IEnumerable<FieldInfo> GetFieldsWithoutAttribute<TAttribute>(this Type type)
            where TAttribute : Attribute
        {
            return type.GetAllFields().Where(f => !f.HasAttribute<TAttribute>());
        }

        #endregion

        #region Methods

        /// <summary>
        /// Retrieves all instance-level methods (public and non-public) declared on the specified <paramref name="type"/>.
        /// </summary>
        /// <param name="type">The type whose methods will be retrieved.</param>
        /// <returns>A collection of <see cref="MethodInfo"/> objects representing the methods.</returns>
        public static IEnumerable<MethodInfo> GetAllMethods(this Type type)
        {
            if (type == null) throw new ArgumentNullException(nameof(type));
            return type.GetMethods(Flags);
        }

        /// <summary>
        /// Retrieves all instance-level methods of the specified <paramref name="type"/> that are decorated with <typeparamref name="TAttribute"/>.
        /// </summary>
        /// <typeparam name="TAttribute">The attribute type to search for.</typeparam>
        /// <param name="type">The type to inspect for methods.</param>
        /// <returns>A sequence of <see cref="MethodInfo"/> objects that have the specified attribute.</returns>
        public static IEnumerable<MethodInfo> GetMethodsWithAttribute<TAttribute>(this Type type)
            where TAttribute : Attribute
        {
            return type.GetAllMethods().Where(m => m.HasAttribute<TAttribute>());
        }

        /// <summary>
        /// Retrieves all instance-level methods of the specified <paramref name="type"/> that are not decorated with <typeparamref name="TAttribute"/>.
        /// </summary>
        /// <typeparam name="TAttribute">The attribute type to exclude.</typeparam>
        /// <param name="type">The type to inspect for methods.</param>
        /// <returns>A sequence of <see cref="MethodInfo"/> objects without the specified attribute.</returns>
        public static IEnumerable<MethodInfo> GetMethodsWithoutAttribute<TAttribute>(this Type type)
            where TAttribute : Attribute
        {
            return type.GetAllMethods().Where(m => !m.HasAttribute<TAttribute>());
        }

        #endregion

        #region Attributes

        /// <summary>
        /// Determines whether the specified <paramref name="member"/> is decorated with the attribute <typeparamref name="TAttribute"/>.
        /// </summary>
        /// <typeparam name="TAttribute">The type of the attribute to check for.</typeparam>
        /// <param name="member">The member to inspect (property, method, field, etc.).</param>
        /// <param name="inherit">Whether to search the inheritance chain.</param>
        /// <returns><c>true</c> if the attribute is defined; otherwise, <c>false</c>.</returns>
        public static bool HasAttribute<TAttribute>(this MemberInfo member, bool inherit = false)
            where TAttribute : Attribute
        {
            if (member == null) throw new ArgumentNullException(nameof(member));
            return Attribute.IsDefined(member, typeof(TAttribute), inherit);
        }

        #endregion
    }
}
