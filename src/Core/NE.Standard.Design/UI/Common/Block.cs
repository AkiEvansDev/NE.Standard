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
        BlockThickness? Margin { get; }

        GridPlacement? Mobile { get; }
        GridPlacement? Tablet { get; }
        GridPlacement? Desktop { get; }

        List<BlockBinding>? Bindings { get; }
        List<BlockInteraction>? Interactions { get; }
    }

    [NEObject]
    public abstract class Block : IBlock
    {
        public string Id { get; set; } = default!;

        public virtual bool Enabled { get; set; } = true;
        public virtual bool Visible { get; set; } = true;

        public virtual Alignment HorizontalAlignment { get; set; } = Alignment.Start;
        public virtual Alignment VerticalAlignment { get; set; } = Alignment.Start;
        public virtual BlockThickness? Margin { get; set; }

        public GridPlacement? Mobile { get; set; }
        public GridPlacement? Tablet { get; set; }
        public GridPlacement? Desktop { get; set; }

        public List<BlockBinding>? Bindings { get; set; }
        public List<BlockInteraction>? Interactions { get; set; }
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

        public T AddBinding(BlockBindingMode mode, string source, string target, INEValueConverter? converter = null)
        {
            Bindings ??= new List<BlockBinding>();
            Bindings.Add(new BlockBinding
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
            Interactions ??= new List<BlockInteraction>();
            Interactions.Add(new BlockInteraction
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
