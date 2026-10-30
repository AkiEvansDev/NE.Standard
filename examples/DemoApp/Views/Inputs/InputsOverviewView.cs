using System;
using DemoApp.Controllers.Inputs;
using DemoApp.Views.Base;

namespace DemoApp.Views.Inputs;

/// <summary>
/// Cross-component input overview (<c>/inputs</c>): shared appearances, size ladder, compact <c>TitlePlacement.Inside</c> inspector rows,
/// validation severities, read-only/disabled states, and multi-type horizontal form alignment.
/// </summary>
internal sealed class InputsOverviewView : DemoView, IUIViewDefinition
{
    private const string ValidationGroup = nameof(InputsOverviewController.ValidationGroup);

    private static readonly OptionItem[] RegionOptions =
    [
        new OptionItem { Id = "eu-west", Title = "eu-west" },
        new OptionItem { Id = "us-east", Title = "us-east" },
        new OptionItem { Id = "ap-northeast", Title = "ap-northeast" }
    ];

    private static readonly OptionItem[] RoleOptions =
    [
        new OptionItem { Id = "api", Title = "api" },
        new OptionItem { Id = "db", Title = "db" },
        new OptionItem { Id = "worker", Title = "worker" }
    ];

    private static readonly OptionItem[] TierOptions =
    [
        new OptionItem { Id = "daily", Title = "Daily snapshot" },
        new OptionItem { Id = "hourly", Title = "Hourly snapshot" },
        new OptionItem { Id = "continuous", Title = "Continuous WAL" }
    ];

    public static string ViewKey => "demo.inputs.overview";

    protected override string ComponentRoute => "/inputs";
    protected override string Header => "demo.inputs.overview.header";
    protected override string HeaderDescription => "demo.inputs.overview.description";

    protected override void DrawContent(WrapPanelComponent container)
        => _ = container
            .AddChildren(DemoUI.CreateColumns([CreateAppearancesGroup(), CreateValidationGroup()], [CreateCompactInsideGroup(), CreateSizesAndStatesGroup()]))
            .AddChild(CreateToolbarRowGroup());

    /// <summary>
    /// All four <see cref="UIInputAppearance"/> variants compared side by side across text, number, choice and date fields.
    /// </summary>
    private static ContainerComponent CreateAppearancesGroup()
    {
        return DemoUI.CreateExample("Input appearances",
            UILayout.Stack(14)
                .AddChild(DemoUI.CreateLabelled("Outline (default)", UIForm.Row(
                        new TextInputComponent()
                            .SetAppearance(UIInputAppearance.Outline)
                            .SetTitle("Hostname")
                            .SetValue("api-eu-west-2"),
                        new SelectComponent()
                            .SetAppearance(UIInputAppearance.Outline)
                            .SetTitle("Region")
                            .SetOptions(RegionOptions)
                            .SetValue("eu-west")
                    )
                ))
                .AddChild(DemoUI.CreateLabelled("Filled", UIForm.Row(
                        new NumberInputComponent()
                            .SetAppearance(UIInputAppearance.Filled)
                            .SetTitle("Replicas")
                            .SetShowStepper()
                            .SetValue(4),
                        new DateInputComponent()
                            .SetAppearance(UIInputAppearance.Filled)
                            .SetTitle("Cutover date")
                            .SetValue(new DateOnly(2026, 11, 14))
                    )
                ))
                .AddChild(DemoUI.CreateLabelled("Underline", UIForm.Row(
                        new TextInputComponent()
                            .SetAppearance(UIInputAppearance.Underline)
                            .SetTitle("Filter tag")
                            .SetValue("release-2.0"),
                        new TimeInputComponent()
                            .SetAppearance(UIInputAppearance.Underline)
                            .SetTitle("Window")
                            .SetValue(new TimeOnly(9, 30))
                    )
                ))
                .AddChild(DemoUI.CreateLabelled("Ghost", UIForm.Row(
                        new TextInputComponent()
                            .SetAppearance(UIInputAppearance.Ghost)
                            .SetTitle("Inline title")
                            .SetValue("Billing worker"),
                        new SelectComponent()
                            .SetAppearance(UIInputAppearance.Ghost)
                            .SetTitle("Role")
                            .SetOptions(RoleOptions)
                            .SetValue("worker")
                    )
                )),
            note: "`Outline`, `Filled`, `Underline` and `Ghost` share identical control heights and baseline metrics across every field component."
        );
    }

    /// <summary>
    /// Live <c>Error</c>, <c>Warning</c> and <c>Info</c> validation severities across text, number and select inputs.
    /// </summary>
    private static ContainerComponent CreateValidationGroup()
    {
        return DemoUI.CreateExample("Validation severities",
            UILayout.Stack(12)
                .AddChild(new TextInputComponent()
                    .SetTitle("Service slug (Error)")
                    .BindValue<InputsOverviewValidationGroupContext>(static x => x.Slug, UIBindingScope.Relative)
                    .Required("A service slug is required.")
                    .Regex("^[a-z0-9-]+$", "Use lower-case letters, digits and hyphens only.", UIValidationTrigger.Change, UIValidationSeverity.Error)
                )
                .AddChild(new NumberInputComponent()
                    .SetTitle("Connection pool (Warning > 200)")
                    .SetShowStepper()
                    .SetStep(20)
                    .BindValue<InputsOverviewValidationGroupContext>(static x => x.PoolSize, UIBindingScope.Relative)
                    .Validate(UIValidationTrigger.Change, UIComparisonOperator.Greater, 0, "Pool size must be above 0.", UIValidationSeverity.Error)
                    .Validate(UIValidationTrigger.Change, UIComparisonOperator.LessOrEqual, 200, "Above 200 connections may saturate the replica.", UIValidationSeverity.Warning)
                )
                .AddChild(new SelectComponent()
                    .SetTitle("Backup tier (Server Info / Warning)")
                    .SetOptions(TierOptions)
                    .BindValue<InputsOverviewValidationGroupContext>(static x => x.Tier, UIBindingScope.Relative)
                    .BindValidation<InputsOverviewValidationGroupContext>(static x => x.TierNote, UIBindingScope.Relative)
                    .OnChange(nameof(InputsOverviewController.TierChanged))
                )
                .AddChild(new ButtonComponent()
                    .SetVariant(UIButtonVariant.Ghost)
                    .SetSize(UISize.Small)
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Undo))
                    .SetTitle("Reset sample values")
                    .OnClick(nameof(InputsOverviewController.ResetValidation))
                ),
            note: "`Error` blocks form submission; `Warning` and `Info` colour the field border and message line without blocking commands.",
            context: ValidationGroup
        );
    }

    /// <summary>
    /// Dense property-inspector rows (<c>UISize.Small</c> + <c>UIInputTitlePlacement.Inside</c> + <c>UIInputAppearance.Underline</c>)
    /// across all eight single-row input types.
    /// </summary>
    private static ContainerComponent CreateCompactInsideGroup()
    {
        return DemoUI.CreateExample("Compact inspector fields (Small + TitlePlacement.Inside)",
            UILayout.Stack(4)
                .AddChild(new TextInputComponent()
                    .SetSize(UISize.Small)
                    .SetTitlePlacement(UIInputTitlePlacement.Inside)
                    .SetAppearance(UIInputAppearance.Underline)
                    .SetTitle("Server")
                    .SetValue("db-us-east-2")
                )
                .AddChild(new NumberInputComponent()
                    .SetSize(UISize.Small)
                    .SetTitlePlacement(UIInputTitlePlacement.Inside)
                    .SetAppearance(UIInputAppearance.Underline)
                    .SetTitle("Disk")
                    .SetSuffixText("GB")
                    .SetShowStepper()
                    .SetValue(240)
                )
                .AddChild(new SelectComponent()
                    .SetSize(UISize.Small)
                    .SetTitlePlacement(UIInputTitlePlacement.Inside)
                    .SetAppearance(UIInputAppearance.Underline)
                    .SetTitle("Role")
                    .SetOptions(RoleOptions)
                    .SetValue("db")
                )
                .AddChild(new DateInputComponent()
                    .SetSize(UISize.Small)
                    .SetTitlePlacement(UIInputTitlePlacement.Inside)
                    .SetAppearance(UIInputAppearance.Underline)
                    .SetTitle("Due")
                    .SetValue(new DateOnly(2026, 10, 30))
                )
                .AddChild(new TimeInputComponent()
                    .SetSize(UISize.Small)
                    .SetTitlePlacement(UIInputTitlePlacement.Inside)
                    .SetAppearance(UIInputAppearance.Underline)
                    .SetTitle("At")
                    .SetValue(new TimeOnly(9, 24))
                )
                .AddChild(new SearchComponent()
                    .SetSize(UISize.Small)
                    .SetTitlePlacement(UIInputTitlePlacement.Inside)
                    .SetAppearance(UIInputAppearance.Underline)
                    .SetTitle("Region")
                    .SetPlaceholder("Search regions")
                    .SetOptions(RegionOptions)
                )
                .AddChild(new FileInputComponent()
                    .SetSize(UISize.Small)
                    .SetTitlePlacement(UIInputTitlePlacement.Inside)
                    .SetAppearance(UIInputAppearance.Underline)
                    .SetTitle("Certificate")
                    .SetPlaceholder("Choose .pem")
                    .SetAccept(".pem,.crt")
                )
                .AddChild(new ImageInputComponent()
                    .SetVariant(UIImageInputVariant.Inline)
                    .SetSize(UISize.Small)
                    .SetTitlePlacement(UIInputTitlePlacement.Inside)
                    .SetAppearance(UIInputAppearance.Underline)
                    .SetTitle("Icon")
                    .SetPlaceholder("None chosen")
                ),
            note: "`TitlePlacement.Inside` places the caption on the left and right-aligns the value and trailing stepper, chevron or `...` picker."
        );
    }

    /// <summary>
    /// <c>Small</c>, <c>Medium</c> and <c>Large</c> height steps paired across field and choice controls, plus <c>IsReadOnly</c> vs <c>Enabled(false)</c>.
    /// </summary>
    private static ContainerComponent CreateSizesAndStatesGroup()
    {
        return DemoUI.CreateExample("Size ladder & states",
            UILayout.Stack(14)
                .AddChild(UIForm.Row(
                    new TextInputComponent()
                        .SetSize(UISize.Small)
                        .SetTitle("Small (24 px)")
                        .SetValue("billing"),
                    new SelectComponent()
                        .SetSize(UISize.Small)
                        .SetTitle("Small select")
                        .SetOptions(RoleOptions)
                        .SetValue("api")
                ))
                .AddChild(UIForm.Row(
                    new TextInputComponent()
                        .SetSize(UISize.Medium)
                        .SetTitle("Medium (40 px)")
                        .SetValue("billing"),
                    new SelectComponent()
                        .SetSize(UISize.Medium)
                        .SetTitle("Medium select")
                        .SetOptions(RoleOptions)
                        .SetValue("api")
                ))
                .AddChild(UIForm.Row(
                    new TextInputComponent()
                        .SetSize(UISize.Large)
                        .SetTitle("Large (48 px)")
                        .SetValue("billing"),
                    new SelectComponent()
                        .SetSize(UISize.Large)
                        .SetTitle("Large select")
                        .SetOptions(RoleOptions)
                        .SetValue("api")
                ))
                .AddChild(DemoUI.CreateLabelled("Read-only vs disabled", UIForm.Row(
                        new TextInputComponent()
                            .SetTitle("Read-only (focusable, copyable)")
                            .SetIsReadOnly(true)
                            .SetValue("orv_pub_88a4c210"),
                        new NumberInputComponent()
                            .SetTitle("Disabled (inert)")
                            .SetEnabled(false)
                            .SetShowStepper()
                            .SetValue(16)
                    )
                )),
            note: "Every sized input steps height, horizontal padding and font size together (`Small`, `Medium`, `Large`) so mixed rows align."
        );
    }

    /// <summary>
    /// Six distinct input families on one horizontal row, sharing label height, 40 px control box and 6 px radius.
    /// </summary>
    private static ContainerComponent CreateToolbarRowGroup()
    {
        return DemoUI.CreateExample("Multi-type horizontal form row",
            UIForm.Row(
                new SearchComponent()
                    .SetTitle("Service")
                    .SetPlaceholder("Filter services")
                    .SetOptions(RoleOptions),
                new SelectComponent()
                    .SetTitle("Region")
                    .SetOptions(RegionOptions)
                    .SetValue("eu-west"),
                new DateInputComponent()
                    .SetTitle("Cutover date")
                    .SetValue(new DateOnly(2026, 11, 14)),
                new NumberInputComponent()
                    .SetTitle("Concurrency")
                    .SetShowStepper()
                    .SetValue(8),
                new FileInputComponent()
                    .SetTitle("Certificate")
                    .SetPlaceholder("Choose .pem")
                    .SetAccept(".pem,.crt"),
                new ColorInputComponent()
                    .SetTitle("Badge color")
                    .SetShowPalette(false)
                    .SetValue(UIThemeColor.FromStyle(UIColorStyle.Primary))
            ),
            columns: 24,
            note: "`Search`, `Select`, `DateInput`, `NumberInput`, `FileInput` and `ColorInput` share one baseline and box geometry inside `UIForm.Row`."
        );
    }
}
