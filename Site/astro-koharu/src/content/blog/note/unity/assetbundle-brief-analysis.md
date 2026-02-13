---
title: Unity AssetBundle 运行机制简析
link: assetbundle-brief-analysis
catalog: true
date: 2020-06-18 16:57:21
description: 本文深入浅出地讲解了 AssetBundle 的加载流程（从路径到对象，从对象到 Asset）、三种压缩格式（LZMA, LZ4, Uncompressed）在内存中的表现差异，以及如何正确地进行内存管理与卸载。
tags:
  - Unity
  - AssetBundle
  - 性能优化
categories:
  - [笔记, Unity]
---

## 加载流程
AssetBundle (AB) 的加载通常分为两步：
1. **创建对象**: 从目标路径（本地或远端）读取并生成 AssetBundle 对象。
2. **提取资产**: 从 AssetBundle 对象中 Load 具体的 Asset。

## 内存存储方案
AB 对象在内存中通常分为两个部分：
- **SerializedFile (Header)**: 包含 Bundle 的概览信息，始终驻留在内存中。
- **Bundle Content**: 依据加载方式（流式、全量解压等）存在于磁盘或内存中。

![SerializedFile 结构示意](/img/posts/assetbundle-brief-analysis/3.png)

## 加载 API 对比

### 1. AssetBundle.LoadFromFile
解压速度与内存占用受压缩格式影响：
- **LZMA**: 加载后会全量解压进入内存。测试显示内存增长约 **4.4MB**。
- **LZ4 (Chunk-compressed)**: 基于块读取，仅按需加载。内存增长仅 **0.5MB**。
- **Uncompressed**: 性能最高，内存增长约 **0.1MB**，但包体最大。

![LZMA 内存占用](/img/posts/assetbundle-brief-analysis/1.png)
![LZ4 内存占用](/img/posts/assetbundle-brief-analysis/2.png)

### 2. AssetBundle.LoadFromMemory
从 byte 数组创建。适用于加密资源解密后的临时加载，但会造成内存双倍占用（byte 数组 + 解压后的内容）。

## 卸载管理
合理的内存管理离不开及时的卸载。通过 `AssetBundle.Unload(bool)` 控制是否卸载已加载的资源实例。

![内存卸载示意图](/img/posts/assetbundle-brief-analysis/5.jpg)

## 总结
虽然压缩能减小包体，但在运行时会产生额外的解压开销和内存占用。在实际项目中，权衡包体大小与运行时性能，合理选择 LZ4 等压缩方式是最佳实践。
