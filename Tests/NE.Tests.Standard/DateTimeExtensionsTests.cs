using NE.Standard.Extensions;

namespace NE.Tests.Standard;

public class DateTimeExtensionsTests
{
    [Fact]
    public void ToFormat_ReturnsFormattedString()
    {
        var date = new DateTime(2024,1,2,3,4,5);
        Assert.Equal("2024/01/02", date.ToFormat("yyyy/MM/dd"));
    }

    [Fact]
    public void UnixTimeConversions_RoundTrip()
    {
        var date = new DateTime(1970,1,1,0,0,1,DateTimeKind.Utc);
        long seconds = date.ToUnixTimeSeconds();
        long millis = date.ToUnixTimeMilliseconds();
        Assert.Equal(1, seconds);
        Assert.Equal(1000, millis);
        Assert.Equal(date, seconds.FromUnixTimeSeconds());
        Assert.Equal(date, millis.FromUnixTimeMilliseconds());
    }

    [Fact]
    public void DayAndMonthBoundaries_ReturnExpectedValues()
    {
        var date = new DateTime(2024,2,15,10,20,30);
        Assert.Equal(new DateTime(2024,2,15), date.StartOfDay());
        Assert.Equal(new DateTime(2024,2,15,23,59,59,999).AddTicks(9999), date.EndOfDay());
        Assert.Equal(new DateTime(2024,2,1), date.StartOfMonth());
        Assert.Equal(new DateTime(2024,2,29,23,59,59,999).AddTicks(9999), date.EndOfMonth());
    }
}
