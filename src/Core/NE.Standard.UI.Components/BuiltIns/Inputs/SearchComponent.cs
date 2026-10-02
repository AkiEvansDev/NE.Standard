using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A select whose open list carries a search field pinned over its options: the field narrows its own options, or asks the server
/// (<c>OnSearch</c>) for the list it answers with, as the user types.
/// </summary>
/// <remarks>
/// Closed, it is a select's field and shows the chosen option; the term is kept between openings and selected as the list opens, so
/// typing replaces it and the list always answers what the field says. After a pick the list closes and the keyboard is back on the field.
/// </remarks>
public abstract partial class SearchComponent<T, TItem>(string? id = null) : SelectComponent<T, TItem>(id), IDebounceInputComponent
    where T : SearchComponent<T, TItem>, IUIComponentDefinition
    where TItem : class, IOptionModel
{
    /// <summary>
    /// Gets or sets what's currently typed into the search box, live as the user types.
    /// </summary>
    [UIComponentProperty(BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource | UIBindingCapabilities.SubmitBufferedTargetToSource, DefaultValue = null, DefaultBindingMode = UIBindingMode.TwoWay)]
    public string? SearchText { get; set; }

    /// <summary>
    /// Gets or sets how the search field pinned over the open list is drawn: <see cref="UIInputAppearance.Ghost"/> unless set, its
    /// line under it parting it from the options.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIInputAppearance.Ghost)]
    public UIInputAppearance? SearchFieldAppearance { get; set; }

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
/// A select whose open list carries a search field pinned over its options.
/// </summary>
public abstract class SearchComponent<T>(string? id = null) : SearchComponent<T, OptionItem>(id)
    where T : SearchComponent<T>, IUIComponentDefinition
{ }

/// <summary>
/// A select whose open list carries a search field pinned over its options.
/// </summary>
public sealed class SearchComponent(string? id = null) : SearchComponent<SearchComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.input.search";
}
