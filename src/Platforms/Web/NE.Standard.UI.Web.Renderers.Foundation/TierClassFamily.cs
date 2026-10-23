using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>A family of classes one property draws: the attribute its tiers go on and the client's converters for a patch.</summary>
public sealed class TierClassFamily<T>
    where T : struct
{
    public TierClassFamily(string attribute, string classConverter, string tiersConverter, Func<T, string> className)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(attribute);
        ArgumentNullException.ThrowIfNull(className);

        Attribute = attribute;
        ClassName = className;
        Operations = [WebDomOperation.Class(converter: classConverter), WebDomOperation.Attribute(attribute, converter: tiersConverter)];
        Write = (target, value) => TierClassRenderer.Write(target, value, this);
    }

    /// <summary>A family drawn at render alone, for a property that never binds: no patch operations.</summary>
    public TierClassFamily(string attribute, Func<T, string> className)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(attribute);
        ArgumentNullException.ThrowIfNull(className);

        Attribute = attribute;
        ClassName = className;
        Operations = [];
        Write = (target, value) => TierClassRenderer.Write(target, value, this);
    }

    /// <summary>Gets the attribute the family's tiers go on.</summary>
    public string Attribute { get; }

    /// <summary>Gets the class a value draws.</summary>
    public Func<T, string> ClassName { get; }

    /// <summary>Gets the patch operations: the width's class, then the tiers.</summary>
    public WebDomOperation[] Operations { get; }

    /// <summary>Gets the static write, built once per family.</summary>
    public Action<IHtmlElementBuilder, UIResponsive<T>?> Write { get; }
}
