using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Controllers;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Recursive;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Base;

/// <summary>
/// One section of a component page's options, and the rows it shows. A row is a property's name, the value
/// it currently holds, and the button that steps it to the next one.
/// </summary>
/// <remarks>The rows live here, not in the view, so the value column stays live off a bound collection.</remarks>
internal partial class DemoGroupContext : RecursiveObservable
{
    private readonly Dictionary<string, DemoOption> _options = new(StringComparer.Ordinal);

    // Empty rather than a placeholder: the header row already reserves the line, so nothing moves.
    [RecursiveMember]
    public partial string Message { get; set; } = string.Empty;

    [RecursiveMember(false)]
    public RecursiveCollection<KeyValueActionItem> OptionRows { get; } = [];

    /// <summary>
    /// Runs one row's cycle and re-reads the whole section, since a cycle may move more than its own value.
    /// </summary>
    public void CycleOption(string id)
    {
        if (!_options.TryGetValue(id, out DemoOption option))
            return;

        option.Cycle();
        SetLastChange(id, Describe(option.Read()));
        RefreshOptions();
    }

    internal void RefreshOptions()
    {
        foreach (KeyValueActionItem row in OptionRows)
        {
            if (_options.TryGetValue(row.Id, out DemoOption option) && row.Value is TextItem value)
                value.Title = Describe(option.Read());
        }
    }

    /// <summary>
    /// Registers one row — name, cycle action and value reader — in display order.
    /// </summary>
    protected void AddOption(string name, Action cycle, Func<object?> read)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        ArgumentNullException.ThrowIfNull(cycle);
        ArgumentNullException.ThrowIfNull(read);

        _options[name] = new DemoOption(cycle, read);

        OptionRows.Add(new KeyValueActionItem
        {
            Id = name,
            Key = new TextItem { Title = name, TitleType = UITextAppearance.Caption },
            Value = new TextItem { Title = Describe(read()), TitleType = UITextAppearance.Caption, TitleColor = UIThemeColor.Muted },
            // Small, so the row's height stays its own text rather than the control's.
            Action = new ButtonItem { Id = name, Icon = DemoIcons.Outline(DemoIcons.ChevronRight), Type = UIButtonType.Ghost, Size = UIButtonSize.Small }
        });
    }

    private static string Describe(object? value) => value switch
    {
        null => "(none)",
        bool flag => flag ? "true" : "false",
        _ => value.ToString() is { Length: > 0 } text ? text : "(empty)"
    };

    protected void SetLastChange<T>(string property, T value)
        => Message = $"{property} -> {value}";

    protected void LogEvent(string message)
        => Message = $"{DateTime.Now:HH:mm:ss} > {message}";

    protected static T CycleEnum<T>(T current) where T : struct, Enum
    {
        T[] values = Enum.GetValues<T>();
        var index = Array.IndexOf(values, current);
        return values[(index + 1) % values.Length];
    }

    /// <summary>
    /// The same walk over every value of an enum, with <see langword="null"/> as one more step.
    /// </summary>
    /// <remarks>Unset is a step of its own, since a component's default is often a behaviour no listed value names.</remarks>
    protected static T? CycleEnum<T>(T? current) where T : struct, Enum
    {
        T[] values = Enum.GetValues<T>();

        if (current is not T value)
            return values[0];

        var index = Array.IndexOf(values, value);
        return index + 1 < values.Length ? values[index + 1] : null;
    }

    /// <summary>
    /// Walks every semantic <see cref="UITextType"/> role, plus <see langword="null"/>.
    /// </summary>
    protected static UITextAppearance? CycleAppearance(UITextAppearance? current)
    {
        UITextType[] roles = Enum.GetValues<UITextType>();

        if (current?.Role is not UITextType role)
            return UITextAppearance.FromRole(roles[0]);

        var index = Array.IndexOf(roles, role);
        return index + 1 < roles.Length ? UITextAppearance.FromRole(roles[index + 1]) : null;
    }

    protected static T CycleValue<T>(T current, params T[] values)
    {
        var index = Array.IndexOf(values, current);
        return values[(index + 1) % values.Length];
    }

    /// <summary>
    /// Walks every kind of value an icon property accepts: nothing, a glyph, its outlined drawing, a tinted
    /// picture, and a photograph.
    /// </summary>
    protected static string? CycleIconValue(string? current, string glyph)
        => CycleValue(current, null, glyph, DemoIcons.Outline(glyph), DemoImages.Mask(DemoImages.Mark), DemoImages.Avatar);
}

/// <summary>
/// The two tooltip rows a section carries: the text, and the side it is shown on.
/// </summary>
internal abstract partial class TooltipGroupContext : DemoGroupContext
{
    private string _sample = string.Empty;

    [RecursiveMember]
    public partial string? Tooltip { get; set; }

    [RecursiveMember]
    public partial UIPopupPlacement? TooltipPlacement { get; set; }

    protected void AddTooltipOptions(string sample)
    {
        _sample = sample;

        AddOption(nameof(Tooltip), ToggleTooltip, () => Tooltip);
        AddOption(nameof(TooltipPlacement), CycleTooltipPlacement, () => TooltipPlacement);
    }

    public void ToggleTooltip()
        => SetLastChange(nameof(Tooltip), Tooltip = CycleValue(Tooltip, null, _sample));

    // All twelve, walked whole: a placement is a side plus an end, easier to see than to read.
    public void CycleTooltipPlacement()
        => SetLastChange(nameof(TooltipPlacement), TooltipPlacement = CycleEnum(TooltipPlacement));
}

/// <summary>What one option row does when pressed, and how its current value reads.</summary>
internal readonly record struct DemoOption(Action Cycle, Func<object?> Read);

internal abstract class DemoController : UIControllerBase
{
    /// <summary>
    /// Re-reads an option row when the preview writes the property back; a group context forwards its
    /// notifications upwards, so its own <c>OnNotify</c> never runs.
    /// </summary>
    protected override void OnNotify(RecursiveChange change)
    {
        base.OnNotify(change);

        ArgumentNullException.ThrowIfNull(change);

        if (change.Path.Count == 0 || change.Path[0].Kind != PathSegmentKind.Property)
            return;

        if (TryGetRecursiveValue(change.Path[0].Property, out var group) && group is DemoGroupContext context)
        {
            // Two segments exactly: a longer path is inside a row's own model, which the refresh writes, so re-reading would not terminate.
            if (change.Path.Count == 2)
                context.RefreshOptions();

            return;
        }

        // A write outside every group lands on a controller collection, so every group's rows have to re-read.
        foreach (PropertyInfo property in GetGroupProperties(GetType()))
        {
            if (property.GetValue(this) is DemoGroupContext other)
                other.RefreshOptions();
        }
    }

    private static PropertyInfo[] GetGroupProperties(Type controllerType)
        => GroupPropertiesByType.GetOrAdd(controllerType, static type =>
            [.. type.GetProperties(BindingFlags.Public | BindingFlags.Instance).Where(property => typeof(DemoGroupContext).IsAssignableFrom(property.PropertyType))]);

    private static readonly ConcurrentDictionary<Type, PropertyInfo[]> GroupPropertiesByType = new();
}
