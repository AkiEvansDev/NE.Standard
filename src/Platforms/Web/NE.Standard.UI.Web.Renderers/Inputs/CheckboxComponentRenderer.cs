using System;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Contents;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Inputs;

public sealed class CheckboxComponentRenderer : TextContentRendererBase
{
    public override string ComponentTypeKey => CheckboxComponent.ComponentTypeKey;

    protected override string ElementName => "label";

    protected override string ClassName => "ui-checkbox";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
        => RenderCheckable(context, root, ClassName);

    /// <summary>
    /// Shared by <see cref="CheckboxComponentRenderer"/> and <c>SwitchComponentRenderer</c> — a switch is
    /// the same &lt;label&gt; + hidden-checkbox-input + visual "box" + icon/title/badge/required/message
    /// shell as a checkbox, just styled differently under its own class prefix (see ui-checkbox.less vs
    /// ui-switch.less). <see cref="SwitchComponent"/> declares no properties of its own — it inherits
    /// everything from <see cref="CheckboxComponent{T}"/>, so the property references below (name-keyed,
    /// not type-keyed) resolve correctly for either component.
    /// <para>
    /// <c>BadgePlacement</c> is deliberately not rendered here. Both its values mean "after the text" on a
    /// control sized by its own content — <c>Trailing</c>'s <c>margin-left: auto</c> needs free space in the
    /// row, and an inline-flex toggle has none. Honouring it would mean stretching the row of an otherwise
    /// inline control, which moves the hit area of every badge-carrying checkbox; see <c>docs/PROJECT.md</c> §7.
    /// </para>
    /// </summary>
    public static void RenderCheckable(WebRenderContext context, IHtmlElementBuilder root, string classPrefix)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);
        ArgumentException.ThrowIfNullOrWhiteSpace(classPrefix);

        _ = RenderProperty<string?>(context, root, ITextBaseComponent.TooltipProperty, static (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
                _ = target.Attribute("title", value);
        }, [WebDomOperation.Attribute("title")]);

        _ = root.Element("span", row =>
        {
            _ = row.Class($"{classPrefix}__row");

            _ = row.Element("input", input =>
            {
                _ = input.Class($"{classPrefix}__input");
                _ = input.Attribute("type", "checkbox");

                _ = RenderProperty<bool?>(context, input, IInputComponent.IsReadOnlyProperty, static (target, value) =>
                {
                    if (value == true)
                        _ = target.Attribute("disabled");
                }, [WebDomOperation.ToggleAttribute("disabled", condition: WebValueCondition.IsTrue)]);

                _ = RenderProperty<string?>(context, input, IInputComponent.FormIdProperty, static (target, value) =>
                {
                    if (!string.IsNullOrWhiteSpace(value))
                        _ = target.Attribute("data-ui-form-id", value);
                }, [WebDomOperation.Attribute("data-ui-form-id")]);

                _ = RenderProperty<bool?>(context, input, IInputComponent.ValueProperty, static (target, value) =>
                {
                    if (value == true)
                        _ = target.Attribute("checked");
                }, [WebDomOperation.Property("checked")]);
            });

            _ = row.Element("span", box =>
            {
                _ = box.Class($"{classPrefix}__box");

                BorderStyleRenderer.RenderBorderStyle(context, box);
            });

            RenderTitleColor(context, row);

            _ = row.Element("span", icon => RenderIcon(context, root, icon, classPrefix));
            _ = row.Element("span", title => RenderTitle(context, root, title, classPrefix));

            _ = row.Element("span", badge =>
            {
                _ = badge.Class($"{classPrefix}__badge");
                _ = badge.Class("ui-badge");

                BadgeComponentRenderer.RenderBadge(context, root, badge,
                    new WebBadgeRenderOptions
                    {
                        StyleProperty = CheckboxComponent.BadgeStyleProperty,
                        IconProperty = CheckboxComponent.BadgeIconProperty,
                        IconColorProperty = CheckboxComponent.BadgeIconColorProperty,
                        IconSizeProperty = CheckboxComponent.BadgeIconSizeProperty,
                        TextProperty = CheckboxComponent.BadgeTextProperty,
                        TextTypeProperty = CheckboxComponent.BadgeTextTypeProperty,
                        TooltipProperty = CheckboxComponent.BadgeTooltipProperty,
                        ContentStateTarget = $".{classPrefix}__badge"
                    });
            });

            if (HasRequiredValidation(context))
            {
                _ = row.Element("span", required =>
                {
                    _ = required.Class($"{classPrefix}__required");
                    _ = required.Text("*");
                });
            }
        });

        _ = root.Element("span", message =>
        {
            _ = message.Class($"{classPrefix}__message");
            _ = message.Attribute("data-ui-validation-message");
        });
    }
}
