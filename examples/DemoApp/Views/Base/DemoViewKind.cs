namespace DemoApp.Views.Base;

internal enum DemoViewKind
{
    /// <summary>The component's own page: one preview, and every bindable property beside it.</summary>
    Main,

    /// <summary>Optional: what the component looks like used in different ways.</summary>
    Examples,

    /// <summary>Optional: interaction, input, files — what needs a story rather than a property.</summary>
    Scenarios,

    /// <summary>
    /// A page with no component of its own to give a Main page — a dialog, a toast, a context menu.
    /// </summary>
    Test
}
