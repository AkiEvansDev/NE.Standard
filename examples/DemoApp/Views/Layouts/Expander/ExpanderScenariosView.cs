using DemoApp.Controllers.Layouts.Expander;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Layouts.Expander;

/// <summary>
/// The reason an expander has server events: opening it is a moment the application can act on.
/// </summary>
internal sealed class ExpanderScenariosView : DemoScenariosView, IUIViewDefinition
{
    private const string LoadGroup = nameof(ExpanderScenariosController.LoadGroup);
    private const string EventGroup = nameof(ExpanderScenariosController.EventGroup);

    public static string ViewKey => "demo.layouts.expander.scenarios";

    protected override string ComponentRoute => "/layouts/expander";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples, DemoViewKind.Scenarios];
    protected override string Header => "demo.layouts.expander.header";
    protected override string HeaderDescription => "demo.layouts.expander.description";

    protected override void DrawContent(WrapPanelComponent container)
        => _ = container.AddChildren(DemoUI.CreateColumns([CreateLoadGroup()], [CreateEventGroup()]));

    /// <summary>
    /// A section whose contents cost something to fetch: the first open goes to the server, later ones do not.
    /// </summary>
    private static ContainerComponent CreateLoadGroup()
    {
        return DemoUI.CreateGroup(LoadGroup, "Read when it is first opened",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(10)
                .SetWidth(UILayoutLength.Absolute(420))
                .AddChild(new ExpanderComponent()
                    .SetCollapsed()
                    .OnExpand(nameof(ExpanderScenariosController.LoadLogAsync))
                    .ConfigureDefaultHeader(header => header
                        .SetIcon(DemoIcons.FileText)
                        .SetTitle("Build log")
                        .SetDescription("A few hundred kilobytes nobody asked for yet")
                        .BindBadgeText(nameof(ExpanderLoadGroupContext.State), UIBindingScope.Relative)
                        .BindBadgeStyle(nameof(ExpanderLoadGroupContext.StateStyle), UIBindingScope.Relative)
                    )
                    // Loading sits on the content: on the expander it would cover the header saying which section is busy.
                    .SetContent(new ContainerComponent()
                        .BindLoading(nameof(ExpanderLoadGroupContext.Busy), UIBindingScope.Relative)
                        .SetMinHeight(UILayoutLength.Absolute(90))
                        .AddChild(new ParagraphComponent()
                            .BindDescription(nameof(ExpanderLoadGroupContext.Log), UIBindingScope.Relative)
                            .SetDescriptionType(UITextAppearance.Caption)
                            .SetDescriptionColor(UIThemeColor.Muted)
                            .SetPlacement(1, 1, 24, 1)
                        )
                    )
                )
                .AddChild(new ButtonComponent()
                    .OnClick(nameof(ExpanderScenariosController.ForgetLog))
                    .SetType(UIButtonType.Ghost)
                    .SetSize(UIButtonSize.Small)
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Undo))
                    .SetTitle("Forget it, so the next open reads again")
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            note: "The contents cost a request. The first open goes to the server and every later one does not, so what arrives lands in a box the reader is already looking at."
        );
    }

    /// <summary>
    /// Two events, one per gesture; the section's two-way write-back lands before either command runs.
    /// </summary>
    private static ContainerComponent CreateEventGroup()
    {
        return DemoUI.CreateGroup(EventGroup, "Two events, one section",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(10)
                .SetWidth(UILayoutLength.Absolute(420))
                .AddChild(new ExpanderComponent()
                    .SetCollapsed()
                    .BindExpanded(nameof(ExpanderEventGroupContext.Expanded), UIBindingScope.Relative)
                    .OnExpand(nameof(ExpanderScenariosController.RecordExpand))
                    .OnCollapse(nameof(ExpanderScenariosController.RecordCollapse))
                    .ConfigureDefaultHeader(header => header
                        .SetTitle("Open and close me")
                    )
                    .SetContent(new ParagraphComponent()
                        .SetDescription("Opening raises **Expand**, closing raises **Collapse** — one command per press, and the state it reads is already the new one.")
                        .SetDescriptionType(UITextAppearance.Body)
                    )
                )
                .AddChild(new ContainerComponent()
                    .SetColumn(24, UIGridUnit.Auto())
                    // A paragraph: the trace grows past its column, and a text row would ellipsise the end of it.
                    .AddChild(new ParagraphComponent()
                        .SetTitle("Last four presses")
                        .SetTitleType(UITextAppearance.Caption)
                        .SetTitleColor(UIThemeColor.Muted)
                        .BindDescription(nameof(ExpanderEventGroupContext.Trace), UIBindingScope.Relative)
                        .SetDescriptionType(UITextAppearance.Body)
                        .SetVerticalAlignment(UIAlignment.Center)
                        .SetPlacement(1, 1, 23, 1)
                    )
                    .AddChild(new ButtonComponent()
                        .OnClick(nameof(ExpanderScenariosController.ClearTrace))
                        .SetType(UIButtonType.Ghost)
                        .SetSize(UIButtonSize.Small)
                        .SetVerticalAlignment(UIAlignment.Center)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Undo))
                        .SetTooltip("Clear the trace")
                        .SetPlacement(24, 1, 1, 1)
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            note: "Opening and closing are two things the application can act on, not one flag it reads afterwards — the log records the last four presses."
        );
    }
}
