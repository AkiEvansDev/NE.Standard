using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Constants;

namespace NE.Standard.UI.Components.BuiltIns.Templates;

/// <summary>
/// A purely structural, invisible template variant whose only purpose is to exist as a compiled node
/// so its owning items component (e.g. <c>KeyValueActionComponent</c>'s row) can attach an
/// <see cref="OnClick(string)"/> event to a per-item scope that otherwise has no addressable identity
/// of its own. Never actually rendered — the owning renderer stamps its compiled identity directly onto
/// an existing DOM element instead of rendering this component's own (empty) output.
/// </summary>
public abstract class DefaultRowTemplate<TTemplate> : ContainerComponent<TTemplate>
    where TTemplate : DefaultRowTemplate<TTemplate>, IUIComponentDefinition
{
    /// <summary>
    /// Registers a command to invoke when the row is clicked.
    /// </summary>
    public TTemplate OnClick(string command)
        => On(EventNames.Click, command);
    /// <summary>
    /// Registers a command with bound arguments to invoke when the row is clicked.
    /// </summary>
    public TTemplate OnClick(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => On(EventNames.Click, command, arguments);
    /// <summary>
    /// Registers a command with literal arguments to invoke when the row is clicked.
    /// </summary>
    public TTemplate OnClickLiteral(string command, params KeyValuePair<string, object?>[] arguments)
        => OnLiteral(EventNames.Click, command, arguments);
}

/// <summary>
/// A purely structural, invisible template variant whose only purpose is to exist as a compiled node
/// so its owning items component (e.g. <c>KeyValueActionComponent</c>'s row) can attach an
/// <c>OnClick(string)</c> event to a per-item scope that otherwise has no addressable identity
/// of its own. Never actually rendered — the owning renderer stamps its compiled identity directly onto
/// an existing DOM element instead of rendering this component's own (empty) output.
/// </summary>
public sealed class DefaultRowTemplate : DefaultRowTemplate<DefaultRowTemplate>, IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.default.row.template";
}
