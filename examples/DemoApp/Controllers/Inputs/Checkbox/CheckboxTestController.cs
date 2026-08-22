using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Inputs.Checkbox;

internal sealed partial class CheckboxChangeGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial bool Value { get; set; }

    /// <summary>
    /// Reads the controller field rather than an argument on purpose: the value the command sees is what
    /// proves the client's two-way write landed <em>before</em> the change command ran, which is the one
    /// ordering guarantee a page like this can actually check.
    /// </summary>
    public void RecordChange()
        => LogEvent($"change -> Value={Value}");
}

internal sealed partial class CheckboxValidationGroupContext : DemoGroupContext
{
    /// <summary>
    /// Starts accepted, so the rule's <c>Change</c> trigger has something to fire on: the message appears
    /// when the box is <em>un</em>checked. A bound value always wins over the component's own
    /// <c>SetValue</c>, so this default — not the view — is what decides the initial state.
    /// </summary>
    [RecursiveMember]
    public partial bool Accepted { get; set; } = true;

    public void RecordAccepted()
        => LogEvent($"accepted -> {Accepted}");
}

internal sealed partial class CheckboxTestController() : DemoController
{
    [RecursiveMember]
    public partial CheckboxChangeGroupContext ChangeGroup { get; set; } = new();

    [RecursiveMember]
    public partial CheckboxValidationGroupContext ValidationGroup { get; set; } = new();

    [UICommand]
    public void RecordChange()
        => ChangeGroup.RecordChange();

    [UICommand]
    public void RecordAccepted()
        => ValidationGroup.RecordAccepted();
}
