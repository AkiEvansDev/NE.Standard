using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Contents.Paragraph;

/// <summary>
/// One paragraph, and every property that can be bound to it — the text page's groups, plus wrapping.
/// </summary>
internal sealed partial class ParagraphMainController : DemoStandardController
{
    // Narrow to begin with, or the paragraph never reaches a second line to wrap onto.
    public ParagraphMainController()
    {
        MainGroup.Width = UILayoutLength.Absolute(320);
    }

    [RecursiveMember]
    public partial TextContentGroupContext ContentGroup { get; set; } = new(
        "Release notes",
        "Every merge to the release branch is built, signed and published to the internal feed, and the notes below are generated from the commits that went into it."
    );

    [RecursiveMember]
    public partial ParagraphLayoutGroupContext LayoutGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextBadgeGroupContext BadgeGroup { get; set; } = new();

    [UICommand]
    public void CycleContentOption(string id)
        => ContentGroup.CycleOption(id);

    [UICommand]
    public void CycleLayoutOption(string id)
        => LayoutGroup.CycleOption(id);

    [UICommand]
    public void CycleBadgeOption(string id)
        => BadgeGroup.CycleOption(id);
}
