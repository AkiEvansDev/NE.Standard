using System;
using System.Diagnostics;
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

    // Told of the view once it is compiled, at startup or on first use: where the unkeyed-words report reads it.
    private readonly Action<CompiledView, Type>? _compiled;

    public UIViewFactory(IServiceProvider services, Type viewType, Func<IServiceProvider, IUIView> factory, Type? controllerType = null, Action<CompiledView, Type>? compiled = null)
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
        _compiled = compiled;
    }

    public CompiledView Compile()
    {
        var started = Stopwatch.GetTimestamp();
        CompiledView view = UIViewCompiler.Compile(CreateView(), _controllerType);
        TimeSpan elapsed = Stopwatch.GetElapsedTime(started);

        if (_services.GetService(typeof(ILoggerFactory)) is ILoggerFactory loggerFactory)
        {
            ILogger logger = loggerFactory.CreateLogger(_viewType.FullName ?? _viewType.Name);

            Log.Compiled(logger, _viewType.Name, elapsed.TotalMilliseconds, view.Graph.All.Count, view.Bindings.All.Count);

            foreach (var warning in view.Warnings)
                Log.CompilationWarning(logger, warning);
        }

        _compiled?.Invoke(view, _viewType);

        return view;
    }

    private static partial class Log
    {
        [LoggerMessage(EventId = 1, Level = LogLevel.Warning, Message = "{Warning}")]
        public static partial void CompilationWarning(ILogger logger, string warning);

        [LoggerMessage(EventId = 2, Level = LogLevel.Debug, Message = "Compiled view '{View}' in {ElapsedMs:F1} ms: {ComponentCount} component(s), {BindingCount} binding(s).")]
        public static partial void Compiled(ILogger logger, string view, double elapsedMs, int componentCount, int bindingCount);
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
