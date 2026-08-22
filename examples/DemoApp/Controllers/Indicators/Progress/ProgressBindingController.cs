using System.Threading.Tasks;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Indicators.Progress;

internal sealed partial class ProgressGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial decimal Value { get; set; } = 40m;

    [RecursiveMember]
    public partial UIProgressVariant Variant { get; set; } = UIProgressVariant.Linear;

    [RecursiveMember]
    public partial UIThemeColor Color { get; set; } = UIThemeColor.FromStyle(UIColorStyle.Primary);

    [RecursiveMember]
    public partial bool ShowValue { get; set; } = true;

    public void CycleVariant()
        => SetLastChange(nameof(Variant), Variant = CycleEnum(Variant));

    public void CycleColor()
        => SetLastChange(nameof(Color), Color = CycleValue(Color, UIThemeColor.FromStyle(UIColorStyle.Primary), UIThemeColor.FromStyle(UIColorStyle.Accent), UIThemeColor.FromStyle(UIColorStyle.Info), UIThemeColor.FromStyle(UIColorStyle.Warning), UIThemeColor.FromStyle(UIColorStyle.Success), UIThemeColor.FromStyle(UIColorStyle.Danger)));

    public void ToggleShowValue()
        => SetLastChange(nameof(ShowValue), ShowValue = !ShowValue);

    public void CycleValueLevel()
        => SetLastChange(nameof(Value), Value = CycleValue(Value, 0m, 25m, 50m, 75m, 100m));

    public async Task SimulateAsync()
    {
        Value = 0m;

        for (var step = 0; step < 10; step++)
        {
            await Task.Delay(150).ConfigureAwait(false);
            Value += 10m;
        }

        SetLastChange(nameof(Value), Value);
    }
}

internal sealed partial class ProgressBindingController() : DemoBindingController
{
    [RecursiveMember]
    public partial ProgressGroupContext ProgressGroup { get; set; } = new();

    [UICommand]
    public void CycleVariant()
        => ProgressGroup.CycleVariant();

    [UICommand]
    public void CycleColor()
        => ProgressGroup.CycleColor();

    [UICommand]
    public void ToggleShowValue()
        => ProgressGroup.ToggleShowValue();

    [UICommand]
    public void CycleValueLevel()
        => ProgressGroup.CycleValueLevel();

    [UICommand]
    public async Task SimulateAsync()
        => await ProgressGroup.SimulateAsync().ConfigureAwait(false);
}
