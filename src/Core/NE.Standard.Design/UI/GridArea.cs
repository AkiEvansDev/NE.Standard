using NE.Standard.Design.Common;
using NE.Standard.Design.Components;
using System;
using System.Collections.Generic;

namespace NE.Standard.Design.UI
{
    public sealed class GridArea : Area<GridArea>
    {
        public List<GridUnit> Columns { get; set; }
        public List<GridUnit> Rows { get; set; }

        public GridArea()
        {
            Columns = new List<GridUnit>(24);
            Rows = new List<GridUnit>(24);
        }

        public GridArea AddColumn(UnitType unit, double value)
        {
            if (Columns.Count == 24)
                throw new ArgumentOutOfRangeException(nameof(Columns.Count));

            Columns.Add(new GridUnit(unit, value));
            return this;
        }

        public GridArea AddRow(UnitType unit, double value)
        {
            if (Rows.Count == 24)
                throw new ArgumentOutOfRangeException(nameof(Rows.Count));

            Rows.Add(new GridUnit(unit, value));
            return this;
        }
    }
}
