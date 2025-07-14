using NE.Standard.Extensions;
using NE.Standard.Serialization;

namespace NE.Tests.Standard.Serialization;

[NEObject]
public class Dummy
{
    public string Name { get; set; } = "Test";
    public int Value { get; set; } = 42;
}

public class SerializationExtensionsTests
{
    [Fact]
    public void SerializeJson_And_DeserializeJson_Works()
    {
        var obj = new Dummy { Name = "Json", Value = 123 };
        var json = obj.SerializeJson();
        var deserialized = json.DeserializeJson<Dummy>();
        Assert.NotNull(deserialized);
        Assert.Equal(obj.Name, deserialized!.Name);
        Assert.Equal(obj.Value, deserialized.Value);
    }

    [Fact]
    public void SerializeXml_And_DeserializeXml_Works()
    {
        var obj = new Dummy { Name = "Xml", Value = 321 };
        var xml = obj.SerializeXml();
        var deserialized = xml.DeserializeXml<Dummy>();
        Assert.NotNull(deserialized);
        Assert.Equal(obj.Name, deserialized!.Name);
        Assert.Equal(obj.Value, deserialized.Value);
    }

    [Fact]
    public void SerializeObject_And_DeserializeObject_Works()
    {
        var obj = new Dummy { Name = "NES", Value = 111 };
        var serialized = obj.SerializeObject();
        var deserialized = serialized.DeserializeObject<Dummy>();
        Assert.NotNull(deserialized);
        Assert.Equal(obj.Name, deserialized!.Name);
        Assert.Equal(obj.Value, deserialized.Value);
    }

    [Fact]
    public void SerializeObject_WithoutBase64_Works()
    {
        var obj = new Dummy { Name = "Raw", Value = 222 };
        var serialized = obj.SerializeObject(useBase64: false);
        var deserialized = serialized.DeserializeObject<Dummy>(useBase64: false);
        Assert.NotNull(deserialized);
        Assert.Equal(obj.Name, deserialized!.Name);
    }

    [Fact]
    public void DeserializeXml_Throws_OnNullInput()
    {
        Assert.Throws<ArgumentNullException>(() => ((string)null!).DeserializeXml<Dummy>());
    }

    [Fact]
    public void SerializeXml_Throws_OnNullInput()
    {
        Dummy? nullDummy = null;
        Assert.Throws<ArgumentNullException>(() => nullDummy!.SerializeXml());
    }
}
