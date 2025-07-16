using NE.Standard.Serialization;

namespace NE.Standard.Design.Common
{
    public enum UIPathType
    {
        Value = 1,
        Object = 2
    }

    [NEObject]
    public struct UIPath
    {
        public UIPathType TargetType { get; set; }
        public string Id { get; set; }
        public string Property { get; set; }
    }
}
