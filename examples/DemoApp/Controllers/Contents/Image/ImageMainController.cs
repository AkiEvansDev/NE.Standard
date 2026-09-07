using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Contents.Image;

/// <summary>
/// One picture, and every property that can be bound to it.
/// </summary>
internal sealed partial class ImageMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial ImageGroupContext ImageGroup { get; set; } = new();

    [UICommand]
    public void CycleImageOption(string id)
        => ImageGroup.CycleOption(id);
}
