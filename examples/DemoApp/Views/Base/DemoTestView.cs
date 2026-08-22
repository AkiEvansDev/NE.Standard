namespace DemoApp.Views.Base;

internal abstract class DemoTestView : DemoView
{
    protected sealed override DemoViewKind ViewKind => DemoViewKind.Test;
}

internal abstract class DemoWindowView : DemoView
{
    protected sealed override DemoViewKind ViewKind => DemoViewKind.Window;
}
