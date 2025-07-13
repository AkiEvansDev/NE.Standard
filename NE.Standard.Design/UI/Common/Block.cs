using NE.Standard.Design.Components;
using NE.Standard.Extensions;
using NE.Standard.Serialization;
using System.Collections.Generic;

namespace NE.Standard.Design.UI.Common
{
    public enum Alignment
    {
        Start = 1,
        Center = 2,
        End = 3,
        Stretch = 4
    }

    public interface IBlock
    {
        string Id { get; }

        bool Enabled { get; }
        bool Visible { get; }

        Alignment HorizontalAlignment { get; }
        Alignment VerticalAlignment { get; }
        Thickness? Margin { get; }

        Placement? Mobile { get; }
        Placement? Tablet { get; }
        Placement? Desktop { get; }

        List<Binding>? Bindings { get; }
        List<InteractionRule>? Interactions { get; }
    }

    [NEObject]
    public abstract class Block : IBlock
    {
        public string Id { get; set; } = default!;

        public virtual bool Enabled { get; set; } = true;
        public virtual bool Visible { get; set; } = true;

        public virtual Alignment HorizontalAlignment { get; set; } = Alignment.Start;
        public virtual Alignment VerticalAlignment { get; set; } = Alignment.Start;
        public virtual Thickness? Margin { get; set; }

        public Placement? Mobile { get; set; }
        public Placement? Tablet { get; set; }
        public Placement? Desktop { get; set; }

        public List<Binding>? Bindings { get; set; }
        public List<InteractionRule>? Interactions { get; set; }
    }

    public abstract class Block<T> : Block
        where T : Block<T>
    {
        public T SetId(string id)
        {
            Id = id;
            return (T)this;
        }

        public T GenerateId(ref int id, string? page = null)
        {
            var prefix = "el";

            //if (this is IUIProperty)
            //    prefix = "prop";
            //else if (this is IUIAction)
            //    prefix = "act";
            //else if (this is UIDialog)
            //    prefix = "dlg";

            if (!page.IsNull())
                prefix = $"{page}_{prefix}";

            Id = $"{prefix}_{id}";
            id++;

            return (T)this;
        }

        public T AddBinding(BindingMode mode, string source, string target, IValueConverter? converter = null)
        {
            Bindings ??= new List<Binding>();
            Bindings.Add(new Binding
            {
                Mode = mode,
                Source = source,
                Target = target,
                Converter = converter
            });

            return (T)this;
        }

        public T AddInteraction(string targetId, string targetProperty, InteractionType type = InteractionType.Disable, RuleType rule = RuleType.Required, object? value = null, bool invert = false)
        {
            Interactions ??= new List<InteractionRule>();
            Interactions.Add(new InteractionRule
            {
                TargetId = targetId,
                TargetProperty = targetProperty,
                InteractionType = type,
                ValidationType = rule,
                ValidationValue = value,
                Invert = invert
            });

            return (T)this;
        }
    }
}
