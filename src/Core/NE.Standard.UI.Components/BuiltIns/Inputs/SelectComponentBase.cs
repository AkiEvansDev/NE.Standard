using System;
using System.Collections.Generic;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A field that opens a list of options: the field's chrome and the list's templates, whatever the value made of the options is.
/// </summary>
/// <remarks><see cref="SelectComponent{T, TItem}"/> holds one key and <see cref="MultiSelectComponent{T, TItem}"/> a list of them.</remarks>
[UIComponentPropertyBlock(typeof(IBorderedComponent))]
[UIComponentPropertyBlock(typeof(IAffixedInputComponent))]
[UIComponentPropertyBlock(typeof(IPlaceholderInputComponent))]
[UIComponentPropertyBlock(typeof(IPopupPlacementComponent))]
[UIComponentPropertyBlock(typeof(IClearableInputComponent))]
public abstract partial class SelectComponentBase<T, TItem, TValue> : OptionsInputComponentBase<T, TItem, TValue>, IBorderedComponent, IAffixedInputComponent, IPlaceholderInputComponent, IPopupPlacementComponent, IClearableInputComponent, IRegionContainerComponent
    where T : SelectComponentBase<T, TItem, TValue>, IUIComponentDefinition
    where TItem : class, IOptionModel
{
    private readonly FieldActions _actions = new();

    /// <summary>
    /// Gets the first control at the end of the field — a copy, a create, a look-up, or a split button with a menu of them.
    /// </summary>
    public IButtonComponent? TrailingAction => _actions.Trailing.Count > 0 ? _actions.Trailing[0] : null;

    /// <summary>
    /// Gets the controls at the start of the field, in the order they stand; a flyout among them by the button it opens from.
    /// </summary>
    public IReadOnlyList<IButtonComponent> LeadingActions => _actions.Leading;

    /// <summary>
    /// Gets the controls at the end of the field, in the order they stand; a flyout among them by the button it opens from.
    /// </summary>
    public IReadOnlyList<IButtonComponent> TrailingActions => _actions.Trailing;

    /// <inheritdoc/>
    public IReadOnlyDictionary<string, IVisualComponent> Regions => _actions.Regions;

    /// <inheritdoc/>
    public bool HasRegions => _actions.Regions.Count > 0;

    /// <summary>
    /// Gets or sets whether the field draws the mark that says it opens a list.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    public bool? ShowChevron { get; set; }

    /// <summary>
    /// Initializes the input with the default item, empty and group templates.
    /// </summary>
    protected SelectComponentBase(string? id = null) : base(id)
    {
        SetDefaultTemplate(CreateOptionTemplate());
        SetDefaultEmptyTemplate(new DefaultEmptyTemplate());
        SetDefaultGroupTemplate(new DefaultGroupTemplate(binds: true));
    }

    /// <summary>
    /// A new default option template: a list row's.
    /// </summary>
    protected static DefaultTextTemplate CreateOptionTemplate()
        // Content, not Title: an option is a list row, so its glyph stands for both lines.
        => new DefaultTextTemplate(binds: true).SetIconAlignment(UITextIconAlignment.Content);

    /// <summary>
    /// Puts a button at the end of the field, in place of any there before; the field lays it in and dresses it as an adornment.
    /// </summary>
    public T SetTrailingAction(IButtonComponent action)
    {
        ValidateActionSupported(nameof(action));
        _actions.SetTrailing(action);
        return Self;
    }

    /// <summary>
    /// Puts a flyout at the end of the field, in place of any action there before: its anchor, a button, dressed as an adornment, and
    /// its content opening from it.
    /// </summary>
    public T SetTrailingAction(FlyoutComponent flyout)
    {
        ValidateActionSupported(nameof(flyout));
        _actions.SetTrailing(flyout);
        return Self;
    }

    /// <summary>
    /// Puts a button-variant multi-select at the end of the field, in place of any action there before.
    /// </summary>
    public T SetTrailingAction(IMultiSelectComponent select)
    {
        ValidateActionSupported(nameof(select));
        _actions.SetTrailing(select);
        return Self;
    }

    /// <summary>
    /// Adds a button at the start of the field, after those added before; the field dresses it as an adornment.
    /// </summary>
    public T AddLeadingAction(IButtonComponent action)
    {
        ValidateActionSupported(nameof(action));
        _actions.AddLeading(action, inField: false);
        return Self;
    }

    /// <summary>
    /// Adds a flyout at the start of the field, after the actions added before: its anchor, a button, dressed as an adornment, and its
    /// content opening from it.
    /// </summary>
    public T AddLeadingAction(FlyoutComponent flyout)
    {
        ValidateActionSupported(nameof(flyout));
        _actions.AddLeading(flyout, inField: false);
        return Self;
    }

    /// <summary>
    /// Adds a button-variant multi-select at the start of the field, after the actions added before.
    /// </summary>
    public T AddLeadingAction(IMultiSelectComponent select)
    {
        ValidateActionSupported(nameof(select));
        _actions.AddLeading(select, inField: false);
        return Self;
    }

    /// <summary>
    /// Adds a button at the end of the field, after those added before; the field dresses it as an adornment.
    /// </summary>
    public T AddTrailingAction(IButtonComponent action)
    {
        ValidateActionSupported(nameof(action));
        _actions.AddTrailing(action, inField: false);
        return Self;
    }

    /// <summary>
    /// Adds a flyout at the end of the field, after the actions added before: its anchor, a button, dressed as an adornment, and its
    /// content opening from it.
    /// </summary>
    public T AddTrailingAction(FlyoutComponent flyout)
    {
        ValidateActionSupported(nameof(flyout));
        _actions.AddTrailing(flyout, inField: false);
        return Self;
    }

    /// <summary>
    /// Adds a button-variant multi-select at the end of the field, after the actions added before.
    /// </summary>
    public T AddTrailingAction(IMultiSelectComponent select)
    {
        ValidateActionSupported(nameof(select));
        _actions.AddTrailing(select, inField: false);
        return Self;
    }

    /// <summary>
    /// Checks whether the input's current configuration allows a field action to be added.
    /// </summary>
    protected virtual void ValidateActionSupported(string parameterName)
    {
    }

    /// <summary>
    /// Configures the built-in default group template, throwing if a different template has been set.
    /// </summary>
    public T ConfigureDefaultGroupTemplate(Action<DefaultGroupTemplate> configure)
    {
        T result = Self.ConfigureTemplate(GroupTemplate as DefaultGroupTemplate, configure, "template");
        MarkGroupTemplateAuthored();
        return result;
    }

    /// <inheritdoc/>
    protected override Action? SnapshotAuthoredState()
    {
        Action? restoreBase = base.SnapshotAuthoredState();
        Action? restoreActions = _actions.SnapshotAuthoredState();

        if (restoreBase is null)
            return restoreActions;

        if (restoreActions is null)
            return restoreBase;

        return () =>
        {
            restoreBase();
            restoreActions();
        };
    }
}
