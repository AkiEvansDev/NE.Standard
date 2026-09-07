using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Components.Foundation.Inputs;

/// <summary>
/// Base class for inputs whose value is one option out of a bound list: the option collection API and the text-restricted
/// item template; the derived input installs its default item, empty and group templates.
/// </summary>
public abstract partial class OptionsInputComponentBase<TComponent, TItem>(string? id = null) : InputTemplatedComponentBase<TComponent, TItem, string?, ITextComponent>(id)
    where TComponent : OptionsInputComponentBase<TComponent, TItem>, IUIComponentDefinition
    where TItem : class, IOptionModel
{
    /// <summary>
    /// Adds a single option to the list.
    /// </summary>
    public TComponent AddOption(TItem option)
    {
        _ = AddItem(option);
        return Self;
    }

    /// <summary>
    /// Adds multiple options to the list.
    /// </summary>
    public TComponent AddOptions(IEnumerable<TItem> options)
    {
        _ = AddItems(options);
        return Self;
    }

    /// <summary>
    /// Replaces the list of options.
    /// </summary>
    public TComponent SetOptions(IEnumerable<TItem> options)
    {
        _ = SetItems(options);
        return Self;
    }

    /// <summary>
    /// Binds the list of options to a property at the given string path.
    /// </summary>
    public TComponent BindOptions(string path, UIBindingScope scope = UIBindingScope.Root, UIBindingMode mode = UIBindingMode.OneWay)
        => BindItems(path, scope, mode);
    /// <summary>
    /// Binds the list of options to a property at the given recursive path.
    /// </summary>
    public TComponent BindOptions(RecursivePath path, UIBindingScope scope = UIBindingScope.Root, UIBindingMode mode = UIBindingMode.OneWay)
        => BindItems(path, scope, mode);
}
