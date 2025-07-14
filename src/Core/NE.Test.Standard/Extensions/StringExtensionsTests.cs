using NE.Standard.Extensions;
using System.Globalization;
using System.Linq;
using System.Text;
using Xunit;

namespace NE.Test.Standard.Extensions;

public class StringExtensionsTests
{
    [Theory]
    [InlineData("true", true)]
    [InlineData("False", false)]
    public void TryToBool_ParsesCorrectly(string input, bool expected)
    {
        Assert.True(input.TryToBool(out var result));
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("123", 123)]
    [InlineData("0", 0)]
    public void TryToInt_ParsesCorrectly(string input, int expected)
    {
        Assert.True(input.TryToInt(out var result));
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("123.45", 123.45)]
    [InlineData("123,45", 123.45)]
    public void TryToDouble_ParsesCorrectly_WithCommaSupport(string input, double expected)
    {
        Assert.True(input.TryToDouble(out var result));
        Assert.Equal(expected, result, 2);
    }

    [Fact]
    public void TryToDate_ParsesFormattedDate()
    {
        string input = "2024-01-01T12:30:00.0000000";
        Assert.True(input.TryToDate(out var result));
        Assert.Equal(new DateTime(2024, 1, 1, 12, 30, 0), result);
    }

    [Fact]
    public void EqualsIgnoreCase_WorksCorrectly()
    {
        Assert.True("hello".EqualsIgnoreCase("HELLO"));
    }

    [Fact]
    public void ContainsIgnoreCase_FindsSubstring()
    {
        Assert.True("Test STRING".ContainsIgnoreCase("string"));
    }

    [Fact]
    public void Search_FindsWord()
    {
        Assert.True("quick brown fox".Search("fox jump"));
    }

    [Fact]
    public void Search_WithSeparator_FindsToken()
    {
        Assert.True("alpha-bravo-charlie".Search("BRAVO", "-"));
    }

    [Theory]
    [InlineData("hello", "Hello")]
    [InlineData("Hello", "Hello")]
    public void UpFirst_CapitalizesFirstLetter(string input, string expected)
    {
        Assert.Equal(expected, input.UpFirst());
    }

    [Theory]
    [InlineData("Hello", "hello")]
    [InlineData("hello", "hello")]
    public void LowFirst_LowercasesFirstLetter(string input, string expected)
    {
        Assert.Equal(expected, input.LowFirst());
    }

    [Fact]
    public void ToSnakeCase_ConvertsProperly()
    {
        Assert.Equal("hello_world", "HelloWorld".ToSnakeCase());
    }

    [Fact]
    public void ToPascalCase_ConvertsProperly()
    {
        Assert.Equal("HelloWorld", "hello_world".ToPascalCase());
    }

    [Fact]
    public void UniqueFrom_AppendsIndexIfDuplicate()
    {
        var existing = new List<string> { "item", "item#1" };
        var unique = "item".UniqueFrom(existing);
        Assert.Equal("item#2", unique);
    }

    [Fact]
    public void AnyFrom_FindsMatch()
    {
        Assert.True("test".AnyFrom(["one", "TEST", "three"]));
    }

    [Fact]
    public void SmartSplit_SplitsAndTrims()
    {
        var result = " a ; b ; ;c ".SmartSplit(";");
        Assert.Equal(["a", "b", "c"], result);
    }

    [Fact]
    public void Base64EncodeDecode_WorksCorrectly()
    {
        var original = "NE";
        var encoded = original.ToBase64();
        var decoded = encoded.FromBase64();
        Assert.Equal(original, decoded);
    }
}
