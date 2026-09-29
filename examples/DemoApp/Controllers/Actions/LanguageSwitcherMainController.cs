using System;
using System.Threading;
using System.Threading.Tasks;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Actions;

/// <summary>A row of the language page's list: an effect's name as a key, and the school a select inside the row chooses.</summary>
internal sealed partial class LanguageEffectItem : TextItem
{
    [RecursiveMember]
    public partial string? School { get; set; }
}

/// <summary>
/// What the language page holds: values a command sets as keys, a phrase with a count and one with a name, rows added while the
/// page is open, and the options every row's select shares.
/// </summary>
internal sealed partial class LanguageSwitcherMainController : DemoController
{
    private int _files = 1;
    private int _rows;

    /// <summary>A translatable value a command sets: the key travels, the page shows its words.</summary>
    [RecursiveMember]
    public partial string? Label { get; set; } = "demo.language.cards";

    /// <summary>A key with a count: the page picks the plural form by its language's rule.</summary>
    [RecursiveMember]
    public partial UIPhrase? Files { get; set; } = FilesPhrase(1);

    /// <summary>A key with a name in a slot; the name is the controller's, picked for the session's language.</summary>
    [RecursiveMember]
    public partial UIPhrase? Greeting { get; set; } = GreetingFor("en");

    /// <summary>Empty at first: every row is built by the page after it loaded, its select given the options held since.</summary>
    [RecursiveMember(false)]
    public RecursiveCollection<LanguageEffectItem> Effects { get; } = [];

    /// <summary>The options every row's select shares, bound from the root inside the row template; their titles are keys.</summary>
    [RecursiveMember(false)]
    public RecursiveCollection<OptionItem> Schools { get; } =
    [
        new OptionItem { Id = "fire", Title = "demo.language.school.fire" },
        new OptionItem { Id = "frost", Title = "demo.language.school.frost" },
        new OptionItem { Id = "arcane", Title = "demo.language.school.arcane" }
    ];

    [UICommand]
    public void ShowCards()
        => Label = "demo.language.cards";

    [UICommand]
    public void ShowDecks()
        => Label = "demo.language.decks";

    [UICommand]
    public void AddFile()
        => Files = FilesPhrase(++_files);

    [UICommand]
    public void RemoveFile()
        => Files = FilesPhrase(_files = Math.Max(0, _files - 1));

    [UICommand]
    public void AddEffect()
    {
        _rows++;

        Effects.Add(new LanguageEffectItem
        {
            Id = $"effect-{_rows}",
            Title = _rows % 2 == 1 ? "demo.language.effect.damage" : "demo.language.effect.heal",
            School = "fire"
        });
    }

    /// <summary>A school joins the options after the page loaded: a row built later offers it too.</summary>
    [UICommand]
    public void AddSchool()
    {
        if (Schools.Count < 4)
            Schools.Add(new OptionItem { Id = "storm", Title = "demo.language.school.storm" });
    }

    /// <summary>
    /// The session switched from a command: English to Chinese, any other language to English. The page follows at once, and the
    /// controller hears it.
    /// </summary>
    [UICommand]
    public async Task SwitchFromCommandAsync()
        => await Context.UpdateSessionAsync(session => session with { Language = session.Language == "en" ? "zh-Hans" : "en" }).ConfigureAwait(false);

    /// <summary>The greeting in the language of the session that opens the page, which need not be the one it was built for.</summary>
    protected override Task OnAttachedAsync(UINavigationRequest navigation, CancellationToken cancellationToken)
    {
        Greeting = GreetingFor(Context.Handle.Session.Language);

        return Task.CompletedTask;
    }

    private static UIPhrase GreetingFor(string language)
    {
        var name = language switch
        {
            "zh-Hans" => "安",
            "ru" => "Анна",
            _ => "Ann"
        };

        return UIPhrase.Of("demo.language.greeting", ("name", name));
    }

    /// <summary>A name the controller picks itself is composed again in the new language; a bound key needs nothing.</summary>
    protected override Task OnLanguageChangedAsync(string previousLanguage, CancellationToken cancellationToken)
    {
        Greeting = GreetingFor(Context.Handle.Session.Language);

        return Task.CompletedTask;
    }

    private static UIPhrase FilesPhrase(int count)
        => UIPhrase.Of("demo.language.files", ("count", count));
}
