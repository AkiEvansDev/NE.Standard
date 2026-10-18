using NE.Standard.UI.Filters;
using NE.Standard.UI.Shell.Navigation;

namespace NE.Standard.UI.Navigation;

/// <summary>
/// Runs a view filter attribute that builds its real filter from the service provider.
/// </summary>
internal sealed class UIViewFilterFactoryAdapter(IUIViewFilterFactory factory) : UIFilterFactoryAdapter<UIViewFilterContext>(factory.Order, factory.GetType(), factory.CreateFilter), IUIViewFilter;

/// <summary>
/// Runs a globally-registered view filter type resolved from the service provider per request.
/// </summary>
internal sealed class UIViewFilterServiceAdapter<TFilter>(int order) : UIFilterServiceAdapter<UIViewFilterContext, TFilter>(order), IUIViewFilter
    where TFilter : class, IUIViewFilter;
