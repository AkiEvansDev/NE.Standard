using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;

namespace NE.Standard.UI.Components.BuiltIns.Templates;

/// <summary>
/// The built-in template rendering a <see cref="IKeyValueActionModel"/>'s <see cref="IKeyValueActionModel.Value"/> text.
/// </summary>
public abstract class DefaultValueTemplate<TTemplate>(bool binds = false) : DefaultTextTemplate<TTemplate>(nameof(IKeyValueActionModel.Value), binds)
    where TTemplate : DefaultValueTemplate<TTemplate>, IUIComponentDefinition
{ }

/// <summary>
/// The built-in template rendering a <see cref="IKeyValueActionModel"/>'s <see cref="IKeyValueActionModel.Value"/> text.
/// </summary>
public sealed class DefaultValueTemplate(bool binds = false) : DefaultValueTemplate<DefaultValueTemplate>(binds), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.default.value.template";
}
