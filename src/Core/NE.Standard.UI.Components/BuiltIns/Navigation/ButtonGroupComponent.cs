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

namespace NE.Standard.UI.Components.BuiltIns.Navigation;

/// <summary>A strip of segments pressed flush together, one of them current — switches a view's mode.</summary>
/// <remarks>
/// Navigation, not an input: the chosen segment is a key, never a validated value. Segments are <see cref="IButtonModel"/>s drawn
/// as ghost buttons on the field's ground, ruled between segments; the current one fills primary unless <c>SelectionStyle</c> says
/// otherwise. Always horizontal.
/// </remarks>
[UIComponentPropertyBlock(typeof(ISurfaceComponent))]
[UIComponentPropertyBlock(typeof(IBorderedComponent))]
[UIComponentPropertyBlock(typeof(ISelectionStyleComponent))]
[UIComponentPropertyBlock(typeof(ISelectedKeyComponent))]
public abstract partial class ButtonGroupComponent<T> : ItemsComponentBase<T, IButtonModel, IButtonComponent>, ISurfaceComponent, IBorderedComponent, ISelectionStyleComponent, ISelectedKeyComponent, IItemClickComponent
    where T : ButtonGroupComponent<T>, IUIComponentDefinition
{
    private static readonly UIResponsive<UIButtonSize> DefaultSize = UIButtonSize.Medium;

    /// <summary>
    /// Gets or sets how much room the strip takes, optionally per breakpoint; every segment follows it.
    /// </summary>
    [UIComponentProperty(DefaultValueMember = nameof(DefaultSize))]
    public UIResponsive<UIButtonSize>? Size { get; set; }

    /// <summary>
    /// Initializes the group with its segment template: a ghost button, since the strip draws the ground.
    /// </summary>
    protected ButtonGroupComponent(string? id = null) : base(id)
    {
        HorizontalAlignment = UIAlignment.Start;
        VerticalAlignment = UIAlignment.Center;

        _ = SetTemplate(new DefaultButtonTemplate(binds: true).SetType(UIButtonType.Ghost));
    }

    /// <summary>
    /// Writes a click registration on the item template, now and on every one set later.
    /// </summary>
    public void OnClickableItemTemplates(Action<IVisualComponent> register)
        => _ = OnItemTemplate(register);
}

/// <summary>
/// A strip of segments pressed flush against each other, one of them current.
/// </summary>
public sealed class ButtonGroupComponent(string? id = null) : ButtonGroupComponent<ButtonGroupComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.button-group";
}
