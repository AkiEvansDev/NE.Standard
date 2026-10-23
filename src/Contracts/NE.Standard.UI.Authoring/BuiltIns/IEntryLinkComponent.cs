namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>
/// A link whose press may also run a command — a menu's entry, a trail's step: the host's one template draws every entry, those with an
/// address and those with a command alike, so the view's compile takes a <c>Url</c> beside a click command where the address is bound
/// or the click is the host's item click. One placed with an address of its own and a click of its own is refused, as any link is; every
/// other rule of a link holds: no toggle, no drawer's press, no control inside.
/// </summary>
public interface IEntryLinkComponent : ILinkableComponent;
