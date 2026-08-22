using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;

namespace NE.Standard.UI.Components.BuiltIns.Templates;

/// <summary>
/// The built-in template rendering a <see cref="IKeyValueActionModel"/>'s <see cref="IKeyValueActionModel.Action"/> button.
/// </summary>
public abstract class DefaultActionTemplate<TTemplate>(bool binds = false) : DefaultButtonTemplate<TTemplate>(nameof(IKeyValueActionModel.Action), binds)
    where TTemplate : DefaultActionTemplate<TTemplate>, IUIComponentDefinition
{ }

/// <summary>
/// The built-in template rendering a <see cref="IKeyValueActionModel"/>'s <see cref="IKeyValueActionModel.Action"/> button.
/// </summary>
public sealed class DefaultActionTemplate(bool binds = false) : DefaultActionTemplate<DefaultActionTemplate>(binds), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.default.action.template";
}
