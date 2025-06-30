using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;

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
        public static IEnumerable<T> GetValues<T>(this Enum @enum) where T : Enum
            => Enum.GetValues(@enum.GetType()).Cast<T>();

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
    }
}
