using System;
using System.Collections.Generic;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>A dropdown input that holds several options out of a bound list.</summary>
/// <remarks>
/// The chosen ones stand in the field as chips, each with its own remove button, and the list marks them with a check and stays open
/// while options are toggled. The value is the chosen keys in the order they were chosen, each once.
/// </remarks>
public abstract partial class MultiSelectComponent<T, TItem>(string? id = null) : SelectComponentBase<T, TItem, IReadOnlyList<string>?>(id)
    where T : MultiSelectComponent<T, TItem>, IUIComponentDefinition
    where TItem : class, IOptionModel
{
    /// <summary>
    /// Gets or sets how many options can be chosen at most; unset, any number. The list refuses one more once the field holds as many.
    /// </summary>
    [UIComponentProperty(DefaultValue = null, GenerateSetter = false)]
    public int? MaxSelected { get; set; }

    /// <summary>
    /// Sets the chosen keys, no more of them than <see cref="MaxSelected"/>; whichever of the two is set last is checked against the
    /// other.
    /// </summary>
    public new T SetValue(IReadOnlyList<string>? value)
    {
        ValidateSelectedCount(value, MaxSelected);

        Value = value;
        return Self;
    }

    private static void ValidateSelectedCount(IReadOnlyList<string>? value, int? maxSelected)
    {
        if (value is null || maxSelected is not int max || value.Count <= max)
            return;

        // A repeated key is one chip on the page, so only the distinct keys count.
        var count = new HashSet<string>(value, StringComparer.Ordinal).Count;

        if (count > max)
            throw new ArgumentOutOfRangeException(nameof(value), count, $"A multi-select cannot hold more than {max} keys.");
    }

    /// <summary>
    /// Sets how many options can be chosen at most, which the chosen keys may not already exceed.
    /// </summary>
    public T SetMaxSelected(int maxSelected)
    {
        ArgumentOutOfRangeException.ThrowIfLessThan(maxSelected, 1);
        ValidateSelectedCount(Value, maxSelected);

        MaxSelected = maxSelected;
        return Self;
    }
}

/// <summary>
/// A dropdown input that holds several options out of a bound list.
/// </summary>
public abstract class MultiSelectComponent<T>(string? id = null) : MultiSelectComponent<T, OptionItem>(id)
    where T : MultiSelectComponent<T>, IUIComponentDefinition
{ }

/// <summary>
/// A dropdown input that holds several options out of a bound list.
/// </summary>
public sealed class MultiSelectComponent(string? id = null) : MultiSelectComponent<MultiSelectComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.input.multi-select";
}
