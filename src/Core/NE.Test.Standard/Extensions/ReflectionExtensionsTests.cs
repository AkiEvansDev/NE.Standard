using NE.Standard.Extensions;
using System.ComponentModel;

namespace NE.Test.Standard.Extensions;

public class TestClass
{
    private string _privateField = "initial";
    public int Number { get; set; } = 42;

    [Obsolete]
    public string Name { get; set; } = "default";

    private string Echo(string input) => $"Echo: {input}";

    public string Concat(string a, string b) => a + b;

    public void SetPrivateField(string value) => _privateField = value;

    public string GetPrivateField() => _privateField;

    [Description("SpecialMethod")]
    public void AnnotatedMethod() { }
}

public class ReflectionExtensionsTests
{
    [Fact]
    public void InvokeMethod_ByName_WorksCorrectly()
    {
        var obj = new TestClass();
        var result = obj.InvokeMethod("Concat", "Hello", "World");
        Assert.Equal("HelloWorld", result);
    }

    [Fact]
    public void InvokeMethod_Generic_ReturnsCorrectType()
    {
        var obj = new TestClass();
        var result = obj.InvokeMethod<string>("Concat", "X", "Y");
        Assert.Equal("XY", result);
    }

    [Fact]
    public void GetPropertyValue_ReturnsCorrectValue()
    {
        var obj = new TestClass();
        var value = obj.GetPropertyValue("Number");
        Assert.Equal(42, value);
    }

    [Fact]
    public void SetPropertyValue_ChangesValue()
    {
        var obj = new TestClass();
        obj.SetPropertyValue("Number", 100);
        Assert.Equal(100, obj.Number);
    }

    [Fact]
    public void SetPropertyValue_Throws_WhenPropertyNotFound()
    {
        var obj = new TestClass();
        Assert.Throws<ArgumentException>(() => obj.SetPropertyValue("NotExists", 123));
    }

    [Fact]
    public void GetFieldValue_ReturnsPrivateField()
    {
        var obj = new TestClass();
        var value = obj.GetFieldValue("_privateField");
        Assert.Equal("initial", value);
    }

    [Fact]
    public void SetFieldValue_UpdatesPrivateField()
    {
        var obj = new TestClass();
        obj.SetFieldValue("_privateField", "changed");
        Assert.Equal("changed", obj.GetPrivateField());
    }

    [Fact]
    public void GetAllProperties_ReturnsAllProperties()
    {
        var props = typeof(TestClass).GetAllProperties().ToList();
        Assert.Contains(props, p => p.Name == "Number");
        Assert.Contains(props, p => p.Name == "Name");
    }

    [Fact]
    public void GetPropertiesWithAttribute_ReturnsAnnotated()
    {
        var props = typeof(TestClass).GetPropertiesWithAttribute<ObsoleteAttribute>().ToList();
        Assert.Single(props);
        Assert.Equal("Name", props[0].Name);
    }

    [Fact]
    public void GetFieldsWithAttribute_ReturnsNoneWhenNoMatch()
    {
        var fields = typeof(TestClass).GetFieldsWithAttribute<ObsoleteAttribute>().ToList();
        Assert.Empty(fields);
    }

    [Fact]
    public void HasAttribute_ReturnsTrueForAnnotatedMethod()
    {
        var method = typeof(TestClass).GetMethod("AnnotatedMethod");
        Assert.True(method!.HasAttribute<DescriptionAttribute>());
    }

    [Fact]
    public void GetAllMethods_ListsExpectedMethod()
    {
        var methods = typeof(TestClass).GetAllMethods().ToList();
        Assert.Contains(methods, m => m.Name == "Concat");
    }
}
