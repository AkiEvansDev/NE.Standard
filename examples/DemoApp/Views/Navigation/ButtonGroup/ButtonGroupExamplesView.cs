using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Navigation.ButtonGroup;

/// <summary>
/// The places a strip of segments is written: a view switched by icons in a toolbar, a period chosen by word, and a
/// strip standing beside a field.
/// </summary>
/// <remarks>Nothing here is bound: the pages show the shapes, and the strips keep their own current segment.</remarks>
internal sealed class ButtonGroupExamplesView : DemoExamplesView, IUIViewDefinition
{
    public static string ViewKey => "demo.navigation.button-group.examples";

    protected override string ComponentRoute => "/navigation/button-group";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.navigation.button-group.header";
    protected override string HeaderDescription => "demo.navigation.button-group.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateToolbarGroup()],
            [CreatePeriodGroup()]
        ));

        _ = container.AddChild(CreateFieldGroup());
    }

    /// <summary>
    /// The shape the control exists for: how a list is shown, chosen by glyph at the end of a toolbar.
    /// </summary>
    private static ContainerComponent CreateToolbarGroup()
    {
        return DemoUI.CreateGroup(null, "A view switched from a toolbar",
            content => content.AddChild(new SurfaceComponent()
                .SetPadding(UIThickness.All(12, 8, 12, 8))
                .SetContent(new ContainerComponent()
                    .SetColumn(24, UIGridUnit.Auto())
                    .AddChild(new TextComponent()
                        .SetTitle("Deploys")
                        .SetDescription("48 in the last day")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetVerticalAlignment(UIAlignment.Center)
                        .SetPlacement(1, 1, 23, 1)
                    )
                    .AddChild(new ButtonGroupComponent()
                        .SetSize(UIButtonSize.Small)
                        .SetSelectedKey("list")
                        .SetItems([
                            new ButtonItem { Id = "list", Icon = DemoIcons.Outline(DemoIcons.List), Tooltip = "List" },
                            new ButtonItem { Id = "board", Icon = DemoIcons.Outline(DemoIcons.LayoutDashboard), Tooltip = "Board" },
                            new ButtonItem { Id = "timeline", Icon = DemoIcons.Outline(DemoIcons.History), Tooltip = "Timeline" }
                        ])
                        .SetPlacement(24, 1, 1, 1)
                    )
                )
            ),
            note: "Glyphs alone, with the word in the tooltip: a strip at a toolbar's end is read by its pictures."
        );
    }

    /// <summary>
    /// Words rather than glyphs, one of them unavailable: a segment that cannot be chosen stays in the strip and takes no press.
    /// </summary>
    private static ContainerComponent CreatePeriodGroup()
    {
        return DemoUI.CreateGroup(null, "A period chosen by word",
            content => content.AddChild(DemoUI.CreateStack()
                .AddChild(new ButtonGroupComponent()
                    .SetSelectedKey("week")
                    .SetItems([
                        new ButtonItem { Id = "day", Title = "Day" },
                        new ButtonItem { Id = "week", Title = "Week" },
                        new ButtonItem { Id = "month", Title = "Month" },
                        new ButtonItem { Id = "year", Title = "Year", Enabled = false, Tooltip = "Not enough history yet" }
                    ])
                )
                .AddChild(new ButtonGroupComponent()
                    .SetSize(UIButtonSize.Large)
                    .SetSelectedKey("staging")
                    .SetSelectionStyle(UISelectionStyle.Ground(UIThemeColor.Accent))
                    .SetItems([
                        new ButtonItem { Id = "dev", Icon = DemoIcons.Outline(DemoIcons.Edit), Title = "Development" },
                        new ButtonItem { Id = "staging", Icon = DemoIcons.Outline(DemoIcons.Cloud), Title = "Staging" },
                        new ButtonItem { Id = "prod", Icon = DemoIcons.Outline(DemoIcons.Shield), Title = "Production" }
                    ])
                )
            ),
            note: "The first at the ordinary size with a disabled year; the second large, with the accent as the chosen ground."
        );
    }

    /// <summary>
    /// A strip beside a field, on the field's own ground, so the two read as one row.
    /// </summary>
    private static ContainerComponent CreateFieldGroup()
    {
        return DemoUI.CreateGroup(null, "Beside a field",
            content => content.AddChild(new ContainerComponent()
                .SetColumn(24, UIGridUnit.Auto())
                .AddChild(new TextInputComponent()
                    .SetTitle("Search deploys")
                    .SetPrefixIcon(DemoIcons.Search)
                    .SetPlaceholder("Service, version or region")
                    .SetPlacement(1, 1, 23, 1)
                )
                .AddChild(new ButtonGroupComponent()
                    .SetVerticalAlignment(UIAlignment.End)
                    .SetMargin(UIThickness.All(8, 0, 0, 0))
                    .SetSelectedKey("all")
                    .SetItems([
                        new ButtonItem { Id = "all", Title = "All" },
                        new ButtonItem { Id = "failed", Title = "Failed" }
                    ])
                    .SetPlacement(24, 1, 1, 1)
                )
            ),
            columns: 24,
            note: "The group sits at the far end of the row the field fills, which is only a row once it has the page's width."
        );
    }
}
