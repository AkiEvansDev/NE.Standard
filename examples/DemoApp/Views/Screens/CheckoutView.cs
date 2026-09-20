using DemoApp.Controllers.Screens;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
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
/// The order form in the filled style beside its summary: sections down the page, two fields to a line where two belong
/// on one, a delivery chosen by word that folds the address away, and a billing block a box hides.
/// </summary>
internal sealed class CheckoutView : DemoScreenView, IUIViewDefinition
{
    private const string FormId = "checkout";
    private const string DeliveryId = "checkout-delivery";
    private const string SameBillingId = "checkout-same-billing";

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
            UIPage.Section("Contact", "Where the receipt goes, and a number for the courier.",
                UIForm.Row(
                    new TextInputComponent()
                        .SetTitle("Email")
                        .SetType(UITextInputType.Email)
                        .SetAutocomplete(UIAutocomplete.Email)
                        .SetFormId(FormId)
                        .BindValue(nameof(CheckoutController.Email))
                        .Required("The receipt has to go somewhere.", UIValidationTrigger.Submit)
                        .Regex("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$", "That does not look like an email address.", UIValidationTrigger.Blur),
                    new TextInputComponent()
                        .SetTitle("Phone")
                        .SetType(UITextInputType.Tel)
                        .SetAutocomplete(UIAutocomplete.Telephone)
                        .SetPlaceholder("Only if the courier should call")
                        .SetFormId(FormId)
                        .BindValue(nameof(CheckoutController.Phone))
                )
            ),
            UIPage.Section("Delivery", null,
                new RadioGroupComponent(DeliveryId)
                    .SetOptions(
                    [
                        new OptionItem { Id = CheckoutController.StandardDelivery, Title = "Standard", Description = "Three to five working days · € 4.90" },
                        new OptionItem { Id = CheckoutController.ExpressDelivery, Title = "Express", Description = "Tomorrow before noon · € 12.00" },
                        new OptionItem { Id = CheckoutController.PickupDelivery, Title = "Pick up in store", Description = "Ready in two hours · free" }
                    ])
                    .BindValue(nameof(CheckoutController.Delivery))
                    .OnChange(nameof(CheckoutController.UpdateDelivery))
            ),
            // Folded away for a pick-up, in the browser: the rule reads the radio group's value.
            UIPage.Section("Shipping address", null,
                new TextInputComponent()
                    .SetTitle("Full name")
                    .SetAutocomplete(UIAutocomplete.Name)
                    .SetFormId(FormId)
                    .BindValue(nameof(CheckoutController.FullName)),
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
                        new OptionItem { Id = "be", Title = "Belgium" },
                        new OptionItem { Id = "fr", Title = "France" }
                    ])
                    .SetFormId(FormId)
                    .BindValue(nameof(CheckoutController.Country))
            )
            .HiddenWhen(DeliveryId, CheckoutController.PickupDelivery),
            UIPage.Section("Billing", null,
                new CheckboxComponent(SameBillingId)
                    .SetTitle("Billing address is the same as the shipping one")
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
            UIPage.Section("For the recipient", null,
                UIForm.Field(new TextAreaComponent()
                    .SetTitle("Gift message")
                    .SetPlaceholder("Left blank, nothing is printed")
                    .SetRows(3)
                    .SetMaxLength(200)
                    .SetFormId(FormId)
                    .BindValue(nameof(CheckoutController.GiftMessage)),
                    "Printed on the packing slip, two hundred characters at most.")
            ),
            UIButtons.Pair(
                UIButtons.Ghost("Back to basket"),
                UIButtons.Primary("Place order")
                    .OnSubmit(FormId, nameof(CheckoutController.PlaceOrderAsync))
                    .InteractBeforeClick(IVisualComponent.LoadingProperty, true)
                    .InteractAfterClick(IVisualComponent.LoadingProperty, false)
            )
        );

    /// <summary>The order read rather than edited: the lines, the sums the server keeps, and the one field that talks to it.</summary>
    private static CardComponent CreateSummary()
        => UIPage.Card("Your order", "Three things, one parcel.", UILayout.Stack(12,
            UIDetails.List(
                ("Field notebook, A5 × 2", "€ 24.00"),
                ("Brass pen", "€ 38.00"),
                ("Ink, midnight", "€ 9.50")
            ),
            new SeparatorComponent(),
            new TextInputComponent()
                .SetPlaceholder("Promo code")
                .SetTrimInput()
                .SetTrailingAction(UIButtons.Ghost("Apply").SetSize(UIButtonSize.Small).OnClick(nameof(CheckoutController.ApplyPromo)))
                .BindValue(nameof(CheckoutController.Promo))
                .BindValidation(nameof(CheckoutController.PromoNotice)),
            new SeparatorComponent(),
            CreateSumRow("Subtotal", "€ 71.50"),
            CreateSumRow("Delivery", nameof(CheckoutController.DeliveryLine), bound: true),
            CreateSumRow("Discount", nameof(CheckoutController.DiscountLine), bound: true).BindVisibility(nameof(CheckoutController.DiscountVisibility)),
            CreateSumRow("Total", nameof(CheckoutController.TotalLine), bound: true, strong: true)
        ), DemoIcons.Outline(DemoIcons.File))
            .SetVerticalAlignment(UIAlignment.Start);

    private static ContainerComponent CreateSumRow(string label, string value, bool bound = false, bool strong = false)
    {
        TextComponent amount = new TextComponent().SetTextAlignment(UITextAlignment.End).AsBody();
        _ = bound ? amount.BindTitle(value) : amount.SetTitle(value);

        return UILayout.Columns(8,
            strong ? UIText.Subtitle(label) : UIText.Body(label).Muted(),
            strong ? amount.AsSubtitle() : amount
        );
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
            ));
}
