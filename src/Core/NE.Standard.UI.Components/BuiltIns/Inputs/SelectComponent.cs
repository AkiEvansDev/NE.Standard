using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

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
public abstract partial class SelectComponent<T>(string? id = null) : SelectComponent<T, OptionItem>(id)
    where T : SelectComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets how the closed select trigger is drawn.
    /// </summary>
    [UIComponentProperty(DefaultValue = UISelectVariant.Field)]
    public UISelectVariant? Variant { get; set; }

    /// <inheritdoc/>
    public override UISize? CaptionRowBox(UIResponsiveTier tier)
        => Variant == UISelectVariant.Quiet && base.CaptionRowBox(tier) is not null ? UISize.Small : base.CaptionRowBox(tier);
}

/// <summary>
/// A dropdown input that lets the user select a single option from a bound list.
/// </summary>
public sealed class SelectComponent(string? id = null) : SelectComponent<SelectComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.input.select";
}
