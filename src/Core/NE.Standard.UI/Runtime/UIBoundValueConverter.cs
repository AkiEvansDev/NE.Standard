using System;
using NE.Standard.UI.Abstractions.Recursive;

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
        if (value is null || targetType is null)
            return value;

        return RecursiveValueCoercion.TryCoerce(value, targetType, out var coerced) ? coerced : value;
    }
}
