using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Items.KeyValueAction;

/// <summary>
/// The properties that answer for the whole list rather than for one row.
/// </summary>
internal sealed partial class KeyValueActionListGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UISurfaceStyle? Surface { get; set; } = UISurfaceStyle.Background;

    [RecursiveMember]
    public partial bool ShowRowSeparators { get; set; } = true;

    [RecursiveMember]
    public partial bool StretchValue { get; set; } = true;

    [RecursiveMember]
    public partial bool ShowActions { get; set; } = true;

    [RecursiveMember]
    public partial bool RowHoverable { get; set; }

    [RecursiveMember]
    public partial UIOverflow? Overflow { get; set; } = UIOverflow.Hidden;

    public KeyValueActionListGroupContext()
    {
        AddOption(nameof(Surface), CycleSurface, () => Surface);
        AddOption(nameof(ShowRowSeparators), ToggleShowRowSeparators, () => ShowRowSeparators);
        AddOption(nameof(StretchValue), ToggleStretchValue, () => StretchValue);
        AddOption(nameof(ShowActions), ToggleShowActions, () => ShowActions);
        AddOption(nameof(RowHoverable), ToggleRowHoverable, () => RowHoverable);
        AddOption(nameof(Overflow), CycleOverflow, () => Overflow);
    }

    public void CycleSurface()
        => SetLastChange(nameof(Surface), Surface = CycleEnum(Surface));

    public void ToggleShowRowSeparators()
        => SetLastChange(nameof(ShowRowSeparators), ShowRowSeparators = !ShowRowSeparators);

    public void ToggleStretchValue()
        => SetLastChange(nameof(StretchValue), StretchValue = !StretchValue);

    public void ToggleShowActions()
        => SetLastChange(nameof(ShowActions), ShowActions = !ShowActions);

    public void ToggleRowHoverable()
        => SetLastChange(nameof(RowHoverable), RowHoverable = !RowHoverable);

    public void CycleOverflow()
        => SetLastChange(nameof(Overflow), Overflow = CycleEnum(Overflow));
}

/// <summary>
/// The rows themselves: each option prints the collection's state, and pressing it moves the collection.
/// </summary>
internal sealed partial class KeyValueActionRowsGroupContext : DemoGroupContext
{
    private int _added;

    [RecursiveMember(false)]
    public RecursiveCollection<KeyValueActionItem> Items { get; } =
    [
        CreateItem("region", "Region", "eu-west"),
        CreateItem("replicas", "Replicas", "3"),
        CreateItem("visibility", "Visibility", "internal"),
    ];

    public KeyValueActionRowsGroupContext()
    {
        AddOption("Add", AddItem, () => Items.Count);
        AddOption("Remove", RemoveItem, () => Items.Count);
        AddOption("Rename last", RenameLast, () => Items.Count == 0 ? null : ((TextItem)Items[^1].Value).Title);
    }

    public void AddItem()
    {
        var id = string.Create(CultureInfo.InvariantCulture, $"flag-{++_added}");

        Items.Add(CreateItem(id, string.Create(CultureInfo.InvariantCulture, $"Feature {_added}"), "enabled"));
    }

    public void RemoveItem()
    {
        if (Items.Count > 0)
            _ = Items.Remove(Items[^1]);
    }

    /// <summary>
    /// Mutates the last row's value in place, which shows the cloned template slot's bindings are live.
    /// </summary>
    public void RenameLast()
    {
        if (Items.Count == 0)
            return;

        TextItem value = (TextItem)Items[^1].Value;

        var title = value.Title?.Key ?? string.Empty;

        value.Title = title.EndsWith('*') ? title.TrimEnd('*') : $"{title}*";
    }

    private static KeyValueActionItem CreateItem(string id, string key, string value)
        => new()
        {
            Id = id,
            Key = new TextItem { Title = key },
            Value = new TextItem { Title = value, TitleColor = UIThemeColor.Muted },
            Action = new ButtonItem { Id = id, Icon = DemoIcons.Outline(DemoIcons.Edit), Type = UIButtonType.Ghost, Size = UIButtonSize.Small }
        };
}

/// <summary>
/// Three rows two lists show: a press on a row hands over the whole item, a press on its action the item's key.
/// </summary>
internal sealed partial class KeyValueActionArgumentGroupContext : DemoGroupContext
{
    [RecursiveMember(false)]
    public RecursiveCollection<KeyValueActionItem> Items { get; } =
    [
        CreateItem("owner", "Owner", "Robin Hale"),
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
/// Rows edited in place. Four are opened by the controller, which seeds the draft from the value it holds, typed as the input wants it;
/// two are opened on the client alone, the pencil flipping the row's flag and the draft the value's text, and only their save is a round
/// trip.
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
        CreateItem(NameId, "Display name", "Billing", inputTemplate: null),
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

    [RecursiveMember(false)]
    public RecursiveCollection<KeyValueActionItem> LocalItems { get; } =
    [
        new()
        {
            Id = "alias",
            Key = new TextItem { Title = "Alias", TitleColor = UIThemeColor.Muted },
            Value = new TextItem { Title = "billing" }
        },
        new()
        {
            Id = "region",
            Key = new TextItem { Title = "Region", TitleColor = UIThemeColor.Muted },
            Value = new TextItem { Title = "eu-west" }
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
            case AvatarId:
                // Saved with no picture chosen: the draft is the icon's address, and the row's text is not that.
                break;
            default:
                Text(row).Title = Convert.ToString(row.EditValue, CultureInfo.InvariantCulture)?.Trim() ?? string.Empty;
                break;
        }

        row.ShowInput = false;
        LogEvent($"saved {id} -> {row.Value.Title}");
    }

    /// <summary>A row the client opened: its draft is the value's text, and the save is the only round trip.</summary>
    public void SaveLocal(string id)
    {
        foreach (KeyValueActionItem row in LocalItems)
        {
            if (row.Id != id)
                continue;

            Text(row).Title = Convert.ToString(row.EditValue, CultureInfo.InvariantCulture)?.Trim() ?? string.Empty;
            row.ShowInput = false;
            LogEvent($"saved {id} -> {row.Value.Title}");
            return;
        }
    }

    public AvatarRowItem Avatar => (AvatarRowItem)Find(AvatarId);

    /// <summary>A picked file the row will not show: the pick is dropped and the line says why.</summary>
    public void RefuseAvatar(string message)
    {
        Avatar.SelectionId = null;
        LogEvent(message);
    }

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
        ["text"] = "Billing",
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
/// One list and every property that can be bound to it, and the examples' rows that answer: a press, an input in a row, and an edit in
/// place.
/// </summary>
internal sealed partial class KeyValueActionController() : DemoStandardController
{
    [RecursiveMember]
    public partial KeyValueActionListGroupContext ListGroup { get; set; } = new();

    [RecursiveMember]
    public partial KeyValueActionRowsGroupContext ItemsGroup { get; set; } = new();

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();

    [RecursiveMember]
    public partial KeyValueActionArgumentGroupContext ClickGroup { get; set; } = new();

    [RecursiveMember]
    public partial KeyValueActionEditGroupContext EditGroup { get; set; } = new();

    [RecursiveMember]
    public partial KeyValueActionInputsGroupContext InputsGroup { get; set; } = new();

    [UICommand]
    public void CycleListOption(string id)
        => ListGroup.CycleOption(id);

    [UICommand]
    public void CycleItemsOption(string id)
        => ItemsGroup.CycleOption(id);

    [UICommand]
    public void CycleBorderOption(string id)
        => BorderGroup.CycleOption(id);

    [UICommand]
    public void ClickRowWithItem(KeyValueActionItem item)
        => ClickGroup.RecordItem(item);

    [UICommand]
    public void ClickActionWithKey(string id)
        => ClickGroup.RecordKey(id);

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

        if (!DemoImages.IsInlinePicture(selection.Files[0].ContentType, selection.Files[0].Size))
        {
            EditGroup.RefuseAvatar("avatar not saved: a PNG, JPEG, GIF or WebP picture of at most 2 MB");
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
        => EditGroup.SaveLocal(id);

    [UICommand]
    public void OpenInputRow(string id)
        => InputsGroup.Open(id);

    [UICommand]
    public void SaveInputRow(string id)
        => InputsGroup.Save(id);
}
