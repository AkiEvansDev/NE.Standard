namespace DemoApp.Views.Inputs.Toggle;

/// <summary>
/// One switch and every property that can be bound to it — the checkbox's page over the other drawing; then the one layout the drawing
/// is made for.
/// </summary>
/// <remarks>The label, the settings list and the control it is not are the checkbox's, shown once on its page.</remarks>
internal sealed class SwitchView : ToggleView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.switch";

    protected override string ComponentRoute => "/inputs/switch";
    protected override string Header => "demo.inputs.switch.header";
    protected override string HeaderDescription => "demo.inputs.switch.description";
    protected override (string Route, string Label)? ComposedIn => ("/screens/settings", "demo.nav.screens.settings");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(Bind(new SwitchComponent())));

    protected override IVisualComponent[] CreateExamples()
        => [CreateRowEndGroup()];

    /// <summary>
    /// The layout a switch is drawn for: a settings list, the control at the far end of each row rather than in front of it.
    /// </summary>
    /// <remarks>Composed by hand, not a property: the control is as wide as itself, so the row is a grid with it in the last column.</remarks>
    private static ContainerComponent CreateRowEndGroup()
    {
        return DemoUI.CreateExample("Settings, at the end of each row",
            new SurfaceComponent()
                .SetContent(UILayout.Stack(4)
                    .AddChild(new ContainerComponent()
                        .SetPadding(UIThickness.All(0, 6, 0, 6))
                        .SetColumn(24, UIGridUnit.Auto())
                        .AddChild(new TextComponent()
                            .SetIcon(DemoIcons.Bell)
                            .SetTitle("Deploy notifications")
                            .SetTitleType(UITextAppearance.Body)
                            .SetDescription("Mailed to the admins on call")
                            .SetDescriptionType(UITextAppearance.Caption)
                            .SetDescriptionColor(UIThemeColor.Muted)
                            .SetVerticalAlignment(UIAlignment.Center)
                            .SetPlacement(1, 1, 23, 1)
                        )
                        .AddChild(new SwitchComponent()
                            .SetValue(true)
                            .SetVerticalAlignment(UIAlignment.Center)
                            .SetPlacement(24, 1, 1, 1)
                        )
                    )
                    .AddChild(new ContainerComponent()
                        .SetPadding(UIThickness.All(0, 6, 0, 6))
                        .SetColumn(24, UIGridUnit.Auto())
                        .AddChild(new TextComponent()
                            .SetIcon(DemoIcons.History)
                            .SetTitle("Keep snapshots")
                            .SetTitleType(UITextAppearance.Body)
                            .SetDescription("Thirty days, then they are dropped")
                            .SetDescriptionType(UITextAppearance.Caption)
                            .SetDescriptionColor(UIThemeColor.Muted)
                            .SetVerticalAlignment(UIAlignment.Center)
                            .SetPlacement(1, 1, 23, 1)
                        )
                        .AddChild(new SwitchComponent()
                            .SetValue(false)
                            .SetVerticalAlignment(UIAlignment.Center)
                            .SetPlacement(24, 1, 1, 1)
                        )
                    )
                    .AddChild(new ContainerComponent()
                        .SetPadding(UIThickness.All(0, 6, 0, 6))
                        .SetColumn(24, UIGridUnit.Auto())
                        .AddChild(new TextComponent()
                            .SetIcon(DemoIcons.Refresh)
                            .SetTitle("Restart on a failed health check")
                            .SetTitleType(UITextAppearance.Body)
                            .SetDescription("After three missed answers in a row")
                            .SetDescriptionType(UITextAppearance.Caption)
                            .SetDescriptionColor(UIThemeColor.Muted)
                            .SetVerticalAlignment(UIAlignment.Center)
                            .SetPlacement(1, 1, 23, 1)
                        )
                        .AddChild(new SwitchComponent()
                            .SetValue(true)
                            .SetVerticalAlignment(UIAlignment.Center)
                            .SetPlacement(24, 1, 1, 1)
                        )
                    )
                ),
            note: "A switch is a checkbox drawn as a track and a knob, for a setting that is turned on rather than agreed to; at the far end of its row the text is the subject and the switch only answers it. The label it carries and the control it is not are on [the checkbox's page](/inputs/checkbox).",
            columns: 24
        );
    }
}
