using System.Threading;
using System.Threading.Tasks;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Services;

namespace DemoApp.Controllers.Actions.Button;

internal sealed partial class ButtonTestGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial int ClickCount { get; set; }

    [RecursiveMember]
    public partial int SlowClickCount { get; set; }

    public void RecordClick()
        => LogEvent($"OnClick fired (count={++ClickCount})");

    public void RecordSlowClick()
        => LogEvent($"Slow OnClick fired (count={++SlowClickCount})");

    public void RecordEffect(string effect)
        => LogEvent($"{effect} effect returned by the command");
}

internal sealed partial class ButtonTestController() : DemoController
{
    [RecursiveMember]
    public partial ButtonTestGroupContext TestGroup { get; set; } = new();

    [UICommand]
    public void RecordClick()
        => TestGroup.RecordClick();

    [UICommand]
    public async Task RecordSlowClickAsync()
    {
        await Task.Delay(1200).ConfigureAwait(false);
        TestGroup.RecordSlowClick();
    }

    /// <summary>
    /// Id of the component the effect commands below target. Declared here rather than on the view so the
    /// command and the component it addresses cannot drift apart.
    /// </summary>
    internal const string EffectTargetId = "button-test-effect-target";

    [UICommand]
    public UICommandResult FocusEffectTarget()
    {
        TestGroup.RecordEffect("Focus + ScrollTo");

        return UICommandResult.Ok([new FocusEffect(EffectTargetId), new ScrollToEffect(EffectTargetId)]);
    }

    [UICommand]
    public UICommandResult HideEffectTarget()
    {
        TestGroup.RecordEffect("Hide");

        return UICommandResult.Ok([new HideEffect(EffectTargetId)]);
    }

    [UICommand]
    public UICommandResult ShowEffectTarget()
    {
        TestGroup.RecordEffect("Show");

        return UICommandResult.Ok([new ShowEffect(EffectTargetId)]);
    }

    /// <summary>
    /// Key of the dialog declared by <c>ButtonTestView.CreateDialogs</c>.
    /// </summary>
    internal const string DialogKey = "button-test-dialog";

    [UICommand]
    public UICommandResult OpenTestDialog()
    {
        TestGroup.RecordEffect("OpenDialog");

        return UICommandResult.Ok([new OpenDialogEffect(DialogKey)]);
    }

    [UICommand]
    public UICommandResult CloseTestDialog()
    {
        TestGroup.RecordEffect("CloseDialog");

        return UICommandResult.Ok([new CloseDialogEffect(DialogKey)]);
    }

    /// <summary>
    /// The service path rather than the effect path: <see cref="IUIDialogService"/> pushes straight to the
    /// connection, so the dialog appears while this command is still running — a full second before its
    /// result reaches the client. Returning an <c>OpenDialogEffect</c> instead could only ever open it
    /// after the command finished.
    /// </summary>
    [UICommand]
    public async Task OpenDialogFromServiceAsync(CancellationToken cancellationToken)
    {
        TestGroup.RecordEffect("Dialogs.ShowAsync (pushed mid-command)");

        _ = await Context.Dialogs.ShowAsync(Context.Handle, DialogKey, cancellationToken).ConfigureAwait(false);

        await Task.Delay(1000, cancellationToken).ConfigureAwait(false);

        TestGroup.RecordEffect("command finished a second after the dialog appeared");
    }

    [UICommand]
    public UICommandResult NotifySuccess()
    {
        TestGroup.RecordEffect("ShowNotification (Success)");

        return UICommandResult.Ok([new ShowNotificationEffect("Build 481 deployed to staging.", UIColorStyle.Success)]);
    }

    [UICommand]
    public UICommandResult NotifyDanger()
    {
        TestGroup.RecordEffect("ShowNotification (Danger)");

        return UICommandResult.Ok(
        [
            new ShowNotificationEffect("Deploy failed: the staging health check never went green, so the release was rolled back.", UIColorStyle.Danger)
        ]);
    }

    [UICommand]
    public UICommandResult NavigateToTextExample()
    {
        TestGroup.RecordEffect("Navigate");

        return UICommandResult.Ok([new NavigateEffect(new UINavigationRequest { Route = "/contents/text/example" })]);
    }
}
