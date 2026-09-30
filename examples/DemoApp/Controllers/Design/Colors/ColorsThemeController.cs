using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using DemoApp.Controllers.Base;
using NE.Colors;
using NE.Standard.UI.Abstractions.Styling.Theme;

namespace DemoApp.Controllers.Design.Colors;

/// <summary>
/// The reader's own primary and accent, picked on the page and put over the application's palette for this session.
/// </summary>
internal sealed partial class ReaderColorsGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UIThemeColor? Primary { get; set; }

    [RecursiveMember]
    public partial UIThemeColor? Accent { get; set; }

    /// <summary>The session's colours as the inputs show them: none where the application's palette stands.</summary>
    internal void Show(UIThemeColors? colors)
    {
        Primary = colors?.LightPrimary is ColorVariant primary ? UIThemeColor.FromColorVariant(primary) : null;
        Accent = colors?.LightAccent is ColorVariant accent ? UIThemeColor.FromColorVariant(accent) : null;
    }

    /// <summary>
    /// The colours as the session keeps them, the same in both themes; a palette role picked in place of a colour has no variant and
    /// counts as none.
    /// </summary>
    internal UIThemeColors ToColors()
        => UIThemeColors.Create(Primary?.Light, Accent?.Light);
}

/// <summary>
/// A row's background bound off and on: a transparent colour, the brand's, and none at all, which is the component's default.
/// </summary>
internal sealed partial class BackgroundGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UIThemeColor? Background { get; set; } = UIThemeColor.Transparent;

    public void Cycle()
    {
        Background = Background == UIThemeColor.Transparent ? UIThemeColor.Primary : Background == UIThemeColor.Primary ? null : UIThemeColor.Transparent;
        LogEvent($"Background -> {(Background == UIThemeColor.Transparent ? "Transparent" : Background is null ? "(none)" : "Primary")}");
    }
}

/// <summary>
/// The line the controller writes when it hears the theme or the language move, composed through the translator in the session's
/// language: text a page cannot translate by itself.
/// </summary>
internal sealed partial class HeardGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? Heard { get; set; }
}

/// <summary>
/// The theme page's controller: the reader's colours, a background bound off, and what the controller heard of the session's switches.
/// </summary>
internal sealed partial class ColorsThemeController() : DemoController
{
    [RecursiveMember]
    public partial ReaderColorsGroupContext ColorsGroup { get; set; } = new();

    [RecursiveMember]
    public partial BackgroundGroupContext BackgroundGroup { get; set; } = new();

    [RecursiveMember]
    public partial HeardGroupContext HeardGroup { get; set; } = new();

    /// <summary>The inputs start from the session's own colours, and the line from what was last heard.</summary>
    protected override Task OnAttachedAsync(UINavigationRequest navigation, CancellationToken cancellationToken)
    {
        ColorsGroup.Show(Context.Handle.Session.ThemeColors);
        HeardGroup.Heard ??= Compose("demo.colors.theme.heard.none", new Dictionary<string, object?>());

        return Task.CompletedTask;
    }

    /// <summary>The line in the session's language, written here rather than by the page: what the kept runtime must hear to follow.</summary>
    private string Compose(string key, IReadOnlyDictionary<string, object?> arguments)
        => Context.Translator.Translate(Context.Handle.Session.Language, key, arguments) ?? key;

    /// <summary>Puts the picked colours over the palette; the page reports them to its session, so every page of it follows.</summary>
    [UICommand]
    public UICommandResult ApplyColors()
    {
        UIThemeColors colors = ColorsGroup.ToColors();

        ColorsGroup.LogEvent(colors.IsEmpty ? "no colour picked: the application's palette" : "the colours are the session's");

        return UICommandResult.Ok([new SetThemeColorsEffect(colors)]);
    }

    /// <summary>Back to the application's palette.</summary>
    [UICommand]
    public UICommandResult ResetColors()
    {
        ColorsGroup.Show(null);
        ColorsGroup.LogEvent("back to the application's palette");

        return UICommandResult.Ok([new SetThemeColorsEffect()]);
    }

    [UICommand]
    public void CycleBackground()
        => BackgroundGroup.Cycle();

    /// <summary>Heard once per switch, from this page's switcher or any other page of the session.</summary>
    protected override Task OnThemeChangedAsync(UIThemeMode? previousMode, CancellationToken cancellationToken)
    {
        HeardGroup.Heard = Compose("demo.colors.theme.heard.mode", new Dictionary<string, object?>
        {
            ["previous"] = ModeName(previousMode),
            ["current"] = ModeName(Context.Handle.Session.ThemeMode)
        });

        return Task.CompletedTask;
    }

    private static UIPhrase ModeName(UIThemeMode? mode) => mode switch
    {
        UIThemeMode.Light => UIPhrase.Of("demo.colors.theme.mode.light"),
        UIThemeMode.Dark => UIPhrase.Of("demo.colors.theme.mode.dark"),
        _ => UIPhrase.Of("demo.colors.theme.mode.system")
    };

    /// <summary>
    /// Heard at the switch where this page shows, or — when the switch was made on another page — before this one paints again.
    /// </summary>
    protected override Task OnLanguageChangedAsync(string previousLanguage, CancellationToken cancellationToken)
    {
        HeardGroup.Heard = Compose("demo.colors.theme.heard.language", new Dictionary<string, object?>
        {
            ["previous"] = previousLanguage,
            ["current"] = Context.Handle.Session.Language
        });

        return Task.CompletedTask;
    }
}
