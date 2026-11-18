using NE.Standard.UI.Authoring.Components;
namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>Marks an item-template link entry whose host template may carry both a bound <c>Url</c> and an item-click command.</summary>
/// <remarks>
/// A static <c>Url</c> paired with its own direct click command is still refused at compile time, and standard link rules (no toggle,
/// drawer trigger or nested interactive control) continue to apply.
/// </remarks>
public interface IEntryLinkComponent : ILinkableComponent;
