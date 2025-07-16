using NE.Standard.Design.Components;
using System;
using System.Collections.Generic;
using System.Text;

namespace NE.Standard.Design.UI
{
    public class LabelBlock<T> : Block<T>
        where T : LabelBlock<T>
    {
        public const string LabelProperty = nameof(Label);
        public const string DescriptionProperty = nameof(Description);

        public string Label { get; set; } = default!;
        public string? Description { get; set; }
    }

    public sealed class LabelBlock : LabelBlock<LabelBlock> { }
}
