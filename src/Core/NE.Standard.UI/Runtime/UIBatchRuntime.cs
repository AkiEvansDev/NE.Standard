using NE.Standard.UI.Application;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Shell.Controllers;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal sealed class UIBatchRuntime(UIHandle handle, CompiledView view, IUIController controller, UIApplication application) : UIRuntimeBase(handle, view, controller, application)
{
    protected override ServerChangeSet DrainPendingUpdatesForRuntimeModeNoLock(bool force)
        => force ? DrainPendingUpdatesNoLock() : ServerChangeSet.Empty;
}
