using System;
using Microsoft.Extensions.Logging;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Compilation;
using NE.Standard.UI.Compiled.Views;

namespace NE.Standard.UI.Views;

internal sealed partial class UIViewFactory
{
    private readonly IServiceProvider _services;
    private readonly Type _viewType;
    private readonly Func<IServiceProvider, IUIView> _factory;
    private readonly Type? _controllerType;

    public UIViewFactory(IServiceProvider services, Type viewType, Func<IServiceProvider, IUIView> factory, Type? controllerType = null)
    {
        ArgumentNullException.ThrowIfNull(services);
        ArgumentNullException.ThrowIfNull(viewType);
        ArgumentNullException.ThrowIfNull(factory);

        if (!typeof(IUIView).IsAssignableFrom(viewType))
            throw new ArgumentException($"View type '{viewType.Name}' must implement '{nameof(IUIView)}'.", nameof(viewType));

        _services = services;
        _viewType = viewType;
        _factory = factory;
        _controllerType = controllerType;
    }

    public CompiledView Compile()
    {
        CompiledView view = UIViewCompiler.Compile(CreateView(), _controllerType);

        if (view.Warnings.Count > 0 && _services.GetService(typeof(ILoggerFactory)) is ILoggerFactory loggerFactory)
        {
            ILogger logger = loggerFactory.CreateLogger(_viewType.FullName ?? _viewType.Name);

            foreach (var warning in view.Warnings)
                Log.CompilationWarning(logger, warning);
        }

        return view;
    }

    private static partial class Log
    {
        [LoggerMessage(EventId = 1, Level = LogLevel.Warning, Message = "{Warning}")]
        public static partial void CompilationWarning(ILogger logger, string warning);
    }

    private IUIView CreateView()
    {
        IUIView view = _factory(_services);

        ArgumentNullException.ThrowIfNull(view);

        if (!_viewType.IsInstanceOfType(view))
            throw new InvalidOperationException($"View factory for '{_viewType.Name}' returned '{view.GetType().Name}'.");

        return view;
    }
}
