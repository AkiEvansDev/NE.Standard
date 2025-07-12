using NE.Standard.Extensions;
using System.ComponentModel;

namespace NE.Tests.Standard;

public class RefletionExtensionsTests
{
    public class Sample
    {
        public int Field;
        public string Property { get; set; } = string.Empty;
        
        [Description("sample attr")] public int Annotated { get; set; }
        public int ReadOnly { get; } = 1;
        
        [Description("field attr")]
        public int AnnotatedField;

        private string SecretMethod() => "secret";
        public string Echo(string input) => $"Echo: {input}";
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
    public void SetPropertyValue_ByType_Works()
    {
        var s = new Sample();
        typeof(Sample).SetPropertyValue(s, "Property", "value");
        Assert.Equal("value", s.Property);
    }

    [Fact]
    public void GetPropertyValue_ByType_Works()
    {
        var s = new Sample { Property = "ok" };
        var result = typeof(Sample).GetPropertyValue(s, "Property");
        Assert.Equal("ok", result);
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
    public void SetFieldValue_ByType_Works()
    {
        var s = new Sample();
        typeof(Sample).SetFieldValue(s, "Field", 123);
        Assert.Equal(123, s.Field);
    }

    [Fact]
    public void GetFieldValue_ByType_Works()
    {
        var s = new Sample { Field = 777 };
        var val = typeof(Sample).GetFieldValue(s, "Field");
        Assert.Equal(777, val);
    }

    [Fact]
    public void InvokeMethod_Works()
    {
        var s = new Sample();
        var result = s.InvokeMethod("Echo", "hello");
        Assert.Equal("Echo: hello", result);

        var typed = s.InvokeMethod<string>("Echo", "hi");
        Assert.Equal("Echo: hi", typed);
    }

    [Fact]
    public void InvokeMethod_ByType_Works()
    {
        var s = new Sample();
        var type = typeof(Sample);

        var result = type.InvokeMethod(s, "Echo", "test");
        Assert.Equal("Echo: test", result);

        var typed = type.InvokeMethod<string>(s, "Echo", "typed");
        Assert.Equal("Echo: typed", typed);
    }

    [Fact]
    public void PrivateMethod_InvokedSuccessfully()
    {
        var s = new Sample();
        var result = s.InvokeMethod("SecretMethod");
        Assert.Equal("secret", result);
    }

    [Fact]
    public void GetProperties_ReturnsFiltered()
    {
        var all = typeof(Sample).GetProperties().Select(p => p.Name);
        Assert.Contains("Property", all);
        Assert.Contains("Annotated", all);
        Assert.Contains("ReadOnly", all);

        var withSet = typeof(Sample).GetAllProperties(true).Select(p => p.Name);
        Assert.DoesNotContain("ReadOnly", withSet);

        var annotated = typeof(Sample).GetPropertiesWithAttribute<DescriptionAttribute>().ToList();
        Assert.Single(annotated);
        Assert.Equal("Annotated", annotated[0].Name);

        var property = typeof(Sample).GetPropertiesWithoutAttribute<DescriptionAttribute>().Select(p => p.Name).ToList();
        Assert.Contains("Property", property);
    }

    [Fact]
    public void GetFields_ReturnsFiltered()
    {
        var fields = typeof(Sample).GetAllFields().Select(f => f.Name).ToList();
        Assert.Contains("Field", fields);
        Assert.Contains("AnnotatedField", fields);

        var annotated = typeof(Sample).GetFieldsWithAttribute<DescriptionAttribute>().ToList();
        Assert.Single(annotated);
        Assert.Equal("AnnotatedField", annotated[0].Name);

        var field = typeof(Sample).GetFieldsWithoutAttribute<DescriptionAttribute>().Select(f => f.Name).ToList();
        Assert.Contains("Field", field);
    }

    [Fact]
    public void HasAttribute_ReturnsExpected()
    {
        var prop = typeof(Sample).GetProperty("Annotated");
        Assert.True(prop!.HasAttribute<DescriptionAttribute>());

        var field = typeof(Sample).GetField("AnnotatedField");
        Assert.True(field!.HasAttribute<DescriptionAttribute>());

        var nonMarkedProp = typeof(Sample).GetProperty("Property");
        Assert.False(nonMarkedProp!.HasAttribute<DescriptionAttribute>());
    }

    [Fact]
    public void InvalidAccess_Throws()
    {
        var s = new Sample();

        Assert.Throws<ArgumentException>(() => s.GetPropertyValue("NoSuchProperty"));
        Assert.Throws<ArgumentException>(() => s.SetFieldValue("NoSuchField", 1));
        Assert.Throws<ArgumentException>(() => s.InvokeMethod("NoSuchMethod"));
        Assert.Throws<ArgumentNullException>(() => ((string)null!).GetPropertyValue("abc"));
    }
}
