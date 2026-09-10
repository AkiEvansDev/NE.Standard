namespace NE.Standard.UI.Primitives.Constants;

/// <summary>
/// What a browser may fill a field with, in the browser's own words. The list is the platform's, not this framework's, so a token
/// it does not name here is still a valid value for <c>Autocomplete</c>; these are the ones an application reaches for.
/// </summary>
/// <remarks>
/// A password manager only offers to remember a sign-in when it can see which field is the name and which is the password, so a
/// sign-in page names both: <see cref="Username"/> and <see cref="CurrentPassword"/>.
/// </remarks>
public static class UIAutocomplete
{
    /// <summary>The browser fills nothing here.</summary>
    public const string Off = "off";

    /// <summary>The account name of a sign-in pair.</summary>
    public const string Username = "username";

    /// <summary>The password of a sign-in pair.</summary>
    public const string CurrentPassword = "current-password";

    /// <summary>A password being chosen, on a sign-up or a change-password form.</summary>
    public const string NewPassword = "new-password";

    /// <summary>A one-time code, which a phone may offer from a message.</summary>
    public const string OneTimeCode = "one-time-code";

    /// <summary>An email address.</summary>
    public const string Email = "email";

    /// <summary>A telephone number.</summary>
    public const string Telephone = "tel";

    /// <summary>A person's full name.</summary>
    public const string Name = "name";

    /// <summary>An organisation's name.</summary>
    public const string Organization = "organization";

    /// <summary>The first line of a street address.</summary>
    public const string AddressLine1 = "address-line1";

    /// <summary>The second line of a street address.</summary>
    public const string AddressLine2 = "address-line2";

    /// <summary>A town or city.</summary>
    public const string City = "address-level2";

    /// <summary>A postal code.</summary>
    public const string PostalCode = "postal-code";

    /// <summary>A country name.</summary>
    public const string Country = "country-name";
}
