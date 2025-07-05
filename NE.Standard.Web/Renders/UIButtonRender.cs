using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using NE.Standard.Design;
using NE.Standard.Design.Elements;
using NE.Standard.Extensions;

namespace NE.Standard.Web.Renders;

internal class UIButtonRender
{
    public static RenderFragment Render(UIButton button, UIPageResult page) => builder =>
    {
        builder.OpenElement(0, "button");

        if (!button.Id.IsNull())
            builder.AddAttribute(1, "id", button.Id);

        builder.AddAttribute(2, "class", "UIButton");
        builder.AddAttribute(3, "style", CssGenerator.GetDefaultStyle(button));
        builder.AddContent(5, button.Label ?? "Button");
        builder.CloseElement();
    };
}
