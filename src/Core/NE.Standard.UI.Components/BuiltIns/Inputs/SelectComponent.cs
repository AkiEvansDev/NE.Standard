using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A dropdown input that lets the user select a single option from a bound list.
/// </summary>
[UIComponentPropertyBlock(typeof(IBorderedComponent))]
public abstract partial class SelectComponent<T, TItem> : OptionsInputComponentBase<T, TItem>, IAffixedInputComponent, IPlaceholderInputComponent
    where T : SelectComponent<T, TItem>, IUIComponentDefinition
    where TItem : class, IOptionModel
{
    /// <summary>
    /// Gets or sets whether the button that clears the selection is shown.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? ShowClearButton { get; set; }

    /// <summary>
    /// Gets or sets whether the field draws the mark that says it opens a list.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    public bool? ShowChevron { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IFieldInputComponent), DefaultValue = UIInputAppearance.Filled)]
    public UIInputAppearance? Appearance { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IAffixedInputComponent), DefaultValue = null)]
    public string? PrefixIcon { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IAffixedInputComponent), DefaultValue = null)]
    public string? SuffixIcon { get; set; }

    /// <inheritdoc/>
    [Translatable]
    [UIComponentProperty(Contract = typeof(IPlaceholderInputComponent), DefaultValue = null)]
    public string? Placeholder { get; set; }

    /// <summary>
    /// Initializes the input with the default item, empty and group templates.
    /// </summary>
    protected SelectComponent(string? id = null) : base(id)
    {
        // Content, not Title: an option is a list row, so its glyph stands for both lines.
        _ = SetTemplate(new DefaultTextTemplate(binds: true).SetIconAlignment(UITextIconAlignment.Content));
        _ = SetEmptyTemplate(new DefaultEmptyTemplate());
        _ = SetGroupTemplate(new DefaultGroupTemplate(binds: true));
    }

    /// <summary>
    /// Shows the button that clears the selection.
    /// </summary>
    public T SetShowClearButton()
        => SetShowClearButton(true);
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
