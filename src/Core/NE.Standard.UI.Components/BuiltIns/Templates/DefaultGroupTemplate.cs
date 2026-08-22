using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Components.BuiltIns.Templates;

/// <summary>
/// The built-in template rendering a group header's label as a separator, bound to the group's key.
/// </summary>
public abstract class DefaultGroupTemplate<TTemplate> : SeparatorComponent<TTemplate>
    where TTemplate : DefaultGroupTemplate<TTemplate>, IUIComponentDefinition
{
    /// <summary>
    /// Initializes a new group template, optionally binding its label to the current group's key.
    /// </summary>
    protected DefaultGroupTemplate(bool binds = false) : base()
    {
        if (binds)
            _ = Bind(LabelProperty, nameof(IBindableGroup.Group), UIBindingScope.Relative);
    }
}

/// <summary>
/// The built-in template rendering a group header's label as a separator, bound to the group's key.
/// </summary>
public sealed class DefaultGroupTemplate(bool binds = false) : DefaultGroupTemplate<DefaultGroupTemplate>(binds), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.default.group.template";
}
