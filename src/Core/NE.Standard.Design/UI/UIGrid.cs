using NE.Standard.Design.Components;
using NE.Standard.Design.UI.Common;

namespace NE.Standard.Design.UI
{
    public sealed class UIGrid : Area<UIGrid>
    {
        public GridUnit[] Columns { get; set; } = default!;
        public GridUnit[] Rows { get; set; } = default!;

        public UIGrid()
        {
            Columns = new GridUnit[0];
            Rows = new GridUnit[0];
        }
    }
}
