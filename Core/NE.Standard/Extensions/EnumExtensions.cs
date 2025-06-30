using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.ComponentModel;

namespace NE.Standard.Extensions
{
    /// <summary>
    /// Useful helpers for working with enums.
    /// </summary>
    public static class EnumExtensions
    {
        /// <summary>
        /// Returns the name of the enumeration value.
        /// </summary>
        public static string GetName(this Enum @enum)
            => Enum.GetName(@enum.GetType(), @enum)!;

        /// <summary>
        /// Returns all names defined in the enumeration type.
        /// </summary>
        public static string[] GetNames(this Enum @enum)
            => Enum.GetNames(@enum.GetType());

        /// <summary>
        /// Returns all values defined in the enumeration type.
        /// </summary>
        public static IEnumerable<T> GetValues<T>() where T : Enum
            => Enum.GetValues(typeof(T)).Cast<T>();

        /// <summary>
        /// Retrieves an attribute of the specified type attached to the enumeration value.
        /// </summary>
        public static TAttribute GetAttribute<TAttribute>(this Enum @enum) where TAttribute : Attribute
        {
            return @enum
                .GetType()
                .GetField(@enum.ToString())!
                .GetCustomAttribute<TAttribute>();
        }

        /// <summary>
        /// Returns the <see cref="DescriptionAttribute.Description"/> of the enumeration value.
        /// </summary>
        public static string? GetDescription(this Enum @enum)
            => @enum.GetAttribute<DescriptionAttribute>()?.Description;

        /// <summary>
        /// Returns a dictionary mapping enumeration values to their descriptions.
        /// </summary>
        public static Dictionary<TEnum, string?> GetDescriptions<TEnum>() where TEnum : Enum
        {
            return Enum.GetValues(typeof(TEnum))
                .Cast<TEnum>()
                .ToDictionary(v => v, v => v.GetDescription());
        }
    }
}
