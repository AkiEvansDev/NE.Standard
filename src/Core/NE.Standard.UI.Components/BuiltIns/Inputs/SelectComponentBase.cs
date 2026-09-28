using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A field that opens a list of options: the field's chrome and the list's templates, whatever the value made of the options is.
/// </summary>
/// <remarks><see cref="SelectComponent{T, TItem}"/> holds one key and <see cref="MultiSelectComponent{T, TItem}"/> a list of them.</remarks>
[UIComponentPropertyBlock(typeof(IBorderedComponent))]
public abstract partial class SelectComponentBase<T, TItem, TValue> : OptionsInputComponentBase<T, TItem, TValue>, IAffixedInputComponent, IPlaceholderInputComponent
    where T : SelectComponentBase<T, TItem, TValue>, IUIComponentDefinition
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

    /// <summary>
    /// Gets or sets where the list opens against the field — below its start edge by default, flipping when there's no room.
    /// Decided once at render.
    /// </summary>
    [UIComponentProperty(IsBindable = false, DefaultValue = UIPopupPlacement.BottomStart)]
    public UIPopupPlacement? PopupPlacement { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IFieldInputComponent), DefaultValue = UIInputAppearance.Filled)]
    public UIInputAppearance? Appearance { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ISizedInputComponent), DefaultValue = UIInputSize.Medium)]
    public UIInputSize? Size { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IFieldInputComponent), IsBindable = false, DefaultValue = UIInputTitlePlacement.Top)]
    public UIInputTitlePlacement? TitlePlacement { get; set; }

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
    protected SelectComponentBase(string? id = null) : base(id)
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
