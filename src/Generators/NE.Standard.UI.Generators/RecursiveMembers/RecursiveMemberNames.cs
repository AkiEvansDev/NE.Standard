namespace NE.Standard.UI.Generators.RecursiveMembers;

internal static class RecursiveMemberNames
{
    public const string AttributeMetadataName = "NE.Standard.UI.Primitives.Annotations.RecursiveMemberAttribute";
    public const string RecursiveObservableMetadataName = "NE.Standard.UI.Abstractions.Recursive.RecursiveObservable";

    public const string PathSegmentTypeName = "global::NE.Standard.UI.Abstractions.Recursive.PathSegment";
    public const string PathSegmentKindTypeName = "global::NE.Standard.UI.Primitives.Recursive.PathSegmentKind";
    public const string RecursiveObservableTypeName = "global::NE.Standard.UI.Abstractions.Recursive.RecursiveObservable";

    public static string GetSegmentFieldName(string propertyName)
        => "__recursive" + propertyName + "Segment";
}
