using Microsoft.AspNetCore.Components;
using NE.Standard.Design.Elements;
using NE.Standard.Design.Elements.Base;
using NE.Standard.Design.Models;
using NE.Standard.Web.Renders.Binding;

namespace NE.Standard.Web.Renders;

internal class UILabelRenderer : UIElementRendererBase<UILabel>
{
    public override string RootElement { get; } = "div";

    public override RenderFragment RenderContent(UILabel el, IModel model, IDataBuilder data, ComponentBase context) => builder =>
    {
        builder.OpenElement(0, "h3");
        builder.AddAttribute(1, "class", nameof(UILabel.Label));
        builder.AddContent(2, el.Label);
        builder.CloseElement();

        builder.OpenElement(3, "p");
        builder.AddAttribute(1, "class", nameof(UILabel.Description));
        builder.AddContent(5, el.Description);
        builder.CloseElement();
    };

    public override void SetBinding(UILabel el, IModel model, IDataBuilder data, UIBinding binding)
    {
        switch (binding.TargetProperty)
        {
            case nameof(UILabel.Label):
                data.Bindings.Add(new BindingModel
                {
                    Id = el.Id,
                    Property = binding.SourceProperty,
                    Action = BindingAction.SetText,
                    Filter = nameof(UILabel.Label),
                    Value = model.GetValue(binding.SourceProperty)
                });
                break;
            case nameof(UILabel.Description):
                data.Bindings.Add(new BindingModel
                {
                    Id = el.Id,
                    Property = binding.SourceProperty,
                    Action = BindingAction.SetText,
                    Filter = nameof(UILabel.Description),
                    Value = model.GetValue(binding.SourceProperty)
                });
                break;
        }
    }
}
