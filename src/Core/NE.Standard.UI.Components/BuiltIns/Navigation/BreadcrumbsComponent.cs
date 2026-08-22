using System;
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
/// <remarks>
/// Fed by the author rather than read off the router: a route is a path, and the framework knows nothing
/// about a route's title, its parent, or whether an intermediate segment is a page at all — a trail derived
/// from <c>/navigation/tabs-view/test</c> would read "navigation › tabs-view › test" and link to a segment
/// that never was a route. The controller says what the trail is, and the titles are real and translatable.
/// <para>
/// The last step is the current page: it is marked and stops being a link, decided by position rather than by
/// a flag on the item, so the trail cannot disagree with its own order.
/// </para>
/// </remarks>
public abstract partial class BreadcrumbsComponent<T> : ItemsComponentBase<T, IBreadcrumbItemModel>
    where T : BreadcrumbsComponent<T>, IUIComponentDefinition
{
    private static readonly UIResponsive<double> DefaultSpacing = 2d;

    /// <summary>The mark drawn between steps unless the author sets another.</summary>
    public const string DefaultSeparator = "›";

    /// <summary>
    /// Gets or sets the mark drawn between steps.
    /// </summary>
    /// <remarks>
    /// Render-time only, and deliberately not bindable: it is drawn by CSS as the mark <em>before</em> every
    /// step but the first, which is what makes it appear for a client-rendered step too — an element emitted
    /// between steps would exist only for the ones the server drew. Patching a CSS string at runtime would
    /// need a converter that quotes it, on both sides of the wire, for a value nobody changes.
    /// </remarks>
    [UIComponentProperty(IsBindable = false, GenerateBinder = false, DefaultValue = DefaultSeparator)]
    public string? Separator { get; set; }

    /// <summary>
    /// Gets or sets the gap between a step and the mark beside it, optionally overridden per breakpoint.
    /// </summary>
    [UIComponentProperty(DefaultValueMember = nameof(DefaultSpacing))]
    public UIResponsive<double>? Spacing { get; set; }

    /// <summary>
    /// Gets the step template.
    /// </summary>
    public virtual IButtonComponent? ItemTemplate => Template as IButtonComponent;

    /// <summary>
    /// Initializes the trail with the built-in step template.
    /// </summary>
    protected BreadcrumbsComponent(string? id = null) : base(id)
    {
        _ = base.SetTemplate(new DefaultBreadcrumbItemTemplate(binds: true));

        TemplateKeyProperty = null;
    }

    /// <summary>
    /// Sets the step template, throwing if <paramref name="visualTemplate"/> is not an <see cref="IButtonComponent"/>.
    /// </summary>
    public override T SetTemplate(IVisualComponent visualTemplate)
        => visualTemplate is not IButtonComponent
            ? throw new InvalidOperationException($"Only {nameof(IButtonComponent)} is supported.")
            : base.SetTemplate(visualTemplate);

    /// <summary>
    /// Sets the step template.
    /// </summary>
    public virtual T SetItemTemplate(IButtonComponent visualTemplate)
        => SetTemplate(visualTemplate);

    /// <summary>
    /// Registers a click command invoked when a step is clicked.
    /// </summary>
    public T OnItemClick(string command)
    {
        _ = GetRequiredItemTemplate().OnClick(command);
        return Self;
    }

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
        _ = GetRequiredItemTemplate().OnClick(command, arguments);
        return Self;
    }

    private IButtonComponent GetRequiredItemTemplate()
        => ItemTemplate ?? throw new InvalidOperationException($"The item template of '{TypeKey}' must inherit from '{nameof(IButtonComponent)}' to configure step actions.");
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
