using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Actions;

/// <summary>
/// A clickable bordered region that invokes UI commands and hosts text/icon content.
/// </summary>
[UIComponentPropertyBlock(typeof(ISurfaceComponent))]
[UIComponentPropertyBlock(typeof(IBorderedComponent))]
[UIComponentPropertyBlock(typeof(IOverflowComponent))]
[UIComponentPropertyBlock(typeof(ITextComponent))]
[UIComponentPropertyBlock(typeof(ITextMarkAlignmentComponent))]
public abstract partial class ButtonComponent<T> : VisualComponentBase<T>, IButtonComponent, ISurfaceComponent, IBorderedComponent, IOverflowComponent, ITextComponent, ITextMarkAlignmentComponent
    where T : ButtonComponent<T>, IUIComponentDefinition
{
    // Declared as registered defaults, not set in the constructor, so tooling reads the value a button wears.
    private static readonly UIThemeColor DefaultIconColor = UIThemeColor.Default;
    private static readonly UITextAppearance DefaultTitleType = UITextAppearance.Body;
    private static readonly UITextAppearance DefaultDescriptionType = UITextAppearance.Caption;

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IButtonComponent), DefaultValue = UIButtonType.Primary)]
    public UIButtonType? Type { get; set; }

    /// <inheritdoc/>
    /// <remarks><c>Default</c> resolves to <c>color: inherit</c>, so the glyph follows the button's contrast colour.</remarks>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValueMember = nameof(DefaultIconColor))]
    public UIThemeColor? IconColor { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValueMember = nameof(DefaultTitleType))]
    public UITextAppearance? TitleType { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = UITextBadgePlacement.Trailing)]
    public UITextBadgePlacement? BadgePlacement { get; set; }

    /// <inheritdoc/>
    /// <remarks>A button's label is a control's caption, not content: a press must not start a selection.</remarks>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = false)]
    public bool? Selectable { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ITextComponent), DefaultValueMember = nameof(DefaultDescriptionType))]
    public UITextAppearance? DescriptionType { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IButtonComponent), DefaultValue = UIButtonSize.Medium)]
    public UIButtonSize? Size { get; set; }

    /// <summary>
    /// Gets the id of the form this button submits, scoping the Submit-trigger validation that runs before the click command.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public string? SubmitFormId { get; set; }

    /// <summary>
    /// Initializes the button centred, with the in-control label defaults.
    /// </summary>
    protected ButtonComponent(string? id = null) : base(id)
    {
        HorizontalAlignment = UIAlignment.Center;
        VerticalAlignment = UIAlignment.Center;
    }

    /// <summary>
    /// Runs the command on a click and shows the button waiting for exactly the round trip: two client interactions on
    /// <c>Loading</c>, one before the dispatch and one after the result, nothing bound and nothing for a controller to clear.
    /// </summary>
    public T OnClickWithLoading(string command)
        => OnClick(command)
            .InteractBeforeClick(IVisualComponent.LoadingProperty, true)
            .InteractAfterClick(IVisualComponent.LoadingProperty, false);

    IButtonComponent IButtonComponent.OnClick(string command)
        => OnClick(command);
    IButtonComponent IButtonComponent.OnClick(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => OnClick(command, arguments);
    IButtonComponent IButtonComponent.OnClickLiteral(string command, params KeyValuePair<string, object?>[] arguments)
        => OnClickLiteral(command, arguments);

    /// <summary>
    /// Registers a click handler that invokes the specified command.
    /// </summary>
    public T OnClick(string command)
        => On(EventNames.Click, command);
    /// <summary>
    /// Registers a click handler that invokes the specified command with UI action arguments.
    /// </summary>
    public T OnClick(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => On(EventNames.Click, command, arguments);
    /// <summary>
    /// Registers a click handler that invokes the specified command with literal argument values.
    /// </summary>
    public T OnClickLiteral(string command, params KeyValuePair<string, object?>[] arguments)
        => OnLiteral(EventNames.Click, command, arguments);

    /// <summary>
    /// Registers a click command that first runs Submit-trigger validation for every input sharing
    /// <paramref name="formId"/>, dispatching the command only if all of them pass.
    /// </summary>
    public T OnSubmit(string formId, string command)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(formId);
        SubmitFormId = formId;
        return OnClick(command);
    }

    /// <inheritdoc cref="OnSubmit(string, string)"/>
    public T OnSubmit(string formId, string command, params KeyValuePair<string, UIActionArgument>[] arguments)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(formId);
        SubmitFormId = formId;
        return OnClick(command, arguments);
    }

    /// <inheritdoc cref="OnSubmit(string, string)"/>
    public T OnSubmitLiteral(string formId, string command, params KeyValuePair<string, object?>[] arguments)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(formId);
        SubmitFormId = formId;
        return OnClickLiteral(command, arguments);
    }
}

/// <summary>
/// A clickable bordered region that invokes UI commands and hosts text/icon content.
/// </summary>
public sealed class ButtonComponent(string? id = null) : ButtonComponent<ButtonComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.button";
}
