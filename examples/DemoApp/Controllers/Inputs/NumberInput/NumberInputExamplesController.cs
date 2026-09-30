using System.Globalization;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Inputs.NumberInput;

/// <summary>
/// A count with an upper bound, the controller's copy written under the group: whatever is typed, it never holds one past the bound.
/// </summary>
internal sealed partial class NumberBoundsGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial decimal? Replicas { get; set; } = 4;

    public void Changed()
        => LogEvent($"the controller holds {Replicas?.ToString(CultureInfo.InvariantCulture) ?? "nothing"}");
}

/// <summary>
/// The one number input on the Examples page with state: a bound the server holds as well as the page.
/// </summary>
internal sealed partial class NumberInputExamplesController() : DemoController
{
    [RecursiveMember]
    public partial NumberBoundsGroupContext BoundsGroup { get; set; } = new();

    [UICommand]
    public void ReplicasChanged()
        => BoundsGroup.Changed();
}
