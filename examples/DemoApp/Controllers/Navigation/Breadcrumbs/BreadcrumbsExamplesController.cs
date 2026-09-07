using System;
using System.Collections.Generic;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Navigation.Breadcrumbs;

/// <summary>
/// A folder tree walked from a trail: the trail is the path, the list under it is what that folder holds.
/// </summary>
internal sealed partial class FolderBrowserContext : DemoGroupContext
{
    private const string Root = "drive";

    private static readonly Dictionary<string, (string Title, string? Parent)> Folders = new(StringComparer.Ordinal)
    {
        [Root] = ("My Drive", null),
        ["projects"] = ("Projects", Root),
        ["shared"] = ("Shared with me", Root),
        ["archive"] = ("Archive", Root),
        ["payments-api"] = ("payments-api", "projects"),
        ["web-portal"] = ("web-portal", "projects"),
        ["src"] = ("src", "payments-api"),
        ["tests"] = ("tests", "payments-api"),
        ["docs"] = ("docs", "web-portal"),
        ["2024"] = ("2024", "archive"),
    };

    [RecursiveMember(false)]
    public RecursiveCollection<BreadcrumbItem> Path { get; } = [];

    [RecursiveMember(false)]
    public RecursiveCollection<TextItem> Entries { get; } = [];

    public FolderBrowserContext()
    {
        Open(Root);
    }

    /// <summary>
    /// Rebuilds both halves from the folder, so a clicked step and an opened folder are the same move.
    /// </summary>
    public void Open(string id)
    {
        if (!Folders.TryGetValue(id, out (string Title, string? Parent) folder))
            return;

        List<BreadcrumbItem> trail = [];

        for (var current = (string?)id; current is not null; current = Folders[current].Parent)
            trail.Insert(0, new BreadcrumbItem { Id = current, Title = Folders[current].Title, Icon = current == Root ? DemoIcons.Outline(DemoIcons.Cloud) : null });

        Path.Clear();
        Path.AddRange(trail);

        Entries.Clear();

        foreach ((var key, (var title, var parent)) in Folders)
        {
            if (parent == id)
                Entries.Add(new TextItem { Id = key, Title = title, Icon = DemoIcons.Outline(DemoIcons.Folder) });
        }

        LogEvent($"Opened {folder.Title}");
    }
}

internal sealed partial class BreadcrumbsExamplesController() : DemoController
{
    [RecursiveMember]
    public partial FolderBrowserContext Browser { get; set; } = new();

    /// <summary>
    /// One command for both a step and a folder row, each naming the folder it stands for.
    /// </summary>
    [UICommand]
    public void Open(string id)
        => Browser.Open(id);
}
