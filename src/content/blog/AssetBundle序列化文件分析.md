---
title: AssetBundle序列化文件分析
date: 2020-06-19 16:22:34
updated: 2020-06-19 16:22:34
description: AssetBundle 在被加载后，不管通过何种方式加载，都会创建一个 AssetBundle 的 SerializedFile。 本文尝试对其 Size 受那些因素影响进行分析。
categories: Unity
tags: AssetBundle
---

# 前言
AssetBundle 在被加载后，不管通过何种方式加载，都会创建一个 AssetBundle 的 SerializedFile。 本文尝试对其 Size 受那些因素影响进行分析。

# 案例分析

## 资源大小
分别创建两个大小不同的贴图 Texture1 和 Texture2 分别打进 texture1 和 texture2 两个 ab 包中，加载后对比 Size

|AssetBundle|TextureSize|FileSize|ChangeSize|
|:---:|:---:|:---:|:---:|
|texture1|512 x 512|18.0 KB| ——|
|texture2|1024 x 1024|18.0 KB| 0KB|

> 两者没有变化，File 不受原始素材大小影响

## Shader 类型
创建创建使用两个不同 Shader 的 Material， 加载后对比

|AssetBundle|Shader|FileSize|ChangeSize|
|:---:|:--:|:---:|:---:|
|mat1|Standard|123.9 KB| ——|
|mat2|Legacy|123.9 KB| 0KB|

> 两者没有变化，File 不受 Shader 类型影响

## 多个 Assets
|Assets|FileSize|
|:---:|:---:|
|texture1|18.0 KB|
|texture2|18.0 KB|
|mat1|123.9 KB|
|mat2|123.9 KB|
|texture1 + mat1|125.2 KB|
|texture1 + texture2 + mat1 + mat2|125.3 KB|

> FileSize 只受包内 Asset 类型的影响与数量无关

## 组件类型
创建多个 prefab 并，组个增加不同的组件，进行对比

|AssetBundle|Component Change|FileSize|ChangeSize|
|:---:|:---|:---:|:---:|
|prefab1|+ GameObject|18.3 KB| —— |
|prefab2|+ MeshColider| 19.0 KB| 0.7 KB|
|prefab3|+ capsule | 91.0 KB| 72 KB|
|prefab4|+ MeshRender | 92.7 KB|  1.7 KB|
|prefab5|+ mat2 | 92.8 KB|  0.1 KB|
|prefab5| capsule -> cube| 92.8 KB|  0 KB|
|prefab5|+ mat1 | 92.8 KB|  0 KB|
|prefab5|+ MonoScript1 (2 kb) | 94.7 KB|  1.9 KB|
refab5|+ MonoScript2 (1 kb) | 95.3 KB|  0.6 KB|

1. 每次增加新的组件都会增加 Size
2. 资源的引入
    - capsule 资源的引入增加了大量 Size 变化
    - capsule 替换成 Cube 并没有 Size 变化
    > 新增类型的引入造成了 Size 的变化。
3. AssetBundle 资源引入
    - mat2 bundle 内容的资源引入增长量与mat2 bundle 的 FileSzie 不相符
    - 再次引入相同类型的资源 mat1 , 未增长
    > Bundle 类型的引入对 Size 影响非常小，且不受数量影响
4. 引入 MonoScript
    - Scirpt 每次引入都会增长 Size
    - Size 的增长与引入脚本的大小正相关

# 总结
AssetBundle 加载后创建的 SerializeFiled 受包体内资源类型的数量影响，Asset 的资源类型数量有限，并不会无限增长。需要注意的是 FileSize 的大小与 MonoScript 的大小，数量正相关，需要在打包时关注。