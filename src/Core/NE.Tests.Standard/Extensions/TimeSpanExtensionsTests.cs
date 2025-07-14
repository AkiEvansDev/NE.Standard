using NE.Standard.Extensions;
using System.Globalization;

namespace NE.Test.Standard.Extensions;

public class TimeSpanExtensionsTests
{
    [Fact]
    public void ToFormat_UsesDefaultFormat_WhenNullProvided()
    {
        var span = new TimeSpan(2, 30, 45);
        var formatted = span.ToFormat();
        Assert.Equal("02:30:45", formatted);
    }

    [Fact]
    public void ToFormat_UsesCustomFormatAndCulture()
    {
        var span = new TimeSpan(1, 2, 3);
        var formatted = span.ToFormat(@"hh\:mm", CultureInfo.InvariantCulture);
        Assert.Equal("01:02", formatted);
    }

    [Theory]
    [InlineData(0, 0, 0, true)]
    [InlineData(0, 0, 1, false)]
    public void IsZero_ReturnsExpectedResult(int h, int m, int s, bool expected)
    {
        var span = new TimeSpan(h, m, s);
        Assert.Equal(expected, span.IsZero());
    }

    [Fact]
    public void Abs_ReturnsPositiveSpan()
    {
        var span = new TimeSpan(-1, -20, 0);
        var abs = span.Abs();
        Assert.Equal(new TimeSpan(1, 20, 0), abs);
    }
}
