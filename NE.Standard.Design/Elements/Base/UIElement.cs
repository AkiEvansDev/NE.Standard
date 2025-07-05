using NE.Standard.Extensions;
using NE.Standard.Serialization;
using System.Collections.Generic;

namespace NE.Standard.Design.Elements.Base
{
    public enum Alignment
    {
        Start,
        Center,
        End,
        Stretch
    }

    public enum BindingType
    {
        TwoWay,
        OneWayToSource,
        OnSubmit
    }

    public enum ValidationType
    {
        Required,
        Equals,
        GreaterThanOrEqual,
        LessThanOrEqual,
        Like,
        In,
        Regex
    }

    public enum InteractionType
    {
        Disable,
        Hide,
    }

    [ObjectSerializable]
    public struct UILayoutPlacement
    {
        public int Row { get; set; }
        public int Column { get; set; }
        public int RowSpan { get; set; }
        public int ColumnSpan { get; set; }
    }

    /// <summary>
    /// Handles communication between the client and the client server.
    /// </summary>
    [ObjectSerializable]
    public struct UIBinding
    {
        public BindingType BindingType { get; set; }
        public string SourceProperty { get; set; }
        public string TargetProperty { get; set; }
    }

    /// <summary>
    /// Handles the relationship between elements on the client side.
    /// </summary>
    [ObjectSerializable]
    public struct UIInteraction
    {
        public string SourceId { get; set; }
        public string TargetId { get; set; }

        public InteractionType InteractionType { get; set; }
        public ValidationType ValidationType { get; set; }
        public object? ValidationValue { get; set; }

        public bool Invert { get; set; }
    }

    public interface IUIElement
    {
        string Id { get; }
        bool Enabled { get; }
        bool Visible { get; }
        Alignment HorizontalAlignment { get; }
        Alignment VerticalAlignment { get; }
        UILayoutPlacement? LayoutPlacement { get; }
        List<UIBinding>? Bindings { get; }
        List<UIInteraction>? Interactions { get; }
    }

    [ObjectSerializable]
    public abstract class UIElement : IUIElement
    {
        public string Id { get; set; } = default!;

        public bool Enabled { get; set; } = true;
        public bool Visible { get; set; } = true;

        public virtual Alignment HorizontalAlignment { get; set; } = Alignment.Stretch;
        public virtual Alignment VerticalAlignment { get; set; } = Alignment.Start;

        public UILayoutPlacement? LayoutPlacement { get; set; }

        public List<UIBinding>? Bindings { get; set; }
        public List<UIInteraction>? Interactions { get; set; }
    }

    public abstract class UIElement<T> : UIElement
        where T : UIElement<T>
    {
        public T SetId(string id)
        {
            Id = id;
            return (T)this;
        }

        public T GenerateId(ref int id, string? page = null)
        {
            var prefix = "el";

            if (this is IUIProperty)
                prefix = "prop";
            else if (this is IUIAction)
                prefix = "act";
            else if (this is UIDialog)
                prefix = "dlg";

            if (!page.IsNull())
                prefix = $"{page}_{prefix}";

            Id = $"{prefix}_{id}";
            id++;

            return (T)this;
        }

        public T SetLayout(int column, int row, int columnSpan = 1, int rowSpan = 1)
        {
            LayoutPlacement = new UILayoutPlacement
            {
                Column = column,
                Row = row,
                ColumnSpan = columnSpan,
                RowSpan = rowSpan
            };

            return (T)this;
        }

        public T AddBinding(BindingType type, string source, string target)
        {
            Bindings ??= new List<UIBinding>();
            Bindings.Add(new UIBinding
            {
                BindingType = type,
                SourceProperty = source,
                TargetProperty = target
            });

            return (T)this;
        }

        public T AddInteraction(string targetId, InteractionType type = InteractionType.Disable, ValidationType validation = ValidationType.Required, object? value = null, bool invert = false)
        {
            Interactions ??= new List<UIInteraction>();
            Interactions.Add(new UIInteraction
            {
                SourceId = Id,
                TargetId = targetId,
                InteractionType = type,
                ValidationType = validation,
                ValidationValue = value,
                Invert = invert
            });

            return (T)this;
        }
    }
}
