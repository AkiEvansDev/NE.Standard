namespace NE.Standard.UI.Abstractions.Recursive;

/// <summary>
/// Stands for a client's value the reader stopped building past its limits (<see cref="ObjectToInferredTypesConverter.ToInferredValue(System.Text.Json.JsonElement, int, int)"/>):
/// <see cref="RecursiveValueCoercion.IsWithinLimits"/> refuses it, so the write is answered as one its input cannot read.
/// </summary>
public sealed class RecursiveValuePastLimits
{
    private RecursiveValuePastLimits()
    {
    }

    /// <summary>Gets the one instance.</summary>
    public static RecursiveValuePastLimits Instance { get; } = new();
}
