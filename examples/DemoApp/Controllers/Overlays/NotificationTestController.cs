using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Commands;

namespace DemoApp.Controllers.Overlays;

internal sealed partial class NotificationGroupContext : DemoGroupContext
{
    public void Report(string message)
        => LogEvent(message);
}

internal sealed partial class NotificationTestController() : DemoController
{
    private int _pushed;

    [RecursiveMember]
    public partial NotificationGroupContext SeverityGroup { get; set; } = new();

    [RecursiveMember]
    public partial NotificationGroupContext StackGroup { get; set; } = new();

    [RecursiveMember]
    public partial NotificationGroupContext LengthGroup { get; set; } = new();

    [RecursiveMember]
    public partial NotificationGroupContext PlacementGroup { get; set; } = new();

    [UICommand]
    public UICommandResult NotifyInfo()
        => Notify(UIColorStyle.Info, "Build 481 is queued behind two others.");

    [UICommand]
    public UICommandResult NotifySuccess()
        => Notify(UIColorStyle.Success, "Build 481 deployed to staging.");

    [UICommand]
    public UICommandResult NotifyWarning()
        => Notify(UIColorStyle.Warning, "The staging certificate expires in three days.");

    [UICommand]
    public UICommandResult NotifyDanger()
        => Notify(UIColorStyle.Danger, "Deploy failed: the health check never went green.");

    private UICommandResult Notify(UIColorStyle severity, string message)
    {
        SeverityGroup.Report($"ShowNotification ({severity})");

        return UICommandResult.Ok([new ShowNotificationEffect(message, severity)]);
    }

    /// <summary>
    /// Three at once, which is the case the host exists for: it stacks them and each keeps its own timer.
    /// </summary>
    [UICommand]
    public UICommandResult NotifyThree()
    {
        StackGroup.Report("three effects in one result");

        return UICommandResult.Ok(
        [
            new ShowNotificationEffect("Queued.", UIColorStyle.Info),
            new ShowNotificationEffect("Built.", UIColorStyle.Primary),
            new ShowNotificationEffect("Deployed.", UIColorStyle.Success)
        ]);
    }

    [UICommand]
    public UICommandResult NotifyOneMore()
    {
        _pushed++;

        StackGroup.Report($"pushed #{_pushed}");

        return UICommandResult.Ok([new ShowNotificationEffect($"Pushed notification #{_pushed}.", UIColorStyle.Accent)]);
    }

    [UICommand]
    public UICommandResult NotifyLong()
    {
        LengthGroup.Report("a message that has to wrap");

        return UICommandResult.Ok(
        [
            new ShowNotificationEffect(
                "The staging deploy was rolled back because the health check at https://staging.nova.dev/healthz answered 503 for ninety seconds, which is longer than the window the release gate allows.",
                UIColorStyle.Danger
            )
        ]);
    }

    [UICommand]
    public UICommandResult NotifyPlacement()
    {
        PlacementGroup.Report("this page asks for the top corner");

        return UICommandResult.Ok([new ShowNotificationEffect("Up here, because the view says so.", UIColorStyle.Primary)]);
    }
}
