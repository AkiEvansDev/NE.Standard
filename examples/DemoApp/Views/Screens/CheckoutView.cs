using DemoApp.Controllers.Screens;
using DemoApp.Views.Base;

namespace DemoApp.Views.Screens;

/// <summary>
/// The subscription form in the filled style beside its summary: sections down the page, two fields to a line where two
/// belong on one, a region chosen by word, and an invoice address a box hides.
/// </summary>
internal sealed class CheckoutView : DemoScreenView, IUIViewDefinition
{
    private const string FormId = "checkout";
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
                .BindVisibility(nameof(CheckoutController.FormVisibility))
            )
            // The placed order's own cell, shown with it: left over the form, an empty band would take the presses on the form's head.
            .AddChild(UICard.Centered(CreatePlaced()).BindVisibility(nameof(CheckoutController.PlacedVisibility)))
            .SetPlacement(1, 1, 24, 1);

    // Filled, set on each field: a long form whose fields stack, where the line under each finds its edge.
    private static StackPanelComponent CreateForm()
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
                        .SetAppearance(UIInputAppearance.Filled)
                        .SetFormId(FormId)
                        .BindValue(nameof(CheckoutController.Plan))
                        .OnChange(nameof(CheckoutController.UpdateSummary)),
                    new NumberInputComponent()
                        .SetTitle("Servers")
                        .SetMin(1)
                        .SetMax(40)
                        .SetAllowDecimals(false)
                        .SetShowStepper()
                        .SetAppearance(UIInputAppearance.Filled)
                        .SetFormId(FormId)
                        .BindValue(nameof(CheckoutController.Servers))
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
                    .BindValue(nameof(CheckoutController.Region))
                    .OnChange(nameof(CheckoutController.UpdateSummary))
            ),
            UIPage.Section("Billing contact", "Where the invoices go, and a number for an outage.",
                UIForm.Row(
                    new TextInputComponent()
                        .SetTitle("Email")
                        .SetType(UITextInputType.Email)
                        .SetAutocomplete(UIAutocomplete.Email)
                        .SetAppearance(UIInputAppearance.Filled)
                        .SetFormId(FormId)
                        .BindValue(nameof(CheckoutController.Email))
                        .Required("The invoices have to go somewhere.", UIValidationTrigger.Submit)
                        .Regex("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$", "That does not look like an email address.", UIValidationTrigger.Blur),
                    new TextInputComponent()
                        .SetTitle("Phone")
                        .SetType(UITextInputType.Tel)
                        .SetAutocomplete(UIAutocomplete.Telephone)
                        .SetPlaceholder("Only if on-call should ring")
                        .SetAppearance(UIInputAppearance.Filled)
                        .SetFormId(FormId)
                        .BindValue(nameof(CheckoutController.Phone))
                ),
                new RadioGroupComponent(BilledId)
                    .SetTitle("Billed")
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetOptions(
                    [
                        new OptionItem { Id = CheckoutController.BilledDirectly, Title = "Directly" },
                        new OptionItem { Id = CheckoutController.BilledThroughReseller, Title = "Through a reseller" }
                    ])
                    .BindValue(nameof(CheckoutController.Billed))
            ),
            // Folded away when a reseller pays, in the browser: the rule reads the radio group's value.
            UIPage.Section("Company address", null,
                new TextInputComponent()
                    .SetTitle("Company")
                    .SetPlaceholder("Bramble Studio")
                    .SetAutocomplete(UIAutocomplete.Organization)
                    .SetAppearance(UIInputAppearance.Filled)
                    .SetFormId(FormId)
                    .BindValue(nameof(CheckoutController.Company)),
                new TextInputComponent()
                    .SetTitle("Street and number")
                    .SetAutocomplete(UIAutocomplete.AddressLine1)
                    .SetAppearance(UIInputAppearance.Filled)
                    .SetFormId(FormId)
                    .BindValue(nameof(CheckoutController.Street)),
                UIForm.Row(
                    new TextInputComponent()
                        .SetTitle("City")
                        .SetAutocomplete(UIAutocomplete.City)
                        .SetAppearance(UIInputAppearance.Filled)
                        .SetFormId(FormId)
                        .BindValue(nameof(CheckoutController.City)),
                    new TextInputComponent()
                        .SetTitle("Postcode")
                        .SetAutocomplete(UIAutocomplete.PostalCode)
                        .SetAppearance(UIInputAppearance.Filled)
                        .SetFormId(FormId)
                        .BindValue(nameof(CheckoutController.Postcode))
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
                    .SetAppearance(UIInputAppearance.Filled)
                    .SetFormId(FormId)
                    .BindValue(nameof(CheckoutController.Country))
            )
            .HiddenWhen(BilledId, CheckoutController.BilledThroughReseller),
            UIPage.Section("Invoices", null,
                new CheckboxComponent(SameBillingId)
                    .SetTitle("Invoices go to the company address")
                    .BindValue(nameof(CheckoutController.SameBilling)),
                UILayout.Stack(16,
                    new TextInputComponent()
                        .SetTitle("Street and number")
                        .SetAppearance(UIInputAppearance.Filled)
                        .SetFormId(FormId)
                        .BindValue(nameof(CheckoutController.BillingStreet)),
                    UIForm.Row(
                        new TextInputComponent()
                            .SetTitle("City")
                            .SetAppearance(UIInputAppearance.Filled)
                            .SetFormId(FormId)
                            .BindValue(nameof(CheckoutController.BillingCity)),
                        new TextInputComponent()
                            .SetTitle("Postcode")
                            .SetAppearance(UIInputAppearance.Filled)
                            .SetFormId(FormId)
                            .BindValue(nameof(CheckoutController.BillingPostcode))
                    )
                )
                .ShownWhen(SameBillingId, false)
            ),
            UIPage.Section("On the invoice", null,
                UIForm.Field(new TextAreaComponent()
                    .SetTitle("Invoice note")
                    .SetPlaceholder("Left blank, nothing is printed")
                    .SetRows(3)
                    .SetMaxLength(200)
                    .SetAppearance(UIInputAppearance.Filled)
                    .SetFormId(FormId)
                    .BindValue(nameof(CheckoutController.InvoiceNote)),
                    "Printed on every invoice, two hundred characters at most.")
            ),
            UIButtons.Pair(
                UIButtons.Ghost("Back to plans"),
                UIButtons.Primary("Subscribe")
                    .OnSubmit(FormId, nameof(CheckoutController.PlaceOrderAsync))
                    .ShowLoadingDuring(EventNames.Click)
            )
        );

    /// <summary>The subscription read rather than edited: the lines, the sums the server keeps, and the one field that talks to it.</summary>
    private static CardComponent CreateSummary()
        => UICard.Create("Your subscription", "Billed monthly, VAT added below.", UILayout.Stack(12,
            UIDetails.List().BindItems(nameof(CheckoutController.Lines)),
            new SeparatorComponent(),
            // Tonal: the separators above and below already frame it, and a line under it would only add weight to the card.
            new TextInputComponent()
                .SetPlaceholder("Promo code")
                .SetAppearance(UIInputAppearance.Tonal)
                .SetTrimInput()
                .SetTrailingAction(UIButtons.Ghost("Apply").SetSize(UIButtonSize.Small).OnClick(nameof(CheckoutController.ApplyPromo)))
                .BindValue(nameof(CheckoutController.Promo))
                .BindValidation(nameof(CheckoutController.PromoNotice))
                .OnChange(nameof(CheckoutController.PromoChanged)),
            // The server's verdict on the code, kept in the summary until the code changes; shown later, each is read out.
            UIMessage.Create(UIMessageSeverity.Success, null, new ParagraphComponent().BindDescription(nameof(CheckoutController.PromoVerdict)))
                .BindVisibility(nameof(CheckoutController.PromoAppliedVisibility)),
            UIMessage.Create(UIMessageSeverity.Danger, null, new ParagraphComponent().BindDescription(nameof(CheckoutController.PromoVerdict)))
                .BindVisibility(nameof(CheckoutController.PromoRefusedVisibility)),
            new SeparatorComponent(),
            UIDetails.Amount("Subtotal", nameof(CheckoutController.SubtotalLine)),
            UIDetails.Amount("Discount", nameof(CheckoutController.DiscountLine)).BindVisibility(nameof(CheckoutController.DiscountVisibility)),
            UIDetails.Amount("VAT, 21%", nameof(CheckoutController.VatLine)),
            UIDetails.Total("Total a month", nameof(CheckoutController.TotalLine))
        ), DemoIcons.Outline(DemoIcons.File))
            .SetVerticalAlignment(UIAlignment.Start);

    /// <summary>What replaces the form once the order is placed.</summary>
    private static SurfaceComponent CreatePlaced()
        => UIPage.Outcome(
            DemoIcons.Outline(DemoIcons.BadgeCheck),
            UIMessageSeverity.Success,
            "Thank you",
            new ParagraphComponent().BindDescription(nameof(CheckoutController.PlacedLine)),
            UIButtons.Ghost("Back to the catalogue")
        );
}
