using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Primitives.Localization;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Shows a picture full size over the page, a lightbox the page draws by itself: fitted to the window over a dimmed backdrop, which a
/// press beside the picture or Escape puts away; a set of pictures walks by its arrows, ← and → and a swipe, with a counter.
/// </summary>
/// <remarks>
/// The pictures are given (<see cref="ShowImageEffect(IEnumerable{UILightboxImage}, int)"/>), or read off the page when it runs: the
/// picture a component shows (<see cref="Of(string, object?[])"/>), or that and the ones its other drawn rows show beside it
/// (<see cref="AmongRows(string)"/>) — a chat message's photos. Raised by an interaction it runs with no round trip.
/// </remarks>
public sealed class ShowImageEffect : ClientEffect
{
    private ShowImageEffect(IReadOnlyList<UILightboxImage> images, int startIndex, UIComponentReference? target, bool includesRows)
    {
        Images = images;
        StartIndex = startIndex;
        Target = target;
        IncludesRows = includesRows;
    }

    /// <summary>Shows one picture, with the words under it, the author's text or a phrase.</summary>
    /// <exception cref="ArgumentException">No picture may be fetched from <paramref name="source"/>.</exception>
    public ShowImageEffect(string source, UIPhrase? caption = null)
        : this([new UILightboxImage(source, caption)], 0, null, false)
    {
    }

    /// <summary>Shows a set of pictures by their addresses, from the one at <paramref name="startIndex"/>.</summary>
    /// <exception cref="ArgumentException">The set is empty, a picture's address is not one a picture may be fetched from, or the start is outside it.</exception>
    public ShowImageEffect(IEnumerable<string> sources, int startIndex = 0)
        : this(ToImages(sources), startIndex)
    {
    }

    /// <summary>Shows a set of pictures, from the one at <paramref name="startIndex"/>.</summary>
    /// <exception cref="ArgumentException">The set is empty or holds no picture, or the start is outside it.</exception>
    public ShowImageEffect(IEnumerable<UILightboxImage> images, int startIndex = 0)
        : this(ToList(images), startIndex, null, false)
    {
        ArgumentOutOfRangeException.ThrowIfNegative(startIndex);
        ArgumentOutOfRangeException.ThrowIfGreaterThanOrEqual(startIndex, Images.Count);
    }

    /// <summary>
    /// Shows the picture the component identified by <paramref name="componentId"/> shows when the effect runs — an image, or the
    /// first picture inside a surface that holds one.
    /// </summary>
    public static ShowImageEffect Of(string componentId, params object?[]? dynamicParameters)
        => Of(new UIComponentReference(componentId, dynamicParameters));

    /// <summary>Shows the picture the given component shows when the effect runs.</summary>
    public static ShowImageEffect Of(UIComponentReference component)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(component.Id);
        return new ShowImageEffect([], 0, component, false);
    }

    /// <summary>
    /// Shows the picture of the row the press came from, among the ones the same component shows in its list's other drawn rows,
    /// in their order — a message's photos; an interaction's alone, since only a press names the row.
    /// </summary>
    public static ShowImageEffect AmongRows(string componentId)
        => AmongRows(new UIComponentReference(componentId));

    /// <inheritdoc cref="AmongRows(string)"/>
    public static ShowImageEffect AmongRows(UIComponentReference component)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(component.Id);
        return new ShowImageEffect([], 0, component, true);
    }

    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.ShowImage;

    /// <inheritdoc />
    [JsonIgnore]
    public override bool CanRunInInteraction => true;

    /// <summary>Gets the pictures given; empty when they are read off <see cref="Target"/>.</summary>
    public IReadOnlyList<UILightboxImage> Images { get; }

    /// <summary>Gets the index of the picture shown first.</summary>
    public int StartIndex { get; }

    /// <summary>Gets the component whose picture is shown; null when <see cref="Images"/> are given.</summary>
    public UIComponentReference? Target { get; }

    /// <summary>Gets whether the pictures of the target's other drawn rows are shown beside its own.</summary>
    public bool IncludesRows { get; }

    /// <inheritdoc />
    public override ClientEffect Resolve(IUIReferenceResolver resolver)
    {
        ArgumentNullException.ThrowIfNull(resolver);
        return new CompiledShowImageEffect(Images, StartIndex, Target is null ? null : resolver.ResolveComponent(Target.Value), IncludesRows);
    }

    private static UILightboxImage[] ToImages(IEnumerable<string> sources)
    {
        ArgumentNullException.ThrowIfNull(sources);
        return [.. sources.Select(static source => new UILightboxImage(source))];
    }

    private static UILightboxImage[] ToList(IEnumerable<UILightboxImage> images)
    {
        ArgumentNullException.ThrowIfNull(images);

        UILightboxImage[] list = [.. images];

        if (list.Length == 0 || Array.Exists(list, static image => image is null))
            throw new ArgumentException("A set of pictures holds at least one, and no null.", nameof(images));

        return list;
    }
}

internal sealed class CompiledShowImageEffect(IReadOnlyList<UILightboxImage> images, int startIndex, UIComponentAddress? target, bool rows) : ClientEffect
{
    public override string Kind => ClientEffectKinds.ShowImage;

    /// <inheritdoc />
    [JsonIgnore]
    public override bool CanRunInInteraction => true;

    public IReadOnlyList<UILightboxImage> Images { get; } = images;

    public int StartIndex { get; } = startIndex;

    public UIComponentAddress? Target { get; } = target;

    /// <summary>Whether the target's other drawn rows show their pictures beside its own.</summary>
    public bool Rows { get; } = rows;
}
