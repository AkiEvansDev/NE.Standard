# Changelog

The framework's changelog — the `core` slice. Every package in the slice carries the same version and goes out together. This file
holds only what is not released yet, under `## X.Y.Z`: the release workflow cuts that section out as the body of the GitHub release
(a tag with no section fails the release), and the notes of every released version live there —
https://github.com/AkiEvansDev/NE.Standard/releases. Other slices keep their own beside their sources (`addons/<Name>/CHANGELOG.md`).

## 2.2.0

- `SelectComponent` and `MultiSelectComponent` implement `IFieldActionsComponent` (`Actions`, `ActionsPlacement`, `AddAction`,
  `AddActions`, `SetActions`, `ConfigureActions`, `SetActionsPlacement`), placing trailing action controls after a vertical rule past
  the clear (`×`) and chevron (`▾`) controls while keeping presses and keyboard focus inside action buttons/flyouts from toggling the
  dropdown (#271).
- `UIDialogs.Create`, `UIDialogs.Content`, `UIDialogs.Header` and their `Bound*` twins accept optional `params IVisualComponent[]
  trailing` controls placed in the dialog header before the close (`×`) button (#273).
- Web: fix composite slot scope resolution for nested `MenuItem.Items` sub-entries so `ContextMenu` and `Flyout` slots inside
  submenus compile and patch in their item's relative scope (#268); preserve keyboard focus-ring and glyph-overhang clip reach on
  `ScrollbarAir` containers (#269); place icon-only button badges in the top-right corner on borderless `Ghost`/`Link` buttons and
  inline with equal `10 px` insets on bordered/filled buttons and split buttons (#270); standardize full-height vertical dividers
  before trailing field controls (`NumberInput`, `TimeInput`, `DateInput`/`DateTimeInput`, `FileInput`, inline `ImageInput`, and
  `Select`/`MultiSelect` action slots) and align `Small` + `Underline` `ImageInput` row height.
