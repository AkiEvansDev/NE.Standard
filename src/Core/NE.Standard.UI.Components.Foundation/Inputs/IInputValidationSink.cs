using NE.Standard.UI.Abstractions.Interaction;

namespace NE.Standard.UI.Components.Foundation.Inputs;

/// <summary>
/// Where an input keeps the validation rules the extension methods add to it.
/// </summary>
internal interface IInputValidationSink
{
    void AddValidation(UIValidationRule rule);
}
