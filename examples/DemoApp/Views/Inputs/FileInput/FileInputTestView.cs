using DemoApp.Controllers.Inputs.FileInput;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Indicators;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Inputs.FileInput;

/// <summary>
/// Covers what only a live transfer proves for a file input: that picking a file actually sends it, that the
/// id the picker writes back resolves to that file on the server, and that a staged download reaches the
/// browser. All of it is invisible to a green build — the binding page can exercise every picker property
/// while nothing is transferred at all, which is exactly what it did before the transport existed.
/// </summary>
internal sealed class FileInputTestView : DemoTestView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.file-input.test";

    protected override string ComponentRoute => "/inputs/file-input";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.inputs.file-input.header";
    protected override string HeaderDescription => "demo.inputs.file-input.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateUploadGroup())
            .AddChild(CreateDownloadGroup());
    }

    /// <summary>
    /// <c>SelectionId</c> is bound, not <c>Value</c>: the field shows the file names, the id is what the
    /// service takes. Picking one file lets the second button read the bytes back.
    /// </summary>
    private static ContainerComponent CreateUploadGroup()
    {
        return DemoUI.CreateGroup(nameof(FileInputTestController.UploadGroup), "Upload round trip",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(12)
                .AddChild(new FileInputComponent()
                    .SetTitle("Pick a file")
                    .BindSelectionId(nameof(FileUploadGroupContext.SelectionId), UIBindingScope.Relative)
                )
                .AddChild(new TextComponent()
                    .SetTitleType(UITextAppearance.Caption)
                    .BindTitle(nameof(FileUploadGroupContext.Files), UIBindingScope.Relative)
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new()
            {
                ["Read selection"] = nameof(FileInputTestController.ReadSelectionAsync),
                ["Read content"] = nameof(FileInputTestController.ReadContentAsync)
            }),
            contentMinHeight: 220
        );
    }

    /// <summary>
    /// The progress bar follows the command that <em>builds</em> the file. The transfer itself is the
    /// browser's business — see <c>docs/FILES.md</c> §6.
    /// </summary>
    private static ContainerComponent CreateDownloadGroup()
    {
        return DemoUI.CreateGroup(nameof(FileInputTestController.DownloadGroup), "Download with bound progress",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(12)
                .AddChild(new ProgressComponent()
                    .BindValue(nameof(FileDownloadGroupContext.Progress), UIBindingScope.Relative)
                    .SetShowValue(true)
                    .SetHorizontalAlignment(UIAlignment.Stretch)
                )
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(FileInputTestController.DownloadReportAsync))
                    .BindLoading(nameof(FileDownloadGroupContext.IsRunning), UIBindingScope.Relative)
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .ConfigureDefaultContent(c => _ = c.SetTitle("Generate and download"))
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            static _ => { },
            contentMinHeight: 190
        );
    }
}
