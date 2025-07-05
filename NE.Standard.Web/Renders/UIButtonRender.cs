using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using NE.Standard.Design;
using NE.Standard.Design.Elements;
using NE.Standard.Extensions;

namespace NE.Standard.Web.Renders;

internal class UIButtonRender
{
    public static RenderFragment Render(UIButton button, UIPageResult page, BindingContext context, AppHost host) => builder =>
    {
        builder.OpenElement(0, "button");

        if (!button.Id.IsNull())
            builder.AddAttribute(1, "id", button.Id);

        builder.AddAttribute(2, "class", "UIButton");
        builder.AddAttribute(3, "style", CssGenerator.GetDefaultStyle(button));

        if (!button.Action.IsNull())
            builder.AddAttribute(4, "onclick", EventCallback.Factory.Create<MouseEventArgs>(
                    (ComponentBase)host, async _ =>
                    {
                        await host.HandleAction(button.Action!, button.RelatedParameters);
                    }));

        builder.AddContent(5, button.Label ?? "Button");
        builder.CloseElement();
    };
}
