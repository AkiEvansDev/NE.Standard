using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Actions;

/// <summary>
/// A button whose end is a second control opening a menu of commands: the main part is the button's own click,
/// the end part drops the entries. In <see cref="UISplitButtonMode.Menu"/> the whole button opens the menu.
/// </summary>
/// <remarks>
/// The entries are a <see cref="MenuComponent"/> of the same <see cref="MenuItem"/> model a sidebar uses (icon, title,
/// shortcut, enabled, a caption or a rule by <c>Kind</c>), drawn in a popup by the machinery a context menu uses.
/// </remarks>
public abstract partial class SplitButtonComponent<T> : ButtonComponent<T>, IRegionContainerComponent
    where T : SplitButtonComponent<T>, IUIComponentDefinition
{
    private readonly Dictionary<string, IVisualComponent> _regions = new(StringComparer.Ordinal);

    /// <summary>
    /// Initializes the button with an empty menu in its region.
    /// </summary>
    protected SplitButtonComponent(string? id = null) : base(id)
    {
        Menu = new MenuComponent().SetOrientation(UIOrientation.Vertical);
        _regions[RegionNames.Menu] = Menu;
    }

    /// <summary>
    /// Gets or sets which part opens the menu: the end part alone, or the whole button.
    /// </summary>
    /// <remarks>Render-time only: which part takes the click is how the control is built, not a state.</remarks>
    [UIComponentProperty(IsBindable = false, GenerateBinder = false, DefaultValue = UISplitButtonMode.Split)]
    public UISplitButtonMode? Mode { get; set; }

    /// <summary>
    /// Gets the menu the button drops — its entries, their template and the command an entry runs.
    /// </summary>
    public MenuComponent Menu { get; }

    /// <inheritdoc/>
    public IReadOnlyDictionary<string, IVisualComponent> Regions => _regions;

    /// <inheritdoc/>
    public bool HasRegions => true;

    /// <summary>
    /// Replaces the menu's entries.
    /// </summary>
    public T SetItems(IEnumerable<MenuItem> items)
    {
        _ = Menu.SetItems(items);
        return Self;
    }

    /// <summary>
    /// Adds one entry to the menu.
    /// </summary>
    public T AddItem(MenuItem item)
    {
        _ = Menu.AddItem(item);
        return Self;
    }

    /// <summary>
    /// Binds the menu's entries to a collection of <see cref="MenuItem"/> on the controller.
    /// </summary>
    public T BindItems(string path, UIBindingScope scope = UIBindingScope.Root)
    {
        _ = Menu.BindItems(path, scope);
        return Self;
    }

    /// <summary>
    /// Registers the command an entry runs when clicked.
    /// </summary>
    public T OnItemClick(string command)
    {
        _ = Menu.OnItemClick(command);
        return Self;
    }

    /// <summary>
    /// Registers the command an entry runs when clicked, with UI action arguments.
    /// </summary>
    public T OnItemClick(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
    {
        _ = Menu.OnItemClick(command, arguments);
        return Self;
    }

    /// <summary>
    /// Registers the command an entry runs, passing the entry as an argument.
    /// </summary>
    public T OnItemClickWithItem(string command, string argumentName = "item")
    {
        _ = Menu.OnItemClickWithItem(command, argumentName);
        return Self;
    }

    /// <summary>
    /// Registers the command an entry runs, passing the entry's key as an argument.
    /// </summary>
    public T OnItemClickWithItemKey(string command, string argumentName = "id")
    {
        _ = Menu.OnItemClickWithItemKey(command, argumentName);
        return Self;
    }
}

/// <summary>
/// A button whose end is a second control opening a menu of commands.
/// </summary>
public sealed class SplitButtonComponent(string? id = null) : SplitButtonComponent<SplitButtonComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.split-button";
}
