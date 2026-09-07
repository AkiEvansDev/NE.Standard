using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
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
public abstract partial class BreadcrumbsComponent<T> : ItemsComponentBase<T, IBreadcrumbItemModel, IButtonComponent>
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

    /// <summary>
    /// Registers a click command invoked when a step is clicked.
    /// </summary>
    public T OnItemClick(string command)
    {
        _ = RequiredTemplate.OnClick(command);
        return Self;
    }

    /// <summary>
    /// Registers a click command that passes the clicked item as an argument.
    /// </summary>
    public T OnItemClickWithItem(string command, string argumentName = "item")
        => OnItemClick(command, UIAction.ArgCurrentItem(argumentName));

    /// <summary>
    /// Registers a step click command that passes the clicked step's key as an argument.
    /// </summary>
    public T OnItemClickWithItemKey(string command, string argumentName = "id")
        => OnItemClick(command, UIAction.ArgCurrentItemKey(argumentName));

    /// <summary>
    /// Registers a click command invoked when a step is clicked, with UI action arguments.
    /// </summary>
    public T OnItemClick(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
    {
        _ = RequiredTemplate.OnClick(command, arguments);
        return Self;
    }

    /// <summary>
    /// Registers a click command invoked when an item is clicked, with literal argument values.
    /// </summary>
    public T OnItemClickLiteral(string command, params KeyValuePair<string, object?>[] arguments)
    {
        _ = RequiredTemplate.OnClickLiteral(command, arguments);
        return Self;
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
