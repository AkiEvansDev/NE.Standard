using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Layouts.Expander;

/// <summary>
/// Why an expander has a server event: a closed section is unpaid for, and its first opening is what asks.
/// </summary>
internal sealed partial class ExpanderLoadGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial bool Busy { get; set; }

    [RecursiveMember]
    public partial bool Loaded { get; set; }

    [RecursiveMember]
    public partial string Log { get; set; } = "Nothing has been read yet.";

    [RecursiveMember]
    public partial string State { get; set; } = "Not read";

    [RecursiveMember]
    public partial UIBadgeType StateStyle { get; set; } = UIBadgeType.Surface;

    public void Reset()
    {
        Loaded = false;
        Log = "Nothing has been read yet.";
        State = "Not read";
        StateStyle = UIBadgeType.Surface;
        LogEvent("forgotten — the next open reads it again");
    }
}

/// <summary>The two events an expander raises, one per gesture, and the state each of them runs against.</summary>
internal sealed partial class ExpanderEventGroupContext : DemoGroupContext
{
    private readonly List<string> _seen = [];

    [RecursiveMember]
    public partial bool Expanded { get; set; }

    [RecursiveMember]
    public partial string Trace { get; set; } = "Nothing yet";

    public void Record(string name, bool expanded)
    {
        _seen.Add($"{name} (Expanded={(expanded ? "true" : "false")})");

        // The last four only: what matters is the order within one press, not the whole session.
        if (_seen.Count > 4)
            _seen.RemoveAt(0);

        Trace = string.Join(" → ", _seen);
    }

    public void Clear()
    {
        _seen.Clear();
        Trace = "Nothing yet";
    }
}

internal sealed partial class ExpanderScenariosController() : DemoController
{
    // Five lines that stay five: a paragraph's description keeps the newlines the author wrote.
    private const string LogText =
        "12:04:11  order    ok\n12:04:12  disk     80 GB created\n12:04:19  boot     ok in 7.1s\n12:04:26  health   check passed\n12:04:31  ready    api-eu-west-1";

    [RecursiveMember]
    public partial ExpanderLoadGroupContext LoadGroup { get; set; } = new();

    [RecursiveMember]
    public partial ExpanderEventGroupContext EventGroup { get; set; } = new();

    /// <summary>
    /// On expand rather than on toggle, so closing the section sends nothing; the fetch guard is the controller's.
    /// </summary>
    [UICommand]
    public async Task LoadLogAsync(CancellationToken cancellationToken)
    {
        if (LoadGroup.Loaded)
        {
            LoadGroup.LogEvent("opened again — the command still ran, and decided there was nothing to read");
            return;
        }

        LoadGroup.Busy = true;
        LoadGroup.State = "Reading";
        LoadGroup.StateStyle = UIBadgeType.Info;
        LoadGroup.LogEvent("first open — going to the server for it");

        await Task.Delay(1200, cancellationToken).ConfigureAwait(false);

        LoadGroup.Log = LogText;
        LoadGroup.Loaded = true;
        LoadGroup.State = "Read";
        LoadGroup.StateStyle = UIBadgeType.Success;
        LoadGroup.Busy = false;
    }

    [UICommand]
    public void ForgetLog()
        => LoadGroup.Reset();

    // Each reads Expanded as well as naming itself: the section's write-back lands before the command runs.
    [UICommand]
    public void RecordExpand()
        => EventGroup.Record("Expand", EventGroup.Expanded);

    [UICommand]
    public void RecordCollapse()
        => EventGroup.Record("Collapse", EventGroup.Expanded);

    [UICommand]
    public void ClearTrace()
        => EventGroup.Clear();
}
