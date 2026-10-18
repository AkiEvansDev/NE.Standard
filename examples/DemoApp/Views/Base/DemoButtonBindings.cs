using DemoApp.Controllers.Base;

namespace DemoApp.Views.Base;

/// <summary>
/// Every property a button can be bound on, shared with the action, which adds only the trailing pair.
/// </summary>
internal static class DemoButtonBindings
{
    public static T Bind<T>(T button, string buttonGroup, string contentGroup, string layoutGroup, string badgeGroup, string borderGroup)
        where T : ButtonComponent<T>, IUIComponentDefinition
        => button
            .BindStandard()
            .BindType($"{buttonGroup}.{nameof(ButtonGroupContext.Type)}")
            .BindSize($"{buttonGroup}.{nameof(ButtonGroupContext.Size)}")
            .BindPadding($"{buttonGroup}.{nameof(ButtonGroupContext.Padding)}")
            .BindBackground($"{buttonGroup}.{nameof(ButtonGroupContext.Background)}")
            .BindOverflow($"{buttonGroup}.{nameof(ButtonGroupContext.Overflow)}")
            .BindShortcut($"{buttonGroup}.{nameof(ButtonGroupContext.Shortcut)}")
            .BindTextContent(contentGroup)
            .BindDescription($"{contentGroup}.{nameof(TextContentGroupContext.Description)}")
            .BindDescriptionType($"{contentGroup}.{nameof(TextContentGroupContext.DescriptionType)}")
            .BindDescriptionColor($"{contentGroup}.{nameof(TextContentGroupContext.DescriptionColor)}")
            .BindTextAlignment($"{layoutGroup}.{nameof(TextLayoutGroupContext.TextAlignment)}")
            .BindBadge(badgeGroup)
            .BindBorder(borderGroup);
}
