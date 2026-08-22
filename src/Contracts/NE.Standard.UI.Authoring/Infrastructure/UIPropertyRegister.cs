using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq.Expressions;
using System.Reflection;
using System.Threading;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Authoring.Infrastructure;

/// <summary>
/// Registers and resolves UI component property definitions.
/// </summary>
public static class UIPropertyRegister
{
    private static readonly Lock Sync = new();
    private static readonly Dictionary<string, Dictionary<UIProperty, UIPropertyDefinition>> Registrations = [];

    /// <summary>
    /// Creates and registers a property definition by property name.
    /// </summary>
    public static UIPropertyDefinition Create<TComponent, TValue>(string property, bool isBindable = true, UIBindingCapabilities bindingCapabilities = UIBindingCapabilities.SourceToTarget, object? defaultValue = null)
        where TComponent : IBindableComponent, IUIComponentDefinition
        => Create<TComponent, TValue>(new UIProperty(property), isBindable, bindingCapabilities, defaultValue);

    /// <summary>
    /// Creates and registers a property definition.
    /// </summary>
    public static UIPropertyDefinition Create<TComponent, TValue>(UIProperty property, bool isBindable = true, UIBindingCapabilities bindingCapabilities = UIBindingCapabilities.SourceToTarget, object? defaultValue = null)
        where TComponent : IBindableComponent, IUIComponentDefinition
    {
        PropertyInfo propertyInfo = typeof(TComponent).GetProperty(property.Name, BindingFlags.Instance | BindingFlags.Public)
            ?? throw new InvalidOperationException($"Property '{property.Name}' was not found on component type '{typeof(TComponent).Name}'.");

        if (!propertyInfo.CanRead)
            throw new InvalidOperationException($"Property '{property.Name}' on component type '{typeof(TComponent).Name}' must be readable.");

        if (propertyInfo.PropertyType != typeof(TValue))
            throw new InvalidOperationException($"Property '{property.Name}' on component type '{typeof(TComponent).Name}' has CLR type '{propertyInfo.PropertyType.FullName}', but the registration expects '{typeof(TValue).FullName}'.");

        if (defaultValue is not null)
        {
            if (!TryCoerceDefaultValue(defaultValue, typeof(TValue), out defaultValue))
                throw new InvalidOperationException($"Default value for property '{property.Name}' on component type '{typeof(TComponent).Name}' must be assignable to '{typeof(TValue).FullName}'.");
        }

        if (!isBindable)
            bindingCapabilities = UIBindingCapabilities.None;

        UIPropertyDefinition definition = new()
        {
            ComponentTypeKey = TComponent.ComponentTypeKey,
            Property = property,
            ValueType = typeof(TValue),
            IsBindable = isBindable,
            BindingCapabilities = bindingCapabilities,
            DefaultValue = defaultValue,
            IsNullable = IsNullableType(typeof(TValue)),
            IsTranslatable = IsTranslatableProperty(propertyInfo),
            Getter = CreateGetter<TComponent>(propertyInfo)
        };

        Register(definition);
        return definition;
    }

    private static void Register(UIPropertyDefinition definition)
    {
        lock (Sync)
        {
            if (!Registrations.TryGetValue(definition.ComponentTypeKey, out Dictionary<UIProperty, UIPropertyDefinition>? definitions))
            {
                definitions = [];
                Registrations.Add(definition.ComponentTypeKey, definitions);
            }

            if (definitions.ContainsKey(definition.Property))
                throw new InvalidOperationException($"Property '{definition.Property.Name}' is already registered for component type '{definition.ComponentTypeKey}'.");

            definitions.Add(definition.Property, definition);
        }
    }

    /// <summary>
    /// Validates (and widens where necessary) a declared default value against the property's CLR type.
    /// `decimal`/`decimal?` properties are the one case that needs widening: `decimal` is not a valid C#
    /// attribute-argument type, so `[UIComponentProperty(DefaultValue = ...)]` on one can only ever be
    /// written as a numeric literal of some other type (typically `double`, e.g. `DefaultValue = 0d`) —
    /// never an actual `decimal` constant.
    /// </summary>
    private static bool TryCoerceDefaultValue(object defaultValue, Type valueType, out object? coerced)
    {
        if (valueType.IsInstanceOfType(defaultValue))
        {
            coerced = defaultValue;
            return true;
        }

        Type underlyingType = Nullable.GetUnderlyingType(valueType) ?? valueType;

        if (underlyingType == typeof(decimal) && defaultValue is double or float or int or long)
        {
            coerced = Convert.ToDecimal(defaultValue);
            return true;
        }

        coerced = null;
        return false;
    }

    private static bool IsNullableType(Type type)
        => !type.IsValueType || Nullable.GetUnderlyingType(type) is not null;

    private static bool IsTranslatableProperty(PropertyInfo propertyInfo)
        => propertyInfo.IsDefined(typeof(TranslatableAttribute), inherit: true);

    private static Func<IBindableComponent, object?> CreateGetter<TBindable>(PropertyInfo propertyInfo)
        where TBindable : IBindableComponent
    {
        ParameterExpression componentParameter = Expression.Parameter(typeof(IBindableComponent), "component");
        UnaryExpression castComponent = Expression.Convert(componentParameter, typeof(TBindable));
        MemberExpression propertyAccess = Expression.Property(castComponent, propertyInfo);
        UnaryExpression boxValue = Expression.Convert(propertyAccess, typeof(object));

        return Expression.Lambda<Func<IBindableComponent, object?>>(boxValue, componentParameter).Compile();
    }

    /// <summary>
    /// Gets a registered property definition or throws when it is not registered.
    /// </summary>
    public static UIPropertyDefinition GetRequired(string typeKey, UIProperty property)
        => TryGet(typeKey, property, out UIPropertyDefinition? definition)
            ? definition
            : throw new InvalidOperationException($"Property definition for '{property.Name}' not found in component '{typeKey}'.");

    /// <summary>
    /// Attempts to get a registered property definition.
    /// </summary>
    public static bool TryGet(string typeKey, UIProperty property, [NotNullWhen(true)] out UIPropertyDefinition? definition)
    {
        ArgumentNullException.ThrowIfNull(typeKey);

        lock (Sync)
        {
            if (Registrations.TryGetValue(typeKey, out Dictionary<UIProperty, UIPropertyDefinition>? definitions) && definitions.TryGetValue(property, out UIPropertyDefinition? registered))
            {
                definition = registered;
                return true;
            }
        }

        definition = null;
        return false;
    }

    /// <summary>
    /// Gets registered property definitions for a component type key.
    /// </summary>
    public static UIPropertyDefinition[] GetProperties(string typeKey)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(typeKey);

        lock (Sync)
        {
            if (!Registrations.TryGetValue(typeKey, out Dictionary<UIProperty, UIPropertyDefinition>? definitions))
                return [];

            UIPropertyDefinition[] result = new UIPropertyDefinition[definitions.Count];
            var index = 0;

            foreach (UIPropertyDefinition definition in definitions.Values)
            {
                result[index++] = definition;
            }

            return result;
        }
    }
}
