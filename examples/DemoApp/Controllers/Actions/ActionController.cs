using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Actions;

/// <summary>
/// One action, and every property that can be bound to it — a button's groups plus the action's own.
/// </summary>
internal sealed partial class ActionController() : DemoStandardController
{
    [RecursiveMember]
    public partial ButtonGroupContext ButtonGroup { get; set; } = new();

    [RecursiveMember]
    public partial ActionGroupContext ActionGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextLabelGroupContext LabelGroup { get; set; } = new("Past-due invoices", "Due this week");

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();
}
