# Changelog

The framework's changelog — the `core` slice. Every package in the slice carries the same version and goes out together. This file
holds only what is not released yet, under `## X.Y.Z`: the release workflow cuts that section out as the body of the GitHub release
(a tag with no section fails the release), and the notes of every released version live there —
https://github.com/AkiEvansDev/NE.Standard/releases. Other slices keep their own beside their sources (`addons/<Name>/CHANGELOG.md`).

## 2.1.1

- `RecursiveObservable` and value coercion: `ObjectToInferredTypesConverter.ToInferredNumber` and item-window filter unwrapping
  infer JSON numbers as `long` → `ulong` → `decimal` → `double` (preserving exact decimal fractions and 64-bit unsigned integers
  before falling back to IEEE-754); `RecursiveObservable()` attaches field-backed initial children in its base constructor across
  primary, explicit and generated constructors alike, while non-field-backed `[RecursiveMember(false)]` getters attach after
  construction or on path access (`UIOptionValue<T>` aligned with `UIValueItem<T>`); `RecursiveValueCoercion` handles `JsonElement`
  collections, invariant numeric strings and `DateTime` ↔ `DateTimeOffset` conversions without losing offset or kind.
- Server gates: refuse client clearing (`null` / `""`) on non-clearable single-choice controls (`TabsComponent`,
  `TabsViewComponent`, `RadioGroupComponent`, `StepsComponent`, `ButtonGroupComponent`, `ISelectableItemsComponent` in
  `UISelectionMode.One`, and `SelectComponent` / `SearchComponent` while `ShowClearButton` closes) unless an interaction targets
  the property or the held value is already empty; enforce `ISelectableItemsComponent.SelectionMode` on `SelectedKey` /
  `SelectedKeys`; enforce host-level `Draggable`, `Removable` and `Renamable` (with rename also opened per host/item by
  `TabsViewComponent.TabMenuEntries` including `Rename` or a compiled/dispatched `RenameItemEffect` while item `CanRename` still
  holds); hold `GridSplitterComponent.Position` client writes to finite `[0..1]` or `null` via `IClientWriteCheckComponent`; fix
  item-window filter term matching and query validation.
- Compiler, runtime, sessions and `NE.Standard.UI.Testing`: fix item and parent binding-scope resolution, `UIViewFingerprint`
  coverage of interactions/rules/slots, dotted-path item projections, `RuntimeScheduler` disposal races, `UserSessionSplitStore`
  update/cleanup edge cases, and `UITestPage` / `UITestRow` acting and reading parity.
- Web: register synthetic item-template bindings for client-rebuilt item controls (`ComponentItemsWriter`), fix scoped property
  patches, dynamic-parameter matching and default-word fallbacks, harden `ItemsRuleWatcher`, `ItemsTemplateRenderer` and
  `ItemsVirtualizationEngine` lifecycle cleanup, and fix responsive container spacing and spinner label rendering.
