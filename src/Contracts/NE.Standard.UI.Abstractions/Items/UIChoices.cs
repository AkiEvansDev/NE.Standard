using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Reflection;
using NE.Standard.UI.Primitives.Text;

namespace NE.Standard.UI.Abstractions.Items;

/// <summary>The choices a field is built from when the author names none: an enum's members, a boolean's two words.</summary>
public static class UIChoices
{
    /// <summary>The choices an enum type offers: a member's <see cref="DescriptionAttribute"/> when it carries one, else its name read as words.</summary>
    public static IReadOnlyList<UIChoice> FromEnum<TEnum>()
        where TEnum : struct, Enum
        => FromEnum(typeof(TEnum));

    /// <inheritdoc cref="FromEnum{TEnum}"/>
    public static IReadOnlyList<UIChoice> FromEnum(Type enumType)
    {
        ArgumentNullException.ThrowIfNull(enumType);

        if (!enumType.IsEnum)
            throw new ArgumentException($"'{enumType.Name}' is not an enum.", nameof(enumType));

        var names = Enum.GetNames(enumType);
        UIChoice[] choices = new UIChoice[names.Length];

        for (var i = 0; i < names.Length; i++)
        {
            var description = enumType.GetField(names[i], BindingFlags.Public | BindingFlags.Static)?.GetCustomAttribute<DescriptionAttribute>()?.Description;

            choices[i] = new UIChoice(names[i], description ?? UINaming.Humanize(names[i]));
        }

        return choices;
    }

    /// <summary>The two choices of a boolean, in the words given.</summary>
    public static IReadOnlyList<UIChoice> Boolean(string trueCaption, string falseCaption)
        => [new UIChoice("true", trueCaption), new UIChoice("false", falseCaption)];
}
