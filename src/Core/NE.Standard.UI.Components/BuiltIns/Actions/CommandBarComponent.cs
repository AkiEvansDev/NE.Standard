using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Actions;

/// <summary>
/// A horizontal or vertical bar of button items, typically used for toolbars and action rows.
/// </summary>
/// <remarks>Items carrying a <c>Group</c> are set apart by <see cref="GroupSeparator"/>; groups keep the order of their first item.</remarks>
public abstract partial class CommandBarComponent<T> : GroupedItemsComponentBase<T, IButtonModel, IButtonComponent>
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
    /// Gets or sets what is drawn between two groups of items — nothing, a step of air, or a hairline.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIGroupSeparator.None)]
    public UIGroupSeparator? GroupSeparator { get; set; }

    /// <summary>
    /// Initializes the command bar with its default button item template.
    /// </summary>
    protected CommandBarComponent(string? id = null) : base(id)
    {
        _ = SetTemplate(new DefaultButtonTemplate(binds: true));

        // A boundary, not a heading: the stylesheet draws the separator on the header's box and shows no content.
        _ = SetGroupTemplate(new DefaultGroupTemplate(binds: false));
    }

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
    /// Registers an item click command with an argument derived from the specified <paramref name="argumentKind"/>.
    /// </summary>
    public T OnItemClickWith(string command, string argumentName, UIActionArgumentKind argumentKind)
        => OnItemClick(command, UIAction.ArgCurrent(argumentKind, argumentName));

    /// <summary>
    /// Registers a click command invoked when an item is clicked.
    /// </summary>
    public T OnItemClick(string command)
    {
        _ = RequiredTemplate.OnClick(command);
        return Self;
    }

    /// <summary>
    /// Registers a click command invoked when an item is clicked, with UI action arguments.
    /// </summary>
    public T OnItemClick(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
    {
        _ = RequiredTemplate.OnClick(command, arguments);
        return Self;
    }

    /// <summary>
    /// Registers a click command invoked when an item is clicked, with literal argument values.
    /// </summary>
    public T OnItemClickLiteral(string command, params KeyValuePair<string, object?>[] arguments)
    {
        _ = RequiredTemplate.OnClickLiteral(command, arguments);
        return Self;
    }
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
