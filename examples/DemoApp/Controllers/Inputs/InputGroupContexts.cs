using System.Globalization;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Inputs;

/// <summary>
/// The one row every value section ends on: whether the field can be typed into at all.
/// </summary>
/// <remarks>The derived constructor registers it through <see cref="AddReadOnlyOption"/> after its own rows, so it closes the section.</remarks>
internal abstract partial class InputValueGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial bool IsReadOnly { get; set; }

    protected void AddReadOnlyOption()
        => AddOption(nameof(IsReadOnly), ToggleIsReadOnly, () => IsReadOnly);

    public void ToggleIsReadOnly()
        => SetLastChange(nameof(IsReadOnly), IsReadOnly = !IsReadOnly);
}

/// <summary>
/// What every field draws around what is typed into it: the appearance, and the hint shown while it is empty.
/// </summary>
internal abstract partial class FieldChromeGroupContext(string? placeholder) : DemoGroupContext
{
    // A field as well: a primary-constructor parameter may not be both captured and used to initialize a member.
    private readonly string? _placeholder = placeholder;

    [RecursiveMember]
    public partial UIInputAppearance? Appearance { get; set; } = UIInputAppearance.Filled;

    [RecursiveMember]
    public partial string? Placeholder { get; set; } = placeholder;

    protected void AddAppearanceOption()
        => AddOption(nameof(Appearance), CycleAppearance, () => Appearance);

    protected void AddPlaceholderOption()
        => AddOption(nameof(Placeholder), TogglePlaceholder, () => Placeholder);

    public void CycleAppearance()
        => SetLastChange(nameof(Appearance), Appearance = CycleEnum(Appearance));

    // Only visible with the field empty, which is what the Value row's empty and unset steps are for.
    public void TogglePlaceholder()
        => SetLastChange(nameof(Placeholder), Placeholder = CycleValue(Placeholder, null, _placeholder));
}

/// <summary>
/// A field with a glyph at either end; the glyphs are passed in because an affix says what the field is for.
/// </summary>
internal abstract partial class AffixedFieldGroupContext(string? placeholder, string prefixGlyph, string suffixGlyph) : FieldChromeGroupContext(placeholder)
{
    [RecursiveMember]
    public partial string? PrefixIcon { get; set; }

    [RecursiveMember]
    public partial string? SuffixIcon { get; set; }

    protected void AddAffixIconOptions()
    {
        AddOption(nameof(PrefixIcon), CyclePrefixIcon, () => PrefixIcon);
        AddOption(nameof(SuffixIcon), CycleSuffixIcon, () => SuffixIcon);
    }

    public void CyclePrefixIcon()
        => SetLastChange(nameof(PrefixIcon), PrefixIcon = CycleIconValue(PrefixIcon, prefixGlyph));

    public void CycleSuffixIcon()
        => SetLastChange(nameof(SuffixIcon), SuffixIcon = CycleIconValue(SuffixIcon, suffixGlyph));
}

/// <summary>
/// A field that opens a list: the clear button and the chevron beside the affixes.
/// </summary>
internal abstract partial class OptionsFieldGroupContext(string? placeholder, string prefixGlyph, string suffixGlyph) : AffixedFieldGroupContext(placeholder, prefixGlyph, suffixGlyph)
{
    [RecursiveMember]
    public partial bool ShowClearButton { get; set; }

    [RecursiveMember]
    public partial bool ShowChevron { get; set; } = true;

    protected void AddAdornmentOptions()
    {
        AddOption(nameof(ShowClearButton), ToggleShowClearButton, () => ShowClearButton);
        AddOption(nameof(ShowChevron), ToggleShowChevron, () => ShowChevron);
    }

    public void ToggleShowClearButton()
        => SetLastChange(nameof(ShowClearButton), ShowClearButton = !ShowClearButton);

    public void ToggleShowChevron()
        => SetLastChange(nameof(ShowChevron), ShowChevron = !ShowChevron);
}

/// <summary>
/// The value halves of the input pages' group contexts, shared by the type the family's value has.
/// </summary>
internal partial class TextValueGroupContext : InputValueGroupContext
{
    private readonly string _sample;
    private readonly string _alternate;

    [RecursiveMember]
    public partial string? Value { get; set; }

    [RecursiveMember]
    public partial int? MaxLength { get; set; }

    [RecursiveMember]
    public partial bool TrimInput { get; set; }

    // The two sample strings are the page's, because what reads well differs by field.
    public TextValueGroupContext(string sample = "Payments API", string alternate = "Web Portal")
    {
        _sample = sample;
        _alternate = alternate;
        Value = sample;

        AddOption(nameof(Value), CycleValue, () => Value);
        AddOption(nameof(MaxLength), CycleMaxLength, () => MaxLength);
        AddOption(nameof(TrimInput), ToggleTrimInput, () => TrimInput);
    }

    // Empty and unset are different values a field may draw differently, so both are steps.
    public void CycleValue()
        => SetLastChange(nameof(Value), Value = CycleValue(Value, _sample, _alternate, "", null));

    // Down to 8 first, so the effect lands on the value already in the field.
    public void CycleMaxLength()
        => SetLastChange(nameof(MaxLength), MaxLength = CycleValue(MaxLength, 8, 24, null));

    public void ToggleTrimInput()
        => SetLastChange(nameof(TrimInput), TrimInput = !TrimInput);
}

/// <summary>
/// What the single-line field adds to the shared text value: the clear button.
/// </summary>
internal sealed partial class TextInputValueGroupContext : TextValueGroupContext
{
    [RecursiveMember]
    public partial bool ShowClearButton { get; set; }

    public TextInputValueGroupContext()
    {
        AddOption(nameof(ShowClearButton), ToggleShowClearButton, () => ShowClearButton);
        AddReadOnlyOption();
    }

    public void ToggleShowClearButton()
        => SetLastChange(nameof(ShowClearButton), ShowClearButton = !ShowClearButton);
}

/// <summary>
/// The text value as a text area holds it: the shared rows, closed by the read-only switch.
/// </summary>
internal sealed partial class TextAreaValueGroupContext : TextValueGroupContext
{
    public TextAreaValueGroupContext(string sample, string alternate) : base(sample, alternate)
    {
        AddReadOnlyOption();
    }
}

/// <summary>
/// A boolean and whether it can be moved — the whole value surface of a checkbox and of a switch.
/// </summary>
/// <remarks>The value steps through <see langword="null"/> too, which is what a control with no answer yet shows.</remarks>
internal sealed partial class ToggleValueGroupContext : InputValueGroupContext
{
    [RecursiveMember]
    public partial bool? Value { get; set; } = true;

    public ToggleValueGroupContext()
    {
        AddOption(nameof(Value), CycleValue, () => Value);
        AddReadOnlyOption();
    }

    public void CycleValue()
        => SetLastChange(nameof(Value), Value = CycleValue(Value, true, false, null));
}

/// <summary>
/// The value a list of options holds — an option's key, not its text.
/// </summary>
/// <remarks>A key naming an option no longer in the list is reachable on purpose: the control falls back to showing nothing.</remarks>
internal sealed partial class OptionValueGroupContext : InputValueGroupContext
{
    [RecursiveMember]
    public partial string? Value { get; set; } = "eu-west-1";

    public OptionValueGroupContext()
    {
        AddOption(nameof(Value), CycleValue, () => Value);
        AddReadOnlyOption();
    }

    public void CycleValue()
        => SetLastChange(nameof(Value), Value = CycleValue(Value, "eu-west-1", "us-east-1", "ap-south-1", null));
}

/// <summary>
/// The list behind a dropdown or a radio group: each row prints the collection's state and pressing it moves the collection.
/// </summary>
internal partial class OptionListGroupContext : DemoGroupContext
{
    private int _added;

    [RecursiveMember(false)]
    public RecursiveCollection<OptionItem> Options { get; } =
    [
        CreateOption("eu-west-1", "Ireland", "Europe", "3 zones · 12 ms from Dublin"),
        CreateOption("us-east-1", "N. Virginia", "Americas", "6 zones · the cheapest of the three"),
        CreateOption("ap-south-1", "Mumbai", "Asia Pacific", "3 zones · no cold storage yet"),
    ];

    public OptionListGroupContext()
    {
        AddOption("Add", AddRegion, () => Options.Count);
        AddOption("Remove", RemoveRegion, () => Options.Count);
        AddOption("Grouped", ToggleGrouped, () => Options.Count > 0 && Options[0].Group is not null);
        AddOption("Disable last", ToggleDisabledLast, () => Options.Count > 0 && Options[^1].Enabled == false);
    }

    public void AddRegion()
    {
        var id = string.Create(CultureInfo.InvariantCulture, $"region-{++_added}");

        Options.Add(CreateOption(id, string.Create(CultureInfo.InvariantCulture, $"Region {_added}"), "Added", "Added while the page was open"));
    }

    /// <summary>
    /// Removing the selected option is not guarded against: the control falls back to showing no value.
    /// </summary>
    public void RemoveRegion()
    {
        if (Options.Count > 0)
            _ = Options.Remove(Options[^1]);
    }

    /// <summary>
    /// Writes the group onto every option or clears it from all of them; the group is the option's property.
    /// </summary>
    public void ToggleGrouped()
    {
        var grouped = Options.Count > 0 && Options[0].Group is not null;

        for (var i = 0; i < Options.Count; i++)
            Options[i].Group = grouped ? null : GroupOf(Options[i].Id);
    }

    public void ToggleDisabledLast()
    {
        if (Options.Count == 0)
            return;

        OptionItem last = Options[^1];

        last.Enabled = last.Enabled == false;
    }

    // One item model: a radio group draws the description under each option, a dropdown inside its list.
    private static OptionItem CreateOption(string id, string title, string group, string description)
        => new() { Id = id, Title = title, Group = group, Description = description };

    private static string GroupOf(string? id)
        => id switch
        {
            "eu-west-1" => "Europe",
            "us-east-1" => "Americas",
            "ap-south-1" => "Asia Pacific",
            _ => "Added"
        };
}
