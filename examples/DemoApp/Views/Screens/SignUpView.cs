using DemoApp.Controllers.Screens;
using DemoApp.Views.Base;

namespace DemoApp.Views.Screens;

/// <summary>
/// The account form: a card in the middle of the page, its fields Tonal as a short form's on a neat centred card are, the rules a
/// real sign-up has, and a switch that reveals the company part. Every rule but the taken address runs in the browser.
/// </summary>
internal sealed class SignUpView : DemoScreenView, IUIViewDefinition
{
    private const string FormId = "sign-up";
    private const string CompanySwitchId = "sign-up-company";

    public static string ViewKey => "demo.screens.sign-up";

    protected override string ComponentRoute => "/screens/sign-up";
    protected override string Header => "demo.screens.sign-up.header";
    protected override string HeaderDescription => "demo.screens.sign-up.description";

    protected override IVisualComponent CreateScreen()
        => new ContainerComponent()
            .SetPadding(UIThickness.All(0, 24, 0, 0))
            .AddChild(CreateForm())
            .AddChild(CreateDone())
            .SetPlacement(1, 1, 24, 1);

    private static CardComponent CreateForm()
        => UIPage.Card("Start with the basics", "Servers from €6 a month, in five regions. No card until the first one.", UILayout.Stack(16,
                new TextInputComponent()
                    .SetTitle("Full name")
                    .SetAppearance(UIInputAppearance.Tonal)
                    .SetAutocomplete(UIAutocomplete.Name)
                    .SetFormId(FormId)
                    .BindValue(nameof(SignUpController.FullName))
                    .Required("Your name goes on what you send.", UIValidationTrigger.Submit),
                new TextInputComponent()
                    .SetTitle("Work email")
                    .SetType(UITextInputType.Email)
                    .SetAppearance(UIInputAppearance.Tonal)
                    .SetAutocomplete(UIAutocomplete.Email)
                    .SetFormId(FormId)
                    .BindValue(nameof(SignUpController.Email))
                    .BindValidation(nameof(SignUpController.EmailNotice))
                    .Required("An address is how you get in.", UIValidationTrigger.Submit)
                    .Regex("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$", "That does not look like an email address.", UIValidationTrigger.Blur),
                UIForm.Field(CreatePasswordField(), "Eight characters or more. A phrase beats a word."),
                // A sentence a toggle's one-line description would cut on a phone goes under it, starting where its title does.
                UILayout.Stack(2,
                    new SwitchComponent(CompanySwitchId)
                        .SetTitle("I'm signing up for a company")
                        .BindValue(nameof(SignUpController.ForCompany)),
                    UIText.Note("Invoices carry its name, and VAT goes by its country.").SetMargin(UIThickness.All(44, 0, 0, 0))
                ),
                // Revealed by the switch, in the browser: nothing here is required, so the fields can stay folded away.
                UILayout.Stack(16,
                    new TextInputComponent()
                        .SetTitle("Company name")
                        .SetAppearance(UIInputAppearance.Tonal)
                        .SetPlaceholder("As it goes on the invoice")
                        .SetAutocomplete(UIAutocomplete.Organization)
                        .SetFormId(FormId)
                        .BindValue(nameof(SignUpController.CompanyName)),
                    new SelectComponent()
                        .SetTitle("Country")
                        .SetAppearance(UIInputAppearance.Tonal)
                        .SetPlaceholder("Where the company is registered")
                        .SetOptions(
                        [
                            new OptionItem { Id = "de", Title = "Germany" },
                            new OptionItem { Id = "fr", Title = "France" },
                            new OptionItem { Id = "es", Title = "Spain" },
                            new OptionItem { Id = "it", Title = "Italy" },
                            new OptionItem { Id = "pl", Title = "Poland" },
                            new OptionItem { Id = "nl", Title = "Netherlands" },
                            new OptionItem { Id = "se", Title = "Sweden" },
                            new OptionItem { Id = "pt", Title = "Portugal" }
                        ])
                        .SetFormId(FormId)
                        .BindValue(nameof(SignUpController.Country))
                )
                .ShownWhen(CompanySwitchId),
                // The links live in a note under the box, which takes inline marks and runs on; a title is one line of plain words.
                UILayout.Stack(2,
                    new CheckboxComponent()
                        .SetTitle("I agree to the terms")
                        .SetFormId(FormId)
                        .BindValue(nameof(SignUpController.AcceptsTerms))
                        .Required("You have to agree before we can make the account.", UIValidationTrigger.Submit),
                    UIText.Note("The [terms of service](https://orvane.example/terms) and the [privacy policy](https://orvane.example/privacy), a page each.")
                        .SetMargin(UIThickness.All(26, 0, 0, 0))
                ),
                UIButtons.Pair(
                    UIButtons.Link("I already have an account"),
                    UIButtons.Primary("Create account")
                        .OnSubmit(FormId, nameof(SignUpController.CreateAccountAsync))
                        .InteractBeforeClick(IVisualComponent.LoadingProperty, true)
                        .InteractAfterClick(IVisualComponent.LoadingProperty, false)
                )
            ), DemoIcons.Outline(DemoIcons.Shield))
            .SetWidth(UILayoutLength.Absolute(460))
            .SetHorizontalAlignment(UIAlignment.Center)
            .BindVisibility(nameof(SignUpController.FormVisibility));

    /// <summary>Two rules on one field, the graver heard first; the info one only says its piece.</summary>
    private static TextInputComponent CreatePasswordField()
        => new TextInputComponent()
            .SetTitle("Password")
            .SetType(UITextInputType.Password)
            .SetAppearance(UIInputAppearance.Tonal)
            .SetAutocomplete(UIAutocomplete.NewPassword)
            .SetFormId(FormId)
            .BindValue(nameof(SignUpController.Password))
            .Required("A password is required.", UIValidationTrigger.Submit)
            .Regex("^.{8,}$", "Eight characters at least.", UIValidationTrigger.Blur)
            .Regex("[^A-Za-z0-9 ]", "A symbol or two makes it harder to guess.", UIValidationTrigger.Blur, UIValidationSeverity.Info);

    /// <summary>What replaces the form: the confirmation, and the two ways on from it.</summary>
    private static SurfaceComponent CreateDone()
        => new SurfaceComponent()
            .SetSurface(UISurfaceStyle.Raised)
            .SetWidth(UILayoutLength.Absolute(460))
            .SetHorizontalAlignment(UIAlignment.Center)
            .SetPadding(UIThickness.Uniform(24))
            .BindVisibility(nameof(SignUpController.DoneVisibility))
            // The line under the title is a paragraph: it names the address, and a title's description would end in an ellipsis.
            .SetContent(UILayout.Stack(16,
                new TextComponent()
                    .SetIcon(DemoIcons.Outline(DemoIcons.BadgeCheck))
                    .SetIconColor(UIThemeColor.Success)
                    .SetTitle("Check your inbox")
                    .AsTitle(),
                UIText.Note(string.Empty).BindDescription(nameof(SignUpController.DoneLine)),
                UIButtons.Pair(
                    UIButtons.Ghost("Start over").OnClick(nameof(SignUpController.StartOver)),
                    // A button that goes somewhere goes through a command: a navigation is an effect a command answers with, not one
                    // an interaction may run.
                    UIButtons.Primary("Open the inbox").OnClick(nameof(SignUpController.OpenInbox))
                )
                )
            );
}
