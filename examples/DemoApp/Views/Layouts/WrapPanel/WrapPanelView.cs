using DemoApp.Controllers.Base;
using DemoApp.Controllers.Layouts.WrapPanel;
using DemoApp.Views.Base;

namespace DemoApp.Views.Layouts.WrapPanel;

/// <summary>
/// One wrapping panel, and every property that can be bound to it.
/// </summary>
/// <remarks>Unlike a stack panel told to wrap, it sizes what it holds by the column span each child claims, out of twenty-four.</remarks>
internal sealed class WrapPanelView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string WrapGroup = nameof(WrapPanelController.WrapGroup);

    public static string ViewKey => "demo.layouts.wrap-panel";

    protected override string ComponentRoute => "/layouts/wrap-panel";
    protected override string Header => "demo.layouts.wrap-panel.header";
    protected override string HeaderDescription => "demo.layouts.wrap-panel.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new WrapPanelComponent()
            .BindStandard()
            .BindSpacing($"{WrapGroup}.{nameof(WrapPanelGroupContext.Spacing)}")
            .BindLineSpacing($"{WrapGroup}.{nameof(WrapPanelGroupContext.LineSpacing)}")
            // Two columns of twenty-four: near-square tiles, and twenty of them do not fill the second row.
            .AddChildren(DemoUI.CreateSpannedTiles(20, 2))
            .SetPlacement(1, 1, 24, 1)
        ), contentMinHeight: 300);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard"),
            DemoUI.CreateOptionSection(WrapGroup, "Wrap panel")
        );

    // The two that need the page's width across it; the captioned tiles beside the form, both read at half the page.
    protected override IVisualComponent[] CreateExamples()
        => [CreateColumnsGroup(), CreatePlansGroup(), .. DemoUI.CreateColumns([CreateRegionsGroup()], [CreateFormGroup()])];

    /// <summary>
    /// A set of like controls in even columns: each line's room shared out, so no line staggers under the one above.
    /// </summary>
    private static ContainerComponent CreateColumnsGroup()
    {
        return DemoUI.CreateExample("Settings in even columns",
            new WrapPanelComponent()
                .SetSpacing(16)
                .SetLineSpacing(8)
                .SetItemMinWidth(180)
                .AddChildren(
                    new SwitchComponent().SetTitle("Line numbers").SetValue(true),
                    new SwitchComponent().SetTitle("Wrap lines"),
                    new SwitchComponent().SetTitle("Read-only"),
                    new SwitchComponent().SetTitle("Search").SetValue(true),
                    new SwitchComponent().SetTitle("Status bar").SetValue(true),
                    new SwitchComponent().SetTitle("Completions"),
                    new SwitchComponent().SetTitle("Spell check"),
                    new SwitchComponent().SetTitle("Show whitespace")
                ),
            columns: 24,
            note: "`SetItemMinWidth(180)`: as many columns as fit at 180 px, each line's room shared out equally. Without it every switch takes its own words' width, and each wrapped line starts under a different neighbour."
        );
    }

    /// <summary>
    /// A responsive span per child: the four plans one to a line on a phone, two on a tablet, four from the extra-large width.
    /// </summary>
    private static ContainerComponent CreatePlansGroup()
    {
        return DemoUI.CreateExample("Plans, a share of the line each",
            new WrapPanelComponent()
                .SetSpacing(16)
                .AddChild(new CardComponent()
                    .SetVerticalAlignment(UIAlignment.Stretch)
                    .ConfigureDefaultHeader(header => header
                        .SetTitle("Starter")
                        .SetDescription("€6 a month for each server")
                    )
                    .SetContent(UIDetails.List(("vCPU", "1"), ("Memory", "2 GB"), ("Disk", "40 GB")))
                    .SetPlacement(1, 1, 24, 1, md: UIGridPlacement.At(1, 1, 12, 1), xl: UIGridPlacement.At(1, 1, 6, 1))
                )
                .AddChild(new CardComponent()
                    .SetVerticalAlignment(UIAlignment.Stretch)
                    .ConfigureDefaultHeader(header => header
                        .SetTitle("Standard")
                        .SetDescription("€18 a month for each server")
                        .SetBadgeText("Most chosen")
                        .SetBadgeStyle(UIBadgeType.Primary)
                    )
                    .SetContent(UIDetails.List(("vCPU", "2"), ("Memory", "4 GB"), ("Disk", "80 GB")))
                    .SetPlacement(1, 1, 24, 1, md: UIGridPlacement.At(1, 1, 12, 1), xl: UIGridPlacement.At(1, 1, 6, 1))
                )
                .AddChild(new CardComponent()
                    .SetVerticalAlignment(UIAlignment.Stretch)
                    .ConfigureDefaultHeader(header => header
                        .SetTitle("Pro")
                        .SetDescription("€64 a month for each server")
                    )
                    .SetContent(UIDetails.List(("vCPU", "4"), ("Memory", "16 GB"), ("Disk", "240 GB")))
                    .SetPlacement(1, 1, 24, 1, md: UIGridPlacement.At(1, 1, 12, 1), xl: UIGridPlacement.At(1, 1, 6, 1))
                )
                .AddChild(new CardComponent()
                    .SetVerticalAlignment(UIAlignment.Stretch)
                    .ConfigureDefaultHeader(header => header
                        .SetTitle("Dedicated")
                        .SetDescription("€290 a month for each server")
                    )
                    .SetContent(UIDetails.List(("vCPU", "16"), ("Memory", "64 GB"), ("Disk", "960 GB")))
                    .SetPlacement(1, 1, 24, 1, md: UIGridPlacement.At(1, 1, 12, 1), xl: UIGridPlacement.At(1, 1, 6, 1))
                ),
            columns: 24,
            note: "Each card claims a span per width — all twenty-four on a phone, twelve from the medium width, six from the extra-large — and the panel puts as many on a line as their spans add up to. A span is read against the window, not the panel, as every responsive placement is."
        );
    }

    /// <summary>
    /// <c>LineSpacing</c> apart from <c>Spacing</c>: tiles with a caption under them want more air between their lines than beside each other.
    /// </summary>
    private static ContainerComponent CreateRegionsGroup()
    {
        return DemoUI.CreateExample("Captioned tiles, lines further apart",
            new WrapPanelComponent()
                .SetSpacing(12)
                .SetLineSpacing(24)
                .AddChild(UILayout.Stack(6,
                        new SurfaceComponent().SetContent(new TextComponent().SetTitle("412").SetTitleType(UITextAppearance.Title).SetDescription("servers").SetDescriptionType(UITextAppearance.Caption).SetDescriptionColor(UIThemeColor.Muted)),
                        UIText.Caption("Europe West", "Amsterdam · eu-west")
                    )
                    .SetPlacement(1, 1, 8, 1)
                )
                .AddChild(UILayout.Stack(6,
                        new SurfaceComponent().SetContent(new TextComponent().SetTitle("268").SetTitleType(UITextAppearance.Title).SetDescription("servers").SetDescriptionType(UITextAppearance.Caption).SetDescriptionColor(UIThemeColor.Muted)),
                        UIText.Caption("Europe Central", "Frankfurt · eu-central")
                    )
                    .SetPlacement(1, 1, 8, 1)
                )
                .AddChild(UILayout.Stack(6,
                        new SurfaceComponent().SetContent(new TextComponent().SetTitle("96").SetTitleType(UITextAppearance.Title).SetDescription("servers").SetDescriptionType(UITextAppearance.Caption).SetDescriptionColor(UIThemeColor.Muted)),
                        UIText.Caption("Europe North", "Stockholm · eu-north")
                    )
                    .SetPlacement(1, 1, 8, 1)
                )
                .AddChild(UILayout.Stack(6,
                        new SurfaceComponent().SetContent(new TextComponent().SetTitle("341").SetTitleType(UITextAppearance.Title).SetDescription("servers").SetDescriptionType(UITextAppearance.Caption).SetDescriptionColor(UIThemeColor.Muted)),
                        UIText.Caption("US East", "Ashburn · us-east")
                    )
                    .SetPlacement(1, 1, 8, 1)
                )
                .AddChild(UILayout.Stack(6,
                        new SurfaceComponent().SetContent(new TextComponent().SetTitle("57").SetTitleType(UITextAppearance.Title).SetDescription("servers").SetDescriptionType(UITextAppearance.Caption).SetDescriptionColor(UIThemeColor.Muted)),
                        UIText.Caption("Asia South", "Singapore · ap-south")
                    )
                    .SetPlacement(1, 1, 8, 1)
                ),
            note: "Spacing 12 beside each other, LineSpacing 24 between the lines: each tile has its caption under it, and with no more air than 12 the caption would read as the next line's."
        );
    }

    /// <summary>
    /// A short form two fields to a line from the medium width, one to a line on a phone, the fields in reading order either way.
    /// </summary>
    private static ContainerComponent CreateFormGroup()
    {
        return DemoUI.CreateExample("Two fields to a line",
            new WrapPanelComponent()
                .SetSpacing(16)
                .AddChild(new TextInputComponent()
                    .SetTitle("Server name")
                    .SetValue("api-eu-west-3")
                    .SetPlacement(1, 1, 24, 1, md: UIGridPlacement.At(1, 1, 12, 1))
                )
                .AddChild(new SelectComponent()
                    .SetTitle("Region")
                    .SetOptions(
                    [
                        new OptionItem { Id = "eu-west", Title = "Europe West" },
                        new OptionItem { Id = "eu-central", Title = "Europe Central" },
                        new OptionItem { Id = "eu-north", Title = "Europe North" },
                        new OptionItem { Id = "us-east", Title = "US East" },
                        new OptionItem { Id = "ap-south", Title = "Asia South" }
                    ])
                    .SetValue("eu-west")
                    .SetPlacement(1, 1, 24, 1, md: UIGridPlacement.At(1, 1, 12, 1))
                )
                .AddChild(new SelectComponent()
                    .SetTitle("Plan")
                    .SetOptions(
                    [
                        new OptionItem { Id = "starter", Title = "Starter" },
                        new OptionItem { Id = "standard", Title = "Standard" },
                        new OptionItem { Id = "pro", Title = "Pro" },
                        new OptionItem { Id = "dedicated", Title = "Dedicated" }
                    ])
                    .SetValue("pro")
                    .SetPlacement(1, 1, 24, 1, md: UIGridPlacement.At(1, 1, 12, 1))
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("Image")
                    .SetValue("ubuntu-24.04")
                    .SetPlacement(1, 1, 24, 1, md: UIGridPlacement.At(1, 1, 12, 1))
                ),
            note: "Twelve columns each from the medium width, so two share a line; all twenty-four on a phone, so they stand one under another in the order they were added."
        );
    }
}
