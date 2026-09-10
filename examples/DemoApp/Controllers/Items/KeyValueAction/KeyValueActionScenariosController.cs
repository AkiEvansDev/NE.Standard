using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Files;

namespace DemoApp.Controllers.Items.KeyValueAction;

internal sealed partial class KeyValueActionArgumentGroupContext : DemoGroupContext
{
    [RecursiveMember(false)]
    public RecursiveCollection<KeyValueActionItem> Items { get; } =
    [
        CreateItem("owner", "Owner", "platform-team"),
        CreateItem("created", "Created", "2026-04-02"),
        CreateItem("visibility", "Visibility", "internal"),
    ];

    public void RecordItem(KeyValueActionItem item)
    {
        ArgumentNullException.ThrowIfNull(item);

        LogEvent($"item -> Id={item.Id}, Value={item.Value.Title}");
    }

    public void RecordKey(string id)
        => LogEvent($"item key -> {id}");

    private static KeyValueActionItem CreateItem(string id, string key, string value)
        => new()
        {
            Id = id,
            Key = new TextItem { Title = key, TitleColor = UIThemeColor.Muted },
            Value = new TextItem { Title = value },
            Action = new ButtonItem { Id = id, Icon = DemoIcons.Outline(DemoIcons.Edit), Type = UIButtonType.Ghost }
        };
}

/// <summary>
/// A row whose editor is a picture: the upload's handle lands beside the draft, and the saved picture is the value's icon.
/// </summary>
internal sealed partial class AvatarRowItem : KeyValueActionItem
{
    [RecursiveMember]
    public partial string? SelectionId { get; set; }
}

/// <summary>
/// A row whose editor carries a message the controller put on it: in a row a message has no line to sit on, so it is a mark.
/// </summary>
internal sealed partial class NotedRowItem : KeyValueActionItem
{
    [RecursiveMember]
    public partial UIValidationMessage? Note { get; set; }
}

/// <summary>
/// Four rows edited in place, each opened by the controller: it seeds the draft from the value it holds, typed as the input wants it.
/// </summary>
internal sealed partial class KeyValueActionEditGroupContext : DemoGroupContext
{
    private const string NameId = "name";
    private const string RetriesId = "retries";
    private const string AlertsId = "alerts";
    private const string AvatarId = "avatar";

    private int _retries = 3;
    private bool _alerts = true;

    [RecursiveMember(false)]
    public RecursiveCollection<KeyValueActionItem> Items { get; } =
    [
        CreateItem(NameId, "Display name", "Payments API", inputTemplate: null),
        CreateItem(RetriesId, "Retries", "3", inputTemplate: "number"),
        CreateItem(AlertsId, "Alerts", "on", inputTemplate: "switch"),
        new AvatarRowItem
        {
            Id = AvatarId,
            Key = new TextItem { Title = "Avatar", TitleColor = UIThemeColor.Muted },
            Value = new TextItem { Title = "avatar.jpg", Icon = DemoImages.Avatar },
            InputTemplate = "avatar"
        }
    ];

    public void Open(string id)
    {
        KeyValueActionItem row = Find(id);

        row.EditValue = id switch
        {
            RetriesId => _retries,
            AlertsId => _alerts,
            AvatarId => row.Value.Icon,
            _ => row.Value.Title
        };
        row.ShowInput = true;
        LogEvent($"opened {id}, the draft seeded from the value");
    }

    /// <summary>The draft comes back as the input sent it — text, number or flag — and the row's text is made from it.</summary>
    public void Save(string id)
    {
        KeyValueActionItem row = Find(id);

        switch (id)
        {
            case RetriesId:
                _retries = Convert.ToInt32(row.EditValue, CultureInfo.InvariantCulture);
                Text(row).Title = _retries.ToString(CultureInfo.InvariantCulture);
                break;
            case AlertsId:
                _alerts = row.EditValue is true;
                Text(row).Title = _alerts ? "on" : "off";
                break;
            default:
                Text(row).Title = Convert.ToString(row.EditValue, CultureInfo.InvariantCulture)?.Trim() ?? string.Empty;
                break;
        }

        row.ShowInput = false;
        LogEvent($"saved {id} -> {row.Value.Title}");
    }

    public AvatarRowItem Avatar => (AvatarRowItem)Find(AvatarId);

    public void ShowAvatar(string fileName, string source)
    {
        AvatarRowItem row = Avatar;

        Text(row).Title = fileName;
        Text(row).Icon = source;
        row.SelectionId = null;
        row.ShowInput = false;
        LogEvent($"saved avatar -> {fileName}");
    }

    /// <summary>The row's value as the item it was built with: the model interface reads, the item writes.</summary>
    private static TextItem Text(KeyValueActionItem row)
        => (TextItem)row.Value;

    private KeyValueActionItem Find(string id)
    {
        foreach (KeyValueActionItem item in Items)
        {
            if (item.Id == id)
                return item;
        }

        throw new ArgumentException($"No row '{id}'.", nameof(id));
    }

    private static KeyValueActionItem CreateItem(string id, string key, string value, string? inputTemplate)
        => new()
        {
            Id = id,
            Key = new TextItem { Title = key, TitleColor = UIThemeColor.Muted },
            Value = new TextItem { Title = value },
            InputTemplate = inputTemplate
        };
}

/// <summary>
/// One row per input kind, each opened by the controller with a draft of the type that input wants, and saved as the text of what came back.
/// </summary>
internal sealed partial class KeyValueActionInputsGroupContext : DemoGroupContext
{
    private readonly Dictionary<string, object?> _drafts = new(StringComparer.Ordinal)
    {
        ["text"] = "Payments API",
        ["number"] = 3m,
        ["switch"] = true,
        ["checkbox"] = false,
        ["select"] = "cover",
        ["search"] = "contain",
        ["radio"] = "fill",
        ["slider"] = 40m,
        ["date"] = new DateOnly(2026, 9, 7),
        ["time"] = new TimeOnly(9, 30),
        ["datetime"] = new DateTimeOffset(2026, 9, 7, 9, 30, 0, TimeSpan.Zero),
        ["color"] = UIThemeColor.FromStyle(UIColorStyle.Primary),
        ["file"] = null
    };

    [RecursiveMember(false)]
    public RecursiveCollection<KeyValueActionItem> Items { get; } =
    [
        CreateRow("text", "Text"),
        CreateRow("number", "Number"),
        CreateRow("switch", "Switch"),
        CreateRow("checkbox", "Checkbox"),
        CreateRow("select", "Select"),
        CreateRow("search", "Search"),
        CreateRow("radio", "Radio group"),
        CreateRow("slider", "Slider"),
        CreateRow("date", "Date"),
        CreateRow("time", "Time"),
        CreateRow("datetime", "Date and time"),
        CreateRow("color", "Colour"),
        CreateRow("file", "File")
    ];

    public void Open(string id)
    {
        KeyValueActionItem row = Find(id);

        row.EditValue = _drafts[id];
        row.ShowInput = true;
        LogEvent($"opened {id}");
    }

    public void Save(string id)
    {
        KeyValueActionItem row = Find(id);

        _drafts[id] = row.EditValue;
        ((TextItem)row.Value).Title = Describe(row.EditValue);
        row.ShowInput = false;
        LogEvent($"saved {id} -> {row.Value.Title}");
    }

    private KeyValueActionItem Find(string id)
    {
        foreach (KeyValueActionItem item in Items)
        {
            if (item.Id == id)
                return item;
        }

        throw new ArgumentException($"No row '{id}'.", nameof(id));
    }

    private static KeyValueActionItem CreateRow(string id, string key)
        => new()
        {
            Id = id,
            Key = new TextItem { Title = key, TitleColor = UIThemeColor.Muted },
            Value = new TextItem { Title = "—" },
            InputTemplate = id == "text" ? null : id
        };

    private static string Describe(object? value)
        => value switch
        {
            null => "—",
            bool flag => flag ? "on" : "off",
            UIThemeColor color => color.ToString() ?? "a colour",
            IFormattable formattable => formattable.ToString(null, CultureInfo.InvariantCulture),
            _ => value.ToString() ?? "—"
        };
}

/// <summary>
/// One row opened on the client alone: the pencil flips the row's flag, the draft is the value's text, and only the save is a round trip.
/// </summary>
internal sealed partial class KeyValueActionLocalEditGroupContext : DemoGroupContext
{
    [RecursiveMember(false)]
    public RecursiveCollection<KeyValueActionItem> Items { get; } =
    [
        new()
        {
            Id = "alias",
            Key = new TextItem { Title = "Alias", TitleColor = UIThemeColor.Muted },
            Value = new TextItem { Title = "payments" }
        },
        new()
        {
            Id = "region",
            Key = new TextItem { Title = "Region", TitleColor = UIThemeColor.Muted },
            Value = new TextItem { Title = "eu-west-1" }
        }
    ];

    public void Save(string id)
    {
        foreach (KeyValueActionItem row in Items)
        {
            if (row.Id != id)
                continue;

            ((TextItem)row.Value).Title = Convert.ToString(row.EditValue, CultureInfo.InvariantCulture)?.Trim() ?? string.Empty;
            row.ShowInput = false;
            LogEvent($"saved {id} -> {row.Value.Title}");
            return;
        }
    }
}

internal sealed partial class KeyValueActionNoteGroupContext : DemoGroupContext
{
    private const string LimitId = "limit";

    [RecursiveMember(false)]
    public RecursiveCollection<KeyValueActionItem> Items { get; } =
    [
        new NotedRowItem
        {
            Id = LimitId,
            Key = new TextItem { Title = "Daily limit", TitleColor = UIThemeColor.Muted },
            Value = new TextItem { Title = "500" },
            EditValue = "500",
            ShowInput = true,
            Note = UIValidationMessage.Warning("Above the plan's 200; a change this size needs an owner's sign-off.")
        }
    ];

    /// <summary>The mark answers the draft: over the plan it stays, at or under it goes, and the row closes either way.</summary>
    public void Save(string id)
    {
        foreach (KeyValueActionItem row in Items)
        {
            if (row.Id != id || row is not NotedRowItem noted)
                continue;

            var text = Convert.ToString(row.EditValue, CultureInfo.InvariantCulture)?.Trim() ?? string.Empty;

            ((TextItem)row.Value).Title = text;
            noted.Note = int.TryParse(text, NumberStyles.Integer, CultureInfo.InvariantCulture, out var limit) && limit > 200
                ? UIValidationMessage.Warning("Above the plan's 200; a change this size needs an owner's sign-off.")
                : null;
            row.ShowInput = false;
            LogEvent($"saved {id} -> {text}");
            return;
        }
    }
}

internal sealed partial class KeyValueActionScenariosController() : DemoController
{
    [RecursiveMember]
    public partial KeyValueActionArgumentGroupContext RowGroup { get; set; } = new();

    [RecursiveMember]
    public partial KeyValueActionArgumentGroupContext ActionGroup { get; set; } = new();

    [RecursiveMember]
    public partial KeyValueActionEditGroupContext EditGroup { get; set; } = new();

    [RecursiveMember]
    public partial KeyValueActionLocalEditGroupContext LocalEditGroup { get; set; } = new();

    [RecursiveMember]
    public partial KeyValueActionInputsGroupContext InputsGroup { get; set; } = new();

    [RecursiveMember]
    public partial KeyValueActionNoteGroupContext NoteGroup { get; set; } = new();

    [UICommand]
    public void ClickRowWithItem(KeyValueActionItem item)
        => RowGroup.RecordItem(item);

    [UICommand]
    public void ClickActionWithKey(string id)
        => ActionGroup.RecordKey(id);

    [UICommand]
    public void OpenRow(string id)
        => EditGroup.Open(id);

    /// <summary>
    /// The avatar row's draft is a picture: its upload is read back and shown as the value's icon; every other row saves its draft as text.
    /// </summary>
    [UICommand]
    public async Task SaveRowAsync(string id, CancellationToken cancellationToken)
    {
        AvatarRowItem avatar = EditGroup.Avatar;

        if (id != avatar.Id || string.IsNullOrWhiteSpace(avatar.SelectionId))
        {
            EditGroup.Save(id);
            return;
        }

        UIUploadSelection selection = await Context.Uploads
            .GetSelectionAsync(Context.Handle, avatar.SelectionId, cancellationToken)
            .ConfigureAwait(false);

        if (selection.Files.Length == 0)
        {
            EditGroup.Save(id);
            return;
        }

        UIUploadedFile file = await Context.Uploads
            .OpenAsync(Context.Handle, selection.Files[0].FileId, cancellationToken: cancellationToken)
            .ConfigureAwait(false);

        await using (file.ConfigureAwait(false))
        {
            using MemoryStream buffer = new();
            await file.Content.CopyToAsync(buffer, cancellationToken).ConfigureAwait(false);

            EditGroup.ShowAvatar(file.Metadata.FileName, $"data:{file.Metadata.ContentType};base64,{Convert.ToBase64String(buffer.ToArray())}");
        }
    }

    [UICommand]
    public void SaveLocalRow(string id)
        => LocalEditGroup.Save(id);

    [UICommand]
    public void SaveNotedRow(string id)
        => NoteGroup.Save(id);

    [UICommand]
    public void OpenInputRow(string id)
        => InputsGroup.Open(id);

    [UICommand]
    public void SaveInputRow(string id)
        => InputsGroup.Save(id);
}
