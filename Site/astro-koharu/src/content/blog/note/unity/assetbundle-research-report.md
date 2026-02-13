---
title: AssetBundle 系统性研究报告
link: assetbundle-research-report
catalog: true
date: 2020-06-24 14:32:32
description: 本文是对 Unity AssetBundle 系统的深度研究报告，涵盖了文件结构分析（Header, DataSegment）、压缩方案对比（LZMA, LZ4）以及加载过程中的内存分析与分包策略建议。
tags:
  - Unity
  - AssetBundle
  - 性能优化
categories:
  - [笔记, Unity]
---

# AssetBundle 文件结构

## 基本介绍

### The AssetBundle File
AssetBundle File 是一个包含多个文件的 **Archive**，其结构会有一些小的变化，取决于它是 Normal AssetBundle 还是 Scene AssetBundle。

**Normal AssetBundle**
![Normal AssetBundle Structure](/img/posts/assetbundle-research-report/1.png)

**Scene AssetBundle**
![Scene AssetBundle Structure](/img/posts/assetbundle-research-report/2.png)
场景包还包含了预加载数据（PreloadData）、共享数据（ShaderData）和全局光照数据（Global Illumination Data），并且针对场景及其内容的 Stream Loading 进行了优化。

### The Manifest File
对于每个生成的 AssetBundle 都会有对应的 Manifest Bundle 生成。文件内容以文本格式存储，可被任何文本编辑器打开。
Manifest 文件仅用于检查增量构建，运行时不需要。因此不需要打包进正式发行的游戏中。

每个 AssetBundle 都有一个 manifest 文件，包含如下信息：
- **CRC（循环冗余码）**: 资源文件的哈希码，在该 AssetBundle 中的所有资源有一个单一的哈希码，用于检查增量的构建。
- **Type tree 哈希码**: 在该 AssetBundle 中所有类型有一个单一的哈希码，用于检查增量的构建。
- **Class types**: 该 AssetBundle 中所有的类类型。当为 type tree 做增量构建检查时将产生一个新的哈希码。
- **Assets**: 该 AssetBundle 中所有明确包含的资源名字，依赖于该 AssetBundle 的其他 AssetBundle。
- **Dependencies**: 依赖列表。

文件内容大体如下所示：

```yaml
ManifestFileVersion: 0
CRC: 2422268106
Hashes:
  AssetFileHash:
    serializedVersion: 2
    Hash: 8b6db55a2344f068cf8a9be0a662ba15
  TypeTreeHash:
    serializedVersion: 2
    Hash: 37ad974993dbaa77485dd2a0c38f347a
HashAppended: 0
ClassTypes:
- Class: 91
  Script: {instanceID: 0}
Assets:
  Asset_0: Assets/Mecanim/StateMachine.controller
Dependencies: {}
```

## 文件结构分析
把压缩数据解开后，就和非压缩模式没有差别，下面只讨论非压缩格式：

AssetBundle 由两部分组成：**Header** 和 **DataSegment**。
- **Header**: 保存了版本号、数据类型、文件信息等描述信息。其中文件信息记录了单个资源文件的描述信息以及文件的 offset 和 size。通过这个信息可以直接获取到 AssetBundle 中的某一个文件的数据。
- **DataSegment**: 保存着实际的 Asset 文件内容。

文件头结构如下图：

![AssetBundle Compression File](/img/posts/assetbundle-research-report/5.png)

具体的序列化结构（C# 描述）：

```csharp
// 这里的 int 都是以小端编码的 4 字节整数（外部文件格式通常采用大端编码）

struct AssetBundleFileHead {
     struct LevelInfo {
         unsigned int PackSize;
         unsigned int UncompressedSize;
     };
     string FileID;
     unsigned int Version; // bundle格式版本 3.5~4.x : Version == 3
     string MainVersion;
     string BuildVersion;
     size_t MinimumStreamedBytes;
     size_t HeaderSize;
     size_t NumberOfLevelsToDownloadBeforeStreaming;
     size_t LevelCount;
     LevelInfo LevelList[];
     size_t CompleteFileSize;
     size_t FileInfoHeaderSize;
     bool Compressed;
};
```

## 压缩方案
AssetBundle 压缩后的大致文件组成：
![AssetBundle Compression File](/img/posts/assetbundle-research-report/3.png)

Unity 在打包 AssetBundle 时会默认以 LZMA 格式进行压缩，可以通过 `BuildAssetBundleOptions` 调整压缩方案：
- **LZMA (None)**: 体积最小，但需要整体解包，加载时间长。
- **Uncompressed**: 无压缩，包体大，加载最快。
- **LZ4 (ChunkBasedCompression)**: 基于分块（chunk）的算法，允许按需加载，是平衡体积与性能的推荐方案。

# AssetBundle 加载时的存储方案
Bundle 加载后，分为两部分存储：
- 一部分是 **Header**，以 `SerializedFile` 格式存储在内存中。
- 另一部分是 **AssetBundle Content**，依据不同的加载方式存储在内存或磁盘中。

## 加载 API 对比

| API | UnCompressed | LZ4 | LZMA |
| :--- | :--- | :--- | :--- |
| **WWW** | 内存：未压缩 | 内存：LZ4HC 压缩 | 内存：LZ4 压缩 |
| **CacheOrDownload** | 硬盘直读 | 硬盘直读 | 硬盘直读 |
| **LoadFromMemory** | 内存：未压缩 | 内存：LZ4HC 压缩 | 内存：LZ4 压缩（解压后） |
| **LoadFromFile** | 硬盘直读 | 硬盘直读 | 内存：LZ4 压缩（解压后） |
| **WebRequest** | Cache 直读 | Cache 直读 | 内存：LZ4 压缩 |

# AssetBundle 加载后的内存分析
![AssetBundle 内存分析](/img/posts/assetbundle-research-report/4.png)

## SerializedFile 分析
> 通过 Profile 抓取内存分析，对比不同资源类型对 SerializedFile 尺寸的影响（Unity 2017.4.x）。

### 资源类型与尺寸对比

| 资源类型 | AssetBundle | 说明 | SerializedFileSize |
| :--- | :--- | :--- | :--- |
| **Texture** | texture1 (512) | 尺寸不影响序列化文件 | 18.0 KB |
| **Shader** | shader1 (Standard) | 属性和 SubShader 增加不明显影响 | 121.6 KB |
| **Mesh** | mesh1 (0 verts) | 顶点数量不影响序列化文件 | 23.2 KB |

**结论**: Asset 打包后进入 AssetBundle 的序列化文件并不受资源内容尺寸影响，只与资源类型相关。

### 复数资源的打包
- **同类资源打包**: 并不等于单个资源序列化文件之和，通常会有压缩优化。
- **重复资源打包**: 增长极小，推断同类型资源不会重复创建序列化文件，仅增加引用数据。

### Prefab 序列化尺寸
- **复杂度影响**: Prefab 越复杂（Child 节点越多），序列化文件的尺寸也会相应增大。
- **层级结构**: 广度嵌套相比深度嵌套，序列化尺寸略有增加。

# 总结
- **推荐方案**: `LZ4` (ChunkBasedCompression) 在内存占用、包体大小和加载时间之间达到了很好的平衡。
- **分包策略**: 应更多考虑合包，避免产生过多的 `External Reference Buffer` 区域，从而减少内存浪费。

---

> [!TIP]
> **参考资料：**
> - [Unity3D asset bundle 格式简析](https://blog.codingnow.com/2014/08/unity3d_asset_bundle.html)
> - [Unite 2018 | 解析 AssetBundle](https://connect.unity.com/p/unite-2018-jie-xi-assetbundle)
