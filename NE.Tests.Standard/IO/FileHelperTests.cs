using NE.Standard.IO;

namespace NE.Tests.Standard.IO;

public class FileHelperTests : IDisposable
{
    private readonly string _testDir;

    public FileHelperTests()
    {
        _testDir = Path.Combine(Path.GetTempPath(), "FileHelperTests_" + Guid.NewGuid());
        Directory.CreateDirectory(_testDir);
    }

    [Fact]
    public void Create_WritesContentToFile()
    {
        string path = Path.Combine(_testDir, "test.txt");
        FileHelper.Create(path, "Hello");
        Assert.True(File.Exists(path));
        Assert.Equal("Hello", File.ReadAllText(path));
    }

    [Fact]
    public void Update_ChangesFileContent()
    {
        string path = Path.Combine(_testDir, "update.txt");
        File.WriteAllText(path, "Old");
        FileHelper.Update(path, "New");
        Assert.Equal("New", File.ReadAllText(path));
    }

    [Fact]
    public void Read_ReturnsContent()
    {
        string path = Path.Combine(_testDir, "read.txt");
        File.WriteAllText(path, "ReadThis");
        var content = FileHelper.Read(path);
        Assert.Equal("ReadThis", content);
    }

    [Fact]
    public void Delete_RemovesFile()
    {
        string path = Path.Combine(_testDir, "delete.txt");
        File.WriteAllText(path, "DeleteMe");
        FileHelper.Delete(path);
        Assert.False(File.Exists(path));
    }

    [Fact]
    public async Task WriteAsync_WritesContent()
    {
        string path = Path.Combine(_testDir, "async.txt");
        await FileHelper.WriteAsync(path, "AsyncContent");
        Assert.True(File.Exists(path));
        Assert.Equal("AsyncContent", File.ReadAllText(path));
    }

    [Fact]
    public async Task ReadAsync_ReadsContent()
    {
        string path = Path.Combine(_testDir, "read_async.txt");
        File.WriteAllText(path, "AsyncRead");
        var result = await FileHelper.ReadAsync(path);
        Assert.Equal("AsyncRead", result);
    }

    [Fact]
    public void FindLinesContaining_ReturnsMatchingLines()
    {
        string path = Path.Combine(_testDir, "lines.txt");
        File.WriteAllLines(path, ["first line", "second match", "third match"]);
        var matches = FileHelper.FindLinesContaining(path, "match").ToList();
        Assert.Equal(2, matches.Count);
    }

    [Fact]
    public void ProcessLines_AppliesActionToEachLine()
    {
        string path = Path.Combine(_testDir, "process.txt");
        File.WriteAllLines(path, ["line1", "line2"]);
        var collected = new List<string>();
        FileHelper.ProcessLines(path, line => collected.Add(line));
        Assert.Equal(2, collected.Count);
    }

    [Fact]
    public async Task ProcessLinesAsync_AppliesAsyncActionToEachLine()
    {
        string path = Path.Combine(_testDir, "process_async.txt");
        File.WriteAllLines(path, ["a", "b"]);
        var list = new List<string>();
        await FileHelper.ProcessLinesAsync(path, async line =>
        {
            await Task.Delay(10);
            list.Add(line);
        });
        Assert.Equal(2, list.Count);
    }

    [Fact]
    public void EnumerateLines_YieldsLines()
    {
        string path = Path.Combine(_testDir, "enumerate.txt");
        File.WriteAllLines(path, ["x", "y"]);
        var lines = FileHelper.EnumerateLines(path).ToList();
        Assert.Equal(2, lines.Count);
    }

    [Fact]
    public async Task ReadLinesAsync_YieldsLines()
    {
        string path = Path.Combine(_testDir, "readlines_async.txt");
        File.WriteAllLines(path, ["1", "2", "3"]);
        var list = new List<string>();
        await foreach (var line in FileHelper.ReadLinesAsync(path))
        {
            list.Add(line);
        }
        Assert.Equal(3, list.Count);
    }

    [Fact]
    public void AppendLinesBuffered_AppendsCorrectly()
    {
        string path = Path.Combine(_testDir, "append.txt");
        File.WriteAllText(path, "existing\n");
        FileHelper.AppendLinesBuffered(path, ["new1", "new2"]);
        var lines = File.ReadAllLines(path);
        Assert.True(lines.Length >= 3);
    }

    public void Dispose()
    {
        if (Directory.Exists(_testDir))
            Directory.Delete(_testDir, true);

        GC.SuppressFinalize(this);
    }
}
