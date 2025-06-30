using NE.Standard.Extensions;

namespace NE.Tests.Standard;

enum ParseEnum { Alpha, Beta }

public class StringExtensionsTests
{
    [Fact]
    public void Conversions_WorkForValidAndInvalidData()
    {
        Assert.True("true".ToBool());
        Assert.False("foo".ToBool());
        Assert.True("true".ToNullableBool());
        Assert.Null("foo".ToNullableBool());

        Assert.Equal((byte)5, "5".ToByte());
        Assert.Equal((byte)0, "x".ToByte());
        Assert.Equal((byte)5, "5".ToNullableByte());
        Assert.Null("x".ToNullableByte());

        Assert.Equal((short)5, "5".ToShort());
        Assert.Equal((short)0, "x".ToShort());
        Assert.Equal((short)5, "5".ToNullableShort());
        Assert.Null("x".ToNullableShort());

        Assert.Equal(42, "42".ToInt());
        Assert.Equal(0, "x".ToInt());
        Assert.Equal(42, "42".ToNullableInt());
        Assert.Null("x".ToNullableInt());

        Assert.Equal(123L, "123".ToLong());
        Assert.Equal(0L, "x".ToLong());
        Assert.Equal(123L, "123".ToNullableLong());
        Assert.Null("x".ToNullableLong());

        Assert.Equal(1.5f, "1.5".ToFloat());
        Assert.Equal(0f, "x".ToFloat());
        Assert.Equal(1.5f, "1.5".ToNullableFloat());
        Assert.Null("x".ToNullableFloat());

        Assert.Equal(2.5, "2.5".ToDouble());
        Assert.Equal(0d, "x".ToDouble());
        Assert.Equal(2.5, "2.5".ToNullableDouble());
        Assert.Null("x".ToNullableDouble());

        Assert.Equal(3.5m, "3.5".ToDecimal());
        Assert.Equal(0m, "x".ToDecimal());
        Assert.Equal(3.5m, "3.5".ToNullableDecimal());
        Assert.Null("x".ToNullableDecimal());

        var dateStr = new DateTime(2024, 1, 2, 3, 4, 5).ToFormat();
        var date = dateStr.ToDate();
        Assert.Equal(new DateTime(2024, 1, 2, 3, 4, 5), date);
        Assert.Null("bad".ToNullableDate());

        var timeStr = new TimeSpan(1, 2, 3).ToFormat();
        var time = timeStr.ToTime();
        Assert.Equal(new TimeSpan(1, 2, 3), time);
        Assert.Null("bad".ToNullableTime());

        Assert.Equal(ParseEnum.Beta, "Beta".ToEnum<ParseEnum>());
        Assert.Equal(ParseEnum.Alpha, "Alpha".ToEnum<ParseEnum>());
    }

    [Fact]
    public void StringOperations_WorkAsExpected()
    {
        Assert.True("abc".EqualsIgnoreCase("ABC"));
        Assert.True("Hello".ContainsIgnoreCase("he"));
        Assert.True("Alpha Beta".Search("beta alp"));
        Assert.True("Alpha,Beta".Search("beta;gamma", ";"));
        Assert.Equal("Hello", "hello".UpFirst());
        Assert.Equal("world", "World".LowFirst());
        string? nullStr = null;
        Assert.True(nullStr.IsNull());
        Assert.Equal("fallback", nullStr.Empty("fallback"));
        Assert.True("a".AnyFrom(["b", "A"]));
        Assert.Equal(["a", "b", "c"], [.. "a,b,, c".SmartSplit(",")]);
        string base64 = "hi".ToBase64();
        Assert.Equal("hi", base64.FromBase64());
    }
}
