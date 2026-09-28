using System.Linq;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.Text;

namespace NE.Standard.UI.Generators.Infrastructure;

/// <summary>
/// A source location as plain data: a <see cref="Location"/> holds its syntax tree, which is new in every compilation and would
/// make every model carrying one unequal.
/// </summary>
internal sealed record LocationInfo(string FilePath, TextSpan Span, LinePositionSpan LineSpan)
{
    /// <summary>The symbol's first declaration in source, or <see langword="null"/> when it has none (metadata reports at no location).</summary>
    public static LocationInfo? From(ISymbol symbol)
        => From(symbol.Locations.FirstOrDefault());

    public static LocationInfo? From(Location? location)
        => location is { IsInSource: true, SourceTree: not null }
            ? new LocationInfo(location.SourceTree.FilePath, location.SourceSpan, location.GetLineSpan().Span)
            : null;

    public Location ToLocation()
        => Location.Create(FilePath, Span, LineSpan);
}
