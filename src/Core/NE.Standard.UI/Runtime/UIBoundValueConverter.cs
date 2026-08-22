using System;
using System.Collections.Concurrent;
using System.Globalization;
using System.Linq.Expressions;
using System.Reflection;
using NE.Standard.UI.Abstractions.Styling;

namespace NE.Standard.UI.Runtime;

/// <summary>
/// Brings a controller-held value to the shape the target component property declares, before it is sent to
/// a client. The mirror of <c>RecursiveValueCoercion</c>, which handles the client-to-server direction.
/// </summary>
/// <remarks>
/// One case actually needs this: authoring lets a controller declare a plain <c>T</c> against a
/// <see cref="UIResponsive{T}"/> property — <c>double Spacing</c>, <c>UIThickness Padding</c> — because of the
/// implicit conversion, and the runtime then sends whatever the controller holds. Every consumer of that value
/// otherwise has to accept both shapes and guess which one it got, which is a per-platform re-implementation
/// waiting to happen. Wrapping here means a platform renderer only ever sees the envelope.
/// <para>
/// Deliberately never throws and never converts speculatively: anything it does not positively recognise is
/// passed through untouched, because a wrong conversion is worse than none.
/// </para>
/// <para>
/// Runs <em>before</em> <c>ResolveServerValueUpdateNoLock</c> resolves an <c>IUIResolvableValue</c>, so a
/// resolvable would reach a client unwrapped. Harmless while <c>UIItemsView</c> is the only implementation —
/// it resolves to a collection view and can never be the value of a responsive scalar property.
/// </para>
/// </remarks>
internal static class UIBoundValueConverter
{
    private static readonly ConcurrentDictionary<Type, Func<object, object>?> Wrappers = new();

    public static object? Convert(object? value, Type? targetType)
    {
        if (value is null || targetType is null)
            return value;

        Type underlying = Nullable.GetUnderlyingType(targetType) ?? targetType;
        Type valueType = value.GetType();

        if (underlying.IsAssignableFrom(valueType))
            return value;

        Func<object, object>? wrapper = Wrappers.GetOrAdd(underlying, CreateResponsiveWrapper);

        if (wrapper is null)
            return value;

        Type elementType = underlying.GetGenericArguments()[0];

        if (valueType == elementType)
            return wrapper(value);

        return TryChangeType(value, elementType, out var converted)
            ? wrapper(converted)
            : value;
    }

    /// <summary>
    /// Compiles a <c>UIResponsive&lt;T&gt;.FromValue</c> call for one element type, or returns
    /// <see langword="null"/> when the target is not a responsive type at all.
    /// </summary>
    private static Func<object, object>? CreateResponsiveWrapper(Type targetType)
    {
        if (!targetType.IsGenericType || targetType.GetGenericTypeDefinition() != typeof(UIResponsive<>))
            return null;

        Type elementType = targetType.GetGenericArguments()[0];
        MethodInfo fromValue = targetType.GetMethod(nameof(UIResponsive<>.FromValue), BindingFlags.Public | BindingFlags.Static)!;

        ParameterExpression parameter = Expression.Parameter(typeof(object), "value");

        UnaryExpression body = Expression.Convert(
            Expression.Call(fromValue, Expression.Convert(parameter, elementType)),
            typeof(object)
        );

        return Expression.Lambda<Func<object, object>>(body, parameter).Compile();
    }

    /// <summary>
    /// Widens a numeric value onto the element type — a controller declaring <c>int</c> against a
    /// <c>UIResponsive&lt;double&gt;</c> property is legal authoring and must not be dropped.
    /// </summary>
    private static bool TryChangeType(object value, Type elementType, out object converted)
    {
        converted = value;

        if (value is not IConvertible || !elementType.IsPrimitive)
            return false;

        try
        {
            converted = System.Convert.ChangeType(value, elementType, CultureInfo.InvariantCulture);
            return true;
        }
        catch (Exception exception) when (exception is FormatException or InvalidCastException or OverflowException)
        {
            return false;
        }
    }
}
