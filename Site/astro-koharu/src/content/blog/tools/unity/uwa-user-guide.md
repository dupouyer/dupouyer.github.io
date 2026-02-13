---
title: Unity UWA 性能优化工具使用指南
link: uwa-user-guide
catalog: true
date: 2020-06-03 18:15:37
description: UWA (Unity Whenever Analysis) 是顶尖的第三方性能优化平台。本文涵盖了 UWA SDK 的集成步骤、GOT/GPM 模式说明以及数据上传分析的全流程。
tags:
  - Unity
  - 性能优化
  - UWA
categories:
  - [工具, Unity]
---

## 环境准备

### 1. SDK 接入
下载最新的 `UWA_SDK`，通常包含 UnityPackage 及各平台工具。

![SDK 内容](/img/posts/uwa-user-guide/1.png)

- 导入 `UWA_SDKV2.x_Android.unitypackage` 到工程。
- 将 SDK 目录下的 Prefab 拖入场景。若 Game 窗口出现 UWA UI 且无报错，则接入成功。

![SDK 集成效果](/img/posts/uwa-user-guide/7.png)

### 2. 模式选择 (GOT vs GPM)
在 `Tools/UWASDK` 中进行配置：
- **GOT 模式**: 支持 Android, iOS, Windows，支持 Release 打包。
- **GPM 模式**: 支持更深度的 Overview、Mono、Assets 和 Lua 分析，仅支持 Development Build。

| 模式 | Android | iOS | Windows |
| :--- | :---: | :---: | :---: |
| Overview | √ | √ | √ |
| Mono | √ | × | √ |
| Assets | √ | √ | √ |
| Lua | √ | × | √ |

## 测试步骤

### 1. 采集数据
- 启动游戏，在 UWA 悬浮窗选择测试模式。
- 点击 **Start** 开始采集，**Stop** 停止并保存数据。

![采集控制](/img/posts/uwa-user-guide/8.png)

### 2. 数据上传
使用 `UWA_Tools` 客户端进行数据管理。

- **上传至 Online**: 对应 GOT Online 选项，可在 UWA 官网查看趋势图及诊断报告。
- **本地服务器 (Local Server)**: 若无需 Online 报表，可设置本地服务器在 Unity Editor 内部查看数据。

![上传设置](/img/posts/uwa-user-guide/4.png)

---

> [!NOTE]
> 本地测试数据存放路径：目标平台设备 `UWA-DataCenter/ProfileData` 目录。
