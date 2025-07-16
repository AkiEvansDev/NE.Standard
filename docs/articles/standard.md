# NE.Standard

**NE.Standard** is a modular, cross-platform .NET library providing essential helpers and utilities for application development.

---

## 🧩 Extensions

Low-level, high-performance extension methods for everyday .NET types:

- **Collections**: Efficient filtering, grouping, partitioning, sorted insert (ascending/descending), shuffling, parallel operations (`ParallelForEach`, `ParallelSelect`, etc.).
- **Strings**: Safe and flexible parsing, snake_case ↔ PascalCase, base64, robust type conversions (numbers, dates, enums).
- **Enums**: Reflection-based access to names, values, descriptions, and custom attributes.
- **Reflection**: Fast helpers for dynamic invocation, property/field access, and metadata inspection.
- **DateTime & TimeSpan**: Reliable formatting, boundary/trim utilities (e.g., `StartOfMonth`, `EndOfDay`).
- **Colors**: Hex conversion, lightness check, tint/shade adjustment.
- **Serialization**:
  - Custom binary serializer (`NESerializer`) with reference and type optimization.
  - Helpers for JSON/XML serialization and deserialization.

---

## 🚀 NESerializer: Advanced Binary-like Object Serialization

`NESerializer` is a custom, attribute-driven serializer designed for complex object graphs.

- **Features**:
  - Preserves object references (handles cycles, shared nodes).
  - Supports nested collections, dictionaries, primitives, and value types.
  - Type metadata is compressed for output size reduction.
  - Fine control via `[NEObject]` and `[NEIgnore]` attributes.
  - Optional Base64 encoding for safe storage/transmission.
  - Fast reflection, minimal allocations.
- **Typical use**: deep model snapshots, state saving, app data export/import.

---

## 📦 Types

Reusable, platform-agnostic types for modern .NET apps:

- **RecursiveObservable & RecursiveCollection**: Deep, hierarchical change tracking for nested object graphs.
- **LimitedStack\<T\>**: Fixed-capacity stack with auto-eviction.
- **WeakDelegate utilities**: Memory-leak safe event delegation (`WeakAction`, `WeakFunc`, etc.).
- **ReferenceComparer**: Identity-based equality comparer for reference types.

---

## 📁 I/O Utilities

Reliable, concise file and directory helpers:

- **FileHelper**:
  - Sync and async read/write.
  - Streamed line processing, filtering, and batch append.
- **DirectoryHelper**:
  - Safe recursive copy, move, delete.
  - Pattern-based file search.

All I/O methods feature strict path validation and guard clauses for robustness.

---

## 📝 Logging

Non-blocking, thread-safe asynchronous logging:

- **AsyncConsoleLogger**: Buffered colored console logging.
- **AsyncFileLogger**:
  - Daily log rotation and retention.
  - Buffered write and periodic flush for performance.
- **ILoggerProvider** adapters for DI and logging setup.

---

## Quality

All utilities are unit-testable, thread-safe where applicable, and come with detailed XML-docs for [docfx](https://dotnet.github.io/docfx/) documentation generation.
