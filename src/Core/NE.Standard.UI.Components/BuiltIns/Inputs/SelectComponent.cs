using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Models;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A dropdown input that lets the user select a single option from a bound list.
/// </summary>
public abstract class SelectComponent<T, TItem>(string? id = null) : SelectComponentBase<T, TItem, string?>(id)
    where T : SelectComponent<T, TItem>, IUIComponentDefinition
    where TItem : class, IOptionModel
{ }

/// <summary>
/// A dropdown input that lets the user select a single option from a bound list.
/// </summary>
public abstract class SelectComponent<T>(string? id = null) : SelectComponent<T, OptionItem>(id)
    where T : SelectComponent<T>, IUIComponentDefinition
{ }

/// <summary>
/// A dropdown input that lets the user select a single option from a bound list.
/// </summary>
public sealed class SelectComponent(string? id = null) : SelectComponent<SelectComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.input.select";
}
