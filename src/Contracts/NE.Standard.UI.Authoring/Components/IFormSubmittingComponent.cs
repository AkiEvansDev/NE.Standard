namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// An input one of whose own events submits the form its value belongs to (<c>FormId</c>), as a submit button's press does: the
/// form's rules are judged and its held values sent before the command — a code field's save. The client's registration of the
/// event says the same (<c>submitsForm</c>).
/// </summary>
public interface IFormSubmittingComponent : IInputComponent
{
    /// <summary>Whether the event <paramref name="eventName"/> submits the input's form.</summary>
    bool SubmitsForm(string eventName);
}
