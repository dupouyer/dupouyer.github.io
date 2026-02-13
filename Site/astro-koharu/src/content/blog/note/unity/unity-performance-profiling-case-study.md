---
title: Unity 性能检查实战案例分析
link: unity-performance-profiling-case-study
catalog: true
date: 2020-06-08 20:37:12
description: 通过一个具体的场景切换案例，详细介绍了如何使用 Unity Profiler 进行性能分析。涵盖了自定义 Sample 标记、逐帧耗时排查以及 Lua 与引擎交互的热点分析。
tags:
  - Unity
  - 性能优化
  - Profiler
categories:
  - [笔记, Unity]
---

## 测试工具
- **Unity Profiler**: 核心性能监测工具。

## 测试场景
从内城场景切换至指挥官界面时，测量流程帧区间与耗时。

## 开始测试

### 1. 流程区间
通过显式标记 `startSwitchScene` 和 `SwitchSceneComplete` 获得测试区间。
整个切换流程合计 **3 帧**，总耗时：**1184.36 ms**。

### 2. 自定义采样分析
为了精确定位，我们在代码中插入了以下自定义 Sample：
- `ShowLoadUI`
- `SceneBase.LeaveScene`
- `ClearMemory`
- `SceneBase.EnterScene`
- `Lua Call scene show/change`

## 逐帧耗时剖析

### 峰值帧分析 (第 71 帧)
在峰值帧中，我们观察到耗时最长的函数分布。

![Profiler 71 帧详情](/img/posts/unity-performance-profiling-case-study/1.png)

### 函数耗时 Top 5
| Sample | Time (ms) | 说明 |
| :--- | :--- | :--- |
| **Lua Call Scene Change** | 328.17 | **性能热点**: Lua 端业务响应 |
| **Loading.ReadObject** | 193.53 | 正常资源加载 |
| **WaitFrameClearMemory** | 111.43 | Lua GC 与内存清理 |
| **StartSwitchScene** | 92.00 | 音频加载异常疑似点 |
| **GC.Collect** | 29.17 | 引擎层 GC |

## 结论与建议
通过细化采样发现，主要的性能瓶颈在于 **Lua 响应场景切换事件** 的逻辑复杂度以及音频加载的潜在延迟。建议优化 Lua 端的初始化列表，并将音频加载改为异步或预加载模式。

![音频分析详情](/img/posts/unity-performance-profiling-case-study/2.png)
