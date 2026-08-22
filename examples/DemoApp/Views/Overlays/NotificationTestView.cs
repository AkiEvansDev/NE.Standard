using DemoApp.Controllers.Overlays;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Overlays;

/// <summary>
/// A notification has no component and no place in the tree: a command returns an effect, and the client
/// builds the host on demand under the body. Which corner it builds it in is the view's to say, which is why
/// this page asks for the top one and every other page in the demo takes the bottom.
/// </summary>
internal sealed class NotificationTestView : DemoTestView, IUIViewDefinition
{
    public static string ViewKey => "demo.overlays.notification.test";

    public override UIViewOptions Options => new()
    {
        StickyHeader = true,
        NotificationPlacement = UINotificationPlacement.Top
    };

    protected override string ComponentRoute => "/overlays/notification";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Test];
    protected override string Header => "demo.overlays.notification.header";
    protected override string HeaderDescription => "demo.overlays.notification.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateSeverityGroup())
            .AddChild(CreateStackGroup())
            .AddChild(CreateLengthGroup())
            .AddChild(CreatePlacementGroup());
    }

    private static ContainerComponent CreateSeverityGroup()
    {
        return DemoUI.CreateGroup(nameof(NotificationTestController.SeverityGroup), "Severity",
            content => content
                .AddRow(UIGridUnit.Auto())
                .AddRow(UIGridUnit.Auto())
                .AddRow(UIGridUnit.Auto())
                .AddChild(CreateButton("Info", nameof(NotificationTestController.NotifyInfo), 1))
                .AddChild(CreateButton("Success", nameof(NotificationTestController.NotifySuccess), 2))
                .AddChild(CreateButton("Warning", nameof(NotificationTestController.NotifyWarning), 3))
                .AddChild(CreateButton("Danger", nameof(NotificationTestController.NotifyDanger), 4)),
            static _ => { },
            contentMinHeight: 180
        );
    }

    private static ContainerComponent CreateStackGroup()
    {
        return DemoUI.CreateGroup(nameof(NotificationTestController.StackGroup), "Several at once",
            content => content
                .AddRow(UIGridUnit.Auto())
                .AddChild(CreateButton("Three in one result", nameof(NotificationTestController.NotifyThree), 1))
                .AddChild(CreateButton("One more", nameof(NotificationTestController.NotifyOneMore), 2)),
            static _ => { },
            contentMinHeight: 180
        );
    }

    private static ContainerComponent CreateLengthGroup()
    {
        return DemoUI.CreateGroup(nameof(NotificationTestController.LengthGroup), "A message that wraps",
            content => content.AddChild(CreateButton("Show", nameof(NotificationTestController.NotifyLong), 1)),
            static _ => { },
            contentMinHeight: 140
        );
    }

    private static ContainerComponent CreatePlacementGroup()
    {
        return DemoUI.CreateGroup(nameof(NotificationTestController.PlacementGroup), "Placement is the view's",
            content => content.AddChild(CreateButton("Show", nameof(NotificationTestController.NotifyPlacement), 1)),
            static _ => { },
            contentMinHeight: 140
        );
    }

    private static ButtonComponent CreateButton(string title, string command, int row)
        => new ButtonComponent()
            .OnClick(command)
            .SetType(UIButtonType.Outline)
            .SetHorizontalAlignment(UIAlignment.Start)
            .SetPlacement(1, row, 24, 1)
            .ConfigureDefaultContent(c => c.SetTitle(title));
}
