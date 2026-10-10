using NE.Standard.UI.Application;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Hosting;
using NE.Standard.UI.Shell.Controllers;
using NE.Standard.UI.Shell.Runtime;

namespace NE.Standard.UI.Runtime;

/// <summary>A runtime whose queued changes wait for the scheduled flush, which sends them to every attached instance.</summary>
internal sealed class UIBatchRuntime(UIHandle handle, CompiledView view, IUIController controller, UIClientServices clientServices, UIApplication application, UIHost host) : UIRuntimeBase(handle, view, controller, clientServices, application, host);
