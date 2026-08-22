using System;
using System.Collections.Generic;
using System.Threading;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Infrastructure;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.Foundation;

internal static class ComponentIdGenerator
{
    private static int _globalId;

    public static string Create()
    {
        var id = Interlocked.Increment(ref _globalId);
        return $"u{id}";
    }
}

/// <summary>
/// Base class for visual components with layout, binding, interaction, and event authoring support.
/// </summary>
public abstract partial class VisualComponentBase<TComponent>(string? id = null) : IVisualComponent
    where TComponent : VisualComponentBase<TComponent>, IUIComponentDefinition
{
    private readonly Dictionary<UIProperty, int> _bindingIndexes = [];
    private readonly Dictionary<string, int> _eventIndexes = new(StringComparer.Ordinal);

    private readonly List<UIBinding> _bindings = [];
    private readonly List<UIInteraction> _interactions = [];
    private readonly List<UIEvent> _events = [];

    private static readonly UIResponsive<bool> DefaultVisible = true;

    /// <summary>
    /// Gets the current component instance typed as the fluent component type.
    /// </summary>
    protected TComponent Self => (TComponent)this;

    /// <inheritdoc/>
    public string TypeKey => TComponent.ComponentTypeKey;

    /// <inheritdoc/>
    public UIBinding? Context { get; private set; }

    /// <inheritdoc/>
    public string Id { get; } = string.IsNullOrWhiteSpace(id)
        ? ComponentIdGenerator.Create()
        : id;

    /// <inheritdoc/>
    public bool HasAuthoredId { get; } = !string.IsNullOrWhiteSpace(id);

    /// <inheritdoc />
    [UIComponentProperty(Contract = typeof(IVisualComponent), DefaultValueMember = nameof(DefaultVisible))]
    public UIResponsive<bool>? Visible { get; set; }

    /// <inheritdoc />
    [UIComponentProperty(Contract = typeof(IVisualComponent), DefaultValue = true)]
    public bool? Enabled { get; set; }

    /// <inheritdoc />
    [UIComponentProperty(Contract = typeof(IVisualComponent))]
    public UIThemeMode? Theme { get; set; }

    /// <inheritdoc />
    [UIComponentProperty(Contract = typeof(IVisualComponent), DefaultValue = UIAlignment.Stretch)]
    public UIAlignment? HorizontalAlignment { get; set; }

    /// <inheritdoc />
    [UIComponentProperty(Contract = typeof(IVisualComponent), DefaultValue = UIAlignment.Stretch)]
    public UIAlignment? VerticalAlignment { get; set; }

    /// <inheritdoc />
    [UIComponentProperty(Contract = typeof(IVisualComponent))]
    public UIResponsive<UILayoutLength>? Width { get; set; }

    /// <inheritdoc />
    [UIComponentProperty(Contract = typeof(IVisualComponent))]
    public UIResponsive<UILayoutLength>? MinWidth { get; set; }

    /// <inheritdoc />
    [UIComponentProperty(Contract = typeof(IVisualComponent))]
    public UIResponsive<UILayoutLength>? MaxWidth { get; set; }

    /// <inheritdoc />
    [UIComponentProperty(Contract = typeof(IVisualComponent))]
    public UIResponsive<UILayoutLength>? Height { get; set; }

    /// <inheritdoc />
    [UIComponentProperty(Contract = typeof(IVisualComponent))]
    public UIResponsive<UILayoutLength>? MinHeight { get; set; }

    /// <inheritdoc />
    [UIComponentProperty(Contract = typeof(IVisualComponent))]
    public UIResponsive<UILayoutLength>? MaxHeight { get; set; }

    /// <inheritdoc />
    [UIComponentProperty(Contract = typeof(IVisualComponent), DefaultValue = 0)]
    public int? ZIndex { get; set; }

    /// <inheritdoc />
    [UIComponentProperty(Contract = typeof(IVisualComponent))]
    public UIResponsive<UIThickness>? Margin { get; set; }

    /// <inheritdoc />
    [UIComponentProperty(Contract = typeof(IVisualComponent))]
    public UIResponsive<UIGridPlacement>? Placement { get; set; }

    /// <inheritdoc />
    [UIComponentProperty(Contract = typeof(IVisualComponent), DefaultValue = false)]
    public bool? Loading { get; set; }

    /// <inheritdoc />
    [UIComponentProperty(Contract = typeof(IVisualComponent), IsBindable = false, GenerateBinder = false)]
    public UISkeletonVariant? LoadingPreview { get; set; }

    /// <inheritdoc/>
    public IReadOnlyList<UIBinding> Bindings => _bindings;

    /// <inheritdoc/>
    public IReadOnlyList<UIInteraction> Interactions => _interactions;

    /// <inheritdoc/>
    public IReadOnlyList<UIEvent> Events => _events;

    /// <inheritdoc />
    public IVisualComponent? ContextMenu { get; private set; }

    /// <summary>
    /// Sets the component shown when this one is right-clicked — normally a <c>MenuComponent</c>, which is
    /// what makes its entries, section captions, rules and styling the menu's own rather than a second
    /// implementation of all four.
    /// </summary>
    public TComponent SetContextMenu(IVisualComponent contextMenu)
    {
        ArgumentNullException.ThrowIfNull(contextMenu);

        ContextMenu = contextMenu;
        return Self;
    }

    /// <summary>
    /// Applies custom configuration to the component.
    /// </summary>
    public TComponent Configure(Action<TComponent> configure)
    {
        ArgumentNullException.ThrowIfNull(configure);

        configure(Self);
        return Self;
    }

    /// <summary>
    /// Sets the grid cell(s) this component occupies, optionally overriding the placement at wider
    /// breakpoints (each falling back to the next narrower one that is set — see <see cref="UIResponsive{T}"/>).
    /// </summary>
    public TComponent SetPlacement(int column, int row, int columnSpan = 1, int rowSpan = 1, UIGridPlacement? sm = null, UIGridPlacement? md = null, UIGridPlacement? xl = null, UIGridPlacement? xxl = null)
        => SetPlacement(UIResponsive<UIGridPlacement>.Create(UIGridPlacement.At(column, row, columnSpan, rowSpan), sm, md, xl, xxl));

    /// <summary>
    /// Sets this component to span the full row width, optionally overriding the placement at wider
    /// breakpoints.
    /// </summary>
    public TComponent SpanFull(int column = 0, int row = 0, int rowSpan = 1, UIGridPlacement? sm = null, UIGridPlacement? md = null, UIGridPlacement? xl = null, UIGridPlacement? xxl = null)
        => SetPlacement(UIResponsive<UIGridPlacement>.Create(UIGridPlacement.Full(column, row, rowSpan), sm, md, xl, xxl));

    /// <summary>
    /// Sets this component to span half the row width, optionally overriding the placement at wider
    /// breakpoints.
    /// </summary>
    public TComponent SpanHalf(int column = 0, int row = 0, int rowSpan = 1, UIGridPlacement? sm = null, UIGridPlacement? md = null, UIGridPlacement? xl = null, UIGridPlacement? xxl = null)
        => SetPlacement(UIResponsive<UIGridPlacement>.Create(UIGridPlacement.Half(column, row, rowSpan), sm, md, xl, xxl));

    /// <summary>
    /// Sets this component to span a third of the row width, optionally overriding the placement at
    /// wider breakpoints.
    /// </summary>
    public TComponent SpanThird(int column = 0, int row = 0, int rowSpan = 1, UIGridPlacement? sm = null, UIGridPlacement? md = null, UIGridPlacement? xl = null, UIGridPlacement? xxl = null)
        => SetPlacement(UIResponsive<UIGridPlacement>.Create(UIGridPlacement.Third(column, row, rowSpan), sm, md, xl, xxl));

    /// <summary>
    /// Sets this component to span a quarter of the row width, optionally overriding the placement at
    /// wider breakpoints.
    /// </summary>
    public TComponent SpanQuarter(int column = 0, int row = 0, int rowSpan = 1, UIGridPlacement? sm = null, UIGridPlacement? md = null, UIGridPlacement? xl = null, UIGridPlacement? xxl = null)
        => SetPlacement(UIResponsive<UIGridPlacement>.Create(UIGridPlacement.Quarter(column, row, rowSpan), sm, md, xl, xxl));

    /// <summary>
    /// Binds the component context to a recursive source path.
    /// </summary>
    public virtual TComponent BindContext(string path, UIBindingScope scope = UIBindingScope.Root)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(path);
        return BindContext(RecursivePath.Parse(path), scope);
    }

    /// <summary>
    /// Binds the component context to a recursive source path.
    /// </summary>
    public virtual TComponent BindContext(RecursivePath path, UIBindingScope scope = UIBindingScope.Root)
    {
        ArgumentNullException.ThrowIfNull(path);
        Context = UIBinding.Context(path, scope);
        return Self;
    }

    /// <summary>
    /// Binds a component property to a recursive source path.
    /// </summary>
    public TComponent Bind(UIProperty property, string path, UIBindingScope scope = UIBindingScope.Root, UIBindingMode mode = UIBindingMode.OneWay)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(path);
        return Bind(property, RecursivePath.Parse(path), scope, mode);
    }

    /// <summary>
    /// Binds a component property to a recursive source path.
    /// </summary>
    public TComponent Bind(UIProperty property, RecursivePath path, UIBindingScope scope = UIBindingScope.Root, UIBindingMode mode = UIBindingMode.OneWay)
    {
        ArgumentNullException.ThrowIfNull(path);
        EnsureBindingAllowed(property, mode);

        SetOrReplaceBinding(UIBinding.Property(property, path, scope, mode));
        return Self;
    }

    private void EnsureBindingAllowed(UIProperty property, UIBindingMode mode)
    {
        if (!UIPropertyRegister.TryGet(TypeKey, property, out UIPropertyDefinition? definition))
            throw new InvalidOperationException($"Property '{property.Name}' is not registered for component type '{typeof(TComponent).Name}'.");

        if (!definition.IsBindable)
            throw new InvalidOperationException($"Property '{property.Name}' on component type '{typeof(TComponent).Name}' does not support binding.");

        if (!mode.IsSupportedBy(definition.BindingCapabilities))
            throw new InvalidOperationException($"Binding mode '{mode}' is not supported for property '{property.Name}' on component type '{typeof(TComponent).Name}'.");
    }

    private void SetOrReplaceBinding(UIBinding binding)
    {
        if (_bindingIndexes.TryGetValue(binding.Target, out var existingIndex))
        {
            _bindings[existingIndex] = binding;
            return;
        }

        _bindingIndexes.Add(binding.Target, _bindings.Count);
        _bindings.Add(binding);
    }

    /// <summary>
    /// Adds an interaction from a local source property to the same target property.
    /// </summary>
    public TComponent Interact(UIProperty property, UIComparisonOperator @operator = UIComparisonOperator.Equal, object? value = null, object? whenTrue = null, object? whenFalse = null)
        => Interact(property, property, @operator, value, whenTrue, whenFalse);

    /// <summary>
    /// Adds an interaction from a local source property to a target property.
    /// </summary>
    public TComponent Interact(UIProperty source, UIProperty target, UIComparisonOperator @operator = UIComparisonOperator.Equal, object? value = null, object? whenTrue = null, object? whenFalse = null)
        => Interact(Id, source, target, @operator, value, whenTrue, whenFalse);

    /// <summary>
    /// Adds an interaction from a property reference to a local target property.
    /// </summary>
    public TComponent Interact(string sourceComponentId, UIProperty source, UIProperty target, UIComparisonOperator @operator = UIComparisonOperator.Equal, object? value = null, object? whenTrue = null, object? whenFalse = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sourceComponentId);

        EnsureBindingAllowed(target, UIBindingMode.OneWay);

        _interactions.Add(new UIInteraction(sourceComponentId, source, target, @operator, value, whenTrue, whenFalse));
        return Self;
    }

    /// <summary>
    /// Adds an interaction triggered before this component's click event command.
    /// </summary>
    public TComponent InteractBeforeClick(UIProperty target, object? value)
        => InteractOn(EventNames.BeforeClick, target, value);

    /// <summary>
    /// Adds an interaction triggered before another component's click event command.
    /// </summary>
    public TComponent InteractBeforeClick(string sourceComponentId, UIProperty target, object? value)
        => InteractOn(sourceComponentId, EventNames.BeforeClick, target, value);

    /// <summary>
    /// Adds an interaction triggered after this component's click event command.
    /// </summary>
    public TComponent InteractAfterClick(UIProperty target, object? value)
        => InteractOn(EventNames.AfterClick, target, value);

    /// <summary>
    /// Adds an interaction triggered after another component's click event command.
    /// </summary>
    public TComponent InteractAfterClick(string sourceComponentId, UIProperty target, object? value)
        => InteractOn(sourceComponentId, EventNames.AfterClick, target, value);

    /// <summary>
    /// Adds an interaction triggered by this component's focus event.
    /// </summary>
    public TComponent InteractOnFocus(UIProperty target, object? value)
        => InteractOn(EventNames.Focus, target, value);

    /// <summary>
    /// Adds an interaction triggered by another component's focus event.
    /// </summary>
    public TComponent InteractOnFocus(string sourceComponentId, UIProperty target, object? value)
        => InteractOn(sourceComponentId, EventNames.Focus, target, value);

    /// <summary>
    /// Adds an interaction triggered by this component's blur event.
    /// </summary>
    public TComponent InteractOnBlur(UIProperty target, object? value)
        => InteractOn(EventNames.Blur, target, value);

    /// <summary>
    /// Adds an interaction triggered by another component's blur event.
    /// </summary>
    public TComponent InteractOnBlur(string sourceComponentId, UIProperty target, object? value)
        => InteractOn(sourceComponentId, EventNames.Blur, target, value);

    /// <summary>
    /// Adds an interaction triggered when the pointer enters this component.
    /// </summary>
    public TComponent InteractOnHoverStart(UIProperty target, object? value)
        => InteractOn(EventNames.HoverStart, target, value);

    /// <summary>
    /// Adds an interaction triggered when the pointer enters another component.
    /// </summary>
    public TComponent InteractOnHoverStart(string sourceComponentId, UIProperty target, object? value)
        => InteractOn(sourceComponentId, EventNames.HoverStart, target, value);

    /// <summary>
    /// Adds an interaction triggered when the pointer leaves this component.
    /// </summary>
    public TComponent InteractOnHoverEnd(UIProperty target, object? value)
        => InteractOn(EventNames.HoverEnd, target, value);

    /// <summary>
    /// Adds an interaction triggered when the pointer leaves another component.
    /// </summary>
    public TComponent InteractOnHoverEnd(string sourceComponentId, UIProperty target, object? value)
        => InteractOn(sourceComponentId, EventNames.HoverEnd, target, value);

    /// <summary>
    /// Adds an interaction triggered by this component's event.
    /// </summary>
    public TComponent InteractOn(string sourceEvent, UIProperty target, object? whenTriggered)
        => InteractOn(Id, sourceEvent, target, whenTriggered);

    /// <summary>
    /// Adds an interaction triggered by another component event.
    /// </summary>
    public TComponent InteractOn(string sourceComponentId, string sourceEvent, UIProperty target, object? whenTriggered)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sourceComponentId);
        ArgumentException.ThrowIfNullOrWhiteSpace(sourceEvent);

        EnsureBindingAllowed(target, UIBindingMode.OneWay);

        _interactions.Add(new UIInteraction(sourceComponentId, sourceEvent, target, whenTriggered));
        return Self;
    }

    /// <summary>
    /// Adds an interaction that runs a client effect when this component's event fires.
    /// </summary>
    public TComponent InteractOn(string sourceEvent, ClientEffect effect)
        => InteractOn(Id, sourceEvent, effect);

    /// <summary>
    /// Adds an interaction that runs a client effect when another component's event fires.
    /// </summary>
    public TComponent InteractOn(string sourceComponentId, string sourceEvent, ClientEffect effect)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sourceComponentId);
        ArgumentException.ThrowIfNullOrWhiteSpace(sourceEvent);
        ArgumentNullException.ThrowIfNull(effect);

        _interactions.Add(new UIInteraction(sourceComponentId, sourceEvent, effect));
        return Self;
    }

    /// <summary>
    /// Adds an interaction that runs a client effect while a local source property satisfies the comparison.
    /// </summary>
    public TComponent Interact(UIProperty source, ClientEffect effect, UIComparisonOperator @operator = UIComparisonOperator.Required, object? value = null)
        => Interact(Id, source, effect, @operator, value);

    /// <summary>
    /// Adds an interaction that runs a client effect while another component's property satisfies the comparison.
    /// </summary>
    public TComponent Interact(string sourceComponentId, UIProperty source, ClientEffect effect, UIComparisonOperator @operator = UIComparisonOperator.Required, object? value = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sourceComponentId);
        ArgumentNullException.ThrowIfNull(effect);

        _interactions.Add(new UIInteraction(sourceComponentId, source, effect, @operator, value));
        return Self;
    }

    /// <summary>
    /// Registers or replaces an event command.
    /// </summary>
    public TComponent On(string eventName, string command)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(eventName);
        ArgumentException.ThrowIfNullOrWhiteSpace(command);

        AddOrReplaceEvent(new UIEvent(eventName, new UIAction(command)));
        return Self;
    }

    private void AddOrReplaceEvent(UIEvent uiEvent)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(uiEvent.Name);
        ArgumentNullException.ThrowIfNull(uiEvent.Action);

        if (_eventIndexes.TryGetValue(uiEvent.Name, out var existingIndex))
        {
            _events[existingIndex] = uiEvent;
            return;
        }

        _eventIndexes.Add(uiEvent.Name, _events.Count);
        _events.Add(uiEvent);
    }

    /// <summary>
    /// Registers or replaces an event command with action arguments.
    /// </summary>
    public TComponent On(string eventName, string command, params KeyValuePair<string, UIActionArgument>[] arguments)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(eventName);
        ArgumentException.ThrowIfNullOrWhiteSpace(command);
        ArgumentNullException.ThrowIfNull(arguments);

        Dictionary<string, UIActionArgument> mapped = new(StringComparer.Ordinal);

        for (var i = 0; i < arguments.Length; i++)
        {
            KeyValuePair<string, UIActionArgument> pair = arguments[i];

            ArgumentException.ThrowIfNullOrWhiteSpace(pair.Key);

            if (!mapped.TryAdd(pair.Key, pair.Value))
                throw new InvalidOperationException($"Event argument '{pair.Key}' is already registered.");
        }

        AddOrReplaceEvent(new UIEvent(eventName, new UIAction(command, mapped)));
        return Self;
    }

    /// <summary>
    /// Registers or replaces an event command with literal action arguments.
    /// </summary>
    public TComponent OnLiteral(string eventName, string command, params KeyValuePair<string, object?>[] arguments)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(eventName);
        ArgumentException.ThrowIfNullOrWhiteSpace(command);
        ArgumentNullException.ThrowIfNull(arguments);

        Dictionary<string, UIActionArgument> mapped = new(StringComparer.Ordinal);

        for (var i = 0; i < arguments.Length; i++)
        {
            KeyValuePair<string, object?> pair = arguments[i];

            ArgumentException.ThrowIfNullOrWhiteSpace(pair.Key);

            if (!mapped.TryAdd(pair.Key, UIActionArgument.Literal(pair.Value)))
                throw new InvalidOperationException($"Event argument '{pair.Key}' is already registered.");
        }

        AddOrReplaceEvent(new UIEvent(eventName, new UIAction(command, mapped)));
        return Self;
    }

    /// <summary>
    /// Returns a string containing the component's type name, type key and id, for debugging.
    /// </summary>
    public override string ToString()
        => $"{GetType().Name}({TypeKey}, {Id})";
}
