using System;
using NE.Colors;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Design.Colors;

/// <summary>
/// Every semantic <see cref="UIColorPalette"/> role: a role with an <c>On*</c> partner as one card per pair,
/// the rest as plain Light/Dark swatches.
/// </summary>
internal sealed class ColorsSemanticView : ColorsViewBase, IUIViewDefinition
{
    private static readonly RolePair[] BrandRoles =
    [
        new("Primary", "OnPrimary", static p => p.Primary, static p => p.OnPrimary),
        new("Accent", "OnAccent", static p => p.Accent, static p => p.OnAccent)
    ];

    private static readonly RolePair[] SurfaceRoles =
    [
        new("Background", "OnBackground", static p => p.Background, static p => p.OnBackground),
        new("Surface", "OnSurface", static p => p.Surface, static p => p.OnSurface)
    ];

    private static readonly RolePair[] StatusRoles =
    [
        new("Info", "OnInfo", static p => p.Info, static p => p.OnInfo),
        new("Warning", "OnWarning", static p => p.Warning, static p => p.OnWarning),
        new("Success", "OnSuccess", static p => p.Success, static p => p.OnSuccess),
        new("Danger", "OnDanger", static p => p.Danger, static p => p.OnDanger)
    ];

    // Words rather than swatches: an ink has to be shown on the ground it will be read against.
    private static readonly SingleRole[] InkRoles =
    [
        new("PrimaryInk", static p => p.PrimaryInk),
        new("AccentInk", static p => p.AccentInk),
        new("InfoInk", static p => p.InfoInk),
        new("WarningInk", static p => p.WarningInk),
        new("SuccessInk", static p => p.SuccessInk),
        new("DangerInk", static p => p.DangerInk)
    ];

    private static readonly SingleRole[] ChromeRoles =
    [
        new("Selected", static p => p.Selected),
        new("FocusRing", static p => p.FocusRing),
        new("Border", static p => p.Border),
        new("Shadow", static p => p.Shadow),
        new("Overlay", static p => p.Overlay)
    ];

    public static string ViewKey => "demo.design.colors.semantic";

    protected override string CurrentTabUrl => "/design/colors/semantic";

    protected override void DrawColorsContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreatePairGroup("Brand", BrandRoles, contentMinHeight: 300))
            .AddChild(CreatePairGroup("Surfaces", SurfaceRoles, contentMinHeight: 300))
            .AddChild(CreatePairGroup("Status", StatusRoles, contentMinHeight: 620))
            .AddChild(CreateInkGroup())
            .AddChild(CreateChromeGroup());
    }

    private static ContainerComponent CreatePairGroup(string title, RolePair[] roles, double contentMinHeight)
    {
        return DemoUI.CreateGroup(null, title,
            content =>
            {
                WrapPanelComponent grid = new WrapPanelComponent()
                    .SetSpacing(12)
                    .SetPlacement(1, 1, 24, 1);

                foreach (RolePair role in roles)
                    _ = grid.AddChild(CreatePairCard(role));

                _ = content.AddChild(grid);
            },
            contentMinHeight: contentMinHeight
        );
    }

    private static StackPanelComponent CreatePairCard(RolePair role)
    {
        return new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(6)
            .SetPlacement(1, 1, 24, 1, md: UIGridPlacement.At(1, 1, 12, 1))
            .AddChild(new TextComponent()
                .SetTitle(role.Name)
                .SetTitleType(UITextAppearance.Body)
                .SetDescription($"text drawn in {role.OnName}")
                .SetDescriptionType(UITextAppearance.Caption)
                .SetDescriptionColor(UIThemeColor.FromStyle(UIColorStyle.Muted))
            )
            .AddChild(CreatePairSample("Light", UIThemeDefaults.LightPalette, role))
            .AddChild(CreatePairSample("Dark", UIThemeDefaults.DarkPalette, role));
    }

    private static ContainerComponent CreatePairSample(string label, UIColorPalette palette, RolePair role)
    {
        ColorVariant baseVariant = role.Select(palette);
        ColorVariant onVariant = role.SelectOn(palette);
        UIThemeColor onColor = UIThemeColor.FromColorVariant(onVariant);

        return new ContainerComponent()
            .SetBackground(UIThemeColor.FromColorVariant(baseVariant))
            .SetBorderColor(UIThemeColor.Border)
            .SetBorderThickness(UIThickness.Uniform(1))
            .SetBorderRadius(UICornerRadius.Uniform(8))
            .SetPadding(UIThickness.All(12, 10, 12, 10))
            .AddRow(UIGridUnit.Auto())
            .AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetPlacement(1, 1, 24, 1)
                .AddChild(new TextComponent()
                    .SetTitle(label)
                    .SetTitleType(UITextAppearance.Body)
                    .SetTitleColor(onColor)
                )
                .AddChild(new TextComponent()
                    .SetTitle(baseVariant.ToHex())
                    .SetTitleType(UITextAppearance.Caption)
                    .SetTitleColor(onColor)
                )
                .AddChild(new TextComponent()
                    .SetTitle(onVariant.ToHex())
                    .SetTitleType(UITextAppearance.Caption)
                    .SetTitleColor(onColor)
                ));
    }

    /// <summary>
    /// The colour each semantic wears as a word, read against the page rather than against its own <c>On*</c>.
    /// </summary>
    private static ContainerComponent CreateInkGroup()
    {
        return DemoUI.CreateGroup(null, "Ink — the same colours as words",
            content =>
            {
                WrapPanelComponent grid = new WrapPanelComponent()
                    .SetSpacing(12)
                    .SetPlacement(1, 1, 24, 1);

                foreach (SingleRole role in InkRoles)
                    _ = grid.AddChild(CreateInkCard(role));

                _ = content.AddChild(grid);
            },
            contentMinHeight: 300
        );
    }

    private static StackPanelComponent CreateInkCard(SingleRole role)
    {
        return new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(6)
            .SetPlacement(1, 1, 24, 1, md: UIGridPlacement.At(1, 1, 12, 1))
            .AddChild(new TextComponent()
                .SetTitle(role.Name)
                .SetTitleType(UITextAppearance.Body)
            )
            .AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetSpacing(12)
                .AddChild(CreateInkSample("Light", UIThemeDefaults.LightPalette, role))
                .AddChild(CreateInkSample("Dark", UIThemeDefaults.DarkPalette, role))
            );
    }

    private static ContainerComponent CreateInkSample(string label, UIColorPalette palette, SingleRole role)
    {
        ColorVariant ink = role.Select(palette);

        return new ContainerComponent()
            .SetBackground(UIThemeColor.FromColorVariant(palette.Background))
            .SetBorderColor(UIThemeColor.Border)
            .SetBorderThickness(UIThickness.Uniform(1))
            .SetBorderRadius(UICornerRadius.Uniform(6))
            .SetPadding(UIThickness.All(10, 8, 10, 8))
            .SetWidth(UILayoutLength.Absolute(150))
            .AddChild(new TextComponent()
                .SetTitle(label)
                .SetTitleColor(UIThemeColor.FromColorVariant(ink))
                .SetDescription(ink.ToHex())
                .SetDescriptionType(UITextAppearance.Caption)
                .SetDescriptionColor(UIThemeColor.FromColorVariant(ink))
                .SetPlacement(1, 1, 24, 1)
            );
    }

    private static ContainerComponent CreateChromeGroup()
    {
        return DemoUI.CreateGroup(null, "Interaction & chrome (no On* partner)",
            content =>
            {
                WrapPanelComponent grid = new WrapPanelComponent()
                    .SetSpacing(12)
                    .SetPlacement(1, 1, 24, 1);

                foreach (SingleRole role in ChromeRoles)
                    _ = grid.AddChild(CreateSingleCard(role));

                _ = content.AddChild(grid);
            },
            contentMinHeight: 300
        );
    }

    private static StackPanelComponent CreateSingleCard(SingleRole role)
    {
        ColorVariant light = role.Select(UIThemeDefaults.LightPalette);
        ColorVariant dark = role.Select(UIThemeDefaults.DarkPalette);

        return new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(6)
            .SetPlacement(1, 1, 24, 1, md: UIGridPlacement.At(1, 1, 12, 1))
            .AddChild(new TextComponent()
                .SetTitle(role.Name)
                .SetTitleType(UITextAppearance.Body)
            )
            .AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetSpacing(12)
                .AddChild(CreateSwatch("Light", light.ToHex(), UIThemeColor.FromColorVariant(light)))
                .AddChild(CreateSwatch("Dark", dark.ToHex(), UIThemeColor.FromColorVariant(dark)))
            );
    }

    private static StackPanelComponent CreateSwatch(string label, string hex, UIThemeColor color)
    {
        return new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(4)
            .AddChild(new ContainerComponent()
                .SetBackground(color)
                .SetBorderColor(UIThemeColor.Border)
                .SetBorderThickness(UIThickness.Uniform(1))
                .SetBorderRadius(UICornerRadius.Uniform(6))
                .SetWidth(UILayoutLength.Absolute(80))
                .SetHeight(UILayoutLength.Absolute(40))
            )
            .AddChild(new TextComponent()
                .SetTitle(label)
                .SetTitleType(UITextAppearance.Caption)
                .SetDescription(hex)
                .SetDescriptionType(UITextAppearance.Caption)
                .SetDescriptionColor(UIThemeColor.FromStyle(UIColorStyle.Muted))
            );
    }

    private readonly record struct RolePair(string Name, string OnName, Func<UIColorPalette, ColorVariant> Select, Func<UIColorPalette, ColorVariant> SelectOn);

    private readonly record struct SingleRole(string Name, Func<UIColorPalette, ColorVariant> Select);
}
