using System;
using System.Globalization;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Controllers;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Screens;

/// <summary>
/// The order's state: what the form holds, and the three sums only the server works out — the delivery chosen by word, a
/// promo code it has an opinion about, and the total.
/// </summary>
internal sealed partial class CheckoutController : UIControllerBase
{
    public const string StandardDelivery = "standard";
    public const string ExpressDelivery = "express";
    public const string PickupDelivery = "pickup";

    private const decimal Subtotal = 71.50m;
    private const string PromoCode = "WELCOME10";

    private bool _discounted;

    [RecursiveMember]
    public partial string? Email { get; set; }

    [RecursiveMember]
    public partial string? Phone { get; set; }

    [RecursiveMember]
    public partial string? Delivery { get; set; } = StandardDelivery;

    [RecursiveMember]
    public partial string? FullName { get; set; }

    [RecursiveMember]
    public partial string? Street { get; set; }

    [RecursiveMember]
    public partial string? City { get; set; }

    [RecursiveMember]
    public partial string? Postcode { get; set; }

    [RecursiveMember]
    public partial string? Country { get; set; } = "nl";

    [RecursiveMember]
    public partial bool? SameBilling { get; set; } = true;

    [RecursiveMember]
    public partial string? BillingStreet { get; set; }

    [RecursiveMember]
    public partial string? BillingCity { get; set; }

    [RecursiveMember]
    public partial string? BillingPostcode { get; set; }

    [RecursiveMember]
    public partial string? GiftMessage { get; set; }

    [RecursiveMember]
    public partial string? Promo { get; set; }

    [RecursiveMember]
    public partial UIValidationMessage? PromoNotice { get; set; }

    [RecursiveMember]
    public partial string DeliveryLine { get; set; } = Money(4.90m);

    [RecursiveMember]
    public partial string DiscountLine { get; set; } = string.Empty;

    [RecursiveMember]
    public partial UIVisibility DiscountVisibility { get; set; } = UIVisibility.Collapsed;

    [RecursiveMember]
    public partial string TotalLine { get; set; } = Money(Subtotal + 4.90m);

    [RecursiveMember]
    public partial UIVisibility FormVisibility { get; set; } = UIVisibility.Visible;

    [RecursiveMember]
    public partial UIVisibility PlacedVisibility { get; set; } = UIVisibility.Collapsed;

    [RecursiveMember]
    public partial string PlacedLine { get; set; } = string.Empty;

    /// <summary>The delivery changed: the two sums that depend on it are rewritten, nothing else moves.</summary>
    [UICommand]
    public void UpdateDelivery()
        => Recalculate();

    /// <summary>The one code the shop knows takes a tenth off; any other is refused on the field itself.</summary>
    [UICommand]
    public void ApplyPromo()
    {
        var code = Promo?.Trim() ?? string.Empty;

        if (code.Length == 0)
        {
            PromoNotice = UIValidationMessage.Info("Type a code first.");
            return;
        }

        if (!string.Equals(code, PromoCode, StringComparison.OrdinalIgnoreCase))
        {
            _discounted = false;
            PromoNotice = UIValidationMessage.Error($"\"{code}\" is not a code we know.");
            Recalculate();
            return;
        }

        _discounted = true;
        PromoNotice = UIValidationMessage.Info("A tenth off, as promised.");
        Recalculate();
    }

    [UICommand]
    public async Task PlaceOrderAsync(CancellationToken cancellationToken)
    {
        await Task.Delay(900, cancellationToken).ConfigureAwait(false);

        var where = Delivery == PickupDelivery ? "ready to pick up in two hours" : $"on its way to {City?.Trim()}";
        PlacedLine = $"Order 48 213 is {where}. The receipt went to {Email?.Trim()}.";
        FormVisibility = UIVisibility.Collapsed;
        PlacedVisibility = UIVisibility.Visible;
    }

    private void Recalculate()
    {
        var delivery = Delivery switch
        {
            ExpressDelivery => 12.00m,
            PickupDelivery => 0m,
            _ => 4.90m
        };
        var discount = _discounted ? Math.Round(Subtotal / 10m, 2) : 0m;

        DeliveryLine = delivery == 0m ? "Free" : Money(delivery);
        DiscountLine = $"−{Money(discount)}";
        DiscountVisibility = _discounted ? UIVisibility.Visible : UIVisibility.Collapsed;
        TotalLine = Money(Subtotal + delivery - discount);
    }

    private static string Money(decimal amount)
        => $"€ {amount.ToString("0.00", CultureInfo.InvariantCulture)}";
}
