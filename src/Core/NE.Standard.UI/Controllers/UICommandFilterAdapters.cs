using NE.Standard.UI.Filters;
using NE.Standard.UI.Shell.Commands;

namespace NE.Standard.UI.Controllers;

/// <summary>
/// Runs a command filter attribute that builds its real filter from the service provider.
/// </summary>
internal sealed class UICommandFilterFactoryAdapter(IUICommandFilterFactory factory) : UIFilterFactoryAdapter<UICommandFilterContext>(factory.Order, factory.GetType(), factory.CreateFilter), IUICommandFilter;

/// <summary>
/// Runs a globally-registered command filter type resolved from the service provider per invocation.
/// </summary>
internal sealed class UICommandFilterServiceAdapter<TFilter>(int order) : UIFilterServiceAdapter<UICommandFilterContext, TFilter>(order), IUICommandFilter
    where TFilter : class, IUICommandFilter;
