using NE.Standard.UI.Hosting;
using NE.Standard.UI.Shell.Runtime;

namespace NE.Standard.UI.Runtime;

internal interface IUIRuntimeConnectionUpdater
{
    void UpdateConnection(UIHandle handle, UIClientServices clientServices);

    void DetachConnection(string instanceId);
}
