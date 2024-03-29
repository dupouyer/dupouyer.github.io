---
title: Unity 总结
date: 2019-03-07 19:30:00
updated: 2019-03-07 19:30:00
categories: 
- Unity
tags:
- Unity
- 编程语言
---

## 业务
### 编程语言
- C# 
    - 装箱，拆箱
- C++
    - 内存管理
- Lua 
    - class 实现，原表
 
### 内存管理
- 美术资源：
  - 纹理压缩，不同格式的纹理进入内存后的体积不一样，针对应用场景进行更加精细的格式控制。   
  - UI 上使用公用元素，复用资源。多使用九宫格，减少图片尺寸
  - 网格缩减, 需要展示更多细节的提高面数，离摄像机比较远的使用少的面数，或者使用贴图实现
  - 动画文件优化, 浮点精度减少，关闭缩放
- 对象：
    - 对象池复用对象
    - 大尺寸对象的销毁策略优化
- 脚本：
    - 销毁闲置脚本（不怎么需要处理）
     
### GC
- C# GC 
    - 引用计数
- Lua GC
    - 引用计数
    - GC 步长设定(设定策略）
    - 资料：
     https://blog.codingnow.com/2011/03/lua_gc_1.html 
     https://blog.codingnow.com/2011/03/lua_gc_2.html
### 热更新
- Lua 热更,通过版本文件修改 url
- IL2CPP,性能比较高
### 协程
- yeild return new WaitForSeconds(3)
- 异步编程
 do something
 yeild return request()
### C/C++插件
- JAVA <-> JNI <-> C/C++ 桥接 <-> CLR
- IOS <-> OC <-> CLR

### CLR(Common Language Runtime)
- 资料：http://www.cnblogs.com/skynet/archive/2010/05/17/1737028.html
- 在 CLR 监管下的运行程序属于 "托管"(managed)代码
- 直接在裸机上运行的应用或者组件属于"非托管"(unmanaged)代码
 
### Unity API
- gameobject.getComponent
- transform
- resource
- collider
- animator
- animation
- animationclip

## 网络
- TCP,UDP  可靠性区别
- 弱网环境的处理, 保证数据的一致性
    - 有状态同步，服务器保存玩家的所有状态信息
    - 帧同步, 按帧率推进状态

## 引擎

- 渲染管线:
 顶点 -> 几何 -> 片段 - > 栅格 -> Ztest,Blend -> 后处理
- 物理碰撞的策略:
    - 精细化的选择不同的碰撞体
    - 合理的分层控制碰撞范围
    - 少用，或者不用连续碰撞检测
- Batch:
    - TextureAtlas
    - 静态 batch，资源 build 阶段, 合并物体。 
    优势：不消耗计算资源
    劣势：包体增大（生成资源文件用来描述合并后的物体）
    - 动态 batch 运行时，forward render ,CPU 合并 物体
    优势：灵活
    劣势：消耗计算资源切且，U3D 中对一次 batch 的定点数有限制 900 个，对于有透明物体的情况下，不能很好的执行合批。（透明物体有严格的渲染顺序控制）
    - 运行时合批: 调用 Mesh.CombineMeshes 方法合并物体
- 纹理格式:

## 架构
- MVC
老生常谈的一个东西了，在业务逻辑的编写上要注意合理的拆分数据与操作逻辑，View 这一层一般都是由第三方的 UI 框架搭建，结构都很内聚。核心在于实现数据驱动。
- UI
    - FariyGUI
    - UGUI
- 面向对象
    - 多使用组合，避免使用继承。
    - 业务逻辑上继承的越多，维护越困难。
    - 多使用方法操作数据
    - 业务数据结构要足够元,才能更好的应对迭代变化, 变化的部分放入方法中。

## 适配
- UI 解决方案
    - 锚点缩放
    - 按最小尺寸设计布局
- shader
    -  针对低端机器编写

## 性能优化
代码(CPU): 

- 减少业务层的复杂逻辑，运算量大的使用 C# 执行，避免使用 Lua
 
渲染(GPU):

- 少用实时光照
- shader 优化性能
- LOD 技术
- 遮挡剔除技术
- 合理的 batch

纹理上要避免使用 2048 ，手机端是 CPU 和 GPU 共用一个总线，带宽有限。

## 数学基础
- 点乘 
|a|*|b|cos0
- 叉乘 
多项式的矩阵表达
- SQT 矩阵
特殊 4x4 矩阵用来表达 缩放，旋转，平移
- 四元数
选择的另外一种描述方式
优点:
    - 可以表达旋转的增量, 进行平滑的插值
    - 没有万向节锁
    - 选择方向反向，直接取反四元数即可
    - 旋转轴可以是任意向量
- 欧拉旋转
优点：容易理解
缺点：有方向节锁，无法实现平滑的插值

---
参考列表：
>https://www.jianshu.com/p/10693fee70a5
