---
title: Unity IL2CPP 代码剔除 (Stripping) 实践
link: stripping-with-il2cpp
catalog: true
date: 2020-06-02 11:26:52
description: 在 Unity 项目中使用 IL2CPP 后端时，包体体积往往会显著增加。本文介绍了如何通过 Managed Bytecode Stripping 优化包体大小，以及如何处理由此带来的反射引用丢失和 Prefab 引用失效等问题。
tags:
  - Unity
  - 优化
  - IL2CPP
categories:
  - [笔记, Unity]
---

## 优化目标
项目中为了减少打包后的包体大小，针对 IL2CPP 打包方案进行体积缩小的优化。

## 核心挑战
IL2CPP 虽在运行时性能上优于 Mono，但在代码量庞大时会导致包体（库文件）体积激增。

## 研究与测试

### 1. Attribute 剔除测试
一些老旧的测评提到 IL2CPP 在打包时会包含未引用的属性元数据。经过测试，在 Unity 2017+ 版本中，未使用的属性在反编译结果中并不会出现对应的声明，说明引擎已包含此类优化。

![使用属性验证](/img/posts/stripping-with-il2cpp/1.png)

### 2. Managed bytecode stripping
Unity 的 **Strip Engine Code** 选项通过 `UnityLinker`（基于 Mono IL Linker 改造）对引擎中未引用的代码进行静态分析和剔除。

![Strip Engine Code 配置](/img/posts/stripping-with-il2cpp/3.png)

#### 注意事项
- **反射引用**: 通过反射动态加载的类型可能会被误删，导致运行时报错。
- **资源 AB 包**: 一些类型仅在 Prefab 中被引用，而 Prefab 构建通常在 Linker 工作之前。如果 Linker 识别不到代码引用，该类型会被剔除。

## 实施方案
启用裁剪后进行全面测试。若出现类型丢失，可通过运行时抛出的 Class ID 并在 [ClassIDReference](https://docs.unity3d.com/Manual/ClassIDReference.html) 中查找。

### 修复方案：link.xml
在 `Assets` 目录下创建 `link.xml`，显式告知 `UnityLinker` 保留特定类型。

```xml
<?xml version="1.0" encoding="utf-8" ?>
<linker>
    <assembly fullname="UnityEngine">
        <type fullname="UnityEngine.Flare" preserve="all"/>
        <type fullname="UnityEngine.Avatar" preserve="all"/>
    </assembly>
</linker>
```

## 最终结果
经过精细化调整，最终包体成功缩小了 **34MB**。

![优化前体积对比](/img/posts/stripping-with-il2cpp/4.png)
![优化后体积对比](/img/posts/stripping-with-il2cpp/5.png)
