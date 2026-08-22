using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Regions;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Actions;

/// <summary>
/// A clickable bordered region that invokes UI commands and hosts text/icon content.
/// </summary>
public abstract partial class ButtonComponent<T> : BorderedRegionComponentBase<T>, IButtonComponent
    where T : ButtonComponent<T>, IUIComponentDefinition
{
    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IButtonComponent), DefaultValue = UIButtonType.Primary)]
    public UIButtonType? Type { get; set; }

    /// <summary>
    /// Gets the id of the form this button submits, scoping which Submit-trigger validation rules run
    /// (and can block dispatch) before the click command fires. Set via <see cref="OnSubmit(string, string)"/>.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public string? SubmitFormId { get; set; }

    /// <inheritdoc/>
    public override ITextComponent? Content => base.Content as ITextComponent;

    /// <summary>
    /// Initializes the button with a centered alignment and its default content region.
    /// </summary>
    protected ButtonComponent(string? id = null) : base(id)
    {
        HorizontalAlignment = UIAlignment.Center;
        VerticalAlignment = UIAlignment.Center;

        _ = SetContent(new ButtonContentRegion());
    }

    /// <summary>
    /// Configures the default button content region.
    /// </summary>
    public T ConfigureDefaultContent(Action<ButtonContentRegion> configure)
    {
        ArgumentNullException.ThrowIfNull(configure);

        if (base.Content is not ButtonContentRegion content)
            throw new InvalidOperationException($"Only {nameof(ButtonContentRegion)} content is supported.");

        configure(content);
        return Self;
    }

    /// <summary>
    /// Sets the button content.
    /// </summary>
    public T SetContent(ITextComponent content)
        => base.SetContent(content);

    /// <summary>
    /// Sets the button content, throwing if <paramref name="content"/> is not an <see cref="ITextComponent"/>.
    /// </summary>
    public override T SetContent(IVisualComponent content)
        => content is not ITextComponent
            ? throw new InvalidOperationException($"Only {nameof(ITextComponent)} is supported.")
            : base.SetContent(content);

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
