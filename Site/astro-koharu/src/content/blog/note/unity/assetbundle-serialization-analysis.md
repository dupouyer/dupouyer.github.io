---
title: AssetBundle 序列化文件深度分析
link: assetbundle-serialization-analysis
catalog: true
date: 2020-06-19 16:22:34
description: 无论以何种方式加载，AssetBundle 都会在内存中创建 SerializedFile。本文通过多个案例探究了资源大小、Shader 类型以及组件多样性对序列化文件尺寸的具体影响规律。
tags:
  - Unity
  - AssetBundle
  - 深度分析
categories:
  - [笔记, Unity]
---

## 研究背景
当加载任何 AssetBundle 时，Unity 都会在内存中创建一个 **SerializedFile**。本研究旨在通过定量测试，分析影响该序列化文件尺寸的关键因素。

## 案例剖析

### 1. 资源素材大小
- **实验**: 将 512x512 和 1024x1024 的贴图分别独立打包。
- **结果**: 两个 AB 包加载后的 SerializedFile 均为 **18.0 KB**。
- **结论**: 序列化文件尺寸不受原始素材（Texture/Mesh 等）本身大小的影响。

### 2. 资源/Shader 类型
- **实验**: 使用不同类型的 Shader（Standard vs Legacy）。
- **结果**: 序列化文件尺寸保持一致。
- **结论**: 单个资源的类型差异通常不会直接引起序列化文件大小的变化。

### 3. 资源数量与多样性
- **实验**: 混合打包不同数量和类型的资源。
- **结果**: 随着包内 **Asset 类型**（而非数量）的增加，FileSize 会有小幅增长。

| 测试组合 | FileSize | 说明 |
| :--- | :--- | :--- |
| Texture 1 | 18.0 KB | 基础参考 |
| Texture 1 + Material 1 | 125.2 KB | 新增 Material 类型导致激增 |
| Texture 1+2 + Material 1+2 | 125.3 KB | 同类型增加，几乎不增长 |

### 4. 组件复杂度
针对 Prefab 打包，新增组件会导致尺寸显著变化：
- **新增组件**: 每次增加新的 Component 类型，都会相应增加 FileSize。
- **引用关系**: 引入从未出现过的资源类型会导致较大变化。
- **MonoScript**: 加载后的尺寸与脚本的 **数量和大小** 呈正相关，这是优化的关键点。

## 核心总结
`SerializedFile` 的主要影响因素是包体内 **资源/组件类型的多样性**，而非单一资源的素材尺寸。在项目优化中，应重点关注 **MonoScript** 的冗余程度以及包内引用关系的复杂度。
