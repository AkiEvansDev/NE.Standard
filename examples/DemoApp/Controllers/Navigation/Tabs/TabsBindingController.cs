using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Navigation.Tabs;

internal sealed partial class TabsGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string SelectedKey { get; set; } = "overview";

    /// <summary>
    /// Hiding a page is hiding its caption — <c>Visible</c> lives on the header, so this is the one flag the
    /// tab strip needs for it.
    /// </summary>
    [RecursiveMember]
    public partial bool SecretsVisible { get; set; } = true;

    public void SelectNext()
        => SetLastChange(nameof(SelectedKey), SelectedKey = CycleValue(SelectedKey, "overview", "members", "secrets"));

    public void ToggleSecrets()
        => SetLastChange(nameof(SecretsVisible), SecretsVisible = !SecretsVisible);
}

internal sealed partial class TabsBindingController() : DemoBindingController
{
    [RecursiveMember]
    public partial TabsGroupContext TabsGroup { get; set; } = new();

    [UICommand]
    public void SelectNext()
        => TabsGroup.SelectNext();

    [UICommand]
    public void ToggleSecrets()
        => TabsGroup.ToggleSecrets();
}
