using System;
using System.Buffers;
using System.IO;
using System.Net;
using System.Text;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Hosting;

namespace NE.Standard.UI.Web.Html;

/// <summary>Markup written as it is: the caller vouches for it.</summary>
internal sealed class RawHtmlContent(string value) : IHtmlContent
{
    public void WriteTo(TextWriter writer)
    {
        ArgumentNullException.ThrowIfNull(writer);
        writer.Write(value);
    }
}

/// <summary>Markup already encoded as UTF-8, written as it is: into a page's pipe without turning it back into text.</summary>
internal sealed class Utf8HtmlContent(ReadOnlyMemory<byte> utf8) : IHtmlContent
{
    private const int ChunkChars = 4096;

    public void WriteTo(TextWriter writer)
    {
        ArgumentNullException.ThrowIfNull(writer);

        if (writer is WebPipeTextWriter pipe)
        {
            pipe.WriteUtf8(utf8.Span);
            return;
        }

        // Any other writer takes text, decoded a chunk at a time so no string of the whole page is made.
        Decoder decoder = Encoding.UTF8.GetDecoder();
        var chars = ArrayPool<char>.Shared.Rent(ChunkChars);

        try
        {
            ReadOnlySpan<byte> pending = utf8.Span;
            bool completed;

            do
            {
                decoder.Convert(pending, chars, flush: true, out var bytesUsed, out var charsUsed, out completed);
                writer.Write(chars, 0, charsUsed);
                pending = pending[bytesUsed..];
            }
            while (!completed);
        }
        finally
        {
            ArrayPool<char>.Shared.Return(chars);
        }
    }
}

/// <summary>Text written encoded — the one place rendered text is made safe for the page, shared by both builders.</summary>
internal sealed class TextHtmlContent(string value) : IHtmlContent
{
    public void WriteTo(TextWriter writer)
    {
        ArgumentNullException.ThrowIfNull(writer);
        WebUtility.HtmlEncode(value, writer);
    }
}
