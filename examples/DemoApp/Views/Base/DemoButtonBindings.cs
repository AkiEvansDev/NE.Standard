using DemoApp.Controllers.Base;

namespace DemoApp.Views.Base;

/// <summary>
/// Every property a button can be bound on, shared with the action, which adds only the trailing pair.
/// </summary>
internal static class DemoButtonBindings
{
    public static T Bind<T>(T button, string buttonGroup, string labelGroup, string borderGroup)
        where T : ButtonComponent<T>, IUIComponentDefinition
        => button
            .BindStandard()
            .BindVariant($"{buttonGroup}.{nameof(ButtonGroupContext.Variant)}")
            .BindSize($"{buttonGroup}.{nameof(ButtonGroupContext.Size)}")
            .BindTextAlignment($"{buttonGroup}.{nameof(ButtonGroupContext.TextAlignment)}")
            .BindPadding($"{buttonGroup}.{nameof(ButtonGroupContext.Padding)}")
            .BindBackground($"{buttonGroup}.{nameof(ButtonGroupContext.Background)}")
            .BindOverflow($"{buttonGroup}.{nameof(ButtonGroupContext.Overflow)}")
            .BindShortcut($"{buttonGroup}.{nameof(ButtonGroupContext.Shortcut)}")
            .BindLabel(labelGroup, hasDescription: true)
            .BindBorder(borderGroup);
}
