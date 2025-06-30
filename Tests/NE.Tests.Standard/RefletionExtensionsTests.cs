using NE.Standard.Extensions;
using System.ComponentModel;
using System.Reflection;

namespace NE.Tests.Standard;

public class RefletionExtensionsTests
{
    private class Sample
    {
        public int Field;
        public string Property { get; set; } = string.Empty;
        [Description("sample attr")] public int Annotated { get; set; }
        public int ReadOnly { get; } = 1;
        [Description("field attr")] public int AnnotatedField;
    }

    [Fact]
    public void GetPropertyValue_ReturnsValue()
    {
        var s = new Sample { Property = "abc" };
        Assert.Equal("abc", s.GetPropertyValue("Property"));
        Assert.Equal("abc", s.GetPropertyValue<string>("Property"));
    }

    [Fact]
    public void SetPropertyValue_SetsValue()
    {
        var s = new Sample();
        s.SetPropertyValue("Property", "xyz");
        Assert.Equal("xyz", s.Property);
    }

    [Fact]
    public void GetFieldValue_ReturnsValue()
    {
        var s = new Sample { Field = 42 };
        Assert.Equal(42, s.GetFieldValue("Field"));
        Assert.Equal(42, s.GetFieldValue<int>("Field"));
    }

    [Fact]
    public void SetFieldValue_SetsValue()
    {
        var s = new Sample();
        s.SetFieldValue("Field", 5);
        Assert.Equal(5, s.Field);
    }

    [Fact]
    public void GetProperties_ReturnsFiltered()
    {
        var all = typeof(Sample).GetProperties().Select(p => p.Name);
        Assert.Contains("Property", all);
        Assert.Contains("Annotated", all);
        Assert.Contains("ReadOnly", all);

        var withSet = typeof(Sample).GetProperties(true).Select(p => p.Name);
        Assert.DoesNotContain("ReadOnly", withSet);

        var annotated = typeof(Sample).GetProperties<DescriptionAttribute>().ToList();
        Assert.Single(annotated);
        Assert.Equal("Annotated", annotated[0].Name);
    }

    [Fact]
    public void GetFields_ReturnsFiltered()
    {
        var fields = typeof(Sample).GetFields().Select(f => f.Name).ToList();
        Assert.Contains("Field", fields);
        Assert.Contains("AnnotatedField", fields);

        var annotated = typeof(Sample).GetFields<DescriptionAttribute>().ToList();
        Assert.Single(annotated);
        Assert.Equal("AnnotatedField", annotated[0].Name);
    }

    [Fact]
    public void GetAttribute_ReturnsAttribute()
    {
        var propAttr = typeof(Sample).GetProperty("Annotated")!.GetAttribute<DescriptionAttribute>();
        Assert.Equal("sample attr", propAttr.Description);

        var fieldAttr = typeof(Sample).GetField("AnnotatedField")!.GetAttribute<DescriptionAttribute>();
        Assert.Equal("field attr", fieldAttr.Description);
    }
}
