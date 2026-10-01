using System;
using System.Text;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

/// <summary>
/// The browser's own form a <c>FormId</c> stands for: a hidden <c>form</c> the shell writes outside the page's root, which the
/// form's fields and submit buttons join by their <c>form</c> attribute. It is the browser's alone — what a password manager and
/// autofill read; the framework's form is still <see cref="WebAttributes.FormId"/>.
/// </summary>
public static class WebForms
{
    /// <summary>
    /// The operation a bound <c>FormId</c> points its field at its form with, creating the form where the page has none yet
    /// (<c>form-owner.ts</c>).
    /// </summary>
    public const string OwnerOperationKind = "form-owner";

    private const string ElementIdPrefix = "ui-form-";

    /// <summary>The id of the hidden form <paramref name="formId"/> stands for, as <c>formElementId</c> writes it on the client.</summary>
    public static string ElementId(string formId)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(formId);

        // An id holds no whitespace, and a `form` naming one with it would point at nothing.
        if (!formId.AsSpan().ContainsAny(" \t\n\f\r"))
            return ElementIdPrefix + formId;

        StringBuilder id = new(ElementIdPrefix, ElementIdPrefix.Length + formId.Length);

        foreach (var character in formId)
            _ = id.Append(character is ' ' or '\t' or '\n' or '\f' or '\r' ? '_' : character);

        return id.ToString();
    }
}
