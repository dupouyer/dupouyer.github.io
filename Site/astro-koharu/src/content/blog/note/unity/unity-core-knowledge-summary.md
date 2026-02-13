---
title: Unity 核心知识点总结
link: unity-core-knowledge-summary
catalog: true
date: 2019-03-07 19:30:00
description: 本文系统地总结了 Unity 开发中的核心技术点，包括编程语言（C#、C++、Lua）、内存管理、GC 机制、渲染管线、物理系统以及架构设计等。
tags:
  - Unity
  - 游戏开发
  - 架构设计
categories:
  - [笔记, Unity]
---

## 业务

### 编程语言
- **C#**: 装箱，拆箱
- **C++**: 内存管理
- **Lua**: class 实现，原表

### 内存管理
- **美术资源**:
  - 纹理压缩：针对应用场景进行更加精细的格式控制，不同格式的纹理进入内存后的体积不一样。
  - UI 优化：使用公用元素，复用资源。多使用九宫格，减少图片尺寸。
  - 网格缩减：对离摄像机远的对象使用减面网格（LOD）或贴图替代。
  - 动画文件优化：减少浮点精度，关闭缩放。
- **对象**:
  - 对象池复用对象。
  - 大尺寸对象的销毁策略优化。
- **脚本**:
  - 销毁闲置脚本（不常用）。

### GC (垃圾回收)
- **C# GC**: 引用计数
- **Lua GC**:
  - 引用计数
  - GC 步长设定策略
  - 相关资料：[Lua GC 1](https://blog.codingnow.com/2011/03/lua_gc_1.html), [Lua GC 2](https://blog.codingnow.com/2011/03/lua_gc_2.html)

### 热更新
- **Lua 热更**: 通过版本文件修改 URL。
- **IL2CPP**: 性能较高。

### 协程
- `yield return new WaitForSeconds(3)`
- 异步编程：`yield return request()`

### C/C++ 插件
- JAVA <-> JNI <-> C/C++ 桥接 <-> CLR
- IOS <-> OC <-> CLR

### CLR (Common Language Runtime)
- 资料：[CLR 简介](http://www.cnblogs.com/skynet/archive/2010/05/17/1737028.html)
- **托管代码 (Managed)**: 在 CLR 监管下运行。
- **非托管代码 (Unmanaged)**: 直接在裸机上运行的应用或组件。

### Unity API
- `gameobject.getComponent`
- `transform`
- `resource`
- `collider`
- `animator`
- `animation`
- `animationclip`

## 网络
- **TCP/UDP**: 可靠性区别。
- **弱网环境处理**: 保证数据一致性。
  - **状态同步**: 服务器保存玩家的所有状态信息。
  - **帧同步**: 按帧率推进状态。

## 引擎

### 渲染管线
顶点 -> 几何 -> 片段 -> 栅格 -> Ztest, Blend -> 后处理

### 物理系统
- 精细化选择不同的碰撞体。
- 合理分层控制碰撞范围。
- 减少使用连续碰撞检测（CCD）。

### Batch (合批)
- **TextureAtlas**: 纹理图集。
- **静态合批 (Static Batch)**: Build 阶段合并，不消耗 CPU 但增大包体。
- **动态合批 (Dynamic Batch)**: 运行时 CPU 合并，灵活但消耗 CPU 且受定点数限制。
- **Mesh.CombineMeshes**: 运行时手动调用方法合并。

## 架构

### 分层结构
- **MVC**: 核心在于实现数据驱动，合理拆分数据与逻辑。
- **UI 框架**: FairyGUI, UUGUI。

### 面向对象原则
- 多使用组合，避免使用继承（避免深层集成）。
- 使用方法操作数据。
- 数据结构应足够元，逻辑放入方法中以应对迭代。

## 适配
- **UI 解决方案**: 锚点缩放，按最小尺寸设计布局。
- **Shader**: 针对低端设备优化。

## 性能优化
- **CPU**: 减少业务层逻辑复杂度，运算量大的使用 C# 避免用 Lua。
- **GPU**: 
  - 少用实时光照。
  - Shader 优化、LOD 技术。
  - 遮挡剔除、合理合批。
- **纹理控制**: 避免在手机端使用过大的纹理（如 2048），防止带宽瓶颈。

## 数学基础
- **点乘**: $|a| \cdot |b| \cos \theta$
- **叉乘**: 多项式的矩阵表达。
- **SQT 矩阵**: 4x4 矩阵表达缩放、旋转、平移。
- **四元数**: 
  - 优点：可进行平滑插值，无万向节锁，旋转轴任意。
- **欧拉旋转**: 
  - 优点：易理解。
  - 缺点：万向节锁，无法平滑插值。

---

> [!NOTE]
> 参考列表：https://www.jianshu.com/p/10693fee70a5
