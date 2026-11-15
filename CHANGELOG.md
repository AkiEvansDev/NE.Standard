# Changelog

Each section below becomes the GitHub release body for that tag and is removed from this file after the release is cut; published history lives on the [Releases page](https://github.com/AkiEvansDev/NE.Standard/releases).

## 2.8.2

- **Visible input captions and required markers with `SetHeaderAction` / `SetExpandable`**: unfolded the `Root > :is(.ui-input__header, .ui-input__header-row > .ui-input__header)` CSS selectors in `ui-input.less` and `FieldBoxPressEngine` into explicit child branches from the field root, restoring visible captions (`display: grid`), required `*` markers, and caption press-to-focus whenever `.ui-input__header` is wrapped inside `.ui-input__header-row` (as well as required markers on `TitlePlacement.Inside` fields).
- **Field-box alignment beside multi-control vertical stacks**: `UIViewCompilationContext` no longer treats a vertical `StackPanelComponent` containing additional buttons or inputs as a single uncaptioned control (`AlignWithFieldBoxes`), and `.ui-field-aligned` preserves horizontal `align-self` stretch inside vertical flex stacks.
