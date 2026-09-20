using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Components.BuiltIns.Navigation;

/// <summary>
/// The trail back to where the current page sits, one step per entry of a collection.
/// </summary>
/// <remarks>Fed by the controller, not the router; the last step is the current page, marked by position rather than by a flag.</remarks>
public abstract partial class BreadcrumbsComponent<T> : ItemsComponentBase<T, IBreadcrumbItemModel, IButtonComponent>, IButtonTemplatedItemsComponent
    where T : BreadcrumbsComponent<T>, IUIComponentDefinition
{
    private static readonly UIResponsive<double> DefaultSpacing = 2d;

    /// <summary>
    /// Gets or sets the text drawn between steps; unset, the mark is the library's own chevron.
    /// </summary>
    /// <remarks>Render-time only, not bindable: it is drawn by the platform after every step but the last.</remarks>
    [UIComponentProperty(IsBindable = false, GenerateBinder = false, DefaultValue = null)]
    public string? Separator { get; set; }

    /// <summary>
    /// Gets or sets the gap between a step and the mark beside it, optionally overridden per breakpoint.
    /// </summary>
    [UIComponentProperty(DefaultValueMember = nameof(DefaultSpacing))]
    public UIResponsive<double>? Spacing { get; set; }

    /// <summary>
    /// Initializes the trail with the built-in step template.
    /// </summary>
    protected BreadcrumbsComponent(string? id = null) : base(id)
    {
        _ = SetTemplate(new DefaultBreadcrumbItemTemplate(binds: true));

        TemplateKeyProperty = null;
    }
}

/// <summary>
/// The trail back to where the current page sits.
/// </summary>
public sealed class BreadcrumbsComponent(string? id = null) : BreadcrumbsComponent<BreadcrumbsComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.breadcrumbs";
}
