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
/// <remarks>The strip is sorted on <see cref="ITabItemModel.Order"/>, so the collection's own order never changes for a drag to stick.</remarks>
[UIComponentPropertyBlock(typeof(ISelectionStyleComponent))]
public abstract partial class TabsViewComponent<T> : ItemsComponentBase<T, ITabItemModel, ITabItemComponent>, ISelectionStyleComponent
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
    /// Gets or sets whether a caption can be renamed in place: a double click, F2, or a <c>RenameTabEffect</c> from a menu.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? Renamable { get; set; }

    /// <summary>
    /// Gets or sets whether tabs can be reordered by dragging their captions; a tab whose item says <c>CanDrag</c> false stays put.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? Draggable { get; set; }

    /// <summary>
    /// Gets or sets whether tabs can be closed at all; off, no caption shows a close and the strip keeps no room for one.
    /// A single tab refuses its close with the item's <c>CanRemove</c>.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    public bool? Removable { get; set; }

    /// <summary>
    /// Gets or sets whether the captions past the strip's room go behind a "…" list; off, the strip wraps them onto the next line.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    public bool? ShowOverflow { get; set; }

    /// <summary>
    /// Initializes the view with the built-in tab template, sorted by the items' own order.
    /// </summary>
    protected TabsViewComponent(string? id = null) : base(id)
    {
        _ = SetTemplate(new DefaultTabItemTemplate(binds: true));
        _ = SetEmptyTemplate(new DefaultEmptyTemplate());
        _ = SortBy(nameof(ITabItemModel.Order));

        TemplateKeyProperty = null;
    }

    /// <summary>
    /// Sets the page rendered for every tab, leaving the built-in caption in place.
    /// </summary>
    public T SetPageTemplate(IVisualComponent page)
    {
        ArgumentNullException.ThrowIfNull(page);

        _ = RequiredTemplate.SetPage(page);
        return Self;
    }

    /// <summary>
    /// Registers a command invoked when a tab's close is pressed, passing the tab's key; the controller removes the tab or leaves it.
    /// </summary>
    public T OnItemRemove(string command, string argumentName = "id")
        => OnItemRemove(command, UIAction.ArgCurrentItemKey(argumentName));

    /// <summary>
    /// Registers a command invoked when a tab's close is pressed, with UI action arguments.
    /// </summary>
    public T OnItemRemove(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
    {
        _ = RequiredTemplate.OnRemove(command, arguments);
        return Self;
    }

    /// <summary>
    /// Registers a command invoked when a caption is renamed in place, passing the tab's key.
    /// </summary>
    /// <remarks>Optional: a two-way caption already writes the new text back; this is for refusing or normalizing it.</remarks>
    public T OnItemRename(string command, string argumentName = "id")
        => OnItemRename(command, UIAction.ArgCurrentItemKey(argumentName));

    /// <summary>
    /// Registers a command invoked when a caption is renamed in place, with UI action arguments.
    /// </summary>
    public T OnItemRename(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
    {
        _ = RequiredTemplate.OnRename(command, arguments);
        return Self;
    }

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
