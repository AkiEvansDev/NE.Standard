using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Identity;

namespace NE.Standard.UI.Compiled.Models;

/// <summary>
/// Represents a compiled recursive path template for a binding source.
/// </summary>
public sealed class CompiledUIBindingTemplate
{
    /// <summary>
    /// Gets the compiled binding template id.
    /// </summary>
    public required UIBindingTemplateId Id { get; init; }

    /// <summary>
    /// Gets the binding source id this template belongs to.
    /// </summary>
    public required UIBindingSourceId SourceId { get; init; }

    /// <summary>
    /// Gets the recursive path template string.
    /// </summary>
    public required string Template { get; init; }

    /// <summary>
    /// Gets the number of parameters required to materialize the template.
    /// </summary>
    public int ParameterCount { get; init; }

    /// <summary>
    /// The template's property names in order, split once: the item walk reads them for every row it renders.
    /// </summary>
    internal string[] PropertyNames => field ??= SplitPropertyNames(Template);

    /// <summary>The names the item walk reads, split by the same grammar; it stops where the walk would fail.</summary>
    private static string[] SplitPropertyNames(string template)
    {
        List<string> names = [];
        var i = 0;

        while (i < template.Length)
        {
            if (template[i] == '.')
            {
                i++;
                continue;
            }

            if (template[i] == '[')
            {
                if (i + 1 >= template.Length || template[i + 1] != ']')
                    break;

                i += 2;
                continue;
            }

            var start = i;

            while (i < template.Length && template[i] != '.' && template[i] != '[')
                i++;

            names.Add(template[start..i]);
        }

        return [.. names];
    }
}
