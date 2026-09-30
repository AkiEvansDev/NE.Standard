using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Inputs.Select;

/// <summary>
/// Opens and closes the roster dialog, whose rows set two selects beside a number and a switch in four narrow cells.
/// </summary>
internal sealed partial class SelectExamplesController() : DemoController
{
    /// <summary>The roster dialog's key.</summary>
    public const string RosterKey = "demo-select-roster";

    [UICommand]
    public static UICommandResult OpenRoster()
        => UICommandResult.Ok([new OpenDialogEffect(RosterKey)]);

    [UICommand]
    public static UICommandResult CloseRoster()
        => UICommandResult.Ok([new CloseDialogEffect(RosterKey)]);
}
