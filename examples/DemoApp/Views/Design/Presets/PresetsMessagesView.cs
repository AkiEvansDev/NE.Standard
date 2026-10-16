using System.Collections.Generic;

namespace DemoApp.Views.Design.Presets;

/// <summary>A dialog with a header, a message that stays in the page, and names and values to read.</summary>
internal sealed class PresetsMessagesView : PresetsViewBase, IUIViewDefinition
{
    public static string ViewKey => "demo.design.presets.messages";

    protected override string CurrentTabUrl => "/design/presets/messages";

    protected override IReadOnlyList<UIDialog> CreateDialogs()
        => CreateSampleDialogs();

    protected override void DrawPresetsContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateHeading("UIDialogs — a dialog with a header"))
            .AddChild(CreateDialogsGroup());

        _ = container
            .AddChild(CreateHeading("UIMessage — a message that stays in the page"))
            .AddChildren(DemoUI.CreateColumns([CreateSeverityGroup()], [CreateMessageCreateGroup()]))
            .AddChild(CreateHeading("UIDetails — names and values to read"))
            .AddChildren(DemoUI.CreateColumns([CreateDetailsListGroup()], [CreateDetailsRowGroup()]))
            .AddChild(CreateSumsGroup());
    }
}
