using DemoApp.Controllers.Screens;
using DemoApp.Views.Base;

namespace DemoApp.Views.Screens;

/// <summary>
/// The subscription form in the filled style beside its summary: three steps across the top, two fields to a line where two
/// belong on one, a region chosen by word, and an invoice address a box hides.
/// </summary>
internal sealed class CheckoutView : DemoScreenView, IUIViewDefinition
{
    private const string FormId = "checkout";
    private const string StepsId = "checkout-steps";
    private const string SameBillingId = "checkout-same-billing";
    private const string BilledId = "checkout-billed";

    public static string ViewKey => "demo.screens.checkout";

    protected override string ComponentRoute => "/screens/checkout";
    protected override string Header => "demo.screens.checkout.header";
    protected override string HeaderDescription => "demo.screens.checkout.description";

    protected override IVisualComponent CreateScreen()
        => new ContainerComponent()
            .SetPadding(UIThickness.All(0, 8, 0, 0))
            .AddChild(UIPage.Column(UIColumnWidth.Wide, UILayout.Split(CreateForm(), CreateSummary(), sideSpan: 9))
                .BindVisibility<CheckoutController>(static x => x.FormVisibility)
            )
            // The placed order's own cell, shown with it: left over the form, an empty band would take the presses on the form's head.
            .AddChild(UICard.Centered(CreatePlaced()).BindVisibility<CheckoutController>(static x => x.PlacedVisibility))
            .SetPlacement(1, 1, 24, 1);

    // Filled, set once for the form's fields: a long form whose fields stack, where the line under each finds its edge.
    private static StackPanelComponent CreateForm()
        => UILayout.Stack(28,
            new StepsComponent(StepsId)
                .BindItems<CheckoutController>(static x => x.Steps)
                .BindSelectedKey<CheckoutController>(static x => x.Step),
            CreatePlanStep(),
            CreateAddressStep(),
            CreateConfirmStep()
        )
        .SetDefaults<SelectComponent>(static c => c.SetAppearance(UIInputAppearance.Filled).SetFormId(FormId))
        .SetDefaults<NumberInputComponent>(static c => c.SetAppearance(UIInputAppearance.Filled).SetFormId(FormId))
        .SetDefaults<TextInputComponent>(static c => c.SetAppearance(UIInputAppearance.Filled).SetFormId(FormId))
        .SetDefaults<TextAreaComponent>(static c => c.SetAppearance(UIInputAppearance.Filled).SetFormId(FormId));

    private static StackPanelComponent CreatePlanStep()
        => UILayout.Stack(28,
            UIPage.Section("Plan", "What each server is, and how many of them.",
                UIForm.Row(
                    new SelectComponent()
                        .SetTitle("Plan")
                        .SetOptions(
                        [
                            new OptionItem { Id = CheckoutController.StarterPlan, Title = "Starter", Description = "1 vCPU · 2 GB · 40 GB · €6" },
                            new OptionItem { Id = CheckoutController.StandardPlan, Title = "Standard", Description = "2 vCPU · 4 GB · 80 GB · €18" },
                            new OptionItem { Id = CheckoutController.ProPlan, Title = "Pro", Description = "4 vCPU · 16 GB · 240 GB · €64" },
                            new OptionItem { Id = CheckoutController.DedicatedPlan, Title = "Dedicated", Description = "16 vCPU · 64 GB · 960 GB · €290" }
                        ])
                        .BindValue<CheckoutController>(static x => x.Plan)
                        .OnChange(nameof(CheckoutController.UpdateSummary)),
                    new NumberInputComponent()
                        .SetTitle("Servers")
                        .SetMin(1)
                        .SetMax(40)
                        .SetAllowDecimals(false)
                        .SetShowStepper()
                        .BindValue<CheckoutController>(static x => x.Servers)
                        .OnChange(nameof(CheckoutController.UpdateSummary))
                )
            ),
            UIPage.Section("Region", null,
                new RadioGroupComponent()
                    .SetOptions(
                    [
                        new OptionItem { Id = CheckoutController.EuWest, Title = "Europe West", Description = "Amsterdam · eu-west" },
                        new OptionItem { Id = CheckoutController.EuCentral, Title = "Europe Central", Description = "Frankfurt · eu-central" },
                        new OptionItem { Id = CheckoutController.EuNorth, Title = "Europe North", Description = "Stockholm · eu-north" },
                        new OptionItem { Id = CheckoutController.UsEast, Title = "US East", Description = "Ashburn · us-east" },
                        new OptionItem { Id = CheckoutController.ApSouth, Title = "Asia South", Description = "Singapore · ap-south" }
                    ])
                    .BindValue<CheckoutController>(static x => x.Region)
                    .OnChange(nameof(CheckoutController.UpdateSummary))
            ),
            UIButtons.Pair(
                UIButtons.Ghost("Back to plans").SetUrl("/screens/catalogue"),
                UIButtons.Primary("Continue to address").OnClick(nameof(CheckoutController.NextStep))
            )
        )
        .ShownWhen(StepsId, ISelectedKeyComponent.SelectedKeyProperty, UIComparisonOperator.Equal, CheckoutController.PlanStep);

    private static StackPanelComponent CreateAddressStep()
        => UILayout.Stack(28,
            UIPage.Section("Billed", "Whether the subscription is billed to the company directly or through a reseller.",
                new RadioGroupComponent(BilledId)
                    .SetTitle("Billed")
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetOptions(
                    [
                        new OptionItem { Id = CheckoutController.BilledDirectly, Title = "Directly" },
                        new OptionItem { Id = CheckoutController.BilledThroughReseller, Title = "Through a reseller" }
                    ])
                    .BindValue<CheckoutController>(static x => x.Billed)
            ),
            // Folded away when a reseller pays, in the browser: the rule reads the radio group's value.
            UIPage.Section("Company address", null,
                new TextInputComponent()
                    .SetTitle("Company")
                    .SetPlaceholder("Bramble Studio")
                    .SetAutocomplete(UIAutocomplete.Organization)
                    .BindValue<CheckoutController>(static x => x.Company),
                new TextInputComponent()
                    .SetTitle("Street and number")
                    .SetAutocomplete(UIAutocomplete.AddressLine1)
                    .BindValue<CheckoutController>(static x => x.Street),
                UIForm.Row(
                    new TextInputComponent()
                        .SetTitle("City")
                        .SetAutocomplete(UIAutocomplete.City)
                        .BindValue<CheckoutController>(static x => x.City),
                    new TextInputComponent()
                        .SetTitle("Postcode")
                        .SetAutocomplete(UIAutocomplete.PostalCode)
                        .BindValue<CheckoutController>(static x => x.Postcode)
                ),
                new SelectComponent()
                    .SetTitle("Country")
                    .SetOptions(
                    [
                        new OptionItem { Id = "nl", Title = "Netherlands" },
                        new OptionItem { Id = "de", Title = "Germany" },
                        new OptionItem { Id = "se", Title = "Sweden" },
                        new OptionItem { Id = "fr", Title = "France" }
                    ])
                    .BindValue<CheckoutController>(static x => x.Country)
            )
            .HiddenWhen(BilledId, CheckoutController.BilledThroughReseller),
            UIPage.Section("Invoices", null,
                new CheckboxComponent(SameBillingId)
                    .SetTitle("Invoices go to the company address")
                    .BindValue<CheckoutController>(static x => x.SameBilling),
                UILayout.Stack(16,
                    new TextInputComponent()
                        .SetTitle("Street and number")
                        .BindValue<CheckoutController>(static x => x.BillingStreet),
                    UIForm.Row(
                        new TextInputComponent()
                            .SetTitle("City")
                            .BindValue<CheckoutController>(static x => x.BillingCity),
                        new TextInputComponent()
                            .SetTitle("Postcode")
                            .BindValue<CheckoutController>(static x => x.BillingPostcode)
                    )
                )
                .ShownWhen(SameBillingId, false)
            ),
            UIButtons.Pair(
                UIButtons.Ghost("Back").OnClick(nameof(CheckoutController.PreviousStep)),
                UIButtons.Primary("Continue to confirm").OnClick(nameof(CheckoutController.NextStep))
            )
        )
        .ShownWhen(StepsId, ISelectedKeyComponent.SelectedKeyProperty, UIComparisonOperator.Equal, CheckoutController.AddressStep);

    private static StackPanelComponent CreateConfirmStep()
        => UILayout.Stack(28,
            UIPage.Section("Billing contact", "Where the invoices go, and a number for an outage.",
                UIForm.Row(
                    new TextInputComponent()
                        .SetTitle("Email")
                        .SetType(UITextInputType.Email)
                        .SetAutocomplete(UIAutocomplete.Email)
                        .BindValue<CheckoutController>(static x => x.Email)
                        .Required("The invoices have to go somewhere.", UIValidationTrigger.Submit)
                        .Regex("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$", "That does not look like an email address.", UIValidationTrigger.Blur),
                    new TextInputComponent()
                        .SetTitle("Phone")
                        .SetType(UITextInputType.Tel)
                        .SetAutocomplete(UIAutocomplete.Telephone)
                        .SetPlaceholder("Only if on-call should ring")
                        .BindValue<CheckoutController>(static x => x.Phone)
                )
            ),
            UIPage.Section("On the invoice", null,
                UIForm.Field(new TextAreaComponent()
                    .SetTitle("Invoice note")
                    .SetPlaceholder("Left blank, nothing is printed")
                    .SetRows(3)
                    .SetMaxLength(200)
                    .BindValue<CheckoutController>(static x => x.InvoiceNote),
                    "Printed on every invoice, two hundred characters at most.")
            ),
            UIButtons.Pair(
                UIButtons.Ghost("Back").OnClick(nameof(CheckoutController.PreviousStep)),
                UIButtons.Primary("Subscribe")
                    .OnSubmitShowingLoading(FormId, nameof(CheckoutController.PlaceOrderAsync))
            )
        )
        .ShownWhen(StepsId, ISelectedKeyComponent.SelectedKeyProperty, UIComparisonOperator.Equal, CheckoutController.ConfirmStep);

    /// <summary>The subscription read rather than edited: the lines, the sums the server keeps, and the one field that talks to it.</summary>
    private static CardComponent CreateSummary()
        => UICard.Create("Your subscription", "Billed monthly, VAT added below.", UILayout.Stack(12,
            UIDetails.List().BindItems<CheckoutController>(static x => x.Lines),
            new SeparatorComponent(),
            // Filled: the separators above and below already frame it, and a line under it would only add weight to the card.
            new TextInputComponent()
                .SetPlaceholder("Promo code")
                .SetAppearance(UIInputAppearance.Filled)
                .SetTrimInput()
                .SetTrailingAction(UIButtons.Ghost("Apply").SetSize(UISize.Small).OnClick(nameof(CheckoutController.ApplyPromo)))
                .BindValue<CheckoutController>(static x => x.Promo)
                .BindValidation<CheckoutController>(static x => x.PromoNotice)
                .OnChange(nameof(CheckoutController.PromoChanged)),
            // The server's verdict on the code, kept in the summary until the code changes; shown later, each is read out.
            UIMessage.BoundCreate(UIColorStyle.Success, null, nameof(CheckoutController.PromoVerdict))
                .BindVisibility<CheckoutController>(static x => x.PromoAppliedVisibility),
            UIMessage.BoundCreate(UIColorStyle.Danger, null, nameof(CheckoutController.PromoVerdict))
                .BindVisibility<CheckoutController>(static x => x.PromoRefusedVisibility),
            new SeparatorComponent(),
            UIDetails.Amount("Subtotal", nameof(CheckoutController.SubtotalLine)),
            UIDetails.Amount("Discount", nameof(CheckoutController.DiscountLine)).BindVisibility<CheckoutController>(static x => x.DiscountVisibility),
            UIDetails.Amount("VAT, 21%", nameof(CheckoutController.VatLine)),
            UIDetails.Total("Total a month", nameof(CheckoutController.TotalLine))
        ), DemoIcons.Outline(DemoIcons.File))
            .SetVerticalAlignment(UIAlignment.Start);

    /// <summary>What replaces the form once the order is placed.</summary>
    private static SurfaceComponent CreatePlaced()
        => UIPage.BoundOutcome(
            DemoIcons.Outline(DemoIcons.BadgeCheck),
            UIColorStyle.Success,
            nameof(CheckoutController.PlacedTitle),
            nameof(CheckoutController.PlacedLine),
            UIButtons.Ghost("Back to the catalogue").SetUrl("/screens/catalogue")
        );
}
