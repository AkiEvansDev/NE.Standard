using System;
using System.Linq;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Items.ItemsView;

internal sealed partial class DemoStepItem : RecursiveObservable, IBindableItem
{
    public DemoStepItem() { }

    public DemoStepItem(string title)
    {
        Title = title;
    }

    [RecursiveMember(false)]
    public string Id { get; init; } = Guid.NewGuid().ToString("N");

    [RecursiveMember]
    public partial string Title { get; set; } = "";
}

internal sealed partial class DemoTaskItem : RecursiveObservable, IBindableItem
{
    public DemoTaskItem() { }

    public DemoTaskItem(string title)
    {
        Title = title;
    }

    [RecursiveMember(false)]
    public string Id { get; init; } = Guid.NewGuid().ToString("N");

    [RecursiveMember]
    public partial string Title { get; set; } = "";

    [RecursiveMember(false)]
    public RecursiveCollection<DemoStepItem> Steps { get; } = [];
}

internal sealed partial class ItemsViewGroupContext : DemoGroupContext
{
    [RecursiveMember(false)]
    public RecursiveCollection<DemoTaskItem> Tasks { get; } = [];

    private int _taskCounter;
    private int _stepCounter;

    public void AddTask()
    {
        _taskCounter++;

        DemoTaskItem task = new($"Task {_taskCounter}");
        Tasks.Add(task);

        LogEvent($"Added '{task.Title}'");
    }

    public void RemoveTask(DemoTaskItem task)
    {
        _ = Tasks.Remove(task);

        LogEvent($"Removed '{task.Title}'");
    }

    // Takes the item itself (ArgCurrentItem): an item collection is addressed by key, so the click site
    // carries the item's id and never a position.
    public void RenameTask(DemoTaskItem task)
    {
        task.Title = task.Title.EndsWith(" *", StringComparison.Ordinal)
            ? task.Title[..^2]
            : task.Title + " *";

        LogEvent($"Renamed to '{task.Title}'");
    }

    public void AddStep(DemoTaskItem task)
    {
        _stepCounter++;

        DemoStepItem step = new($"Step {_stepCounter}");
        task.Steps.Add(step);

        LogEvent($"Added '{step.Title}' to '{task.Title}'");
    }

    // Two levels of item scope: the step comes from the inner items-view, the task id from ArgParent one
    // level up. This is the pair the nested-scope resolution exists for.
    public void RemoveStep(DemoStepItem step, string taskId)
    {
        DemoTaskItem? task = Tasks.FirstOrDefault(t => t.Id == taskId);

        _ = (task?.Steps.Remove(step));

        LogEvent($"Removed step from '{task?.Title ?? "?"}'");
    }
}

internal sealed partial class ItemsViewBindingController() : DemoBindingController
{
    [RecursiveMember]
    public partial ItemsViewGroupContext TasksGroup { get; set; } = new();

    [UICommand]
    public void AddTask()
        => TasksGroup.AddTask();

    [UICommand]
    public void RemoveTask(DemoTaskItem task)
        => TasksGroup.RemoveTask(task);

    [UICommand]
    public void RenameTask(DemoTaskItem task)
        => TasksGroup.RenameTask(task);

    [UICommand]
    public void AddStep(DemoTaskItem task)
        => TasksGroup.AddStep(task);

    [UICommand]
    public void RemoveStep(DemoStepItem step, string taskId)
        => TasksGroup.RemoveStep(step, taskId);
}
