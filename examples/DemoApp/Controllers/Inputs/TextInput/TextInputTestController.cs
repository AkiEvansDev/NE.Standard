using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Inputs.TextInput;

internal sealed partial class TextInputChangeGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? Value { get; set; } = "nova-api";

    public void RecordChange()
        => LogEvent($"change -> \"{Value}\"");
}

internal sealed partial class TextInputTrimGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? Value { get; set; } = "   nova-api   ";

    /// <summary>
    /// Reports the length too: trimming happens client-side before the value is sent, so the only way to
    /// tell a trimmed value from an untrimmed one on the server is by what actually arrived.
    /// </summary>
    public void RecordChange()
        => LogEvent($"received -> \"{Value}\" (length {Value?.Length ?? 0})");
}

internal sealed partial class TextInputSubmitGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? Email { get; set; }

    /// <summary>
    /// Bound <c>OnSubmit</c>: the client holds what is typed here until the form is submitted, so the
    /// controller only ever sees the value the user actually saved.
    /// </summary>
    [RecursiveMember]
    public partial string? Notes { get; set; }

    public void Submit()
        => LogEvent($"submitted -> \"{Email}\", notes \"{Notes}\"");
}

internal sealed partial class TextInputTestController() : DemoController
{
    [RecursiveMember]
    public partial TextInputChangeGroupContext ChangeGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextInputTrimGroupContext TrimGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextInputSubmitGroupContext SubmitGroup { get; set; } = new();

    [UICommand]
    public void RecordChange()
        => ChangeGroup.RecordChange();

    [UICommand]
    public void RecordTrimmedChange()
        => TrimGroup.RecordChange();

    [UICommand]
    public void Submit()
        => SubmitGroup.Submit();
}
