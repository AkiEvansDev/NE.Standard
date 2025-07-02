using NE.Standard.Extensions;

namespace NE.Tests.Standard;

public class TimeSpanExtensionsTests
{
    [Fact]
    public void ToFormat_ReturnsFormattedString()
    {
        var span = new TimeSpan(1, 2, 3);
        Assert.Equal("01:02:03", span.ToFormat());
    }

    [Fact]
    public void IsZero_ReturnsTrueWhenZero()
    {
        Assert.True(TimeSpan.Zero.IsZero());
        Assert.False(new TimeSpan(0, 0, 1).IsZero());
    }

    [Fact]
    public void Abs_ReturnsAbsoluteValue()
    {
        var span = new TimeSpan(-1, 0, 0);
        Assert.Equal(new TimeSpan(1, 0, 0), span.Abs());
    }
}
