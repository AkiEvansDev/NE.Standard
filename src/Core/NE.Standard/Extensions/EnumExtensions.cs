using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;

namespace NE.Standard.Extensions
{
    /// <summary>
    /// Provides extension methods for working with <see cref="Enum"/> types,
    /// including name resolution, metadata access, and description extraction.
    /// </summary>
    public static class EnumExtensions
    {
        /// <summary>
        /// Returns the name of the specified enumeration <paramref name="enum"/> value.
        /// </summary>
        /// <returns>The name of the enum value as defined in its type.</returns>
        public static string GetName(this Enum @enum)
            => Enum.GetName(@enum.GetType(), @enum)!;

        /// <summary>
        /// Returns all defined names in the enumeration type of the specified <paramref name="enum"/>.
        /// </summary>
        /// <returns>An array of names defined in the enum type.</returns>
        public static string[] GetNames(this Enum @enum)
            => Enum.GetNames(@enum.GetType());

        /// <summary>
        /// Returns all defined values of the enumeration type <typeparamref name="T"/>.
        /// </summary>
        /// <typeparam name="T">The enumeration type.</typeparam>
        /// <returns>An enumerable containing all values of the specified enum type.</returns>
        public static IEnumerable<T> GetValues<T>() where T : Enum
            => Enum.GetValues(typeof(T)).Cast<T>();

        /// <summary>
        /// Returns the custom attribute of type <typeparamref name="TAttribute"/> for the enum value, or <c>null</c> if not found.
        /// </summary>
        public static TAttribute? GetAttribute<TAttribute>(this Enum @enum) where TAttribute : Attribute
        {
            var field = @enum.GetType().GetField(@enum.ToString());
            return field?.GetCustomAttribute<TAttribute>();
        }

        /// <summary>
        /// Returns the <see cref="DescriptionAttribute.Description"/> of the specified enumeration <paramref name="enum"/> value.
        /// </summary>
        /// <returns>The description string if <see cref="DescriptionAttribute"/> is defined; otherwise, <c>null</c>.</returns>
        public static string? GetDescription(this Enum @enum)
            => @enum.GetAttribute<DescriptionAttribute>()?.Description;

        /// <summary>
        /// Creates a dictionary mapping each value of the enumeration type <typeparamref name="TEnum"/>
        /// to its corresponding <see cref="DescriptionAttribute.Description"/>, if available.
        /// </summary>
        /// <typeparam name="TEnum">The enumeration type.</typeparam>
        /// <returns>
        /// A dictionary where keys are enum values and values are their associated descriptions,
        /// or <c>null</c> if a description is not defined.
        /// </returns>
        public static Dictionary<TEnum, string?> GetDescriptions<TEnum>() where TEnum : Enum
        {
            return Enum.GetValues(typeof(TEnum))
                .Cast<TEnum>()
                .ToDictionary(v => v, v => v.GetDescription());
        }
    }
}
