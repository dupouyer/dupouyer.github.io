---
title: 场景切换卡顿深度性能分析
link: scene-switching-performance-analysis
catalog: true
date: 2020-06-10 11:05:06
description: 本文记录了针对 Android 平台下场景切换卡顿（1-2s）的一次实战分析。通过 Unity Profiler 定位 Loading.ReadObject 瓶颈，并利用自定义采样函数精确定位热点代码。
tags:
  - Unity
  - 性能分析
  - 优化
categories:
  - [笔记, Unity]
---

## 游戏现状
从普通场景切换至主城场景时，玩家会感知到明显的 1-2s 卡顿。

## 分析与定位

### 1. 初步分析
通过 Unity Profiler 抓取切换区间的 CPU 消耗，发现 `Loading.ReadObject` 的耗时占比极高。初步判断性能热点在于资源加载过程。

### 2. 代码深度采样
在流程控制函数 `DelayEnterScene()` 中增加自定义采样点（Step1 - Step4），并对 Lua 端初始化逻辑增加 `Lua Call Main_City_Scene_Init` 标记。

**分析结果如下：**
![步骤 2 耗时详情](/img/posts/scene-switching-performance-analysis/2.png)
![步骤 3 耗时详情](/img/posts/scene-switching-performance-analysis/1.png)

### 3. 数据剖析
- **Step 2**: 主要耗时集中在同步加载场景的基础 Objects。
- **Step 3**: 集中在模型 Collider 及其动态建筑的实例化过程。

## 详细加载统计
统计了切换时每个 Resource 的加载耗时，结果显示：
- **总耗时**: ~837ms
- **Step 2 Loading.ReadObject**: 574ms
- **Step 3 Loading.ReadObject**: 229ms

![耗时统计 1](/img/posts/scene-switching-performance-analysis/3.png)
![耗时统计 2](/img/posts/scene-switching-performance-analysis/4.png)

## 结论
场景切换的卡顿主因在于大型场景 Prefab 的同步加载。优化方向应考虑资源拆分、分步加载或异步预加载策略。
