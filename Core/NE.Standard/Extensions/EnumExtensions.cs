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
        public static string GetName(this Enum @enum)
            => Enum.GetName(@enum.GetType(), @enum)!;

        public static string[] GetNames(this Enum @enum)
            => Enum.GetNames(@enum.GetType());

        public static IEnumerable<T> GetValues<T>(this Enum @enum) where T : Enum
            => Enum.GetValues(@enum.GetType()).Cast<T>();

        public static TAttribute GetAttribute<TAttribute>(this Enum @enum) where TAttribute : Attribute
        {
            return @enum
                .GetType()
                .GetMember(@enum.GetName()!)[0]
                .GetCustomAttribute<TAttribute>();
        }
    }
}
