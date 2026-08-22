namespace DemoApp.Views.Base;

internal abstract class DemoExampleView : DemoView
{
    protected sealed override DemoViewKind ViewKind => DemoViewKind.Example;
}
