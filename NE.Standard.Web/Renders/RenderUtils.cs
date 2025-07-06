using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;
using NE.Standard.Design.Elements.Base;
using NE.Standard.Design.Models;
using NE.Standard.Extensions;
using NE.Standard.Web.Renders.Binding;

namespace NE.Standard.Web.Renders;

public interface IUIElementRenderer<T>
    where T : IUIElement
{
    string RootElement { get; }
    RenderFragment Render(T el, IModel model, IDataBuilder data, ComponentBase context);
    void RenderAttribute(RenderTreeBuilder builder, T el, IModel model, ComponentBase context);
    string GetClass(T el);
    string GetStyle(T el);
    void SetBinding(T el, IModel model, IDataBuilder data, UIBinding binding);
    void SetInteraction(T el, IDataBuilder data, UIInteraction interaction);
    void SetValidation(T el, IDataBuilder data, UIValidationRule validation);
}

public abstract class UIElementRendererBase<T> : IUIElementRenderer<T>
    where T : IUIElement
{
    public abstract string RootElement { get; }

    public abstract RenderFragment RenderContent(T el, IModel model, IDataBuilder data, ComponentBase context);
    public virtual void RenderAttribute(RenderTreeBuilder builder, T el, IModel model, ComponentBase context) { }

    public virtual string GetClass(T el) => "";
    public virtual string GetStyle(T el) => "";

    public virtual void SetBinding(T el, IModel model, IDataBuilder data, UIBinding binding) { }
    public virtual void SetInteraction(T el, IDataBuilder data, UIInteraction interaction) { }
    public virtual void SetValidation(T el, IDataBuilder data, UIValidationRule validation) { }

    public RenderFragment Render(T el, IModel model, IDataBuilder data, ComponentBase context) => builder =>
    {
        RenderUtils.Render(this, builder, el, model, data, context, RenderContent(el, model, data, context));
    };
}

public static class RenderUtils
{
    public static void Render<T>(IUIElementRenderer<T> renderer, RenderTreeBuilder builder, T el, IModel model, IDataBuilder bind, ComponentBase context, RenderFragment? childContent)
        where T : IUIElement
    {
        SetDefaultBinding(renderer, el, model, bind);

        builder.OpenElement(0, renderer.RootElement);

        if (!el.Id.IsNull())
            builder.AddAttribute(1, "id", el.Id);

        builder.AddAttribute(2, "class", GetDefaultClass(renderer, el));
        builder.AddAttribute(3, "style", GetDefaultStyle(renderer, el));

        renderer.RenderAttribute(builder, el, model, context);

        if (childContent != null)
            builder.AddContent(4, childContent);

        builder.CloseElement();
    }

    private static void SetDefaultBinding<T>(IUIElementRenderer<T> renderer, T el, IModel model, IDataBuilder data)
        where T : IUIElement
    {
        if (el.Bindings == null)
            return;

        foreach (var binding in el.Bindings)
        {
            if (binding.BindingType == BindingType.TwoWay)
            {
                switch (binding.TargetProperty)
                {
                    case nameof(IUIElement.Visible):
                        data.Bindings.Add(new BindingModel
                        {
                            Id = el.Id,
                            Property = binding.SourceProperty,
                            Action = BindingAction.ClassSwitch,
                            Map = new Dictionary<object, string> { { false, "hide" }, { true, "" } },
                            Value = model.GetValue(binding.SourceProperty)
                        });
                        break;
                    case nameof(IUIElement.Enabled):
                        data.Bindings.Add(new BindingModel
                        {
                            Id = el.Id,
                            Property = binding.SourceProperty,
                            Action = BindingAction.ClassSwitch,
                            Map = new Dictionary<object, string> { { false, "disabled" }, { true, "" } },
                            Value = model.GetValue(binding.SourceProperty)
                        });
                        break;
                    case nameof(IUIElement.HorizontalAlignment):
                        data.Bindings.Add(new BindingModel
                        {
                            Id = el.Id,
                            Property = binding.SourceProperty,
                            Action = BindingAction.ClassSwitch,
                            Map = new Dictionary<object, string>
                            {
                                { Alignment.Start, "justify-start" },
                                { Alignment.Center, "justify-center" },
                                { Alignment.End, "justify-end" },
                                { Alignment.Stretch, "justify-stretch" }
                            },
                            Value = model.GetValue(binding.SourceProperty)
                        });
                        break;
                    case nameof(IUIElement.VerticalAlignment):
                        data.Bindings.Add(new BindingModel
                        {
                            Id = el.Id,
                            Property = binding.SourceProperty,
                            Action = BindingAction.ClassSwitch,
                            Map = new Dictionary<object, string>
                            {
                                { Alignment.Start, "align-start" },
                                { Alignment.Center, "align-center" },
                                { Alignment.End, "align-end" },
                                { Alignment.Stretch, "align-stretch" }
                            },
                            Value = model.GetValue(binding.SourceProperty)
                        });
                        break;
                    default:
                        renderer.SetBinding(el, model, data, binding);
                        break;
                }
            }
        }
    }

    private static string GetDefaultClass<T>(IUIElementRenderer<T> renderer, T el)
        where T : IUIElement
    {
        List<string> classes = [el.GetType().Name, renderer.GetClass(el)];

        if (!el.Visible) classes.Add("hide");
        if (!el.Enabled) classes.Add("disabled");

        classes.Add(el.HorizontalAlignment switch
        {
            Alignment.Start => "justify-start",
            Alignment.Center => "justify-center",
            Alignment.End => "justify-end",
            Alignment.Stretch => "justify-stretch",
            _ => ""
        });

        classes.Add(el.VerticalAlignment switch
        {
            Alignment.Start => "align-start",
            Alignment.Center => "align-center",
            Alignment.End => "align-end",
            Alignment.Stretch => "align-stretch",
            _ => ""
        });

        return string.Join(" ", classes.Where(c => !c.IsNull()));
    }

    private static string GetDefaultStyle<T>(IUIElementRenderer<T> renderer, T el)
        where T : IUIElement
    {
        List<string> styles = [renderer.GetStyle(el)];

        if (el.LayoutPlacement is { } placement)
        {
            var colStart = placement.Column + 1;
            var colEnd = colStart + placement.ColumnSpan;
            var rowStart = placement.Row + 1;
            var rowEnd = rowStart + placement.RowSpan;

            styles.Add($"grid-column:{colStart}/{colEnd}");
            styles.Add($"grid-row:{rowStart}/{rowEnd}");
        }

        return string.Join(";", styles.Where(s => !s.IsNull()));
    }
}
