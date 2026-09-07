using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Layouts.Scroll;

/// <summary>The chat bubble both Scroll pages fill their panes with.</summary>
internal static class ScrollDemo
{
    public static SurfaceComponent CreateMessage(string author, string text, bool mine, double maxWidth = 300)
        => new SurfaceComponent()
            .SetSurface(mine ? UISurfaceStyle.Tinted : UISurfaceStyle.Raised)
            .SetBackground(mine ? UIThemeColor.Primary : null)
            .SetMaxWidth(UILayoutLength.Absolute(maxWidth))
            .SetHorizontalAlignment(mine ? UIAlignment.End : UIAlignment.Start)
            .SetPadding(UIThickness.All(10, 8, 10, 8))
            .SetContent(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(2)
                .AddChild(new TextComponent()
                    .SetTitle(author)
                    .SetTitleType(UITextAppearance.Caption)
                    .SetTitleColor(UIThemeColor.Muted)
                )
                .AddChild(new ParagraphComponent()
                    .SetDescription(text)
                    .SetDescriptionType(UITextAppearance.Body)
                )
            );
}
