using System;
using System.Collections.Generic;
using System.Diagnostics;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Actions;

/// <summary>
/// A horizontal or vertical bar of button items, typically used for toolbars and action rows.
/// </summary>
public abstract partial class CommandBarComponent<T> : ItemsComponentBase<T, IButtonModel>
    where T : CommandBarComponent<T>, IUIComponentDefinition
{
    private static readonly UIResponsive<double> DefaultSpacing = 0d;

    /// <summary>
    /// Gets or sets the layout direction of the command bar's items.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIOrientation.Horizontal)]
    public UIOrientation? Orientation { get; set; }

    /// <summary>
    /// Gets or sets whether items wrap onto additional lines instead of overflowing.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? Wrap { get; set; }

    /// <summary>
    /// Gets or sets the spacing between items, optionally overridden per breakpoint.
    /// </summary>
    [UIComponentProperty(DefaultValueMember = nameof(DefaultSpacing))]
    public UIResponsive<double>? Spacing { get; set; }

    /// <summary>
    /// Gets the button template used to render each item.
    /// </summary>
    public virtual IButtonComponent? ItemTemplate => Template as IButtonComponent;

    /// <summary>
    /// Initializes the command bar with its default button item template.
    /// </summary>
    protected CommandBarComponent(string? id = null) : base(id)
    {
        _ = base.SetTemplate(new DefaultButtonTemplate(binds: true));
    }

    /// <summary>
    /// Sets the button template used to render each item.
    /// </summary>
    public virtual T SetItemTemplate(IButtonComponent visualTemplate)
        => base.SetTemplate(visualTemplate);

    /// <summary>
    /// Sets the item template, throwing if <paramref name="visualTemplate"/> is not an <see cref="IButtonComponent"/>.
    /// </summary>
    public override T SetTemplate(IVisualComponent visualTemplate)
        => visualTemplate is not IButtonComponent
            ? throw new InvalidOperationException($"Only {nameof(IButtonComponent)} is supported.")
            : base.SetTemplate(visualTemplate);

    /// <summary>
    /// Adds a named template variant, throwing if <paramref name="visualTemplate"/> is not an <see cref="IButtonComponent"/>.
    /// </summary>
    public override T AddTemplateVariant(string key, IVisualComponent visualTemplate)
        => visualTemplate is not IButtonComponent
            ? throw new InvalidOperationException($"Only {nameof(IButtonComponent)} is supported.")
            : base.AddTemplateVariant(key, visualTemplate);

    /// <summary>
    /// Registers an item click command that passes the current item as an argument.
    /// </summary>
    public T OnItemClickWithItem(string command, string argumentName = "item")
        => OnItemClick(command, UIAction.ArgCurrentItem(argumentName));
    /// <summary>
    /// Registers an item click command that passes the current item's key as an argument.
    /// </summary>
    public T OnItemClickWithItemKey(string command, string argumentName = "id")
        => OnItemClick(command, UIAction.ArgCurrentItemKey(argumentName));

    /// <summary>
    /// Registers an item click command that passes a bound value at <paramref name="path"/> as an argument.
    /// </summary>
    public T OnItemClickWithBinding(string command, string argumentName, string path, UIBindingScope scope = UIBindingScope.Relative)
        => OnItemClick(command, UIAction.ArgBinding(argumentName, path, scope));
    /// <summary>
    /// Registers an item click command that passes a bound value at <paramref name="path"/> as an argument.
    /// </summary>
    public T OnItemClickWithBinding(string command, string argumentName, RecursivePath path, UIBindingScope scope = UIBindingScope.Relative)
        => OnItemClick(command, UIAction.ArgBinding(argumentName, path, scope));
    /// <summary>
    /// Registers an item click command that passes a value relative to the current item as an argument.
    /// </summary>
    public T OnItemClickWithRelative(string command, string argumentName, string path)
        => OnItemClick(command, UIAction.ArgRelative(argumentName, path));

    /// <summary>
    /// Registers an item click command that passes a value from the parent scope as an argument.
    /// </summary>
    public T OnItemClickWithParent(string command, string argumentName, string path)
        => OnItemClick(command, UIAction.ArgParent(argumentName, path));
    /// <summary>
    /// Registers an item click command that passes a value from the root scope as an argument.
    /// </summary>
    public T OnItemClickWithRoot(string command, string argumentName, string path)
        => OnItemClick(command, UIAction.ArgRoot(argumentName, path));
    /// <summary>
    /// Registers an item click command that passes a literal value as an argument.
    /// </summary>
    public T OnItemClickWithLiteral(string command, string argumentName, object? value)
        => OnItemClick(command, UIAction.Arg(argumentName, value));

    /// <summary>
    /// Registers an item click command with an argument derived from the specified <paramref name="argumentKind"/>.
    /// </summary>
    public T OnItemClickWith(string command, string argumentName, UIActionArgumentKind argumentKind)
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

        return OnItemClick(command, argument);
    }

    /// <summary>
    /// Registers a click command invoked when an item is clicked.
    /// </summary>
    public T OnItemClick(string command)
    {
        _ = GetRequiredItemTemplate().OnClick(command);
        return Self;
    }

    /// <summary>
    /// Registers a click command invoked when an item is clicked, with UI action arguments.
    /// </summary>
    public T OnItemClick(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
    {
        _ = GetRequiredItemTemplate().OnClick(command, arguments);
        return Self;
    }

    /// <summary>
    /// Registers a click command invoked when an item is clicked, with literal argument values.
    /// </summary>
    public T OnItemClickLiteral(string command, params KeyValuePair<string, object?>[] arguments)
    {
        _ = GetRequiredItemTemplate().OnClickLiteral(command, arguments);
        return Self;
    }

    /// <summary>
    /// Gets the item template as an <see cref="IButtonComponent"/>, throwing if it does not implement it.
    /// </summary>
    private IButtonComponent GetRequiredItemTemplate()
        => ItemTemplate is IButtonComponent buttonTemplate
            ? buttonTemplate
            : throw new InvalidOperationException($"The item template of '{TypeKey}' must inherit from '{nameof(IButtonComponent)}' to configure item click actions.");
}

/// <summary>
/// A horizontal or vertical bar of button items, typically used for toolbars and action rows.
/// </summary>
public sealed class CommandBarComponent(string? id = null) : CommandBarComponent<CommandBarComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.command-bar";
}
