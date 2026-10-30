using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Linq.Expressions;
using System.Reflection;
using System.Runtime.CompilerServices;
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

    // The component types whose hierarchy has been walked; apart from Sync, since a static constructor it runs registers under it.
    private static readonly ConcurrentDictionary<Type, bool> RegisteredTypes = new();

    /// <summary>
    /// Runs every static constructor of a component type's hierarchy, base type first, so that every level's properties are
    /// registered before any is read; once per type.
    /// </summary>
    public static void EnsureRegistered(Type componentType)
    {
        ArgumentNullException.ThrowIfNull(componentType);

        if (RegisteredTypes.ContainsKey(componentType))
            return;

        List<Type> hierarchy = [];

        for (Type? current = componentType; current is not null && current != typeof(object); current = current.BaseType)
            hierarchy.Add(current);

        for (var i = hierarchy.Count - 1; i >= 0; i--)
        {
            RuntimeHelpers.RunClassConstructor(hierarchy[i].TypeHandle);
            _ = RegisteredTypes.TryAdd(hierarchy[i], true);
        }
    }

    /// <summary>
    /// Creates and registers a property definition by property name.
    /// </summary>
    public static UIPropertyDefinition Create<TComponent, TValue>(string property, bool isBindable = true, UIBindingCapabilities bindingCapabilities = UIBindingCapabilities.SourceToTarget, object? defaultValue = null, UIBindingMode defaultBindingMode = UIBindingMode.OneWay)
        where TComponent : IBindableComponent, IUIComponentDefinition
        => Create<TComponent, TValue>(new UIProperty(property), isBindable, bindingCapabilities, defaultValue, defaultBindingMode);

    /// <summary>
    /// Creates and registers a property definition.
    /// </summary>
    public static UIPropertyDefinition Create<TComponent, TValue>(UIProperty property, bool isBindable = true, UIBindingCapabilities bindingCapabilities = UIBindingCapabilities.SourceToTarget, object? defaultValue = null, UIBindingMode defaultBindingMode = UIBindingMode.OneWay)
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
            DefaultBindingMode = defaultBindingMode,
            DefaultValue = defaultValue,
            IsNullable = IsNullableType(typeof(TValue)),
            IsTranslatable = IsTranslatableProperty(propertyInfo),
            Getter = CreateGetter<TComponent>(propertyInfo),
            Setter = CreateSetter<TComponent, TValue>(propertyInfo)
        };

        Register(definition);
        return definition;
    }

    /// <summary>
    /// Overrides the registered default value of an inherited component property by property name.
    /// </summary>
    public static UIPropertyDefinition OverrideDefault<TComponent, TValue>(Type declaringType, string property, object? defaultValue)
        where TComponent : IBindableComponent, IUIComponentDefinition
        => OverrideDefault<TComponent, TValue>(declaringType, new UIProperty(property), defaultValue);

    /// <summary>
    /// Overrides the registered default value of an inherited component property.
    /// </summary>
    public static UIPropertyDefinition OverrideDefault<TComponent, TValue>(Type declaringType, UIProperty property, object? defaultValue)
        where TComponent : IBindableComponent, IUIComponentDefinition
    {
        ArgumentNullException.ThrowIfNull(declaringType);

        if (declaringType.BaseType is { } baseType && baseType != typeof(object))
            EnsureRegistered(baseType);

        if (defaultValue is not null)
        {
            if (!TryCoerceDefaultValue(defaultValue, typeof(TValue), out defaultValue))
                throw new InvalidOperationException($"Default value for property '{property.Name}' on component type '{typeof(TComponent).Name}' must be assignable to '{typeof(TValue).FullName}'.");
        }

        var componentTypeKey = TComponent.ComponentTypeKey;

        lock (Sync)
        {
            if (!Registrations.TryGetValue(componentTypeKey, out Dictionary<UIProperty, UIPropertyDefinition>? definitions) || !definitions.TryGetValue(property, out UIPropertyDefinition? existing))
                throw new InvalidOperationException($"Cannot override default value for property '{property.Name}' because it is not registered on component type '{componentTypeKey}'.");

            if (existing.ValueType != typeof(TValue))
                throw new InvalidOperationException($"Property '{property.Name}' on component type '{componentTypeKey}' has registered CLR type '{existing.ValueType.FullName}', but the default override expects '{typeof(TValue).FullName}'.");

            UIPropertyDefinition updated = new()
            {
                ComponentTypeKey = existing.ComponentTypeKey,
                Property = existing.Property,
                ValueType = existing.ValueType,
                IsBindable = existing.IsBindable,
                BindingCapabilities = existing.BindingCapabilities,
                DefaultBindingMode = existing.DefaultBindingMode,
                DefaultValue = defaultValue,
                IsNullable = existing.IsNullable,
                IsTranslatable = existing.IsTranslatable,
                Getter = existing.Getter,
                Setter = existing.Setter
            };

            definitions[property] = updated;
            return updated;
        }
    }

    /// <summary>
    /// Validates and widens a declared default value against the property's CLR type.
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
            coerced = Convert.ToDecimal(defaultValue, CultureInfo.InvariantCulture);
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

    private static Action<IBindableComponent, object?>? CreateSetter<TBindable, TValue>(PropertyInfo propertyInfo)
        where TBindable : IBindableComponent
    {
        if (propertyInfo.SetMethod is not { } setMethod || Array.IndexOf(setMethod.ReturnParameter.GetRequiredCustomModifiers(), typeof(IsExternalInit)) >= 0)
            return null;

        ParameterExpression componentParameter = Expression.Parameter(typeof(IBindableComponent), "component");
        ParameterExpression valueParameter = Expression.Parameter(typeof(object), "value");
        UnaryExpression castComponent = Expression.Convert(componentParameter, typeof(TBindable));
        UnaryExpression castValue = Expression.Convert(valueParameter, typeof(TValue));
        MethodCallExpression callSetter = Expression.Call(castComponent, setMethod, castValue);

        return Expression.Lambda<Action<IBindableComponent, object?>>(callSetter, componentParameter, valueParameter).Compile();
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
