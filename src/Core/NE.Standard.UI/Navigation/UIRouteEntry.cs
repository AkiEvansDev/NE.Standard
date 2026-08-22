using System;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Shell.Navigation;

namespace NE.Standard.UI.Navigation;

internal sealed class UIRouteEntry
{
    public required UIRouteDefinition Definition { get; init; }
    public required Func<CompiledView> GetView { get; init; }
}
