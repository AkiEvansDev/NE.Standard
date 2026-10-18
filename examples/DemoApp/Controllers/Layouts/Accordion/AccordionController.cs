using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Layouts.Accordion;

/// <summary>
/// What an accordion paints around its sections: the room inside its edge, the ground behind them, and whether it clips.
/// </summary>
/// <remarks>No spacing row: the sections share their edges as one block, which is what makes it an accordion.</remarks>
internal sealed partial class AccordionSurfaceGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UIResponsive<UIThickness>? Padding { get; set; }

    [RecursiveMember]
    public partial UIThemeColor? Background { get; set; }

    [RecursiveMember]
    public partial UIOverflow? Overflow { get; set; } = UIOverflow.Hidden;

    public AccordionSurfaceGroupContext()
    {
        AddOption(nameof(Padding), CyclePadding, () => Padding);
        AddOption(nameof(Background), CycleBackground, () => Background);
        AddOption(nameof(Overflow), CycleOverflow, () => Overflow);
    }

    public void CyclePadding()
        => SetLastChange(nameof(Padding), Padding = CycleValue(Padding, UIThickness.Uniform(8), UIThickness.Uniform(24), null));

    public void CycleBackground()
        => SetLastChange(nameof(Background), Background = CycleValue(Background, UIThemeColor.FromStyle(UIColorStyle.Surface), UIThemeColor.FromStyle(UIColorStyle.Info), null));

    public void CycleOverflow()
        => SetLastChange(nameof(Overflow), Overflow = CycleEnum(Overflow));
}

/// <summary>
/// A release set up in three steps, one section each: which is open is bound, so Next opens the following one from here, and a
/// header pressed by hand writes its own section back.
/// </summary>
internal sealed partial class ReleaseStepsGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial bool ImageOpen { get; set; } = true;

    [RecursiveMember]
    public partial bool RegionsOpen { get; set; }

    [RecursiveMember]
    public partial bool WindowOpen { get; set; }
}

internal sealed partial class AccordionController() : DemoStandardController
{
    [RecursiveMember]
    public partial AccordionSurfaceGroupContext AccordionGroup { get; set; } = new();

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();

    [RecursiveMember]
    public partial ReleaseStepsGroupContext StepsGroup { get; set; } = new();

    /// <summary>Closes the step it is pressed in as well: the accordion would, but the controller's state must not wait on the page to say so.</summary>
    [UICommand]
    public void OpenRegions()
    {
        StepsGroup.ImageOpen = false;
        StepsGroup.RegionsOpen = true;
    }

    [UICommand]
    public void OpenWindow()
    {
        StepsGroup.RegionsOpen = false;
        StepsGroup.WindowOpen = true;
    }

    [UICommand]
    public void ScheduleRelease()
    {
        StepsGroup.WindowOpen = false;
        StepsGroup.LogEvent("billing 2.5.0 scheduled for eu-west, eu-central and us-east, tonight at 02:00 UTC");
    }
}
