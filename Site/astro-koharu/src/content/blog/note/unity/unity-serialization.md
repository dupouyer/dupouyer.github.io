---
title: Unity 序列化机制深度解析
link: unity-serialization
catalog: true
date: 2020-05-18 18:16:10
description: 深入探讨 Unity 的序列化原理，涵盖 MonoBehaviour 序列化规则、基础与自定义类型支持、ScriptableObject 的优势，以及如何处理字典等不可序列化类型。
tags:
  - Unity
  - 序列化
  - 性能优化
categories:
  - [笔记, Unity]
---

## 核心概念
序列化是为了将对象状态转化为一组字节，以便存储（内存、数据库、文件）或传输。在 Unity 中，大部分序列化过程是由引擎隐式完成的。

![序列化过程](/img/posts/unity-serialization/1.png)

## 序列化规则

### 1. 字段要求
符合以下条件的字段会被隐式序列化：
- **访问修饰符**: `public` 或带有 `[SerializeField]` 属性。
- **限制**: 不能是 `static`, `const` 或 `readonly`。
- **类型**: 必须是可序列化类型。

### 2. 支持的类型
- `UnityEngine.Object` 派生类。
- 带有 `[Serializable]` 的非抽象类/结构体。
- 基础数据类型（int, float, string, bool 等）。
- 泛型列表 `List<T>` 和数组 `Array`。

> [!WARNING]
> **Dictionaries** 默认无法被 Unity 序列化，即使添加了 `[SerializeField]`。

## 自定义序列化与问题

### 常见限制
- **递归引用**: 循环引用会由于不支持空引用而导致死循环，Unity 限制了最大深度为 7 层。
- **多态性**: 基类数组中的子类对象在序列化后可能退化为基类。
- **引用耦合**: 同一个对象在泛型列表中多次引用，反序列化后会变成多个独立对象。

### 解决方案：ScriptableObject
- **解耦**: 直接存储为 `.asset` 文件，无需挂载至 GameObject。
- **引用保持**: 序列化时创建的是对象引用，有效解决多态和耦合引用问题。

## 编辑器交互
Unity Editor 利用序列化数据在 Inspector 中显示和修改对象状态。

![Editor 序列化交互](/img/posts/unity-serialization/2.png)

### 常用编辑器 API
- **EditorWindow**: 创建自定义编辑窗口。
- **CustomEditor**: 定制类在 Inspector 中的展示。
- **PropertyDrawer**: 自定义特定字段类型的渲染方案。

## 进阶方案
- **实现 ISerializationCallbackReceiver**: 处理不可序列化类型（如字典分拆为两个 List）。
- **ISerializable**: 利用 .NET 原生序列化机制。
- **SerializeReference (Unity 2019.x+)**: 支持接口和抽象类的引用类型序列化。

---

> [!TIP]
> **最佳实践：**
> 理解序列化机制有助于减少反序列化后数据不一致导致的 Bug，并能通过合理利用 ScriptableObject 优化项目架构。
