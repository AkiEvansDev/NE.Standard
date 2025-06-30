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
}
