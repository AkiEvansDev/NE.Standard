using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Layouts.Flyout;

internal sealed partial class FlyoutGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial bool IsOpen { get; set; }
}

internal sealed partial class FlyoutBindingController() : DemoBindingController
{
    [RecursiveMember]
    public partial FlyoutGroupContext FlyoutGroup { get; set; } = new();
}
