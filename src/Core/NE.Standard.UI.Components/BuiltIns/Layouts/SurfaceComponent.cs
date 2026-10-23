using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Layouts;

/// <summary>
/// A bordered surface holding one content region: a fill, an edge, a radius and — where it is asked for — a
/// click or an address it links to. <see cref="CardComponent{T}"/> is this plus a header and a footer.
/// </summary>
[UIComponentPropertyBlock(typeof(ISurfaceStyleComponent))]
[UIComponentPropertyBlock(typeof(IClickableComponent))]
[UIComponentPropertyBlock(typeof(ILinkableComponent))]
[UIComponentPropertyBlock(typeof(IAccessibleNameComponent))]
public abstract partial class SurfaceComponent<T>(string? id = null) : BorderedRegionComponentBase<T>(id), ISurfaceStyleComponent, IClickableComponent, ILinkableComponent, IAccessibleNameComponent
    where T : SurfaceComponent<T>, IUIComponentDefinition
{
    /// <summary>Whether a clickable surface answers hover quietly — half the wash, no lift — for a strip the pointer crosses on its way elsewhere.</summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? QuietHover { get; set; }

    /// <summary>
    /// What the surface is to a screen reader when it holds a message — a status, read when the reader is free, or an alert, read at
    /// once — so its words are read as they change and as it is shown; unset, neither. A clickable surface is a button or a group
    /// instead.
    /// </summary>
    [UIComponentProperty(IsBindable = false, DefaultValue = null)]
    public UILiveRegion? LiveRegion { get; set; }

    /// <summary>
    /// Registers a command to invoke when the surface is clicked; the surface is clickable unless its author set or bound <c>Clickable</c>.
    /// </summary>
    public T OnClick(string command)
        => On(EventNames.Click, command);

    /// <summary>
    /// Registers a command with bound arguments to invoke when the surface is clicked.
    /// </summary>
    public T OnClick(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => On(EventNames.Click, command, arguments);

    /// <summary>
    /// Registers a command with literal arguments to invoke when the surface is clicked.
    /// </summary>
    public T OnClickLiteral(string command, params KeyValuePair<string, object?>[] arguments)
        => OnLiteral(EventNames.Click, command, arguments);

    /// <summary>
    /// Runs the command on click with the key of the item the surface is drawn for — a row's card.
    /// </summary>
    public T OnClickWithItemKey(string command, string argumentName = "id")
        => OnClick(command, UIAction.ArgCurrentItemKey(argumentName));

    /// <summary>
    /// Shows the picture the surface holds full size on a press, on the page alone (<see cref="ShowImageEffect"/>);
    /// <paramref name="amongRows"/> shows it among the pictures of the surface's other drawn rows — a message's photos.
    /// </summary>
    public T OnClickShowImage(bool amongRows = false)
        => InteractOn(EventNames.Click, amongRows ? ShowImageEffect.AmongRows(Id) : ShowImageEffect.Of(Id));
}

/// <summary>
/// A bordered surface holding one content region, optionally clickable as a whole or a link.
/// </summary>
public sealed class SurfaceComponent(string? id = null) : SurfaceComponent<SurfaceComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.surface";
}
