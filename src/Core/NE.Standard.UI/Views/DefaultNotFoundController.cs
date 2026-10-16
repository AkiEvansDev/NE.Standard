using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Controllers;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Shell.Commands;

namespace NE.Standard.UI.Views;

/// <summary>
/// The default not-found page's way back to the application's root.
/// </summary>
[UIAllowAnonymous]
internal sealed partial class DefaultNotFoundController : UIControllerBase
{
    [UICommand]
    public static UICommandResult GoHome()
        => GoHomeResult();

    /// <summary>The navigation to the application's root, the default pages' one way on.</summary>
    internal static UICommandResult GoHomeResult()
        => UICommandResult.Ok([new NavigateEffect(new UINavigationRequest { Route = "/" })]);
}
