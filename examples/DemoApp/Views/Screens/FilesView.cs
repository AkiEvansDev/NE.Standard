using DemoApp.Controllers.Screens;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Templates;

namespace DemoApp.Views.Screens;

/// <summary>
/// An editor of the operator's files: the folders as a tree, the files open in a strip of tabs over the text, and a status line. The
/// strip is an items view, so every gesture on it — open, close, rename, pin, drag — is a change to one document the controller sees
/// and may refuse.
/// </summary>
internal sealed class FilesView : DemoScreenView, IUIViewDefinition
{
    public const string TabsId = "files-tabs";

    public static string ViewKey => "demo.screens.files";

    protected override string ComponentRoute => "/screens/files";
    protected override string Header => "demo.screens.files.header";
    protected override string HeaderDescription => "demo.screens.files.description";

    protected override IVisualComponent CreateScreen()
        => new ContainerComponent()
            .AddChild(CreateExplorer()
                .SetPlacement(UIResponsive<UIGridPlacement>.Create(UIGridPlacement.At(1, 1, 24, 1), md: UIGridPlacement.At(1, 1, 8, 1), xl: UIGridPlacement.At(1, 1, 6, 1)))
            )
            .AddChild(CreateEditor()
                .SetMargin(UIResponsive<UIThickness>.Create(UIThickness.All(0, 16, 0, 0), md: UIThickness.All(16, 0, 0, 0)))
                .SetPlacement(UIResponsive<UIGridPlacement>.Create(UIGridPlacement.At(1, 2, 24, 1), md: UIGridPlacement.At(9, 1, 16, 1), xl: UIGridPlacement.At(7, 1, 18, 1)))
            )
            .SetPadding(UIThickness.All(0, 8, 0, 24))
            .SetPlacement(1, 1, 24, 1);

    /// <summary>
    /// The folders and their files; a press on a file opens it. A folder takes no selection, so a press only folds it and the chosen
    /// row is always the open file — the same key the strip shows.
    /// </summary>
    private static SurfaceComponent CreateExplorer()
        => new SurfaceComponent()
            .SetSurface(UISurfaceStyle.Raised)
            .SetPadding(UIThickness.All(8, 8, 8, 12))
            .SetVerticalAlignment(UIAlignment.Start)
            .SetContent(UILayout.Stack(4,
                new ContainerComponent()
                    .SetColumn(24, UIGridUnit.Auto())
                    .SetPadding(UIThickness.All(8, 0, 0, 0))
                    .AddChild(UIText.Label("Explorer")
                        .SetVerticalAlignment(UIAlignment.Center)
                        .SetPlacement(1, 1, 23, 1)
                    )
                    .AddChild(UIButtons.Icon(DemoIcons.Outline(DemoIcons.Add), "New file")
                        .OnClick(nameof(FilesController.NewFile))
                        .SetVerticalAlignment(UIAlignment.Center)
                        .SetPlacement(24, 1, 1, 1)
                    ),
                new TreeComponent()
                    .BindItems(nameof(FilesController.Tree))
                    .SetSelectionMode(UISelectionMode.One)
                    .BindSelectedKey(nameof(FilesController.SelectedKey))
                    .AddNodeKind(FilesController.FolderKind, node => node.SetIconColor(DemoIcons.Warm))
                    .OnNodeClickWithItemKey(nameof(FilesController.OpenFile))
            ));

    /// <summary>
    /// The open files over their text, and the line under them: where the file lives and what the controller last did. The strip's
    /// menu is its own — Rename, Pin, Close — with the editor's Close others before Close.
    /// </summary>
    private static SurfaceComponent CreateEditor()
        => new SurfaceComponent()
            .SetSurface(UISurfaceStyle.Raised)
            .SetPadding(UIThickness.Uniform(0))
            .SetContent(UILayout.Stack(0,
                new TabsViewComponent(TabsId)
                    .BindItems(nameof(FilesController.Documents))
                    .BindSelectedKey(nameof(FilesController.SelectedKey))
                    .SetRenamable(true)
                    .SetDraggable(true)
                    .SetTabMenuEntries(UITabMenuEntries.Rename | UITabMenuEntries.Pin | UITabMenuEntries.Close)
                    .AddTabMenuEntries(new MenuItem { Id = FilesController.CloseOthersAction, Title = "Close others", Icon = DemoIcons.Outline(DemoIcons.Close) })
                    .OnTabMenuEntry(nameof(FilesController.TabAction))
                    .OnItemRemove(nameof(FilesController.CloseDocument))
                    .OnItemRename(nameof(FilesController.RenameDocument), UIAction.ArgCurrentItemKey("id"))
                    // The text is the document's own: an edit stays with its tab, as an editor's buffer does until it is saved.
                    .SetPageTemplate(new CodeInputComponent()
                        .BindValue(nameof(DemoFileDocument.Body), UIBindingScope.Relative)
                        .BindLanguage(nameof(DemoFileDocument.Language), UIBindingScope.Relative)
                        .SetStatusBar(false)
                        .SetRows(18)
                    )
                    .SetEmptyTemplate(new DefaultEmptyTemplate()
                        .SetIcon(DemoIcons.Outline(DemoIcons.File))
                        .SetTitle("No file is open")
                        .SetDescription("Press one in the tree, or make a new one.")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                    .SetMargin(UIThickness.All(8, 4, 8, 0)),
                new SeparatorComponent(),
                new ContainerComponent()
                    .SetColumn(24, UIGridUnit.Auto())
                    .SetPadding(UIThickness.All(16, 6, 16, 6))
                    .AddChild(new TextComponent()
                        .BindTitle(nameof(FilesController.Status))
                        .SetTitleType(UITextAppearance.Caption)
                        .SetTitleColor(UIThemeColor.Muted)
                        .SetVerticalAlignment(UIAlignment.Center)
                        .SetPlacement(1, 1, 23, 1)
                    )
                    .AddChild(new TextComponent()
                        .BindTitle(nameof(FilesController.Location))
                        .SetTitleType(UITextAppearance.Caption)
                        .SetTitleColor(UIThemeColor.Muted)
                        .SetVerticalAlignment(UIAlignment.Center)
                        .SetMargin(UIThickness.All(12, 0, 0, 0))
                        .SetPlacement(24, 1, 1, 1)
                    )
            ));
}
