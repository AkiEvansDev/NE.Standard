using System;
using System.Collections.Generic;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Actions;

/// <summary>
/// A button whose end opens a menu of commands: the main part fires its own click, the end part opens the menu; in
/// <see cref="UISplitButtonMode.Menu"/> the whole button does.
/// </summary>
/// <remarks>Entries are a <see cref="MenuComponent"/> of <see cref="MenuItem"/>, the same model a sidebar uses, drawn in a popup.</remarks>
public abstract partial class SplitButtonComponent<T> : ButtonComponent<T>, IRegionContainerComponent, ISplitButtonComponent, IItemClickComponent
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
    [UIComponentProperty(IsBindable = false, DefaultValue = UISplitButtonMode.Split)]
    public UISplitButtonMode? Mode { get; set; }

    /// <summary>
    /// Whether a menu button draws the chevron at its end; off, its icon alone says it opens a menu (a "⋮"). A split button's end
    /// part is its chevron and always draws it.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    public bool? ShowChevron { get; set; }

    /// <summary>
    /// Gets or sets where the menu opens against the button: below it, its end at the button's end, by default — a button at a bar's
    /// end — flipping where there is no room; a leading button (a composer's quick replies) opens from its start.
    /// </summary>
    /// <remarks>Render-time only, as a select's list placement is.</remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = UIPopupPlacement.BottomEnd)]
    public UIPopupPlacement? MenuPlacement { get; set; }

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
    /// Writes an entry's click on the menu's templates: an entry of the split button is an entry of its menu.
    /// </summary>
    public void OnClickableItemTemplates(Action<IVisualComponent> register)
        => Menu.OnClickableItemTemplates(register);
}

/// <summary>
/// A button whose end is a second control opening a menu of commands.
/// </summary>
public sealed class SplitButtonComponent(string? id = null) : SplitButtonComponent<SplitButtonComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.split-button";
}
