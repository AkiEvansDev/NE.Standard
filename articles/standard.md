# NE.Standard

**NE.Standard** is a cross-platform, modular .NET library that provides a broad set of foundational helpers and utilities.

---

## 🧩 Extensions

NE.Standard offers rich, low-level extension methods across common .NET types:

- **Collections**: Filtering, grouping, partitioning, sorted insertion (both ascending & descending), in-place shuffling, parallel processing (`ParallelForEach`, `ParallelSelect`, etc.).
- **Strings**: Advanced parsing and transformation, including snake_case ↔ PascalCase, base64 encoding, safe conversions to numbers, dates, enums.
- **Enums**: Reflection-based access to enum descriptions, values, and attributes.
- **Reflection**: Strong utility layer for invoking methods, accessing properties/fields dynamically.
- **DateTime & TimeSpan**: Safe formatting, boundary calculation (e.g., `StartOfMonth`, `TrimMilliseconds`).
- **Colors**: Hex conversion, tint/shade adjustment, lightness evaluation.
- **Serialization**: 
  - Custom serializer (`NESerializer`) with reference tracking and type compression.
  - JSON/XML serialization helpers.

---

## 📦 Types

Reusable types designed for platform-agnostic MVVM apps:

- **RecursiveObservable & RecursiveCollection**: Observable objects/collections with hierarchical change tracking.
- **LimitedStack\<T\>**: Bounded stack with automatic eviction on overflow.
- **WeakDelegate utilities**: Memory-safe event delegation (`WeakAction`, `WeakFunc`, etc.).

---

## 📁 I/O Utilities

Simple and robust tools for file and directory operations:

- **FileHelper**:
  - Synchronous and async read/write.
  - Line-level filtering, streaming, appending.
- **DirectoryHelper**:
  - Recursive copy/move/delete.
  - Pattern-based file search.

All utilities are built with guard clauses and consistent path validation for reliability.

---

## 📝 Logging

Thread-safe, non-blocking async loggers with modular backends:

- **AsyncConsoleLogger**: Buffered console logging with colored output.
- **AsyncFileLogger**:
  - Log rotation by day.
  - Retention policy (configurable).
  - Buffered I/O and flush loop.
- **ILoggerProvider** integrations for dependency injection and logging builder setup.

---

> Documentation generated with [DocFX](https://dotnet.github.io/docfx), powered by rich XML `<summary>` comments in the source code.

