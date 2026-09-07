using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Components.BuiltIns.Templates;

/// <summary>
/// The built-in template rendering an <see cref="IBreadcrumbItemModel"/> as one step of a trail.
/// </summary>
public abstract class DefaultBreadcrumbItemTemplate<TTemplate> : BreadcrumbItemComponent<TTemplate>
    where TTemplate : DefaultBreadcrumbItemTemplate<TTemplate>, IUIComponentDefinition
{
    /// <summary>
    /// Initializes a new step template, optionally binding its label to the item at <paramref name="itemPath"/>.
    /// </summary>
    protected DefaultBreadcrumbItemTemplate(string? itemPath = null, bool binds = true) : base()
    {
        if (!string.IsNullOrWhiteSpace(itemPath))
            _ = BindContext(itemPath, UIBindingScope.Relative);

        if (binds)
        {
            _ = this.BindTextBase();

            _ = Bind(VisibilityProperty, nameof(ITextBaseModel.Visibility), UIBindingScope.Relative);
            _ = Bind(EnabledProperty, nameof(ITextBaseModel.Enabled), UIBindingScope.Relative);

            _ = Bind(UrlProperty, nameof(IBreadcrumbItemModel.Url), UIBindingScope.Relative);
        }
    }
}

/// <summary>
/// The built-in template rendering an <see cref="IBreadcrumbItemModel"/> as one step of a trail.
/// </summary>
public sealed class DefaultBreadcrumbItemTemplate(string? itemPath = null, bool binds = false) : DefaultBreadcrumbItemTemplate<DefaultBreadcrumbItemTemplate>(itemPath, binds), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.default.breadcrumb-item.template";
}
