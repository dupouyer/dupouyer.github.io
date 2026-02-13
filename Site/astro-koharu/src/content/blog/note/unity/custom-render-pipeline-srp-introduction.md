---
title: Unity 自定义渲染管线 (SRP) 入门简析
link: custom-render-pipeline-srp-introduction
catalog: true
date: 2021-06-20 15:43:51
description: 简要介绍了 Unity Scriptable Render Pipeline (SRP) 的基本概念、创建流程以及核心渲染步骤（裁剪、绘制、后处理），并对比了 URP 的特点。
tags:
  - Unity
  - SRP
  - 渲染管线
categories:
  - [笔记, Unity]
---

## SRP 介绍
Unity 的 **Scriptable Render Pipeline (SRP)** 是一项允许开发者通过 C# 脚本完全控制渲染流程的功能。在此基础上，Unity 提供了 URP (通用渲染管线) 和 HDRP (高清渲染管线) 两种官方预设。

## 管线创建
1. **PipelineAsset**: 创建自定义的 Asset 类，用于存储渲染配置。
2. **Pipeline 类**: 继承自 `RenderPipeline`，实现核心渲染逻辑。

## 自定义渲染流程
渲染逻辑主要在 `Render` 方法中定义，利用 `ScriptableRenderContext` 和 `CommandBuffer` 执行指令：

### 核心步骤
- **Culling (裁剪)**: 获得相机的可见物体裁剪结果。
- **Rendering (绘制)**:
  - `DrawRenders`: 按照指定的相交测试和层级绘制物体。
  - `DrawSkyBox`: 绘制天空盒。
  - `RenderTransparentQueue`: 绘制透明通道物体。
  - `DrawDefaultPipeline`: 处理失效物体的回退绘制。
- **Post-processing (后处理)**: 实现 Bloom、色调映射等视觉增强效果。

## URP 简析
### 特点
- **高性能**: 针对全平台优化。
- **前向渲染**: 核心架构为前向渲染，适合移动端。
- **可扩展性**: 允许通过 Render Objects 和 Scriptable Render Features 进行自定义。

---

> [!NOTE]
> 更多详情请参考：[Unity 官方 URP 比较文档](https://docs.unity3d.com/Packages/com.unity.render-pipelines.universal@latest/manual/universalrp-builtin-feature-comparison.html)
