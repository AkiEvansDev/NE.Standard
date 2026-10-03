using System;
using System.Globalization;
using System.Threading;
using System.Threading.Tasks;

namespace DemoApp.Controllers.Screens;

/// <summary>
/// The subscription's state: what the form holds, and the sums only the server works out — the plan and servers chosen,
/// a promo code it has an opinion about, the VAT and the total.
/// </summary>
internal sealed partial class CheckoutController : UIControllerBase
{
    public const string StarterPlan = "starter";
    public const string StandardPlan = "standard";
    public const string ProPlan = "pro";
    public const string DedicatedPlan = "dedicated";

    public const string EuWest = "eu-west";
    public const string EuCentral = "eu-central";
    public const string EuNorth = "eu-north";
    public const string UsEast = "us-east";
    public const string ApSouth = "ap-south";

    public const string BilledDirectly = "direct";
    public const string BilledThroughReseller = "reseller";

    private const decimal VatRate = 0.21m;
    private const string PromoCode = "ORVANE10";

    private bool _discounted;

    public CheckoutController()
    {
        Recalculate();
    }

    [RecursiveMember]
    public partial string? Plan { get; set; } = ProPlan;

    [RecursiveMember]
    public partial decimal? Servers { get; set; } = 4;

    [RecursiveMember]
    public partial string? Region { get; set; } = EuWest;

    /// <summary>Who pays: the company itself, or a reseller whose customer gives no address of its own.</summary>
    [RecursiveMember]
    public partial string? Billed { get; set; } = BilledDirectly;

    [RecursiveMember]
    public partial string? Email { get; set; }

    [RecursiveMember]
    public partial string? Phone { get; set; }

    [RecursiveMember]
    public partial string? Company { get; set; }

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
    public partial string? InvoiceNote { get; set; }

    [RecursiveMember]
    public partial string? Promo { get; set; }

    /// <summary>The field's own line, for a press with no code in it; a code the server judged is a message under the field.</summary>
    [RecursiveMember]
    public partial UIValidationMessage? PromoNotice { get; set; }

    /// <summary>What the server made of the code: one line, shown in the message of the verdict's severity.</summary>
    [RecursiveMember]
    public partial string PromoVerdict { get; set; } = string.Empty;

    [RecursiveMember]
    public partial UIVisibility PromoAppliedVisibility { get; set; } = UIVisibility.Collapsed;

    [RecursiveMember]
    public partial UIVisibility PromoRefusedVisibility { get; set; } = UIVisibility.Collapsed;

    /// <summary>The subscription's lines, rewritten in place when the plan, the servers or the region change.</summary>
    [RecursiveMember(false)]
    public RecursiveCollection<KeyValueActionItem> Lines { get; } =
    [
        UIDetails.Row("plan", string.Empty, string.Empty),
        UIDetails.Row("server", "Each server", string.Empty),
        UIDetails.Row("region", "Region", string.Empty)
    ];

    [RecursiveMember]
    public partial string SubtotalLine { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string VatLine { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string DiscountLine { get; set; } = string.Empty;

    [RecursiveMember]
    public partial UIVisibility DiscountVisibility { get; set; } = UIVisibility.Collapsed;

    [RecursiveMember]
    public partial string TotalLine { get; set; } = string.Empty;

    [RecursiveMember]
    public partial UIVisibility FormVisibility { get; set; } = UIVisibility.Visible;

    [RecursiveMember]
    public partial UIVisibility PlacedVisibility { get; set; } = UIVisibility.Collapsed;

    [RecursiveMember]
    public partial string PlacedLine { get; set; } = string.Empty;

    /// <summary>The plan, the servers or the region changed: the lines and the sums are rewritten, nothing else moves.</summary>
    [UICommand]
    public void UpdateSummary()
        => Recalculate();

    /// <summary>
    /// The one code the panel knows takes a tenth off, said in a success message; any other is refused in a danger one. An empty
    /// press is the field's own business, said on its line.
    /// </summary>
    [UICommand]
    public void ApplyPromo()
    {
        var code = Promo?.Trim() ?? string.Empty;

        _discounted = IsPromo(code);
        PromoNotice = code.Length == 0 ? UIValidationMessage.Info("Type a code first.") : null;
        PromoVerdict = code.Length == 0 ? string.Empty : _discounted
            ? $"{PromoCode} takes a tenth off every month, as promised."
            : $"\"{code}\" is not a code we know. Codes come with the newsletter, and are written in capitals.";
        PromoAppliedVisibility = code.Length > 0 && _discounted ? UIVisibility.Visible : UIVisibility.Collapsed;
        PromoRefusedVisibility = code.Length > 0 && !_discounted ? UIVisibility.Visible : UIVisibility.Collapsed;
        Recalculate();
    }

    private static bool IsPromo(string? code)
        => string.Equals(code, PromoCode, StringComparison.OrdinalIgnoreCase);

    /// <summary>
    /// The field no longer holds the code the verdict was given for: a refusal goes, and so does the discount, until a code is
    /// applied again.
    /// </summary>
    [UICommand]
    public void PromoChanged()
    {
        PromoRefusedVisibility = UIVisibility.Collapsed;

        if (!_discounted || IsPromo(Promo?.Trim()))
            return;

        _discounted = false;
        PromoAppliedVisibility = UIVisibility.Collapsed;
        Recalculate();
    }

    [UICommand]
    public async Task PlaceOrderAsync(CancellationToken cancellationToken)
    {
        // The field's rule is the browser's feedback; the server keeps its own, since a submit can reach it without the form.
        if (string.IsNullOrWhiteSpace(Email))
            return;

        await Task.Delay(900, cancellationToken).ConfigureAwait(false);

        PlacedLine = $"SUB-000015 is active: {PlanLine()} in {Region}. The invoice went to {Email?.Trim()}.";
        FormVisibility = UIVisibility.Collapsed;
        PlacedVisibility = UIVisibility.Visible;
    }

    private string PlanLine()
    {
        var name = Plan switch
        {
            StarterPlan => "Starter",
            StandardPlan => "Standard",
            DedicatedPlan => "Dedicated",
            _ => "Pro"
        };
        var seats = SeatCount();

        return seats == 1 ? $"{name} × 1 server" : $"{name} × {seats.ToString(CultureInfo.InvariantCulture)} servers";
    }

    private int SeatCount()
        => (int)Math.Clamp(Servers ?? 1m, 1m, 40m);

    private void Recalculate()
    {
        (var price, var spec) = Plan switch
        {
            StarterPlan => (6m, "1 vCPU · 2 GB · 40 GB"),
            StandardPlan => (18m, "2 vCPU · 4 GB · 80 GB"),
            DedicatedPlan => (290m, "16 vCPU · 64 GB · 960 GB"),
            _ => (64m, "4 vCPU · 16 GB · 240 GB")
        };
        var city = Region switch
        {
            EuCentral => "Frankfurt",
            EuNorth => "Stockholm",
            UsEast => "Ashburn",
            ApSouth => "Singapore",
            _ => "Amsterdam"
        };
        var subtotal = price * SeatCount();
        var discount = _discounted ? Math.Round(subtotal / 10m, 2) : 0m;
        var vat = Math.Round((subtotal - discount) * VatRate, 2);

        SetLine(0, PlanLine(), Money(subtotal));
        // The price is the line above; this one says what a server is, and stays within the summary's width.
        SetLine(1, "Each server", spec);
        SetLine(2, "Region", $"{Region} · {city}");

        SubtotalLine = Money(subtotal);
        DiscountLine = $"−{Money(discount)}";
        DiscountVisibility = _discounted ? UIVisibility.Visible : UIVisibility.Collapsed;
        VatLine = Money(vat);
        TotalLine = Money(subtotal - discount + vat);
    }

    private static string Money(decimal amount)
        => $"€{amount.ToString("0.00", CultureInfo.InvariantCulture)}";

    private void SetLine(int index, string key, string value)
    {
        ((TextItem)Lines[index].Key).Title = key;
        ((TextItem)Lines[index].Value).Title = value;
    }
}
