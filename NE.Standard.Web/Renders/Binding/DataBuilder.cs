using NE.Standard.Design.Elements.Base;

namespace NE.Standard.Web.Renders.Binding;

public enum BindingAction
{
    ClassSwitch,
    SetText,
    SetValue
}

public class DataModel
{
    public string Id { get; set; } = default!;
    public string? Filter { get; set; }
}

public class BindingModel : DataModel
{
    public string Property { get; set; } = default!;
    public BindingAction Action { get; set; }
    public Dictionary<object, string>? Map { get; set; }
    public object? Value { get; set; }
}

public class InteractionModel : DataModel
{
    public string TargetId { get; set; } = default!;

    public InteractionType InteractionType { get; set; }
    public ValidationType ValidationType { get; set; }
    public object? ValidationValue { get; set; }

    public bool Invert { get; set; }
}

public class ValidationModel : DataModel
{
    public ValidationType ValidationType { get; set; }
    public object? ValidationValue { get; set; }
    public string? ErrorMessage { get; set; }
}

public interface IDataBuilder
{
    List<BindingModel> Bindings { get; }
    List<InteractionModel> Interactions { get; }
    List<ValidationModel> Validations { get; }
}

public class DataBuilder : IDataBuilder
{
    public List<BindingModel> Bindings { get; }
    public List<InteractionModel> Interactions { get; }
    public List<ValidationModel> Validations { get; }

    public DataBuilder()
    {
        Bindings = [];
        Interactions = [];
        Validations = [];
    }
}
