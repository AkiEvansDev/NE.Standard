using NE.Standard.Extensions;
using System.Globalization;

namespace NE.Test.Standard.Extensions;

public class DateTimeExtensionsTests
{
    [Fact]
    public void ToFormat_UsesDefaultFormat_WhenFormatIsNull()
    {
        var date = new DateTime(2024, 1, 1, 13, 45, 0);
        var formatted = date.ToFormat(null, null);
        Assert.Equal("2024-01-01T13:45:00.0000000", formatted);
    }

    [Fact]
    public void ToFormat_UsesProvidedFormatAndCulture()
    {
        var date = new DateTime(2024, 1, 1, 13, 45, 0);
        var formatted = date.ToFormat("dd MMM yyyy", new CultureInfo("en-US"));
        Assert.Equal("01 Jan 2024", formatted);
    }

    [Fact]
    public void ToUnixTimeSeconds_And_FromUnixTimeSeconds_AreConsistent()
    {
        var date = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        var unix = date.ToUnixTimeSeconds();
        var restored = unix.FromUnixTimeSeconds();

        Assert.Equal(date, restored);
    }

    [Fact]
    public void ToUnixTimeMilliseconds_And_FromUnixTimeMilliseconds_AreConsistent()
    {
        var date = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        var unixMs = date.ToUnixTimeMilliseconds();
        var restored = unixMs.FromUnixTimeMilliseconds();

        Assert.Equal(date, restored);
    }

    [Fact]
    public void StartOfDay_ReturnsBeginningOfDay()
    {
        var date = new DateTime(2024, 1, 1, 13, 30, 45, 123);
        var start = date.StartOfDay();

        Assert.Equal(new DateTime(2024, 1, 1, 0, 0, 0), start);
    }

    [Fact]
    public void EndOfDay_ReturnsLastTickOfDay()
    {
        var date = new DateTime(2024, 1, 1);
        var end = date.EndOfDay();

        Assert.Equal(new DateTime(2024, 1, 1).AddDays(1).AddTicks(-1), end);
    }

    [Fact]
    public void StartOfMonth_ReturnsFirstDayOfMonth()
    {
        var date = new DateTime(2024, 3, 15);
        var start = date.StartOfMonth();

        Assert.Equal(new DateTime(2024, 3, 1), start);
    }

    [Fact]
    public void EndOfMonth_ReturnsLastTickOfMonth()
    {
        var date = new DateTime(2024, 2, 15); // Leap year
        var end = date.EndOfMonth();

        Assert.Equal(new DateTime(2024, 3, 1).AddTicks(-1), end);
    }

    [Fact]
    public void TrimMilliseconds_RemovesMillisecondsComponent()
    {
        var date = new DateTime(2024, 1, 1, 10, 10, 10).AddMilliseconds(550);
        var trimmed = date.TrimMilliseconds();

        Assert.Equal(new DateTime(2024, 1, 1, 10, 10, 10), trimmed);
    }
}
