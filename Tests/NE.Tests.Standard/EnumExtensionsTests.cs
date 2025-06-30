
using NE.Standard.Extensions;
using System.ComponentModel;

namespace NE.Tests.Standard;

enum SampleEnum
{
    [Description("First value")]
    First,
    Second
}

public class EnumExtensionsTests
{
    private static readonly string[] sourceArray = ["First", "Second"];

    [Fact]
    public void GetName_ReturnsName()
    {
        Assert.Equal("First", SampleEnum.First.GetName());
    }

    [Fact]
    public void GetNames_ReturnsAllNames()
    {
        var names = SampleEnum.First.GetNames();
        Assert.Equal(sourceArray, names);
    }

    [Fact]
    public void GetValues_ReturnsAllValues()
    {
        var values = Enum.GetValues<SampleEnum>();
        Assert.Equal([SampleEnum.First, SampleEnum.Second], values);
    }

    [Fact]
    public void GetAttribute_ReturnsAttribute()
    {
        var attr = SampleEnum.First.GetAttribute<DescriptionAttribute>();
        Assert.Equal("First value", attr.Description);
    }
}
