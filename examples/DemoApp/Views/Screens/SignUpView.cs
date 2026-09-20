using DemoApp.Controllers.Screens;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Extensions;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Screens;

/// <summary>
/// The account form in the outline style: a card in the middle of the page, the rules a real sign-up has, and a switch
/// that reveals the team part. Every rule but the taken address runs in the browser.
/// </summary>
internal sealed class SignUpView : DemoScreenView, IUIViewDefinition
{
    private const string FormId = "sign-up";
    private const string TeamSwitchId = "sign-up-team";

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
        => UIPage.Card("Start with the basics", "Free for a team of three. No card, no trial clock.", UILayout.Stack(16,
                new TextInputComponent()
                    .SetTitle("Full name")
                    .SetAppearance(UIInputAppearance.Outline)
                    .SetAutocomplete(UIAutocomplete.Name)
                    .SetFormId(FormId)
                    .BindValue(nameof(SignUpController.FullName))
                    .Required("Your name goes on what you send.", UIValidationTrigger.Submit),
                new TextInputComponent()
                    .SetTitle("Work email")
                    .SetType(UITextInputType.Email)
                    .SetAppearance(UIInputAppearance.Outline)
                    .SetAutocomplete(UIAutocomplete.Email)
                    .SetFormId(FormId)
                    .BindValue(nameof(SignUpController.Email))
                    .BindValidation(nameof(SignUpController.EmailNotice))
                    .Required("An address is how you get in.", UIValidationTrigger.Submit)
                    .Regex("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$", "That does not look like an email address.", UIValidationTrigger.Blur),
                UIForm.Field(CreatePasswordField(), "Eight characters or more. A phrase beats a word."),
                new SwitchComponent(TeamSwitchId)
                    .SetTitle("I'm setting this up for a team")
                    .SetDescription("Invite people and share a room from the first day.")
                    .SetDescriptionColor(UIThemeColor.Muted)
                    .BindValue(nameof(SignUpController.ForTeam)),
                // Revealed by the switch, in the browser: nothing here is required, so the fields can stay folded away.
                UILayout.Stack(16,
                    new TextInputComponent()
                        .SetTitle("Team name")
                        .SetAppearance(UIInputAppearance.Outline)
                        .SetPlaceholder("What the room is called")
                        .SetAutocomplete(UIAutocomplete.Organization)
                        .SetFormId(FormId)
                        .BindValue(nameof(SignUpController.TeamName)),
                    new SelectComponent()
                        .SetTitle("Team size")
                        .SetAppearance(UIInputAppearance.Outline)
                        .SetPlaceholder("How many of you")
                        .SetOptions(
                        [
                            new OptionItem { Id = "2-5", Title = "2 to 5" },
                            new OptionItem { Id = "6-20", Title = "6 to 20" },
                            new OptionItem { Id = "21-100", Title = "21 to 100" },
                            new OptionItem { Id = "100+", Title = "More than 100" }
                        ])
                        .SetFormId(FormId)
                        .BindValue(nameof(SignUpController.TeamSize))
                )
                .ShownWhen(TeamSwitchId),
                // The links live in the description: a title is one line of plain words, a description takes inline marks.
                new CheckboxComponent()
                    .SetTitle("I agree to the terms")
                    .SetDescription("The [terms of service](https://example.com/terms) and the [privacy policy](https://example.com/privacy), a page each.")
                    .SetDescriptionColor(UIThemeColor.Muted)
                    .SetFormId(FormId)
                    .BindValue(nameof(SignUpController.AcceptsTerms))
                    .Required("You have to agree before we can make the account.", UIValidationTrigger.Submit),
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
            .SetAppearance(UIInputAppearance.Outline)
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
            ));
}
