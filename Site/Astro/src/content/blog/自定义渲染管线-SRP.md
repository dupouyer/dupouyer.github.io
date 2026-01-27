---
title: 自定义渲染管线-SRP
date: 2026-01-27
categories:
  - Unity
tags:
  - Unity
  - SRP
---

---
title: 自定义渲染管线(SRP)
date: 2021-06-20 15:43:51
updated: 2021-06-20 15:43:51
description: Unity SRP 简单介绍与入门
categories: Unity
tags: SRP
---

# SRP 介绍
Unity 的 Scriptable Render Pipeline (SRP) 是一项允许您通过 C# 脚本控制渲染的功能。 在此基础上，Unity 官方提供了通用渲染管线 (URP) 和高清渲染管线 (HDRP) 两种开箱即用的渲染管线。
# 管线创建
## Create PiplineAsset
自定义管线 Asset，定义个人 Pipeline 类。
# 自定义管线流程
在开放出来的 Render 方法中制订流程
## Cull
获得相机裁剪结果
## Rendering
渲染流程
CommandBuff 渲染命令缓冲区
### DrawRenders
绘制物体
ScriptableRenderContext 定义自定义渲染管线使用的状态和绘图命令。
DrawRenderers
### DrawSkyBox
绘制天空盒子
### RenderTransparentQueue
绘制透明通道内的物体
### DrawDefaultPipeline
绘制默认管线，显示失效物体
## Post-processing
后效处理

# URP 简析
## 特点介绍
开箱即用，高性能，针对全平台使用。前向渲染
## demo 展示
渲染流程展示

功能对比
https://docs.unity3d.com/Packages/com.unity.render-pipelines.universal@10.5/manual/universalrp-builtin-feature-comparison.html

资料：
https://docs.unity3d.com/Packages/com.unity.render-pipelines.universal@10.5/manual/post-processing-ssao.html

https://docs.unity3d.com/cn/Packages/com.unity.render-pipelines.high-definition@7.4/manual/index.html

