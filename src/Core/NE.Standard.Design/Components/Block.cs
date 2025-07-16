using NE.Standard.Design.Binding;
using NE.Standard.Design.Common;
using NE.Standard.Serialization;
using System;
using System.Collections.Generic;

namespace NE.Standard.Design.Components
{
    public enum Alignment
    {
        Start = 1,
        Center = 2,
        End = 3,
        Stretch = 4
    }

    public enum BlockStyle
    {
        Primary = 1,
        Accent = 2,
        Info = 3,
        Warning = 4,
        Success = 5,
        Error = 6
    }

    public interface IBlock
    {
        string Id { get; }

        bool Enabled { get; }
        bool Visible { get; }

        Alignment HorizontalAlignment { get; }
        Alignment VerticalAlignment { get; }
        BlockThickness? Margin { get; }

        GridPlacement? MobileLayout { get; }
        GridPlacement? TabletLayout { get; }
        GridPlacement? DesktopLayout { get; }

        List<BlockBinding>? Bindings { get; }
        List<BlockInteraction>? Interactions { get; }
    }

    [NEObject]
    public abstract class Block : IBlock
    {
        public string Id { get; set; }

        public virtual bool Enabled { get; set; } = true;
        public virtual bool Visible { get; set; } = true;

        public virtual Alignment HorizontalAlignment { get; set; } = Alignment.Start;
        public virtual Alignment VerticalAlignment { get; set; } = Alignment.Start;
        public virtual BlockThickness? Margin { get; set; }

        public GridPlacement? MobileLayout { get; set; }
        public GridPlacement? TabletLayout { get; set; }
        public GridPlacement? DesktopLayout { get; set; }

        public List<BlockBinding>? Bindings { get; set; }
        public List<BlockInteraction>? Interactions { get; set; }

        public Block()
        {
            Id = Guid.NewGuid().ToString();
        }
    }

    public abstract class Block<T> : Block
        where T : Block<T>
    {
        public const string ContextProperty = "Context";

        public const string EnabledProperty = nameof(Enabled);
        public const string VisibleProperty = nameof(Visible);
        public const string HorizontalAlignmentProperty = nameof(HorizontalAlignment);
        public const string VerticalAlignmentProperty = nameof(VerticalAlignment);
        public const string MarginProperty = nameof(Margin);
        public const string MobileLayoutProperty = nameof(MobileLayout);
        public const string TabletLayoutProperty = nameof(TabletLayout);
        public const string DesktopLayoutProperty = nameof(DesktopLayout);

        public T Bind(string property, string path, BlockBindingMode mode = BlockBindingMode.OneWay)
        {
            Bindings ??= new List<BlockBinding>();
            Bindings.Add(new BlockBinding
            {
                Mode = mode,
                Target = new UIPath
                {
                    TargetType = GetPropertyType(property),
                    Id = Id,
                    Property = property
                },
                Path = path
            });

            return (T)this;
        }

        public T Bind<TConverter>(string property, string path, BlockBindingMode mode = BlockBindingMode.OneWay)
            where TConverter : class, IBindingValueConverter, new()
        {
            Bindings ??= new List<BlockBinding>();
            Bindings.Add(new BlockBinding
            {
                Mode = mode,
                Target = new UIPath
                {
                    TargetType = GetPropertyType(property),
                    Id = Id,
                    Property = property
                },
                Path = path,
                Converter = new TConverter()
            });

            return (T)this;
        }

        public T VisibleInteraction(string id, string property, InteractionType type = InteractionType.Required, object? value = null, bool invert = false)
        {
            return Interaction(VisibleProperty, id, property, type, value, invert);
        }

        public T EnabledInteraction(string id, string property, InteractionType type = InteractionType.Required, object? value = null, bool invert = false)
        {
            return Interaction(EnabledProperty, id, property, type, value, invert);
        }

        protected T Interaction(string targetProperty, string id, string sourceProperty, InteractionType type = InteractionType.Required, object? value = null, bool invert = false, string? error = null)
        {
            Interactions ??= new List<BlockInteraction>();
            Interactions.Add(new BlockInteraction
            {
                Target = new UIPath
                {
                    TargetType = UIPathType.Value,
                    Id = Id,
                    Property = targetProperty
                },
                Source = new UIPath
                {
                    TargetType = UIPathType.Value,
                    Id = id,
                    Property = sourceProperty
                },
                Type = type,
                Value = value,
                Invert = invert,
                Error = error
            });

            return (T)this;
        }

        protected virtual UIPathType GetPropertyType(string property)
        {
            if (property == ContextProperty)
                return UIPathType.Object;

            return UIPathType.Value;
        }
    }
}
