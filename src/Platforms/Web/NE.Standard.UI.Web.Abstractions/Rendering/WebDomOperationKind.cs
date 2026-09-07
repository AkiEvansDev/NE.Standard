namespace NE.Standard.UI.Web.Abstractions.Rendering;

/// <summary>
/// The operations the client knows out of the box. The wire carries the name, so a package's own operation travels the same way
/// under a name of its own — <see cref="WebDomOperation.Custom"/>.
/// </summary>
public enum WebDomOperationKind
{
    Text = 0,
    Attribute = 1,
    RemoveAttribute = 2,
    ToggleAttribute = 3,
    Class = 4,
    ToggleClass = 5,
    Style = 6,
    Data = 7,
    Property = 8,
    Markup = 9
}
