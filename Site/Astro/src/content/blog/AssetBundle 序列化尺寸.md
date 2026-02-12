---
title: "AssetBundle序列化尺寸"
date: 2020-06-23
updated: 2020-06-23
description: "上次的分析案例做的不够，变量太多。结果不具有指导意义，这里重新再弄一次"
categories:
  - Unity
tags:
  - AssetBundle
---


# AssetBundle 加载进内存的序列化文件分析
## Asset AssetBundle 序列化分析
---
### Texture 
纹理大小不一样
|AssetBundle|TextureSize| AssetBundleSize|SerializedFileSize|
|---|---|---|---|
|texture1|512 * 512| 176 KB |18.0 KB |
|texture2|1024 * 1024| 688 KB |18.0 KB |

### Shader 
以拷贝出来的的 Standard Shader 为标准，分别增加其 Properties 和 SubShader
|AssetBundle|ShaderInfo| AssetBundleSize|SerializedFileSize|
|---|---|---|---|
|shader1|Copy From Standard| 110 KB | **121.6 KB** |
|shader2|+ 40 Properties| 113 KB| **121.6 KB** |
|shader3|+ 20 SubShader| 519 KB |**121.6 KB** |

### Mesh 
顶点数量不同
|AssetBundle| MeshInfo |AssetBundleSize|SerializedFileSize|
|---|---|---|---|
|mesh1| 0 verts 0 tris |9 KB| **23.2 KB** |
|mesh2| 30000 verts 10000 tris| 419 KB| **23.2 KB** |

> Asset 打包进行 AssetBundle 的序列化文件，并不受资源内容尺寸影响，只与资源类型相关
---

### 复数资源的打包
|AssetBundle| Group |AssetBundleSize|SerializedFileSize|
|---|---|---|---|
|group1 |Texture1 + Mesh1 + Shader1 |289 KB| **129.4 KB** |
|group2 |Texture1 + Texture2 + Mesh1 + Mesh2 + Shader1 + Shader2 |1461 KB| **129.5 KB** |

> - 同类资源打包, 并不等于单个资源序列化后的文件之和，而是小于，推测有过一些压缩的方案。
> - 重复资源打包，增长量为 0.1KB , 推断同类型资源不会重复创建序列化文件， 增长的 0.1KB 应该是引用相关的数据

## Prefab AssetBundle 序列化分析
### Prefab 序列化尺寸 
空 Prefab
复数空 Prefab 尺寸
|AssetBundle| Info |AssetBundleSize|SerializedFileSize|
|---|---|---|---|
| prefab1| 空的 Gameobject | 5 KB | **18.3 KB** |
| prefabgroup | 100 个 空 Gameobject | 30 KB | **23 KB** |
> 100 个 Prefab 打包相比单个 Prefab ，增长量为 1.7 KB , 复数的 Prefab 合并打包不会创建重复的序列化文件

### Prefab 复杂化后的尺寸
|AssetBundle| Info |AssetBundleSize|SerializedFileSize|
|---|---|---|---|
| prefab1| 空的 Gameobject | 5 KB | **18.3 KB** |
| prefab2| 深度创建 1000 个 Child | 192 KB | **65.2 KB** |
| prefab3| 广度创建 1000 个 Child | 197 KB | **67.0 KB** |

> 1000 个 Gameobject 嵌套创建后相比空的 GameObject ，增长量为 46.9 KB ，广度嵌套相比增长再多 1.8 KB 。 对比上一个空 prefab 的测试， 100 个 prefab 增长约 5KB , 这里 1000 个 child 对应增长  46.9 KB 。Prefab 的复杂度增加也会增大序列化文件的尺寸

## MonoScript AssetBundle 序列化尺寸
|AssetBundle| Info |AssetBundleSize|SerializedFileSize|
|---|---|---|---|
| mono1 | 干净的 MonoScript | 6 KB | **20.1 KB** |
| mono2 | + 10 Vector3[] 序列化字段 | 7 KB | **20.8 KB** |
| mono3 | 每个序列化字段填入100个 vector3 | 19 KB | **20.8 KB** |
> 脚本的序列化只与序列化字段的的数量有关，字段内容并不被提前序列化后加载

## AssetBundle 中依赖关系的序列化分析
|AssetBundle| Info |AssetBundleSize|SerializedFileSize|
|---|---|---|---|
| reference1 | GameObject + Mono | 6 KB | **20.2 KB** |
| reference2 | GameObject + Mono + Texture | 178 KB | **21.6 KB** |
| reference3 | GameObject + Mono -> Texture | 178 KB | **21.6 KB** |
| reference4 | GameObject + Mono -> Texture(texture1) | 6 KB | **92.3 KB** |
| reference4 | GameObject + Mono -> Texture1(texture1) Texture2(texture2) | 6 KB | **92.4 KB** |
> - 包内依赖与包内引用没有大小的变化，推断引用关系不会被序列化或者是量级太小无法感知
> - 包之间的引用产生了一个 70.7 KB 的变化，这个变化不会随着包的引用数量而增加，查资料发现是有一个extern reference 的 buff 区域创建。 