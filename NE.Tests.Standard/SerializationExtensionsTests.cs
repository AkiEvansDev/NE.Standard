using NE.Standard.Extensions;
using NE.Standard.Serialization;

namespace NE.Tests.Standard;

public class SerializationExtensionsTests
{
    [NEObject]
    public class Sample
    {
        public int Value { get; set; }
        public string? Text { get; set; }
    }

    [Fact]
    public void SerializeObject_RoundTrip()
    {
        var obj = new Sample { Value = 5, Text = "test" };
        string data = obj.SerializeObject();
        var res = data.DeserializeObject<Sample>();
        Assert.NotNull(res);
        Assert.Equal(obj.Value, res.Value);
        Assert.Equal(obj.Text, res.Text);
    }

    [Fact]
    public void SerializeJson_RoundTrip()
    {
        var obj = new Sample { Value = 1, Text = "json" };
        string json = obj.SerializeJson();
        var res = json.DeserializeJson<Sample>();
        Assert.NotNull(res);
        Assert.Equal(obj.Value, res?.Value);
        Assert.Equal(obj.Text, res?.Text);
    }

    [Fact]
    public void SerializeXml_RoundTrip()
    {
        var obj = new Sample { Value = 2, Text = "xml" };
        string xml = obj.SerializeXml();
        var res = xml.DeserializeXml<Sample>();
        Assert.NotNull(res);
        Assert.Equal(obj.Value, res?.Value);
        Assert.Equal(obj.Text, res?.Text);
    }
}
