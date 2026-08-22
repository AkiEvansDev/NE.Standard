using System;
using System.Collections.Generic;
using System.Diagnostics;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Interaction;

namespace NE.Standard.UI.Components.BuiltIns.Contents;

/// <summary>
/// A list of key/value rows, each with an optional trailing action, e.g. a settings or detail list.
/// </summary>
public abstract partial class KeyValueActionComponent<T> : ItemsComponentBase<T, IKeyValueActionModel>
    where T : KeyValueActionComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets whether separator lines are shown between rows.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    public bool? ShowRowSeparators { get; set; }

    /// <summary>
    /// Gets or sets whether the value column stretches to fill the remaining row width.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    public bool? StretchValue { get; set; }

    /// <summary>
    /// Gets or sets whether the action column is shown.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    public bool? ShowActions { get; set; }

    /// <summary>
    /// Whether the whole list renders inside a card-like outline — on by default, matching
    /// <see cref="ShowRowSeparators"/>/<see cref="StretchValue"/>/<see cref="ShowActions"/>'s idiom.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    public bool? ShowBorder { get; set; }

    /// <summary>
    /// Whether rows highlight on hover — a purely presentational opt-in, matching the same idiom as
    /// <c>CardComponent.Clickable</c>, independent of whether <see cref="OnRowClick(string)"/> is
    /// actually wired.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? RowHoverable { get; set; }

    /// <summary>
    /// Gets the template used to render each row's key content.
    /// </summary>
    public ITextComponent? KeyTemplate => GetTemplateVariant(TemplateNames.Key) as ITextComponent;
    /// <summary>
    /// Gets the template used to render each row's value content.
    /// </summary>
    public ITextComponent? ValueTemplate => GetTemplateVariant(TemplateNames.Value) as ITextComponent;
    /// <summary>
    /// Gets the template used to render each row's action content.
    /// </summary>
    public IButtonComponent? ActionTemplate => GetTemplateVariant(TemplateNames.Action) as IButtonComponent;
    /// <summary>
    /// Gets the template used to render each row's overall layout.
    /// </summary>
    public DefaultRowTemplate? RowTemplate => GetTemplateVariant(TemplateNames.Row) as DefaultRowTemplate;

    /// <summary>
    /// Initializes the component with its default key, value, action and row templates.
    /// </summary>
    protected KeyValueActionComponent(string? id = null) : base(id)
    {
        _ = SetKeyTemplate(new DefaultKeyTemplate(binds: true));
        _ = SetValueTemplate(new DefaultValueTemplate(binds: true));
        _ = SetActionTemplate(new DefaultActionTemplate(binds: true));
        _ = SetRowTemplate(new DefaultRowTemplate());
    }

    /// <summary>
    /// Configures the default key template.
    /// </summary>
    public T ConfigureDefaultKeyTemplate(Action<DefaultKeyTemplate> configure)
    {
        ArgumentNullException.ThrowIfNull(configure);

        if (KeyTemplate is not DefaultKeyTemplate template)
            throw new InvalidOperationException($"Only {nameof(DefaultKeyTemplate)} template is supported.");

        configure(template);
        return Self;
    }

    /// <summary>
    /// Configures the default value template.
    /// </summary>
    public T ConfigureDefaultValueTemplate(Action<DefaultValueTemplate> configure)
    {
        ArgumentNullException.ThrowIfNull(configure);

        if (ValueTemplate is not DefaultValueTemplate template)
            throw new InvalidOperationException($"Only {nameof(DefaultValueTemplate)} template is supported.");

        configure(template);
        return Self;
    }

    /// <summary>
    /// Configures the default action template.
    /// </summary>
    public T ConfigureDefaultActionTemplate(Action<DefaultActionTemplate> configure)
    {
        ArgumentNullException.ThrowIfNull(configure);

        if (ActionTemplate is not DefaultActionTemplate template)
            throw new InvalidOperationException($"Only {nameof(DefaultActionTemplate)} template is supported.");

        configure(template);
        return Self;
    }

    /// <summary>
    /// Sets the key template.
    /// </summary>
    public T SetKeyTemplate(ITextComponent template)
        => base.AddTemplateVariant(TemplateNames.Key, template);
    /// <summary>
    /// Sets the value template.
    /// </summary>
    public T SetValueTemplate(ITextComponent template)
        => base.AddTemplateVariant(TemplateNames.Value, template);
    /// <summary>
    /// Sets the action template.
    /// </summary>
    public T SetActionTemplate(IButtonComponent template)
        => base.AddTemplateVariant(TemplateNames.Action, template);
    /// <summary>
    /// Sets the row template.
    /// </summary>
    public T SetRowTemplate(DefaultRowTemplate template)
        => base.AddTemplateVariant(TemplateNames.Row, template);

    /// <summary>
    /// Not supported; use <see cref="SetKeyTemplate"/>, <see cref="SetValueTemplate"/> or <see cref="SetActionTemplate"/> instead.
    /// </summary>
    public override T SetTemplate(IVisualComponent visualTemplate)
        => throw new InvalidOperationException($"Use {nameof(SetKeyTemplate)}, {nameof(SetValueTemplate)} or {nameof(SetActionTemplate)}.");
    /// <summary>
    /// Not supported; use <see cref="SetKeyTemplate"/>, <see cref="SetValueTemplate"/> or <see cref="SetActionTemplate"/> instead.
    /// </summary>
    public override T AddTemplateVariant(string key, IVisualComponent visualTemplate)
        => throw new InvalidOperationException($"Use {nameof(SetKeyTemplate)}, {nameof(SetValueTemplate)} or {nameof(SetActionTemplate)}.");

    /// <summary>
    /// Registers an action click command that passes the current item as an argument.
    /// </summary>
    public T OnActionClickWithItem(string command, string argumentName = "item")
        => OnActionClick(command, UIAction.ArgCurrentItem(argumentName));
    /// <summary>
    /// Registers an action click command that passes the current item's key as an argument.
    /// </summary>
    public T OnActionClickWithItemKey(string command, string argumentName = "id")
        => OnActionClick(command, UIAction.ArgCurrentItemKey(argumentName));
    /// <summary>
    /// Registers an action click command that passes a bound value at <paramref name="path"/> as an argument.
    /// </summary>
    public T OnActionClickWithBinding(string command, string argumentName, string path, UIBindingScope scope = UIBindingScope.Relative)
        => OnActionClick(command, UIAction.ArgBinding(argumentName, path, scope));
    /// <summary>
    /// Registers an action click command that passes a bound value at <paramref name="path"/> as an argument.
    /// </summary>
    public T OnActionClickWithBinding(string command, string argumentName, RecursivePath path, UIBindingScope scope = UIBindingScope.Relative)
        => OnActionClick(command, UIAction.ArgBinding(argumentName, path, scope));
    /// <summary>
    /// Registers an action click command that passes a value relative to the current item as an argument.
    /// </summary>
    public T OnActionClickWithRelative(string command, string argumentName, string path)
        => OnActionClick(command, UIAction.ArgRelative(argumentName, path));

    /// <summary>
    /// Registers an action click command that passes a value from the parent scope as an argument.
    /// </summary>
    public T OnActionClickWithParent(string command, string argumentName, string path)
        => OnActionClick(command, UIAction.ArgParent(argumentName, path));
    /// <summary>
    /// Registers an action click command that passes a value from the root scope as an argument.
    /// </summary>
    public T OnActionClickWithRoot(string command, string argumentName, string path)
        => OnActionClick(command, UIAction.ArgRoot(argumentName, path));
    /// <summary>
    /// Registers an action click command that passes a literal value as an argument.
    /// </summary>
    public T OnActionClickWithLiteral(string command, string argumentName, object? value)
        => OnActionClick(command, UIAction.Arg(argumentName, value));

    /// <summary>
    /// Registers an action click command with an argument derived from the specified <paramref name="argumentKind"/>.
    /// </summary>
    public T OnActionClickWith(string command, string argumentName, UIActionArgumentKind argumentKind)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(command);
        ArgumentException.ThrowIfNullOrWhiteSpace(argumentName);

        KeyValuePair<string, UIActionArgument> argument = argumentKind switch
        {
            UIActionArgumentKind.CurrentItem => UIAction.ArgCurrentItem(argumentName),
            UIActionArgumentKind.CurrentItemKey => UIAction.ArgCurrentItemKey(argumentName),
            UIActionArgumentKind.Literal or UIActionArgumentKind.Binding => throw new ArgumentOutOfRangeException(nameof(argumentKind), argumentKind, $"Only '{nameof(UIActionArgumentKind.CurrentItem)}' and '{nameof(UIActionArgumentKind.CurrentItemKey)}' are supported by this overload."),
            _ => throw new UnreachableException()
        };

        return OnActionClick(command, argument);
    }

    /// <summary>
    /// Registers a click command invoked when a row's action is clicked.
    /// </summary>
    public T OnActionClick(string command)
    {
        _ = GetRequiredActionTemplate().OnClick(command);
        return Self;
    }

    /// <summary>
    /// Registers a click command invoked when a row's action is clicked, with UI action arguments.
    /// </summary>
    public T OnActionClick(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
    {
        _ = GetRequiredActionTemplate().OnClick(command, arguments);
        return Self;
    }

    /// <summary>
    /// Registers a click command invoked when a row's action is clicked, with literal argument values.
    /// </summary>
    public T OnActionClickLiteral(string command, params KeyValuePair<string, object?>[] arguments)
    {
        _ = GetRequiredActionTemplate().OnClickLiteral(command, arguments);
        return Self;
    }

    /// <summary>
    /// Gets the action template as an <see cref="IButtonComponent"/>, throwing if it does not implement it.
    /// </summary>
    private IButtonComponent GetRequiredActionTemplate()
        => ActionTemplate is IButtonComponent buttonTemplate
            ? buttonTemplate
            : throw new InvalidOperationException($"The action template of '{TypeKey}' must inherit from '{nameof(IButtonComponent)}' to configure item click actions.");

    /// <summary>
    /// Registers a row click command that passes the current item as an argument.
    /// </summary>
    public T OnRowClickWithItem(string command, string argumentName = "item")
        => OnRowClick(command, UIAction.ArgCurrentItem(argumentName));
    /// <summary>
    /// Registers a row click command that passes the current item's key as an argument.
    /// </summary>
    public T OnRowClickWithItemKey(string command, string argumentName = "id")
        => OnRowClick(command, UIAction.ArgCurrentItemKey(argumentName));
    /// <summary>
    /// Registers a row click command that passes a bound value at <paramref name="path"/> as an argument.
    /// </summary>
    public T OnRowClickWithBinding(string command, string argumentName, string path, UIBindingScope scope = UIBindingScope.Relative)
        => OnRowClick(command, UIAction.ArgBinding(argumentName, path, scope));
    /// <summary>
    /// Registers a row click command that passes a bound value at <paramref name="path"/> as an argument.
    /// </summary>
    public T OnRowClickWithBinding(string command, string argumentName, RecursivePath path, UIBindingScope scope = UIBindingScope.Relative)
        => OnRowClick(command, UIAction.ArgBinding(argumentName, path, scope));
    /// <summary>
    /// Registers a row click command that passes a value relative to the current item as an argument.
    /// </summary>
    public T OnRowClickWithRelative(string command, string argumentName, string path)
        => OnRowClick(command, UIAction.ArgRelative(argumentName, path));

    /// <summary>
    /// Registers a row click command that passes a value from the parent scope as an argument.
    /// </summary>
    public T OnRowClickWithParent(string command, string argumentName, string path)
        => OnRowClick(command, UIAction.ArgParent(argumentName, path));
    /// <summary>
    /// Registers a row click command that passes a value from the root scope as an argument.
    /// </summary>
    public T OnRowClickWithRoot(string command, string argumentName, string path)
        => OnRowClick(command, UIAction.ArgRoot(argumentName, path));
    /// <summary>
    /// Registers a row click command that passes a literal value as an argument.
    /// </summary>
    public T OnRowClickWithLiteral(string command, string argumentName, object? value)
        => OnRowClick(command, UIAction.Arg(argumentName, value));

    /// <summary>
    /// Registers a click command invoked when a row is clicked.
    /// </summary>
    public T OnRowClick(string command)
    {
        _ = GetRequiredRowTemplate().OnClick(command);
        return Self;
    }

    /// <summary>
    /// Registers a click command invoked when a row is clicked, with UI action arguments.
    /// </summary>
    public T OnRowClick(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
    {
        _ = GetRequiredRowTemplate().OnClick(command, arguments);
        return Self;
    }

    /// <summary>
    /// Registers a click command invoked when a row is clicked, with literal argument values.
    /// </summary>
    public T OnRowClickLiteral(string command, params KeyValuePair<string, object?>[] arguments)
    {
        _ = GetRequiredRowTemplate().OnClickLiteral(command, arguments);
        return Self;
    }

    /// <summary>
    /// Gets the row template, throwing if it is not configured.
    /// </summary>
    private DefaultRowTemplate GetRequiredRowTemplate()
        => RowTemplate ?? throw new InvalidOperationException($"The row template of '{TypeKey}' is not configured.");
}

/// <summary>
/// A list of key/value rows, each with an optional trailing action, e.g. a settings or detail list.
/// </summary>
public sealed class KeyValueActionComponent(string? id = null) : KeyValueActionComponent<KeyValueActionComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.key-value-action";
}
