using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Recursive;
using NE.Standard.UI.Shell.Commands;

namespace DemoApp.Controllers.Navigation.TabsView;

/// <summary>
/// An editor: the project's files, the ones open in the strip, and the four gestures the strip allows.
/// </summary>
internal sealed partial class EditorGroupContext : DemoGroupContext
{
    private static readonly Dictionary<string, (string Title, string Folder, string Icon, string Body)> Project = new(StringComparer.Ordinal)
    {
        ["readme"] = ("README.md", "/", DemoIcons.FileText, "A server-driven UI framework for .NET: views and controllers in C#, rendered live to the browser."),
        ["program"] = ("Program.cs", "examples/DemoApp.Web", DemoIcons.File, "WebStartupBuilder.Configure<DemoAppWebStartup, DemoAppStartup>(builder.Services);\n\nawait app.RunAsync();"),
        ["startup"] = ("DemoAppStartup.cs", "examples/DemoApp", DemoIcons.File, "protected override void ConfigureApplication(UIApplicationBuilder application)\n{\n    _ = application.Route<HomeView>(\"/\");\n}"),
        ["settings"] = ("appsettings.json", "examples/DemoApp.Web", DemoIcons.Settings, /*lang=json,strict*/ "{\n  \"Logging\": { \"LogLevel\": { \"Default\": \"Information\" } }\n}"),
        ["styles"] = ("ui.less", "Client/src", DemoIcons.Palette, "@import \"core/tokens.less\";\n@import \"components/ui-tabs-view.less\";"),
        ["plan"] = ("PLAN.md", "docs", DemoIcons.List, "What is built, and what is left to finish the Web platform.")
    };

    /// <summary>The project tree — every file there is, open or not.</summary>
    [RecursiveMember(false)]
    public RecursiveCollection<TextItem> Files { get; } =
    [
        .. Project.Select(static entry => new TextItem
        {
            Id = entry.Key,
            Title = entry.Value.Title,
            Description = entry.Value.Folder,
            Icon = DemoIcons.Outline(entry.Value.Icon)
        })
    ];

    /// <summary>The files open in the strip; the first is pinned and the controller refuses to close it.</summary>
    [RecursiveMember(false)]
    public RecursiveCollection<DemoDocumentItem> Documents { get; } = [CreateDocument("readme", 1, pinned: true), CreateDocument("program", 2)];

    [RecursiveMember]
    public partial string? SelectedKey { get; set; } = "readme";

    /// <summary>
    /// Opens a file, or switches to it when it is already open.
    /// </summary>
    public void Open(string id)
    {
        if (!Project.TryGetValue(id, out (string Title, string Folder, string Icon, string Body) file))
            return;

        if (Find(id) is null)
        {
            // Past the last tab, so a new document lands at the end wherever a drag left the rest.
            var order = Documents.Count == 0 ? 1 : Documents.Max(static document => document.Order ?? 0) + 1;

            Documents.Add(CreateDocument(id, order));
            LogEvent($"opened {file.Title}");
        }
        else
        {
            LogEvent($"{file.Title} is already open — switched to it");
        }

        SelectedKey = id;
    }

    public const string PinAction = "pin";
    public const string CloseOthersAction = "close-others";
    public const string CloseAction = "close";

    /// <summary>
    /// What the tab's context menu asks for, by the entry's key and the tab's id.
    /// </summary>
    public void Act(string action, string id)
    {
        switch (action)
        {
            case PinAction:
                TogglePin(id);
                break;
            case CloseOthersAction:
                CloseOthers(id);
                break;
            case CloseAction:
                Close(id);
                break;
            default:
                LogEvent($"unknown tab action '{action}'");
                break;
        }
    }

    private void TogglePin(string id)
    {
        if (Find(id) is not DemoDocumentItem document)
            return;

        document.Pinned = !document.Pinned;
        document.CanRemove = !document.Pinned;
        LogEvent(document.Pinned ? $"pinned {document.Title}" : $"unpinned {document.Title}");
    }

    private void CloseOthers(string id)
    {
        foreach (DemoDocumentItem document in Documents.Where(document => !string.Equals(document.Id, id, StringComparison.Ordinal)).ToArray())
            Close(document.Id);

        SelectedKey = id;
    }

    /// <summary>
    /// Closes a document, or refuses to: whether a tab may go is the controller's answer, not the strip's.
    /// </summary>
    public void Close(string id)
    {
        if (Find(id) is not DemoDocumentItem document)
            return;

        if (document.Pinned)
        {
            LogEvent($"{document.Title} is pinned and stays open");
            return;
        }

        var index = Documents.IndexOf(document);

        Documents.RemoveAt(index);
        LogEvent($"closed {document.Title}");

        // The strip would fall back to its first tab; an editor picks the neighbour instead.
        if (string.Equals(SelectedKey, id, StringComparison.Ordinal))
            SelectedKey = Documents.Count == 0 ? null : Documents[Math.Min(index, Documents.Count - 1)].Id;
    }

    /// <summary>
    /// Normalizes the name the caption already wrote back, applying the rule that a file keeps its extension.
    /// </summary>
    public void Rename(string id)
    {
        if (Find(id) is not DemoDocumentItem document)
            return;

        var title = document.Title?.Trim() ?? string.Empty;

        if (title.Length == 0)
        {
            document.Title = Project[id].Title;
            LogEvent($"an empty name is refused — back to {document.Title}");
            return;
        }

        if (!title.EndsWith(document.Extension, StringComparison.OrdinalIgnoreCase))
            title += document.Extension;

        document.Title = title;
        LogEvent($"renamed to {title}");
    }

    /// <summary>The strip after a drop, read off the orders the drag wrote back.</summary>
    public void ReportOrder()
        => LogEvent("order: " + string.Join(" · ", Documents.OrderBy(static document => document.Order).Select(static document => document.Title)));

    private DemoDocumentItem? Find(string id)
        => Documents.FirstOrDefault(document => string.Equals(document.Id, id, StringComparison.Ordinal));

    private static DemoDocumentItem CreateDocument(string id, double order, bool pinned = false)
    {
        (var title, _, var icon, var body) = Project[id];

        return new DemoDocumentItem
        {
            Id = id,
            Title = title,
            Icon = DemoIcons.Outline(icon),
            Order = order,
            CanRemove = true,
            Body = body,
            Extension = Path.GetExtension(title),
            Pinned = pinned
        };
    }
}

/// <summary>
/// A strip the controller walks: four steps nobody closes or drags, driven by the server as readily as by a click.
/// </summary>
internal sealed partial class DriveGroupContext : DemoGroupContext
{
    [RecursiveMember(false)]
    public RecursiveCollection<DemoDocumentItem> Steps { get; } =
    [
        CreateStep("source", 1, "Source", "Checked out main at 7f3a1c2. Nothing to do here."),
        CreateStep("build", 2, "Build", "Restore, compile and the client bundle — 41 seconds on the last run."),
        CreateStep("test", 3, "Test", "452 tests across three projects, none skipped."),
        CreateStep("deploy", 4, "Deploy", "Promotes the build to staging and waits for a person.")
    ];

    [RecursiveMember]
    public partial string? SelectedKey { get; set; } = "source";

    public void Move(int offset)
    {
        DemoDocumentItem[] ordered = [.. Steps.OrderBy(static step => step.Order)];

        var index = Array.FindIndex(ordered, step => string.Equals(step.Id, SelectedKey, StringComparison.Ordinal));
        var target = Math.Clamp(index + offset, 0, ordered.Length - 1);

        if (target == index)
        {
            LogEvent(offset > 0 ? "already on the last step" : "already on the first step");
            return;
        }

        SelectedKey = ordered[target].Id;
        LogEvent($"now on {ordered[target].Title}");
    }

    private static DemoDocumentItem CreateStep(string id, double order, string title, string body)
        => new() { Id = id, Title = title, Order = order, CanRemove = false, Body = body };
}

internal sealed partial class TabsViewScenariosController() : DemoController
{
    [RecursiveMember]
    public partial EditorGroupContext EditorGroup { get; set; } = new();

    [RecursiveMember]
    public partial DriveGroupContext DriveGroup { get; set; } = new();

    [UICommand]
    public void OpenFile(string id)
        => EditorGroup.Open(id);

    [UICommand]
    public void CloseDocument(string id)
        => EditorGroup.Close(id);

    [UICommand]
    public void RenameDocument(string id)
        => EditorGroup.Rename(id);

    public const string EditorTabsId = "editor-tabs";
    public const string RenameAction = "rename";

    /// <summary>
    /// Rename opens the caption's own field through an effect; everything else the group answers on the server.
    /// </summary>
    [UICommand]
    public UICommandResult TabAction(string action, string id)
    {
        if (string.Equals(action, RenameAction, StringComparison.Ordinal))
            return UICommandResult.Ok([new RenameTabEffect(EditorTabsId, id)]);

        EditorGroup.Act(action, id);

        return UICommandResult.Ok();
    }

    [UICommand]
    public void NextStep()
        => DriveGroup.Move(1);

    [UICommand]
    public void PreviousStep()
        => DriveGroup.Move(-1);

    /// <summary>
    /// A drop has no command of its own: it writes the tab's <c>Order</c> back, and this hangs off that notification.
    /// </summary>
    protected override void OnNotify(RecursiveChange change)
    {
        base.OnNotify(change);

        ArgumentNullException.ThrowIfNull(change);

        RecursivePath path = change.Path;

        if (path.Count == 4
            && path[0].Kind == PathSegmentKind.Property && string.Equals(path[0].Property, nameof(EditorGroup), StringComparison.Ordinal)
            && path[1].Kind == PathSegmentKind.Property && string.Equals(path[1].Property, nameof(EditorGroupContext.Documents), StringComparison.Ordinal)
            && path[3].Kind == PathSegmentKind.Property && string.Equals(path[3].Property, nameof(TabItem.Order), StringComparison.Ordinal))
        {
            EditorGroup.ReportOrder();
        }
    }
}
