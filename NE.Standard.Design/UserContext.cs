using NE.Standard.Design.Styles;
using NE.Standard.Serialization;
using System.Collections.Generic;

namespace NE.Standard.Design
{
    [ObjectSerializable]
    public class UserContext
    {
        public UIStyleConfig UIStyle { get; set; } = default!;

        public Dictionary<string, object>? Options { get; set; }
        public Dictionary<string, bool>? Permissions { get; set; }

        public bool HasPermission(string key)
            => Permissions?.TryGetValue(key, out var allowed) == true && allowed;
    }
}
