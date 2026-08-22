using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Contents.Image;

internal sealed partial class ImageFitGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UIImageFit Fit { get; set; } = UIImageFit.Cover;

    [RecursiveMember]
    public partial UICornerRadius CornerRadius { get; set; } = UICornerRadius.Uniform(8);

    public void CycleFit()
        => SetLastChange(nameof(Fit), Fit = CycleEnum(Fit));

    public void CycleCornerRadius()
        => SetLastChange(nameof(CornerRadius), CornerRadius = CycleValue(CornerRadius, UICornerRadius.Uniform(0), UICornerRadius.Uniform(8), UICornerRadius.Uniform(24), UICornerRadius.Uniform(999)));
}

internal sealed partial class ImageSourceGroupContext : DemoGroupContext
{
    private const string ValidSource = "https://picsum.photos/id/1015/320/200";
    private const string BrokenSource = "https://invalid.example/broken-image.jpg";

    [RecursiveMember]
    public partial string Source { get; set; } = ValidSource;

    [RecursiveMember]
    public partial string? AltText { get; set; } = "Mountain river landscape";

    public void ToggleSource()
        => SetLastChange(nameof(Source), Source = CycleValue(Source, ValidSource, BrokenSource));

    public void ToggleAltText()
        => SetLastChange(nameof(AltText), AltText = CycleValue(AltText, "Mountain river landscape", null));
}

internal sealed partial class ImageBindingController() : DemoBindingController
{
    [RecursiveMember]
    public partial ImageFitGroupContext FitGroup { get; set; } = new();

    [RecursiveMember]
    public partial ImageSourceGroupContext SourceGroup { get; set; } = new();

    [UICommand]
    public void CycleFit()
        => FitGroup.CycleFit();

    [UICommand]
    public void CycleCornerRadius()
        => FitGroup.CycleCornerRadius();

    [UICommand]
    public void ToggleSource()
        => SourceGroup.ToggleSource();

    [UICommand]
    public void ToggleAltText()
        => SourceGroup.ToggleAltText();
}
