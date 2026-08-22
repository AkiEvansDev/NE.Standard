using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A search input that filters a bound list of options as the user types.
/// </summary>
public abstract partial class SearchComponent<T, TItem>(string? id = null) : SelectComponent<T, TItem>(id)
    where T : SearchComponent<T, TItem>, IUIComponentDefinition
    where TItem : class, IOptionModel
{
    /// <summary>
    /// Gets or sets how the selected option is displayed in the search text after selection.
    /// </summary>
    [UIComponentProperty(DefaultValue = UISearchSelectionDisplayMode.KeepSearchInput)]
    public UISearchSelectionDisplayMode? SelectionDisplayMode { get; set; }

    /// <summary>
    /// Gets or sets the current search text.
    /// </summary>
    [UIComponentProperty(BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource | UIBindingCapabilities.SubmitBufferedTargetToSource, DefaultValue = null, DefaultBindingMode = UIBindingMode.TwoWay)]
    public string? SearchText { get; set; }

    /// <summary>
    /// Gets or sets the delay, in milliseconds, before a search is triggered after the last keystroke.
    /// </summary>
    [UIComponentProperty(DefaultValue = null, GenerateSetter = false)]
    public int? DebounceMilliseconds { get; set; }

    /// <summary>
    /// Gets or sets the minimum number of characters required before a search is triggered.
    /// </summary>
    [UIComponentProperty(DefaultValue = 0, GenerateSetter = false)]
    public int? MinSearchLength { get; set; }

    /// <summary>
    /// Gets or sets whether searching is triggered automatically as the user types.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    public bool? AutoSearch { get; set; }

    /// <summary>
    /// Sets the delay, in milliseconds, before a search is triggered after the last keystroke.
    /// </summary>
    public T SetDebounceMilliseconds(int debounceMilliseconds)
    {
        ArgumentOutOfRangeException.ThrowIfNegative(debounceMilliseconds);

        DebounceMilliseconds = debounceMilliseconds;
        return Self;
    }

    /// <summary>
    /// Sets the minimum number of characters required before a search is triggered.
    /// </summary>
    public T SetMinSearchLength(int minSearchLength)
    {
        ArgumentOutOfRangeException.ThrowIfNegative(minSearchLength);

        MinSearchLength = minSearchLength;
        return Self;
    }

    /// <summary>
    /// Enables triggering searches automatically as the user types.
    /// </summary>
    public T SetAutoSearch()
        => SetAutoSearch(true);

    /// <summary>
    /// Registers a search event command.
    /// </summary>
    public T OnSearch(string command)
        => On(EventNames.Search, command);
    /// <summary>
    /// Registers a search event command with action arguments.
    /// </summary>
    public T OnSearch(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => On(EventNames.Search, command, arguments);
    /// <summary>
    /// Registers a search event command with literal action arguments.
    /// </summary>
    public T OnSearchLiteral(string command, params KeyValuePair<string, object?>[] arguments)
        => OnLiteral(EventNames.Search, command, arguments);
}

/// <summary>
/// A search input that filters a bound list of options as the user types.
/// </summary>
public abstract class SearchComponent<T>(string? id = null) : SearchComponent<T, OptionItem>(id)
    where T : SearchComponent<T>, IUIComponentDefinition
{ }

/// <summary>
/// A search input that filters a bound list of options as the user types.
/// </summary>
public sealed class SearchComponent(string? id = null) : SearchComponent<SearchComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.input.search";
}
