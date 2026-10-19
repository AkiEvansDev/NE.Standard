namespace NE.Standard.UI.Compiled.Views;

/// <summary>
/// What a view compiled with that is likely not what its author meant, and of which kind: a binding naming nothing, or advice.
/// </summary>
public sealed record UICompileWarning(UICompileWarningKind Kind, string Message)
{
    /// <inheritdoc />
    public override string ToString()
        => Message;
}
