# Changelog

The framework's changelog — the `core` slice. Every package in the slice carries the same version and goes out together. This file
holds only what is not released yet, under `## X.Y.Z`: the release workflow cuts that section out as the body of the GitHub release
(a tag with no section fails the release), and the notes of every released version live there —
https://github.com/AkiEvansDev/NE.Standard/releases. Other slices keep their own beside their sources (`addons/<Name>/CHANGELOG.md`).

## 2.2.1

- Compiler, runtime and server gates: isolate submenu template slots (`MenuComponent.SubmenuTemplateKey`) and enforce server write/event
  gates on `MenuComponent`, `MultiSelectComponent`, `TabsComponent` and `KeyValueActionComponent` (#276); preserve `ServerFullResyncUIUpdate`
  across `ServerChangeSet.CoalesceWith` (#278); reload windowed item hosts when a bound `UIItemsView` or its filter/sort trigger source
  changes and when `Invalidate` runs on an end-anchored (`UIItemAnchor.End`) window (#277); skip `Scope` parameters when matching and
  materializing template slots in `UIRuntime.BuildInitialChangeSetNoLock` (`CompiledUIBindingParameterResolver.GetSlot`); detect
  conflicting route registrations at compile time; add `StepItem.DisabledWhen` overloads in `NE.Standard.UI.Extensions` and tighten
  4 px trailing icon-only button spacing in `UIPage.Header`, `UICard.Header` and `UILayout.Ends` (#276); fix `UITestPage.SetInputAsync`
  and `UIComponentQuery.IsVisible` in `NE.Standard.UI.Testing` (#279).
- Web: isolate pointer hover inside clickable surfaces, cards, file tiles and key-value rows when hovering nested interactive controls
  (#275); recompute `totalCount` on `UIItemAnchor.End` `Replace` window responses and grow scroll-anchored containers cleanly (#277);
  register item-template bindings in `initBindingIds` for `SelectComponent`, `MultiSelectComponent` and `SearchComponent` (#278); keep
  `aria-expanded` in sync on choice triggers, fix `action-bar-engine` hover state reset and vertical `tabs-view-engine` keyboard/scroll
  navigation, and enforce `IsCrossSiteRequest` on `WebValueEndpoint.ReadAsync` and `WebFileEndpoints.DownloadAsync`.
- Skill: generalize the framework skill to `skills/ne-standard/` (`SKILL.md`, `components.md`, and `references/*.md`) for all coding
  agents.
