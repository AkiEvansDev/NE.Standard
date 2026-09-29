using System;
using System.Buffers.Binary;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Security.Cryptography;
using System.Text.Json;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using NE.Standard.UI.Application;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Shell.Hosting;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Assets;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// Serves a language's words at <c>/_ne/words/{language}.json</c> for a language the translator lists, and holds each one built —
/// the page's boot words among it.
/// </summary>
/// <remarks>The words reach any page that asks: a translation source holds nothing secret.</remarks>
internal static class WebWordsEndpoint
{
    /// <summary>The path the words are served under.</summary>
    public const string Prefix = "/_ne/words/";

    // How many languages' words are held per translator; past it a table is built for its request.
    private const int MaxHeldLanguages = 64;

    private static readonly ConditionalWeakTable<ITranslator, ConcurrentDictionary<string, WebWordsAsset>> Held = [];

    public static void Map(IEndpointRouteBuilder endpoints)
    {
        ArgumentNullException.ThrowIfNull(endpoints);

        _ = endpoints.MapGet(Prefix + "{language}.json", Serve);
    }

    /// <summary>The language whose table a page of <paramref name="language"/> translates by: its own when listed, else the default.</summary>
    public static string TableLanguage(ITranslator translator, string? language)
    {
        ArgumentNullException.ThrowIfNull(translator);

        return language is not null && translator.HasLanguage(language) ? language : translator.DefaultLanguage;
    }

    /// <summary>The words of a listed language, built on first use and held with the translator.</summary>
    public static WebWordsAsset Resolve(ITranslator translator, string language, IEnumerable<IUIStringsSource> packages, bool reportMissing)
    {
        ArgumentNullException.ThrowIfNull(translator);
        ArgumentException.ThrowIfNullOrWhiteSpace(language);
        ArgumentNullException.ThrowIfNull(packages);

        ConcurrentDictionary<string, WebWordsAsset> held = Held.GetValue(translator, static _ => new ConcurrentDictionary<string, WebWordsAsset>(StringComparer.Ordinal));

        if (held.TryGetValue(language, out WebWordsAsset? asset))
            return asset;

        asset = WebWordsAsset.Build(translator, language, packages, reportMissing);

        return held.Count < MaxHeldLanguages ? held.GetOrAdd(language, asset) : asset;
    }

    private static IResult Serve(string language, HttpContext http, [FromServices] UIApplication application, [FromServices] IEnumerable<IUIStringsSource> packages, [FromServices] WebAssetCompression compression)
    {
        if (!application.Translator.HasLanguage(language))
            return Results.NotFound();

        WebWordsAsset asset = Resolve(application.Translator, language, packages, application.MissingWords is not null);
        var etag = string.Create(CultureInfo.InvariantCulture, $"\"{asset.Version}\"");
        var versioned = string.Equals(http.Request.Query["v"].ToString(), asset.Version, StringComparison.Ordinal);

        http.Response.Headers.ETag = etag;
        http.Response.Headers.CacheControl = versioned ? "public, max-age=31536000, immutable" : "public, no-cache";

        if (http.Request.Headers.IfNoneMatch.Count > 0 && http.Request.Headers.IfNoneMatch.ToString().Contains(etag, StringComparison.Ordinal))
            return Results.StatusCode(StatusCodes.Status304NotModified);

        if (compression.Enabled)
        {
            http.Response.Headers.Vary = "Accept-Encoding";

            if (WebEndpointRouteBuilderExtensions.ChooseEncoding(http.Request.Headers.AcceptEncoding, asset.Compressed) is { } encoding)
            {
                http.Response.Headers.ContentEncoding = encoding;

                return Results.Bytes(encoding == "br" ? asset.Compressed.Brotli! : asset.Compressed.Gzip!, WebWordsAsset.ContentType);
            }
        }

        return Results.Bytes(asset.Bytes, WebWordsAsset.ContentType);
    }
}

/// <summary>
/// One language's words as the page fetches them — the JSON, its version, its address, its compressed forms — and the chrome's words
/// a page carries to boot with.
/// </summary>
internal sealed class WebWordsAsset
{
    public const string ContentType = "application/json; charset=utf-8";

    private readonly Lazy<WebAssetCompression.Compressed> _compressed;

    private WebWordsAsset(string language, byte[] bytes, string version, string stringsJson)
    {
        Language = language;
        Bytes = bytes;
        Version = version;
        StringsJson = stringsJson;
        Href = string.Create(CultureInfo.InvariantCulture, $"{WebWordsEndpoint.Prefix}{Uri.EscapeDataString(language)}.json?v={version}");
        _compressed = new Lazy<WebAssetCompression.Compressed>(() => WebAssetCompression.Build(bytes));
    }

    public string Language { get; }

    /// <summary>The words as UTF-8 JSON: <c>{language, complete, prefixes, report?, words}</c>.</summary>
    public byte[] Bytes { get; }

    /// <summary>A hash of <see cref="Bytes"/>, the same on every node and every start, since the words are written in key order.</summary>
    public string Version { get; }

    /// <summary>The versioned address a page fetches, which a browser keeps for good.</summary>
    public string Href { get; }

    /// <summary>The compressed forms, built on the first request that takes one; either is null where it is not smaller.</summary>
    public WebAssetCompression.Compressed Compressed => _compressed.Value;

    /// <summary>The framework's and the packages' words in this language, serialized for the page's <c>data-ui-strings</c> block.</summary>
    public string StringsJson { get; }

    public static WebWordsAsset Build(ITranslator translator, string language, IEnumerable<IUIStringsSource> packages, bool reportMissing)
    {
        UIWordTable table = translator.ListWords(language);
        SortedDictionary<string, string> words = new(StringComparer.Ordinal);

        foreach (KeyValuePair<string, string> word in table.Words)
            words[word.Key] = word.Value;

        Dictionary<string, string> chrome = UIStrings.Resolve(translator, language, packages);

        // The chrome's words as the translator answers them, for a translator that cannot list its own.
        foreach (KeyValuePair<string, string> word in chrome)
            _ = words.TryAdd(word.Key, word.Value);

        byte[] bytes;

        using (MemoryStream buffer = new())
        {
            using (Utf8JsonWriter writer = new(buffer))
                Write(writer, language, table, reportMissing, words);

            bytes = buffer.ToArray();
        }

        return new WebWordsAsset(language, bytes, HashVersion(bytes), WebShellRenderer.SerializeStrings(chrome));
    }

    private static void Write(Utf8JsonWriter writer, string language, UIWordTable table, bool reportMissing, SortedDictionary<string, string> words)
    {
        writer.WriteStartObject();
        writer.WriteString("language", language);
        writer.WriteBoolean("complete", table.Complete);
        writer.WriteStartArray("prefixes");

        foreach (var prefix in table.KeyPrefixes.Order(StringComparer.Ordinal))
            writer.WriteStringValue(prefix);

        writer.WriteEndArray();

        // Where missing words are reported, a page asks the server about a prefixed key its table lacks, complete or not.
        if (reportMissing)
            writer.WriteBoolean("report", true);

        writer.WriteStartObject("words");

        foreach (KeyValuePair<string, string> word in words)
            writer.WriteString(word.Key, word.Value);

        writer.WriteEndObject();
        writer.WriteEndObject();
    }

    private static string HashVersion(byte[] bytes)
    {
        Span<byte> hash = stackalloc byte[SHA256.HashSizeInBytes];
        _ = SHA256.HashData(bytes, hash);

        return BinaryPrimitives.ReadUInt64LittleEndian(hash).ToString(CultureInfo.InvariantCulture);
    }
}

/// <summary>What a page says about its words: the table it translates by, and its title as a key the page can translate again.</summary>
internal sealed class WebPageWords
{
    /// <summary>Gets the language and address of the table.</summary>
    public required WebPageWordsTable Table { get; init; }

    /// <summary>Gets the view's title as it is translated — a plain key, or a phrase when the title takes arguments — or none.</summary>
    public object? Title { get; init; }

    /// <summary>The page's words for the session and view it renders.</summary>
    public static WebPageWords For(UIApplication application, UIViewResolution resolution, IEnumerable<IUIStringsSource> packages)
    {
        ArgumentNullException.ThrowIfNull(application);
        ArgumentNullException.ThrowIfNull(resolution);

        var language = WebWordsEndpoint.TableLanguage(application.Translator, resolution.Session.Language);
        WebWordsAsset asset = WebWordsEndpoint.Resolve(application.Translator, language, packages, application.MissingWords is not null);
        var title = resolution.View.Title;

        return new WebPageWords
        {
            Table = new WebPageWordsTable(asset.Language, asset.Href),
            Title = string.IsNullOrWhiteSpace(title)
                ? null
                : resolution.View.TitleArguments is { Count: > 0 } arguments ? new UIPhrase(title, arguments) : title
        };
    }
}

/// <summary>The table a page translates by: its language, and the versioned address it is fetched from.</summary>
internal sealed record WebPageWordsTable(string Language, string Href);
