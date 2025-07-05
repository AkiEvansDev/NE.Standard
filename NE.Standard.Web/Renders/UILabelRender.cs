using Microsoft.AspNetCore.Components;
using NE.Standard.Design;
using NE.Standard.Design.Elements;
using NE.Standard.Design.Elements.Base;
using NE.Standard.Extensions;

namespace NE.Standard.Web.Renders;

internal class UILabelRender
{
    public static RenderFragment Render(UILabel label, UIPageResult page) => builder =>
    {
        builder.OpenElement(0, "div");
        if (!label.Id.IsNull())
            builder.AddAttribute(1, "id", label.Id);
        builder.AddAttribute(2, "class", "UILabel");
        builder.AddAttribute(3, "style", CssGenerator.GetDefaultStyle(label));

        builder.OpenElement(4, "h3");
        builder.AddContent(5, label.Description);
        builder.CloseElement();

        builder.OpenElement(6, "p");
        builder.AddContent(8, label.Description);
        builder.CloseElement();

        builder.CloseElement();
    };
}
