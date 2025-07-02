using NE.Standard.Design.Styles;
using System.Windows;
using UIElement = NE.Standard.Design.Elements.Base.UIElement;

namespace NE.Standard.WPF;

public static class WpfRendererRegistry
{
    private static readonly Dictionary<Type, Func<UIElement, UIStyleConfig, FrameworkElement>> _renderers = [];

    public static void RegisterRenderer<T>(Func<T, UIStyleConfig, FrameworkElement> renderer)
        where T : UIElement
    {
        _renderers[typeof(T)] = (element, style) => renderer((T)element, style);
    }

    public static FrameworkElement Render(UIElement element, UIStyleConfig style)
    {
        return _renderers[element.GetType()].Invoke(element, style);
    }
}
