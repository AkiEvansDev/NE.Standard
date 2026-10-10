using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Actions;

/// <summary>
/// A horizontal or vertical bar of button items, typically used for toolbars and action rows.
/// </summary>
/// <remarks>Items carrying a <c>Group</c> are set apart by <see cref="GroupSeparator"/>; groups keep the order of their first item.</remarks>
public abstract partial class CommandBarComponent<T> : GroupedItemsComponentBase<T, IButtonModel, IButtonComponent>, IItemClickComponent
    where T : CommandBarComponent<T>, IUIComponentDefinition
{
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
    /// <remarks>Unset, the stylesheet's 8 px: the commands keep a button's corners, and two rounded grounds need air between them.</remarks>
    [UIComponentProperty]
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
    /// Writes a click registration on the item template, now and on every one set later.
    /// </summary>
    public void OnClickableItemTemplates(Action<IVisualComponent> register)
        => _ = OnItemTemplate(register);
}

/// <summary>
/// A horizontal or vertical bar of button items, typically used for toolbars and action rows.
/// </summary>
public sealed class CommandBarComponent(string? id = null) : CommandBarComponent<CommandBarComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.command-bar";
}
