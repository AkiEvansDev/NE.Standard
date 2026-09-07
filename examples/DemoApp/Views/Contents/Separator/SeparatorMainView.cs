using DemoApp.Controllers.Base;
using DemoApp.Controllers.Contents.Separator;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;

namespace DemoApp.Views.Contents.Separator;

/// <summary>
/// One rule, and every property that can be bound to it.
/// </summary>
/// <remarks>Drawn between two lines of text, since a rule alone in a frame makes every row unreadable; a vertical one needs the <c>Height</c> row.</remarks>
internal sealed class SeparatorMainView : DemoMainView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string SeparatorGroup = nameof(SeparatorMainController.SeparatorGroup);

    public static string ViewKey => "demo.contents.separator.main";

    protected override string ComponentRoute => "/contents/separator";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.contents.separator.header";
    protected override string HeaderDescription => "demo.contents.separator.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new StackPanelComponent()
            // A stack, not the frame's grid rows: a taller container hands its slack to its tracks.
            .BindOrientation($"{SeparatorGroup}.{nameof(SeparatorGroupContext.PreviewOrientation)}")
            .SetSpacing(4)
            .AddChild(new TextComponent()
                .SetTitle("Everything before the rule")
                .SetTitleType(UITextAppearance.Body)
            )
            .AddChild(new SeparatorComponent()
                .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
                .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
                .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
                .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
                .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
                .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
                .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
                .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
                .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
                .BindOrientation($"{SeparatorGroup}.{nameof(SeparatorGroupContext.Orientation)}")
                .BindLabel($"{SeparatorGroup}.{nameof(SeparatorGroupContext.Label)}")
                .BindColor($"{SeparatorGroup}.{nameof(SeparatorGroupContext.Color)}")
            )
            .AddChild(new TextComponent()
                .SetTitle("Everything after it")
                .SetTitleType(UITextAppearance.Body)
            )
            .SetPlacement(1, 1, 24, 1)
        ), contentMinHeight: 140);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(SeparatorGroup, "Separator", nameof(SeparatorMainController.CycleSeparatorGroupOption))
        );
}
