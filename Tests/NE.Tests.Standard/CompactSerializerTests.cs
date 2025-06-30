using NE.Standard.Extensions;
using NE.Standard.Serialization;

namespace NE.Tests.Standard;

public class CompactSerializerTests
{
    [Fact]
    public void SerializeDeserialize_DateTimeAndTimeSpan()
    {
        var serializer = new CompactSerializer();
        var date = new DateTime(2024, 1, 2, 3, 4, 5, 200);
        var time = new TimeSpan(1, 2, 3);

        string dateData = serializer.Serialize(date, useBase64: false);
        string timeData = serializer.Serialize(time, useBase64: false);

        Assert.Contains(date.ToFormat(), dateData);
        Assert.Contains(time.ToFormat(), timeData);

        var roundDate = serializer.Deserialize<DateTime>(dateData, useBase64: false);
        var roundTime = serializer.Deserialize<TimeSpan>(timeData, useBase64: false);

        Assert.Equal(date, roundDate);
        Assert.Equal(time, roundTime);
    }
}
