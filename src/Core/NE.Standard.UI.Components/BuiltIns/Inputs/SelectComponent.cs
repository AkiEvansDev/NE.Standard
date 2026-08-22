using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A dropdown input that lets the user select a single option from a bound list.
/// </summary>
/// <remarks>
/// The option collection, item template and default templates live on
/// <see cref="OptionsInputComponentBase{TComponent, TItem}"/>; what is added here is the dropdown's own
/// surface — a trigger that needs a placeholder when nothing is chosen, and a popup whose selection can be
/// cleared. <c>RadioGroupComponent</c> shares the former and has neither of the latter.
/// </remarks>
public abstract partial class SelectComponent<T, TItem>(string? id = null) : OptionsInputComponentBase<T, TItem>(id), IAffixedInputComponent
    where T : SelectComponent<T, TItem>, IUIComponentDefinition
    where TItem : class, IOptionModel
{
    /// <summary>
    /// Gets or sets whether the selection can be cleared to no value.
    /// </summary>
    /// <remarks>
    /// Unbindable, same shape as <c>TextInputComponent.ShowClearButton</c>: it decides whether the clear
    /// element is emitted at all. See <c>docs/PROJECT.md</c> §7.
    /// </remarks>
    [UIComponentProperty(DefaultValue = false, IsBindable = false, GenerateBinder = false)]
    public bool? AllowEmptySelection { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IFieldInputComponent), DefaultValue = UIInputAppearance.Filled)]
    public UIInputAppearance? Appearance { get; set; }

    // Declared here rather than inherited, for the reason Appearance is: a select sits on the options branch,
    // which has no ancestor in common with AffixedInputComponentBase below VisualComponentBase.
    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IAffixedInputComponent), DefaultValue = null)]
    public string? PrefixIcon { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IAffixedInputComponent), DefaultValue = null)]
    public string? SuffixIcon { get; set; }

    /// <summary>
    /// Gets or sets the placeholder text shown when no option is selected.
    /// </summary>
    [Translatable]
    [UIComponentProperty(DefaultValue = null)]
    public string? Placeholder { get; set; }

    /// <summary>
    /// Allows the selection to be cleared to no value.
    /// </summary>
    public T SetAllowEmptySelection()
        => SetAllowEmptySelection(true);
}

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
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.input.select";
}
