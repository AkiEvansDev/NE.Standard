using NE.Standard.Serialization;

namespace NE.Tests.Standard;

public class NESerializerTests
{
    private enum TestEnum
    {
        V1,
        V2,
        V3,
    }

    [NESerializable]
    private class TestSerializer
    {
        public bool V { get; set; }
        public int V1 { get; set; }
        [NEIgnore]
        public int V1Ignore { get; set; }
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

    private interface ITestClass
    {
        string? Text { get; set; }
    }

    [NESerializable]
    private class SubTestSerializerClass : ITestClass
    {
        public string? Text { get; set; }
    }

    [NESerializable]
    private struct SubTestSerializerStruct(string text)
    {
        public string? Text { get; set; } = text;
    }

    [Fact]
    public void SerializeDeserialize_DateTimeAndTimeSpan()
    {
        var serializer = new NESerializer();

        var obj = new TestSerializer
        {
            V = true,
            V1 = 1,
            V1Ignore = 1,
            V2 = 2.2f,
            V3 = 3.3,
            Text = "~[Test&^$(']",
            Date = new DateTime(2000, 1, 1),
            Time = new TimeSpan(1, 2, 3, 4, 5) - new TimeSpan(2, 3, 4, 5, 6),
            DateNull = null,
            Guid = Guid.NewGuid(),
            Enum = TestEnum.V3,
            Ints = [1, 2],
            Floats = [2.2f, 3.3f],
            TestInterface = new SubTestSerializerClass
            {
                Text = "~[Test&^$(']",
            },
            SubTestClass = new SubTestSerializerClass
            {
                Text = "~[Test&^$(']",
            },
            SubTestStruct = new SubTestSerializerStruct
            {
                Text = "~[Test&^$(']",
            },
            KeyValuePairs = new Dictionary<string, string>
            {
                { "1", "2" }
            }
        };

        var data = serializer.Serialize(obj);
        var obj2 = serializer.Deserialize<TestSerializer>(data);

        if (obj2.V == false)
            Assert.Fail();

        if (obj2.V1 != 1)
            Assert.Fail();

        if (obj2.V1Ignore == 1)
            Assert.Fail();

        if (obj2.V2 != 2.2f)
            Assert.Fail();

        if (obj2.V3 != 3.3)
            Assert.Fail();

        if (obj2.Text != "~[Test&^$(']")
            Assert.Fail();

        if (obj2.Date != new DateTime(2000, 1, 1))
            Assert.Fail();

        if (obj2.Time != new TimeSpan(1, 2, 3, 4, 5) - new TimeSpan(2, 3, 4, 5, 6))
            Assert.Fail();

        if (obj2.DateNull != null)
            Assert.Fail();

        if (obj2.Enum != TestEnum.V3)
            Assert.Fail();

        if (obj2.Ints?[0] != 1 || obj2.Ints[1] != 2)
            Assert.Fail();

        if (obj2.Floats?[0] != 2.2f || obj2.Floats[1] != 3.3f)
            Assert.Fail();

        if (obj2.TestInterface == null || obj2.TestInterface.Text != "~[Test&^$(']")
            Assert.Fail();

        if (obj2.SubTestClass == null || obj2.SubTestClass.Text != "~[Test&^$(']")
            Assert.Fail();

        if (obj2.SubTestStruct == null || obj2.SubTestStruct?.Text != "~[Test&^$(']")
            Assert.Fail();
    }

    [NESerializable]
    public class ReferenceTest
    {
        public string? Data { get; set; }

        public ReferenceTest SubData1 { get; set; }
        public ReferenceTest SubData2 { get; set; }
    }

    [NESerializable]
    public class ReferenceTestArray
    {
        public string? Data { get; set; }
        public Dictionary<string, ReferenceTestArrayItem> Items { get; set; }
    }

    [NESerializable]
    public class ReferenceTestArrayItem
    {
        public string? Data { get; set; }
        public ReferenceTestArray Parent { get; set; }
    }

    [Fact]
    public void TestReference1()
    {
        var serializer = new NESerializer();

        var r1 = new ReferenceTest
        {
            Data = "test1"
        };
        var r2 = new ReferenceTest
        {
            Data = "test2"
        };

        r1.SubData1 = r1;
        r1.SubData2 = r2;

        var data = serializer.Serialize(r1);
        var res = serializer.Deserialize<ReferenceTest>(data);

        res.SubData1.Data = "0";

        if (res.Data != "0")
            Assert.Fail();
    }

    [Fact]
    public void TestReference2()
    {
        var serializer = new NESerializer();

        var r1 = new ReferenceTest
        {
            Data = "test1"
        };
        var r2 = new ReferenceTest
        {
            Data = "test2"
        };

        r1.SubData1 = r2;
        r1.SubData2 = r2;

        var data = serializer.Serialize(r1);
        var res = serializer.Deserialize<ReferenceTest>(data);

        res.SubData2.Data = "0";

        if (res.SubData1.Data != "0")
            Assert.Fail();
    }

    [Fact]
    public void TestReference3()
    {
        var serializer = new NESerializer();

        var r1 = new ReferenceTest
        {
            Data = "test1"
        };
        var r2 = new ReferenceTest
        {
            Data = "test2"
        };

        r1.SubData1 = r2;
        r1.SubData2 = r2;

        var data = serializer.SerializeCopy(r1);
        var res = serializer.Deserialize<ReferenceTest>(data);

        res.SubData2.Data = "0";

        if (res.SubData1.Data == "0")
            Assert.Fail();
    }

    [Fact]
    public void TestReference4()
    {
        var serializer = new NESerializer();

        var r = new ReferenceTestArray
        {
            Data = "parent",
            Items = new Dictionary<string, ReferenceTestArrayItem>(),
        };

        var r1 = new ReferenceTestArrayItem
        {
            Data = "r1",
            Parent = r,
        };

        var r2 = new ReferenceTestArrayItem
        {
            Data = "r2",
            Parent = r,
        };

        r.Items.Add("1", r1);
        r.Items.Add("2", r2);
        r.Items.Add("3", r1);

        var data = serializer.Serialize(r);
        var res = serializer.Deserialize<ReferenceTestArray>(data);

        res.Data = "0";
        res.Items["1"].Data = "0";

        if (res.Items["1"].Parent.Data != "0")
            Assert.Fail();

        if (res.Items["3"].Data != "0")
            Assert.Fail();
    }
}
