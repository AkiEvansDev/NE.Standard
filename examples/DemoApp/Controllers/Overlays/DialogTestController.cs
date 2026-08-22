using System.Threading;
using System.Threading.Tasks;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Commands;

namespace DemoApp.Controllers.Overlays;

internal sealed partial class DialogGroupContext : DemoGroupContext
{
    public void Report(string message)
        => LogEvent(message);
}

internal sealed partial class DialogTestController() : DemoController
{
    /// <summary>The keys the view declares its dialogs under; a dialog is addressed by key, never by id.</summary>
    internal const string StandardKey = "overlay-dialog-standard";
    internal const string StubbornKey = "overlay-dialog-stubborn";
    internal const string ModelessKey = "overlay-dialog-modeless";
    internal const string FormKey = "overlay-dialog-form";
    internal const string ScreenKey = "overlay-dialog-screen";

    [RecursiveMember]
    public partial DialogGroupContext StandardGroup { get; set; } = new();

    [RecursiveMember]
    public partial DialogGroupContext SwitchesGroup { get; set; } = new();

    [RecursiveMember]
    public partial DialogGroupContext ServiceGroup { get; set; } = new();

    [RecursiveMember]
    public partial DialogGroupContext FormGroup { get; set; } = new();

    /// <summary>The value the form dialog edits — ordinary controller state, bound the ordinary way.</summary>
    [RecursiveMember]
    public partial string ServiceName { get; set; } = "nova-api";

    [UICommand]
    public UICommandResult OpenStandard()
    {
        StandardGroup.Report("OpenDialogEffect");

        return UICommandResult.Ok([new OpenDialogEffect(StandardKey)]);
    }

    [UICommand]
    public UICommandResult CloseStandard()
    {
        StandardGroup.Report("CloseDialogEffect");

        return UICommandResult.Ok([new CloseDialogEffect(StandardKey)]);
    }

    [UICommand]
    public UICommandResult OpenStubborn()
    {
        SwitchesGroup.Report("opened a dialog that only its own button closes");

        return UICommandResult.Ok([new OpenDialogEffect(StubbornKey)]);
    }

    // Static, because it reads nothing on the controller — which is what CA1822 asks for and what the command
    // discovery now honours.
    [UICommand]
    public static UICommandResult CloseStubborn()
        => UICommandResult.Ok([new CloseDialogEffect(StubbornKey)]);

    [UICommand]
    public UICommandResult OpenScreen()
    {
        SwitchesGroup.Report("opened one built out of the page background");

        return UICommandResult.Ok([new OpenDialogEffect(ScreenKey)]);
    }

    [UICommand]
    public static UICommandResult CloseScreen()
        => UICommandResult.Ok([new CloseDialogEffect(ScreenKey)]);

    [UICommand]
    public UICommandResult OpenModeless()
    {
        SwitchesGroup.Report("opened a dialog the page underneath still answers to");

        return UICommandResult.Ok([new OpenDialogEffect(ModelessKey)]);
    }

    [UICommand]
    public static UICommandResult CloseModeless()
        => UICommandResult.Ok([new CloseDialogEffect(ModelessKey)]);

    /// <summary>
    /// The service rather than the effect: it pushes straight to the connection, so the dialog is on screen
    /// while this command is still running. An effect could only ever arrive with the command's result.
    /// </summary>
    [UICommand]
    public async Task OpenFromServiceAsync(CancellationToken cancellationToken)
    {
        ServiceGroup.Report("Dialogs.ShowAsync — pushed mid-command");

        _ = await Context.Dialogs.ShowAsync(Context.Handle, StandardKey, cancellationToken).ConfigureAwait(false);

        await Task.Delay(1200, cancellationToken).ConfigureAwait(false);

        ServiceGroup.Report("the command finished more than a second after the dialog appeared");
    }

    [UICommand]
    public static UICommandResult OpenForm()
        => UICommandResult.Ok([new OpenDialogEffect(FormKey)]);

    /// <summary>
    /// A dialog's content is ordinary compiled components, so what it edits is ordinary controller state and
    /// the value is already written by the time this runs.
    /// </summary>
    [UICommand]
    public UICommandResult SaveForm()
    {
        FormGroup.Report($"saved '{ServiceName}'");

        return UICommandResult.Ok(
        [
            new CloseDialogEffect(FormKey),
            new ShowNotificationEffect($"Saved '{ServiceName}'.", UIColorStyle.Success)
        ]);
    }

    [UICommand]
    public static UICommandResult CancelForm()
        => UICommandResult.Ok([new CloseDialogEffect(FormKey)]);
}
