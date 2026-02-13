---
title: 再探 AssetBundle 序列化尺寸规律
link: assetbundle-serialization-size
catalog: true
date: 2020-06-23 16:22:34
description: 针对先前实验变量过多的问题进行的二次精密测试。详细记录了 Texture、Shader、Mesh 及复数资源打包场景下的序列化尺寸数据，揭示了包内依赖与包间引用的内存占用差异。
tags:
  - Unity
  - AssetBundle
  - 内存分析
categories:
  - [笔记, Unity]
---

## 修正研究
为了获得更具指导意义的结论，本次测试严格控制单一变量，重新分析 AssetBundle 加载后的 SerializedFile 表现。

## 资源打包分析

### 1. 独立资源
| 资源类型 | 素材大小 | AB 大小 | SerializedFile 尺寸 |
| :--- | :--- | :--- | :--- |
| **Texture** | 512 -> 1024 | 176KB -> 688KB | **18.0 KB (无变化)** |
| **Shader** | Standard -> +SubShader | 110KB -> 519KB | **121.6 KB (无变化)** |
| **Mesh** | 0 -> 30000 顶点 | 9KB -> 419KB | **23.2 KB (无变化)** |

**结论**: 再次证实 SerializedFile 尺寸并不受资源内容尺寸影响，仅与资源类型相关。

### 2. 复数与重复资源
- **同类资源打包**: 综合体积小于单个独立文件之和，存在内置优化。
- **重复资源**: 增加量极小（~0.1KB），推断仅存储了引用数据，不会重复创建序列化描述。

## Prefab 打包分析
- **层级复杂度**: 1000 个子节点的 Prefab 序列化尺寸明显大于空 Prefab（18KB -> 65KB）。
- **节点数量**: 复杂度的增加会直接导致序列化文件臃肿。

## 脚本与依赖分析

### 1. MonoScript
- **规律**: 脚本序列化尺寸仅与 **序列化字段的数量** 有关。字段内的具体内容（如数组长度）并不影响此文件尺寸。

### 2. 依赖关系
- **包内依赖**: 几乎不产生额外尺寸感知。
- **包间引用 (Extern Reference)**: 会产生一个约 **70KB** 的额外增长。
- **原理**: 这是由于创建了一个 `External Reference Buffer` 区域。在分包策略上，应尽量考虑合包，避免复数的 External Reference Buffer 导致内存浪费。
