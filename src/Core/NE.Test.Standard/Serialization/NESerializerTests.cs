using NE.Standard.Serialization;

namespace NE.Test.Standard.Serialization;

public enum TestEnum { V1, V2, V3 }

public interface ITestClass { string? Text { get; set; } }

[NEObject]
public class SubTestSerializerClass : ITestClass { public string? Text { get; set; } }

[NEObject]
public struct SubTestSerializerStruct { public string? Text { get; set; } }

[NEObject]
public class TestSerializer
{
    public bool V { get; set; }
    public int V1 { get; set; }
    public int? V1Null { get; set; }
    public int? V1NullValue { get; set; }
    [NEIgnore] public int V1Ignore { get; set; }
    public float V2 { get; set; }
    public double V3 { get; set; }
    public string? Text { get; set; }
    public DateTime Date { get; set; }
    public TimeSpan Time { get; set; }
    public DateTime? DateNull { get; set; }
    public Guid Guid { get; set; }
    public TestEnum Enum { get; set; }
    public int[]? Ints { get; set; }
    public List<float>? Floats { get; set; }
    public ITestClass? TestInterface { get; set; }
    public SubTestSerializerClass? SubTestClass { get; set; }
    public SubTestSerializerStruct? SubTestStruct { get; set; }
    public IDictionary<string, string>? KeyValuePairs { get; set; }
}

[NEObject]
public class ReferenceTest
{
    public string? Data { get; set; }
    public ReferenceTest? SubData1 { get; set; }
    public ReferenceTest? SubData2 { get; set; }
}

[NEObject]
public class ReferenceTestArray
{
    public string? Data { get; set; }
    public Dictionary<string, ReferenceTestArrayItem>? Items { get; set; }
}

[NEObject]
public class ReferenceTestArrayItem
{
    public string? Data { get; set; }
    public ReferenceTestArray? Parent { get; set; }
}

public class NESerializerTests
{
    private static TestSerializer CreateSampleObject(Guid guid, string marker)
    {
        var text = $"~[{marker}]";
        return new TestSerializer
        {
            V = true,
            V1 = 1,
            V1Null = null,
            V1NullValue = 2,
            V1Ignore = 123,
            V2 = 2.2f,
            V3 = 3.3,
            Text = text,
            Date = new DateTime(2000, 1, 1),
            Time = new TimeSpan(1, 2, 3, 4, 5) - new TimeSpan(2, 3, 4, 5, 6),
            DateNull = null,
            Guid = guid,
            Enum = TestEnum.V3,
            Ints = [1, 2],
            Floats = [2.2f, 3.3f],
            TestInterface = new SubTestSerializerClass { Text = text },
            SubTestClass = new SubTestSerializerClass { Text = text },
            SubTestStruct = new SubTestSerializerStruct { Text = text },
            KeyValuePairs = new Dictionary<string, string> { { "1", "2" } }
        };
    }

    [Fact]
    public void SerializeDeserialize_AllTypes()
    {
        var serializer = new NESerializer();
        var guid = Guid.NewGuid();
        var obj = CreateSampleObject(guid, "Test&^$('");
        var data = serializer.Serialize(obj);
        var result = serializer.Deserialize<TestSerializer>(data);

        Assert.NotNull(result);
        Assert.True(result!.V);
        Assert.Equal(1, result.V1);
        Assert.Null(result.V1Null);
        Assert.Equal(2, result.V1NullValue);
        Assert.NotEqual(123, result.V1Ignore);
        Assert.Equal(2.2f, result.V2);
        Assert.Equal(3.3, result.V3);
        Assert.Equal(obj.Text, result.Text);
        Assert.Equal(obj.Date, result.Date);
        Assert.Equal(obj.Time, result.Time);
        Assert.Null(result.DateNull);
        Assert.Equal(TestEnum.V3, result.Enum);
        Assert.Equal(obj.Ints, result.Ints);
        Assert.Equal(obj.Floats, result.Floats);
        Assert.Equal(obj.TestInterface?.Text, result.TestInterface?.Text);
        Assert.Equal(obj.SubTestClass?.Text, result.SubTestClass?.Text);
        Assert.Equal(obj.SubTestStruct?.Text, result.SubTestStruct?.Text);
    }

    [Fact]
    public void Serialize_PreservesSelfReference()
    {
        var serializer = new NESerializer();
        var r1 = new ReferenceTest { Data = "test1" };
        var r2 = new ReferenceTest { Data = "test2" };
        r1.SubData1 = r1;
        r1.SubData2 = r2;

        var res = serializer.Deserialize<ReferenceTest>(serializer.Serialize(r1));
        res!.SubData1!.Data = "0";
        Assert.Equal("0", res.Data);
    }

    [Fact]
    public void Serialize_PreservesSharedReference()
    {
        var serializer = new NESerializer();
        var r2 = new ReferenceTest { Data = "test2" };
        var r1 = new ReferenceTest { Data = "test1", SubData1 = r2, SubData2 = r2 };

        var res = serializer.Deserialize<ReferenceTest>(serializer.Serialize(r1));
        res!.SubData2!.Data = "0";
        Assert.Equal("0", res.SubData1?.Data);
    }

    [Fact]
    public void SerializeCopy_CreatesDeepCopy()
    {
        var serializer = new NESerializer();
        var r2 = new ReferenceTest { Data = "test2" };
        var r1 = new ReferenceTest { Data = "test1", SubData1 = r2, SubData2 = r2 };

        var res = serializer.Deserialize<ReferenceTest>(serializer.SerializeCopy(r1));
        res!.SubData2!.Data = "0";
        Assert.NotEqual("0", res.SubData1?.Data);
    }

    [Fact]
    public void Serialize_PreservesCollectionReferences()
    {
        var serializer = new NESerializer();
        var r = new ReferenceTestArray { Data = "parent", Items = new() };
        var r1 = new ReferenceTestArrayItem { Data = "r1", Parent = r };
        var r2 = new ReferenceTestArrayItem { Data = "r2", Parent = r };

        r.Items!.Add("1", r1);
        r.Items!.Add("2", r2);
        r.Items!.Add("3", r1);

        var res = serializer.Deserialize<ReferenceTestArray>(serializer.Serialize(r));
        res!.Data = "0";
        res.Items!["1"].Data = "0";

        Assert.Equal("0", res.Items["1"].Parent?.Data);
        Assert.Equal("0", res.Items["3"].Data);
    }

    [Fact]
    public void SerializeDeserialize_NullableAndEmptyCollections()
    {
        var serializer = new NESerializer();
        var obj = new TestSerializer
        {
            Ints = null,
            Floats = new List<float>(),
            KeyValuePairs = null
        };
        var data = serializer.Serialize(obj);
        var result = serializer.Deserialize<TestSerializer>(data);
        Assert.Null(result!.Ints);
        Assert.Empty(result.Floats!);
        Assert.Null(result.KeyValuePairs);
    }

    [Fact]
    public void Deserialize_Throws_OnInvalidInput()
    {
        var serializer = new NESerializer();
        Assert.Throws<FormatException>(() => serializer.Deserialize<TestSerializer>("badstring"));
        Assert.Throws<Exception>(() => serializer.Deserialize<TestSerializer>("", false));
    }
}
