using DemoApp.Controllers.Actions;
using DemoApp.Controllers.Base;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Actions;

/// <summary>
/// One split button in each of its two modes, and every button property bound to both through <see cref="DemoButtonBindings"/>.
/// </summary>
/// <remarks>Two panes because <c>Mode</c> is not bindable; the menu adds no property of its own, only entries and a command.</remarks>
internal sealed class SplitButtonMainView : DemoMainView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ButtonGroup = nameof(SplitButtonMainController.ButtonGroup);
    private const string ContentGroup = nameof(SplitButtonMainController.ContentGroup);
    private const string LayoutGroup = nameof(SplitButtonMainController.LayoutGroup);
    private const string BadgeGroup = nameof(SplitButtonMainController.BadgeGroup);
    private const string BorderGroup = nameof(SplitButtonMainController.BorderGroup);

    public static string ViewKey => "demo.actions.split-button.main";

    protected override string ComponentRoute => "/actions/split-button";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.actions.split-button.header";
    protected override string HeaderDescription => "demo.actions.split-button.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(360,
            ("Split: the label is the command, the end opens the menu", frame => frame.AddChild(CreatePane(UISplitButtonMode.Split))),
            ("Menu: the whole button opens the menu", frame => frame.AddChild(CreatePane(UISplitButtonMode.Menu)))
        );

    private static StackPanelComponent CreatePane(UISplitButtonMode mode)
    {
        SplitButtonComponent button = DemoButtonBindings.Bind(new SplitButtonComponent(), ButtonGroup, ContentGroup, LayoutGroup, BadgeGroup, BorderGroup)
            .SetMode(mode)
            .SetItems(CreateEntries())
            .OnItemClickWithItemKey(nameof(SplitButtonMainController.MergeAs));

        // A menu button's own click never runs, and the renderer refuses one: only the split pane carries it.
        if (mode == UISplitButtonMode.Split)
            _ = button.OnClick(nameof(SplitButtonMainController.Merge));

        return new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(12)
            .AddChild(button)
            .AddChild(new TextComponent()
                .SetTitleType(UITextAppearance.Caption)
                .SetTitleColor(UIThemeColor.Muted)
                .BindTitle(nameof(SplitButtonMainController.LastPress))
            )
            .SetPlacement(1, 1, 24, 1);
    }

    private static MenuItem[] CreateEntries()
        =>
        [
            new() { Id = "merge-commit", Title = "Create a merge commit", Icon = DemoIcons.Outline(DemoIcons.Check) },
            new() { Id = "rebase", Title = "Rebase and merge", Icon = DemoIcons.Outline(DemoIcons.History) },
            new() { Id = "rule", Kind = UIMenuItemKind.Separator },
            new() { Id = "draft", Title = "Convert to draft", Icon = DemoIcons.Outline(DemoIcons.Edit), Enabled = false }
        ];

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(ButtonGroup, "Button", nameof(SplitButtonMainController.CycleButtonOption)),
            DemoUI.CreateOptionSection(LayoutGroup, "Layout", nameof(SplitButtonMainController.CycleLayoutOption)),
            DemoUI.CreateOptionSection(ContentGroup, "Content", nameof(SplitButtonMainController.CycleContentOption)),
            DemoUI.CreateOptionSection(BadgeGroup, "Badge", nameof(SplitButtonMainController.CycleBadgeOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(SplitButtonMainController.CycleBorderOption))
        );
}
