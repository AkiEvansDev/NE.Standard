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
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Navigation;

/// <summary>
/// A list of navigation entries, vertical or horizontal, that can collapse to icons alone.
/// </summary>
/// <remarks>
/// One collection carries entries, section captions and rules: <see cref="IMenuItemModel.Kind"/> selects the
/// template variant, so a caption and a rule are entries of the same list rather than a second component the
/// author has to interleave by hand. That is also what lets a context menu reuse this model whole.
/// </remarks>
public abstract partial class MenuComponent<T> : ItemsComponentBase<T, IMenuItemModel>
    where T : MenuComponent<T>, IUIComponentDefinition
{
    private static readonly UIResponsive<double> DefaultSpacing = 2d;

    /// <summary>The template variant key rendering <see cref="UIMenuItemKind.Header"/> entries.</summary>
    public const string HeaderTemplateKey = nameof(UIMenuItemKind.Header);

    /// <summary>The template variant key rendering <see cref="UIMenuItemKind.Separator"/> entries.</summary>
    public const string SeparatorTemplateKey = nameof(UIMenuItemKind.Separator);

    /// <summary>
    /// Gets or sets the direction the entries run in.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIOrientation.Vertical)]
    public UIOrientation? Orientation { get; set; }

    /// <summary>
    /// Gets or sets the gap between entries, optionally overridden per breakpoint.
    /// </summary>
    [UIComponentProperty(DefaultValueMember = nameof(DefaultSpacing))]
    public UIResponsive<double>? Spacing { get; set; }

    /// <summary>
    /// Gets or sets whether entries show their icon alone, with the title moving to the tooltip.
    /// </summary>
    /// <remarks>
    /// A plain flag rather than a <c>UIResponsive</c> one: a responsive boolean renders as one attribute per
    /// breakpoint tier, and each tier needs its own converter on both sides plus an entry in the C#↔TS sync
    /// test — the cost `Visible` pays. Collapsing by breakpoint is worth adding deliberately, not as a side
    /// effect of this property's type.
    /// </remarks>
    [UIComponentProperty(DefaultValue = false)]
    public bool? Collapsed { get; set; }

    /// <summary>
    /// Gets or sets whether the menu draws its own control for switching <see cref="Collapsed"/>.
    /// </summary>
    /// <remarks>
    /// The switch is the viewer's, not the controller's: the client flips it and remembers it in the browser
    /// under the menu's authored id, so it survives a navigation without a property on every controller that
    /// hosts a menu. <see cref="Collapsed"/> stays the author's answer for how the menu opens, and a menu with
    /// no authored id is switched all the same — it simply forgets between pages.
    /// </remarks>
    [UIComponentProperty(DefaultValue = false)]
    public bool? ShowCollapseToggle { get; set; }

    /// <summary>
    /// Gets the entry template.
    /// </summary>
    public virtual IButtonComponent? ItemTemplate => Template as IButtonComponent;

    /// <summary>
    /// Initializes the menu with its default entry template and the caption/rule variants, keyed by
    /// <see cref="IMenuItemModel.Kind"/>.
    /// </summary>
    protected MenuComponent(string? id = null) : base(id)
    {
        _ = base.SetTemplate(new DefaultMenuItemTemplate(binds: true));
        _ = base.AddTemplateVariant(HeaderTemplateKey, new DefaultMenuItemTemplate(binds: true).SetKind(UIMenuItemKind.Header));
        _ = base.AddTemplateVariant(SeparatorTemplateKey, new DefaultMenuItemTemplate(binds: true).SetKind(UIMenuItemKind.Separator));

        TemplateKeyProperty = nameof(IMenuItemModel.Kind);
    }

    /// <summary>
    /// Sets the entry template.
    /// </summary>
    public virtual T SetItemTemplate(IButtonComponent visualTemplate)
        => base.SetTemplate(visualTemplate);

    /// <summary>
    /// Sets the entry template, throwing if <paramref name="visualTemplate"/> is not an <see cref="IButtonComponent"/>.
    /// </summary>
    public override T SetTemplate(IVisualComponent visualTemplate)
        => visualTemplate is not IButtonComponent
            ? throw new InvalidOperationException($"Only {nameof(IButtonComponent)} is supported.")
            : base.SetTemplate(visualTemplate);

    /// <summary>
    /// Registers a click command invoked when an entry is clicked.
    /// </summary>
    public T OnItemClick(string command)
    {
        _ = GetRequiredItemTemplate().OnClick(command);
        return Self;
    }

    /// <summary>
    /// Registers an entry click command that passes the clicked entry's key as an argument.
    /// </summary>
    public T OnItemClickWithItemKey(string command, string argumentName = "id")
        => OnItemClick(command, UIAction.ArgCurrentItemKey(argumentName));

    /// <summary>
    /// Registers a click command invoked when an entry is clicked, with UI action arguments.
    /// </summary>
    public T OnItemClick(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
    {
        _ = GetRequiredItemTemplate().OnClick(command, arguments);
        return Self;
    }

    private IButtonComponent GetRequiredItemTemplate()
        => ItemTemplate is IButtonComponent buttonTemplate
            ? buttonTemplate
            : throw new InvalidOperationException($"The item template of '{TypeKey}' must inherit from '{nameof(IButtonComponent)}' to configure item click actions.");
}

/// <summary>
/// A list of navigation entries, vertical or horizontal, that can collapse to icons alone.
/// </summary>
public sealed class MenuComponent(string? id = null) : MenuComponent<MenuComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.menu";
}
