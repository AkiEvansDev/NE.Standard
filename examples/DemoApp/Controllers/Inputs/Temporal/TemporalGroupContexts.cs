using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Inputs.Temporal;

/// <summary>
/// The field a date, a time or a date-and-time is typed into, with the display formats passed in.
/// </summary>
/// <remarks><c>DisplayFormat</c> is the only formatting property with a row; the rest are unbindable.</remarks>
internal sealed partial class TemporalFieldGroupContext : AffixedFieldGroupContext
{
    private readonly string _firstFormat;
    private readonly string _secondFormat;

    [RecursiveMember]
    public partial string? DisplayFormat { get; set; }

    public TemporalFieldGroupContext(string firstFormat, string secondFormat) : base(null, DemoIcons.Clock, DemoIcons.History)
    {
        _firstFormat = firstFormat;
        _secondFormat = secondFormat;

        AddOption(nameof(DisplayFormat), CycleDisplayFormat, () => DisplayFormat);
        AddAppearanceOption();
        AddAffixIconOptions();
    }

    // Back to null last: that is the control's own default, the culture's short pattern.
    public void CycleDisplayFormat()
        => SetLastChange(nameof(DisplayFormat), DisplayFormat = CycleValue(DisplayFormat, _firstFormat, _secondFormat, null));

}
