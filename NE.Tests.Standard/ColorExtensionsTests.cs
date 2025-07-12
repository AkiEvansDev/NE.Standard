using NE.Standard.Extensions;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NE.Tests.Standard;

public class ColorExtensionsTests
{
    [Fact]
    public void ToHexAndFromHex_PreservesColor()
    {
        var original = Color.FromArgb(128, 10, 20, 30);
        var hex = original.ToHex();
        var parsed = hex.FromHex();

        Assert.Equal(original.A, parsed.A);
        Assert.Equal(original.R, parsed.R);
        Assert.Equal(original.G, parsed.G);
        Assert.Equal(original.B, parsed.B);
    }

    [Fact]
    public void FromHex_WithoutAlpha_ParsesCorrectly()
    {
        var color = "#FF00FF".FromHex();
        Assert.Equal(255, color.A);
        Assert.Equal(255, color.R);
        Assert.Equal(0, color.G);
        Assert.Equal(255, color.B);
    }

    [Theory]
    [InlineData("#FFFFFFFF", 255, 255, 255, 255)]
    [InlineData("#00000000", 0, 0, 0, 0)]
    [InlineData("#00FF0080", 128, 255, 0, 0)]
    public void FromHex_ParsesVariousFormats(string hex, int a, int r, int g, int b)
    {
        var color = hex.FromHex();
        Assert.Equal(a, color.A);
        Assert.Equal(r, color.R);
        Assert.Equal(g, color.G);
        Assert.Equal(b, color.B);
    }

    [Fact]
    public void IsLight_ReturnsExpectedValues()
    {
        Assert.True(Color.White.IsLight());
        Assert.False(Color.Black.IsLight());
        Assert.False(Color.FromArgb(50, 50, 50).IsLight());
        Assert.True(Color.FromArgb(200, 200, 200).IsLight());
    }
}
