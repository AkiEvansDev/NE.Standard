using System;
using System.Buffers;
using System.IO;
using System.IO.Pipelines;
using System.Text;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// Writes text into a response's pipe as UTF-8, so a page streams into pooled segments instead of being built as a string and
/// copied: a large page's strings land on the large object heap, several of them a request.
/// </summary>
/// <remarks>
/// Synchronous by design: an HTML tree writes through a plain <see cref="TextWriter"/>, and a pipe takes bytes without flushing;
/// the caller completes the writer and flushes the pipe once, asynchronously, at the end.
/// </remarks>
internal sealed class WebPipeTextWriter : TextWriter
{
    private const int CharBufferSize = 2048;

    // Enough bytes for any run of the char buffer: three per UTF-16 unit is UTF-8's worst case.
    private const int MinimumSegmentBytes = CharBufferSize * 3;

    private static readonly UTF8Encoding Utf8 = new(encoderShouldEmitUTF8Identifier: false);

    private readonly PipeWriter _pipe;
    private readonly Encoder _encoder = Utf8.GetEncoder();
    private char[]? _chars = ArrayPool<char>.Shared.Rent(CharBufferSize);
    private int _count;

    public WebPipeTextWriter(PipeWriter pipe)
    {
        ArgumentNullException.ThrowIfNull(pipe);

        _pipe = pipe;
    }

    public override Encoding Encoding => Utf8;

    /// <summary>Gets how many characters have been written, the length a string of the same text would have.</summary>
    public long Length { get; private set; }

    public override void Write(char value)
    {
        var chars = Buffer();

        if (_count == chars.Length)
            Encode(flush: false);

        chars[_count++] = value;
        Length++;
    }

    public override void Write(string? value)
        => Write(value.AsSpan());

    public override void Write(char[] buffer, int index, int count)
        => Write(buffer.AsSpan(index, count));

    public override void Write(ReadOnlySpan<char> buffer)
    {
        var chars = Buffer();

        Length += buffer.Length;

        while (!buffer.IsEmpty)
        {
            if (_count == chars.Length)
                Encode(flush: false);

            var taken = Math.Min(buffer.Length, chars.Length - _count);

            buffer[..taken].CopyTo(chars.AsSpan(_count));
            _count += taken;
            buffer = buffer[taken..];
        }
    }

    /// <summary>Writes text already encoded as UTF-8 straight into the pipe, after what is buffered.</summary>
    public void WriteUtf8(ReadOnlySpan<byte> utf8)
    {
        Encode(flush: true);

        Length += Utf8.GetCharCount(utf8);
        _pipe.Write(utf8);
    }

    /// <summary>Hands everything written so far to the pipe, a trailing half of a surrogate pair included; the pipe still needs its flush.</summary>
    public void Complete()
        => Encode(flush: true);

    private char[] Buffer()
        => _chars ?? throw new ObjectDisposedException(nameof(WebPipeTextWriter));

    private void Encode(bool flush)
    {
        ReadOnlySpan<char> pending = Buffer().AsSpan(0, _count);
        bool completed;

        // Unflushed, a trailing high surrogate stays in the encoder for the next run, so only the flush waits on `completed`.
        do
        {
            Span<byte> bytes = _pipe.GetSpan(MinimumSegmentBytes);

            _encoder.Convert(pending, bytes, flush, out var charsUsed, out var bytesUsed, out completed);
            _pipe.Advance(bytesUsed);
            pending = pending[charsUsed..];
        }
        while (!pending.IsEmpty || (flush && !completed));

        _count = 0;
    }

    protected override void Dispose(bool disposing)
    {
        if (disposing && _chars is { } chars)
        {
            _chars = null;
            ArrayPool<char>.Shared.Return(chars);
        }

        base.Dispose(disposing);
    }
}
