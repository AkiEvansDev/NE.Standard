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
            .AddChild(UILayout.Split(CreateForm(), CreateSummary(), sideSpan: 9)
                .SetMaxWidth(UILayoutLength.Absolute(1080))
                .BindVisibility(nameof(CheckoutController.FormVisibility))
            )
            .AddChild(CreatePlaced())
            .SetPlacement(1, 1, 24, 1);

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
                        .SetFormId(FormId)
                        .BindValue(nameof(CheckoutController.Plan))
                        .OnChange(nameof(CheckoutController.UpdateSummary)),
                    new NumberInputComponent()
                        .SetTitle("Servers")
                        .SetMin(1)
                        .SetMax(40)
                        .SetAllowDecimals(false)
                        .SetShowStepper()
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
                        .SetFormId(FormId)
                        .BindValue(nameof(CheckoutController.Email))
                        .Required("The invoices have to go somewhere.", UIValidationTrigger.Submit)
                        .Regex("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$", "That does not look like an email address.", UIValidationTrigger.Blur),
                    new TextInputComponent()
                        .SetTitle("Phone")
                        .SetType(UITextInputType.Tel)
                        .SetAutocomplete(UIAutocomplete.Telephone)
                        .SetPlaceholder("Only if on-call should ring")
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
                    .SetFormId(FormId)
                    .BindValue(nameof(CheckoutController.Company)),
                new TextInputComponent()
                    .SetTitle("Street and number")
                    .SetAutocomplete(UIAutocomplete.AddressLine1)
                    .SetFormId(FormId)
                    .BindValue(nameof(CheckoutController.Street)),
                UIForm.Row(
                    new TextInputComponent()
                        .SetTitle("City")
                        .SetAutocomplete(UIAutocomplete.City)
                        .SetFormId(FormId)
                        .BindValue(nameof(CheckoutController.City)),
                    new TextInputComponent()
                        .SetTitle("Postcode")
                        .SetAutocomplete(UIAutocomplete.PostalCode)
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
                        .SetFormId(FormId)
                        .BindValue(nameof(CheckoutController.BillingStreet)),
                    UIForm.Row(
                        new TextInputComponent()
                            .SetTitle("City")
                            .SetFormId(FormId)
                            .BindValue(nameof(CheckoutController.BillingCity)),
                        new TextInputComponent()
                            .SetTitle("Postcode")
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
                    .SetFormId(FormId)
                    .BindValue(nameof(CheckoutController.InvoiceNote)),
                    "Printed on every invoice, two hundred characters at most.")
            ),
            UIButtons.Pair(
                UIButtons.Ghost("Back to plans"),
                UIButtons.Primary("Subscribe")
                    .OnSubmit(FormId, nameof(CheckoutController.PlaceOrderAsync))
                    .InteractBeforeClick(IVisualComponent.LoadingProperty, true)
                    .InteractAfterClick(IVisualComponent.LoadingProperty, false)
            )
        );

    /// <summary>The subscription read rather than edited: the lines, the sums the server keeps, and the one field that talks to it.</summary>
    private static CardComponent CreateSummary()
        => UIPage.Card("Your subscription", "Billed monthly, VAT added below.", UILayout.Stack(12,
            UIDetails.List().BindItems(nameof(CheckoutController.Lines)),
            new SeparatorComponent(),
            new TextInputComponent()
                .SetPlaceholder("Promo code")
                .SetTrimInput()
                .SetTrailingAction(UIButtons.Ghost("Apply").SetSize(UIButtonSize.Small).OnClick(nameof(CheckoutController.ApplyPromo)))
                .BindValue(nameof(CheckoutController.Promo))
                .BindValidation(nameof(CheckoutController.PromoNotice))
                .OnChange(nameof(CheckoutController.PromoChanged)),
            new SeparatorComponent(),
            CreateSumRow("Subtotal", nameof(CheckoutController.SubtotalLine)),
            CreateSumRow("Discount", nameof(CheckoutController.DiscountLine)).BindVisibility(nameof(CheckoutController.DiscountVisibility)),
            CreateSumRow("VAT, 21%", nameof(CheckoutController.VatLine)),
            CreateSumRow("Total a month", nameof(CheckoutController.TotalLine), strong: true)
        ), DemoIcons.Outline(DemoIcons.File))
            .SetVerticalAlignment(UIAlignment.Start);

    // Placed by hand rather than as equal columns, which stand one under another on a phone: a sum and its name are one line at every width.
    private static ContainerComponent CreateSumRow(string label, string property, bool strong = false)
    {
        TextComponent name = strong ? UIText.Subtitle(label) : UIText.Body(label).Muted();
        TextComponent amount = new TextComponent().SetTextAlignment(UITextAlignment.End).AsBody().BindTitle(property);

        return new ContainerComponent()
            .AddChild(name.SetVerticalAlignment(UIAlignment.Center).SetPlacement(1, 1, 14, 1))
            .AddChild((strong ? amount.AsSubtitle() : amount).SetVerticalAlignment(UIAlignment.Center).SetPlacement(15, 1, 10, 1));
    }

    private static SurfaceComponent CreatePlaced()
        => new SurfaceComponent()
            .SetSurface(UISurfaceStyle.Raised)
            .SetWidth(UILayoutLength.Absolute(520))
            .SetHorizontalAlignment(UIAlignment.Center)
            .SetPadding(UIThickness.Uniform(24))
            .BindVisibility(nameof(CheckoutController.PlacedVisibility))
            .SetContent(UILayout.Stack(16,
                new TextComponent()
                    .SetIcon(DemoIcons.Outline(DemoIcons.BadgeCheck))
                    .SetIconColor(UIThemeColor.Success)
                    .SetTitle("Thank you")
                    .AsTitle(),
                UIText.Note(string.Empty).BindDescription(nameof(CheckoutController.PlacedLine)),
                UIButtons.Toolbar(UIButtons.Secondary("Back to the catalogue"))
                )
            );
}
