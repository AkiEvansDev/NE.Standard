using DemoApp.Controllers.Base;
using DemoApp.Controllers.Inputs.FileInput;
using DemoApp.Views.Base;

namespace DemoApp.Views.Inputs.FileInput;

/// <summary>
/// One file field and every property that can be bound to it; then what it will accept, how much of it, and what it looks like once
/// something is chosen.
/// </summary>
/// <remarks>The client writes the uploaded files' handle into the two-way <c>SelectionId</c>, which the server reads back; the examples
/// upload nothing, so only the preview needs the controller.</remarks>
internal sealed class FileInputView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ValueGroup = nameof(FileInputController.ValueGroup);
    private const string FileGroup = nameof(FileInputController.FileGroup);
    private const string UploadGroup = nameof(FileInputController.UploadGroup);
    private const string ContentGroup = nameof(FileInputController.ContentGroup);
    private const string BadgeGroup = nameof(FileInputController.BadgeGroup);
    private const string BorderGroup = nameof(FileInputController.BorderGroup);
    private const long Megabyte = 1024 * 1024;

    public static string ViewKey => "demo.inputs.file-input";

    protected override string ComponentRoute => "/inputs/file-input";
    protected override string Header => "demo.inputs.file-input.header";
    protected override string HeaderDescription => "demo.inputs.file-input.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new FileInputComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindValue($"{ValueGroup}.{nameof(FileInputValueGroupContext.Value)}")
            .BindIsReadOnly($"{ValueGroup}.{nameof(FileInputValueGroupContext.IsReadOnly)}")
            .BindSize($"{ValueGroup}.{nameof(FileInputValueGroupContext.Size)}")
            .BindSelectionId($"{ValueGroup}.{nameof(FileInputValueGroupContext.SelectionId)}")
            .BindAccept($"{FileGroup}.{nameof(FileInputFileGroupContext.Accept)}")
            .BindMaxFileSize($"{FileGroup}.{nameof(FileInputFileGroupContext.MaxFileSize)}")
            .BindMultiple($"{FileGroup}.{nameof(FileInputFileGroupContext.Multiple)}")
            .BindAppearance($"{FileGroup}.{nameof(FileInputFileGroupContext.Appearance)}")
            .BindPlaceholder($"{FileGroup}.{nameof(FileInputFileGroupContext.Placeholder)}")
            .BindPrefixIcon($"{FileGroup}.{nameof(FileInputFileGroupContext.PrefixIcon)}")
            .BindSuffixIcon($"{FileGroup}.{nameof(FileInputFileGroupContext.SuffixIcon)}")
            .BindIcon($"{ContentGroup}.{nameof(TextContentGroupContext.Icon)}")
            .BindIconColor($"{ContentGroup}.{nameof(TextContentGroupContext.IconColor)}")
            .BindIconSize($"{ContentGroup}.{nameof(TextContentGroupContext.IconSize)}")
            .BindTitle($"{ContentGroup}.{nameof(TextContentGroupContext.Title)}")
            .BindTitleType($"{ContentGroup}.{nameof(TextContentGroupContext.TitleType)}")
            .BindTitleColor($"{ContentGroup}.{nameof(TextContentGroupContext.TitleColor)}")
            .BindTooltip($"{ContentGroup}.{nameof(TextContentGroupContext.Tooltip)}")
            .BindTooltipPlacement($"{ContentGroup}.{nameof(TextContentGroupContext.TooltipPlacement)}")
            .BindBadgePlacement($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgePlacement)}")
            .BindBadgeStyle($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeStyle)}")
            .BindBadgeColor($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeColor)}")
            .BindBadgeIcon($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeIcon)}")
            .BindBadgeIconColor($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeIconColor)}")
            .BindBadgeIconSize($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeIconSize)}")
            .BindBadgeText($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeText)}")
            .BindBadgeTextType($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeTextType)}")
            .BindBadgeTooltip($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeTooltip)}")
            .BindBadgeTooltipPlacement($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeTooltipPlacement)}")
            .BindBorderColor($"{BorderGroup}.{nameof(BorderGroupContext.BorderColor)}")
            .BindBorderThickness($"{BorderGroup}.{nameof(BorderGroupContext.BorderThickness)}")
            .BindBorderRadius($"{BorderGroup}.{nameof(BorderGroupContext.BorderRadius)}")
            .SetPlacement(1, 1, 24, 1)
        ));

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(ValueGroup, "Value", nameof(FileInputController.CycleValueOption)),
            DemoUI.CreateOptionSection(FileGroup, "File", nameof(FileInputController.CycleFileOption)),
            DemoUI.CreateOptionSection(UploadGroup, "Upload", nameof(FileInputController.CycleUploadOption), "A server round trip, not a property: what the last upload reported."),
            DemoUI.CreateOptionSection(ContentGroup, "Content", nameof(FileInputController.CycleContentOption)),
            DemoUI.CreateOptionSection(BadgeGroup, "Badge", nameof(FileInputController.CycleBadgeOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(FileInputController.CycleBorderOption))
        );

    protected override IVisualComponent[] CreateExamples()
        => [.. DemoUI.CreateColumns([CreateUsesGroup()], [CreateFormGroup()]), CreateContractGroup(), CreateRefusalGroup()];

    /// <summary>
    /// The jobs it is given, and what a single file and a set of them look like in one row.
    /// </summary>
    private static ContainerComponent CreateUsesGroup()
    {
        return DemoUI.CreateExample("Where it is used",
            UILayout.Stack(16)
                .AddChild(new FileInputComponent()
                    .SetTitle("Avatar")
                    .SetIcon(DemoIcons.UserRound)
                    .SetAccept("image/png,image/jpeg")
                    .SetPlaceholder("PNG or JPEG, up to 2 MB")
                    .SetMaxFileSize(2 * Megabyte)
                )
                .AddChild(new FileInputComponent()
                    .SetTitle("TLS certificate")
                    .SetIcon(DemoIcons.FileText)
                    .SetAccept(".pem,.crt")
                    .SetPlaceholder("One certificate for bramble.example")
                )
                .AddChild(new FileInputComponent()
                    .SetTitle("Attachments")
                    .SetIcon(DemoIcons.Upload)
                    .SetMultiple(true)
                    .SetPlaceholder("Anything the reviewer should see")
                    .SetBadgeText("several at once")
                    .SetBadgeStyle(UIBadgeType.Info)
                )
        );
    }

    /// <summary>
    /// The field among the others it is submitted with: one row of a form rather than a page of its own.
    /// </summary>
    private static ContainerComponent CreateFormGroup()
    {
        return DemoUI.CreateExample("In a form",
            new CardComponent()
                .ConfigureDefaultHeader(header => header
                    .SetIcon(DemoIcons.FileText)
                    .SetTitle("Attach to the review")
                    .SetDescription("Everything here is submitted together")
                )
                .SetContent(UILayout.Stack(12)
                    .AddChild(new TextInputComponent()
                        .SetTitle("What it is")
                        .SetValue("Rollback plan")
                    )
                    .AddChild(new FileInputComponent()
                        .SetTitle("The file")
                        .SetIcon(DemoIcons.File)
                        .SetAccept(".md,.pdf")
                        .SetPlaceholder("Markdown or PDF, up to 2 MB")
                        .SetMaxFileSize(2 * Megabyte)
                        .Required("A file is required.")
                    )
                )
                .SetFooter(UILayout.Row(8)
                    .AddChild(UIButtons.Primary("Attach"))
                    .AddChild(UIButtons.Ghost("Cancel"))
                )
        );
    }

    /// <summary>
    /// With nothing chosen the placeholder is the whole contract, so it is written rather than left to the filter.
    /// </summary>
    /// <remarks>Side by side, because the three contracts only read as a set of choices when they can be compared.</remarks>
    private static ContainerComponent CreateContractGroup()
    {
        return DemoUI.CreateExample("What the empty field promises",
            // Three to a row at the page's width, each as wide as a form's field: at 320 the third wrapped onto a row alone.
            UILayout.Row(24)
                .AddChild(UIPage.Labelled("One kind of file", new FileInputComponent()
                    .SetTitle("Deploy manifest")
                    .SetAccept(".yaml,.yml")
                    .SetPlaceholder("A single .yaml, up to 256 KB")
                    .SetMaxFileSize(256 * 1024)
                    .SetWidth(UILayoutLength.Absolute(300))
                    )
                )
                .AddChild(UIPage.Labelled("A whole family of them", new FileInputComponent()
                    .SetTitle("Screenshot")
                    .SetAccept("image/*")
                    .SetPlaceholder("Any image, up to 5 MB")
                    .SetMaxFileSize(5 * Megabyte)
                    .SetWidth(UILayoutLength.Absolute(300))
                    )
                )
                .AddChild(UIPage.Labelled("Several, each within the limit", new FileInputComponent()
                    .SetTitle("Attachments")
                    .SetMultiple(true)
                    .SetMaxFileSize(5 * Megabyte)
                    .SetPlaceholder("Each of them at most 5 MB, not all of them together")
                    .SetWidth(UILayoutLength.Absolute(300))
                    )
                ),
            columns: 24,
            note: "The filter and the limit are a courtesy to the reader, **not a guarantee**: the transfer endpoint enforces its own, because nothing the client says about a file can be trusted — see [the transfer design](https://docs.orvane.example/files)."
        );
    }

    /// <summary>
    /// A file over the limit is refused where the field is, in the page's language: one file by the limit, several by the names left out.
    /// </summary>
    private static ContainerComponent CreateRefusalGroup()
    {
        return DemoUI.CreateExample("A file over the limit",
            UILayout.Row(24)
                .AddChild(UIPage.Labelled("One file, 1 MB at most", new FileInputComponent()
                    .SetTitle("Signed contract")
                    .SetPlaceholder("A PDF of 1 MB at most")
                    .SetMaxFileSize(Megabyte)
                    .SetWidth(UILayoutLength.Absolute(320))
                    )
                )
                .AddChild(UIPage.Labelled("Several, each 1 MB at most", new FileInputComponent()
                    .SetTitle("Receipts")
                    .SetMultiple(true)
                    .SetMaxFileSize(Megabyte)
                    .SetPlaceholder("Pick several, one of them larger than 1 MB")
                    .SetWidth(UILayoutLength.Absolute(320))
                    )
                ),
            columns: 24,
            note: "Pick a file over 1 MB: the first field says \"The file is larger than 1 MB.\" on its validation line; the second keeps the files within the limit and names the ones left out. Switch the language and the line is written again; the next pick clears it."
        );
    }
}
