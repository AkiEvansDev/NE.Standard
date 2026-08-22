using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Components.BuiltIns.Navigation;

/// <summary>
/// A strip of captions over pages that come from a collection — a document-tab control.
/// </summary>
/// <remarks>
/// The other half of <see cref="TabsComponent"/>, and a different control rather than a flag on it: there the
/// pages are regions known when the view is written, here they are a template rendered once per item. That is
/// the difference between a layout and an items view, and it is what lets a tab be renamed, reordered and
/// closed — all three are changes to the item, not to the tree.
/// <para>
/// The strip is sorted on <see cref="ITabItemModel.Order"/>, so the collection's own order never has to
/// change for a drag to stick.
/// </para>
/// </remarks>
public abstract partial class TabsViewComponent<T> : ItemsComponentBase<T, ITabItemModel>
    where T : TabsViewComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets the key of the tab currently shown. Two-way, as on <see cref="TabsComponent"/>.
    /// </summary>
    [UIComponentProperty(
        BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource,
        DefaultBindingMode = UIBindingMode.TwoWay,
        DefaultValue = null)]
    public string? SelectedKey { get; set; }

    /// <summary>
    /// Gets or sets whether a caption can be renamed in place by double-clicking it.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? Renamable { get; set; }

    /// <summary>
    /// Gets or sets whether tabs can be reordered by dragging their captions.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? Reorderable { get; set; }

    /// <summary>
    /// Gets the tab template.
    /// </summary>
    public virtual ITabItemComponent? ItemTemplate => Template as ITabItemComponent;

    /// <summary>
    /// Initializes the view with the built-in tab template, sorted by the items' own order.
    /// </summary>
    protected TabsViewComponent(string? id = null) : base(id)
    {
        _ = base.SetTemplate(new DefaultTabItemTemplate(binds: true));
        _ = SortBy(nameof(ITabItemModel.Order));

        TemplateKeyProperty = null;
    }

    /// <summary>
    /// Sets the page rendered for every tab, leaving the built-in caption in place.
    /// </summary>
    public T SetPageTemplate(IVisualComponent page)
    {
        ArgumentNullException.ThrowIfNull(page);

        _ = GetRequiredItemTemplate().SetPage(page);
        return Self;
    }

    /// <summary>
    /// Sets the tab template, throwing if <paramref name="visualTemplate"/> is not a <see cref="TabItemComponent"/>.
    /// </summary>
    public override T SetTemplate(IVisualComponent visualTemplate)
        => visualTemplate is not ITabItemComponent
            ? throw new InvalidOperationException($"Only {nameof(ITabItemComponent)} is supported.")
            : base.SetTemplate(visualTemplate);

    /// <summary>
    /// Registers a command invoked when a tab's close button is pressed, passing the tab's key.
    /// </summary>
    public T OnItemClose(string command, string argumentName = "id")
        => OnItemClose(command, UIAction.ArgCurrentItemKey(argumentName));

    /// <summary>
    /// Registers a command invoked when a tab's close button is pressed, with UI action arguments.
    /// </summary>
    public T OnItemClose(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
    {
        _ = GetRequiredItemTemplate().OnClose(command, arguments);
        return Self;
    }

    /// <summary>
    /// Registers a command invoked when a caption is renamed in place, with UI action arguments.
    /// </summary>
    /// <remarks>
    /// Optional: a caption bound two-way to the item's title already writes the new text back on its own, and
    /// this is for a controller that wants to refuse or normalize it instead.
    /// </remarks>
    public T OnItemRename(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
    {
        _ = GetRequiredItemTemplate().OnRename(command, arguments);
        return Self;
    }

    private ITabItemComponent GetRequiredItemTemplate()
        => ItemTemplate ?? throw new InvalidOperationException($"The item template of '{TypeKey}' must be an '{nameof(ITabItemComponent)}'.");
}

/// <summary>
/// A strip of captions over pages that come from a collection.
/// </summary>
public sealed class TabsViewComponent(string? id = null) : TabsViewComponent<TabsViewComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.tabs-view";
}
