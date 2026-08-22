using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;

namespace NE.Standard.UI.Components.BuiltIns.Templates;

/// <summary>
/// The built-in template rendering a <see cref="IKeyValueActionModel"/>'s <see cref="IKeyValueActionModel.Key"/> text.
/// </summary>
public abstract class DefaultKeyTemplate<TTemplate>(bool binds = false) : DefaultTextTemplate<TTemplate>(nameof(IKeyValueActionModel.Key), binds)
    where TTemplate : DefaultKeyTemplate<TTemplate>, IUIComponentDefinition
{ }

/// <summary>
/// The built-in template rendering a <see cref="IKeyValueActionModel"/>'s <see cref="IKeyValueActionModel.Key"/> text.
/// </summary>
public sealed class DefaultKeyTemplate(bool binds = false) : DefaultKeyTemplate<DefaultKeyTemplate>(binds), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.default.key.template";
}
