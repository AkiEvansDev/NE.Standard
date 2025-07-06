using Microsoft.AspNetCore.Components;
using NE.Standard.Design;
using NE.Standard.Design.Elements;
using NE.Standard.Design.Elements.Base;
using NE.Standard.Design.Models;
using NE.Standard.Web.Renders.Binding;

namespace NE.Standard.Web.Renders;

internal class UIButtonRenderer : UIElementRendererBase<UIButton>
{
    public override string RootElement { get; } = "button";

    public override RenderFragment RenderContent(UIButton el, IModel model, IDataBuilder data, ComponentBase context) => builder =>
    {
        builder.AddContent(0, el.Label);
    };

    public override void SetBinding(UIButton el, IModel model, IDataBuilder data, UIBinding binding)
    {
        switch (binding.TargetProperty)
        {
            case nameof(UIButton.Label):
                data.Bindings.Add(new BindingModel
                {
                    Id = el.Id,
                    Property = binding.SourceProperty,
                    Action = BindingAction.SetText,
                    Value = model.GetValue(binding.SourceProperty)
                });
                break;
        }
    }
}
