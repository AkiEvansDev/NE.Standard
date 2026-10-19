using System.Diagnostics.CodeAnalysis;
using NE.Standard.UI.Authoring.Components;

namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>
/// An input drawn as a field the reader types into at a caret — an <c>&lt;input&gt;</c> or a <c>&lt;textarea&gt;</c> — which an
/// <c>InsertTextEffect</c> types into: a text input, a text area, a number input, a search's field, a package's code editor.
/// </summary>
[SuppressMessage("Design", "CA1040:Avoid empty interfaces", Justification = "Marks what the page draws a caret field for, which the effect-target check reads; it adds no member of its own.")]
public interface ICaretFieldComponent : IInputComponent;
