using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Constants;

namespace NE.Standard.UI.Components.BuiltIns.Layouts;

/// <summary>
/// A bordered surface holding one content region: a fill, an edge, a radius and — where it is asked for — a
/// click. <see cref="CardComponent{T}"/> is this plus a header and a footer.
/// </summary>
[UIComponentPropertyBlock(typeof(ISurfaceStyleComponent))]
public abstract partial class SurfaceComponent<T>(string? id = null) : BorderedRegionComponentBase<T>(id), ISurfaceStyleComponent
    where T : SurfaceComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Whether the whole surface is actionable — the affordance and the click both. Left false, a command
    /// registered through <see cref="OnClick(string)"/> does not fire; controls inside are unaffected.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? Clickable { get; set; }

    /// <summary>
    /// Registers a command to invoke when the surface is clicked.
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
}

/// <summary>
/// A bordered surface holding one content region, optionally clickable as a whole.
/// </summary>
public sealed class SurfaceComponent(string? id = null) : SurfaceComponent<SurfaceComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.surface";
}
