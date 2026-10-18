namespace NE.Standard.UI.Shell.Localization;

/// <summary>One piece of a pattern: the longest token at <see cref="Index"/>, or none where a character no token starts at stands.</summary>
public readonly record struct UITemporalPatternPiece(int Index, string? Token);

/// <summary>
/// A pattern's pieces in order, each token greedily and each other character alone (<see cref="UITemporalPattern.Walk"/>), with no
/// allocation: a grid's cells format through it.
/// </summary>
public ref struct UITemporalPatternWalk
{
    private readonly string _pattern;
    private int _next;

    internal UITemporalPatternWalk(string pattern)
    {
        _pattern = pattern;
        _next = 0;
        Current = default;
    }

    /// <summary>Gets the piece the walk stands on.</summary>
    public UITemporalPatternPiece Current { get; private set; }

    /// <summary>Returns the walk itself, so it can stand in a <see langword="foreach"/>.</summary>
    public readonly UITemporalPatternWalk GetEnumerator()
        => this;

    /// <summary>Steps onto the next piece; false past the pattern's end.</summary>
    public bool MoveNext()
    {
        if (_next >= _pattern.Length)
            return false;

        var token = UITemporalPattern.Match(_pattern, _next);

        Current = new UITemporalPatternPiece(_next, token);
        _next += token?.Length ?? 1;

        return true;
    }
}
