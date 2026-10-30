using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Inputs;

/// <summary>
/// Cross-input validation state for the <c>/inputs</c> overview page, seeded with Error, Warning and Info verdicts across input types.
/// </summary>
internal sealed partial class InputsOverviewValidationGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? Slug { get; set; } = "Billing_API";

    [RecursiveMember]
    public partial decimal? PoolSize { get; set; } = 240m;

    [RecursiveMember]
    public partial string? Tier { get; set; } = "hourly";

    [RecursiveMember]
    public partial UIValidationMessage? TierNote { get; set; } = UIValidationMessage.Info("Hourly snapshots are retained for 14 days.");

    public void Reset()
    {
        Slug = "Billing_API";
        PoolSize = 240m;
        Tier = "hourly";
        TierNote = UIValidationMessage.Info("Hourly snapshots are retained for 14 days.");
        LogEvent("reset validation fields");
    }
}

/// <summary>
/// Backing state for the cross-component <c>/inputs</c> overview page.
/// </summary>
internal sealed partial class InputsOverviewController() : DemoController
{
    [RecursiveMember]
    public partial InputsOverviewValidationGroupContext ValidationGroup { get; set; } = new();

    [UICommand]
    public void TierChanged()
    {
        ValidationGroup.TierNote = ValidationGroup.Tier switch
        {
            "continuous" => UIValidationMessage.Warning("Continuous archiving adds ~8% write overhead."),
            "hourly" => UIValidationMessage.Info("Hourly snapshots are retained for 14 days."),
            _ => null
        };
    }

    [UICommand]
    public void ResetValidation()
        => ValidationGroup.Reset();
}
