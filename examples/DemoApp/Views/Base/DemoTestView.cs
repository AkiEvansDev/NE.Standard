namespace DemoApp.Views.Base;

internal abstract class DemoTestView : DemoView
{
    protected sealed override DemoViewKind ViewKind => DemoViewKind.Test;
}
