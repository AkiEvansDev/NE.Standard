using System;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Primitives.Localization;

namespace NE.Standard.UI.Runtime;

/// <summary>
/// Brings a controller-held value to the shape the target property declares, before sending it to a client —
/// <see cref="RecursiveValueCoercion"/>'s rule: never throws, passes through what it doesn't recognize.
/// </summary>
/// <remarks>
/// Must run before <c>ResolveServerValueUpdateNoLock</c> resolves an <c>IUIResolvableValue</c>, or it reaches the client unwrapped.
/// </remarks>
internal static class UIBoundValueConverter
{
    public static object? Convert(object? value, Type? targetType)
    {
        // An author's text travels as the plain string it stands for, so an item marked content shows it as written.
        value = UIPhrase.AsValue(value);

        // A key is the page's to translate, whatever the property declares; a string on a phrase property is words already.
        if (value is null or UIPhrase || targetType is null || (value is string && targetType == typeof(UIPhrase)))
            return value;

        return RecursiveValueCoercion.TryCoerce(value, targetType, out var coerced) ? coerced : value;
    }
}
