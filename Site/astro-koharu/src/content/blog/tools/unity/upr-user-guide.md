---
title: Unity UPR 性能测试使用指南
link: upr-user-guide
catalog: true
date: 2020-06-04 15:56:37
description: Unity UPR (Unity Performance Reporting) 是官方提供的性能检测工具。本文详细介绍了从官网项目创建、测试包准备到 Android 与 Windows 平台的测试执行全流程。
tags:
  - Unity
  - 性能测试
  - UPR
categories:
  - [工具, Unity]
---

## 环境准备

### 1. 官网项目配置
- 登录 [Unity UPR 官网](https://upr.unity.com/)。
- 创建新项目并填写相关信息（包名需与测试包对齐）。

![新建 UPR 项目](/img/posts/upr-user-guide/1.png)

- 进入项目并点击 **新建测试**，开启所需的测试选项（如 Mono, Lua 等）。

![配置测试项](/img/posts/upr-user-guide/2.png)

### 2. 测试包准备
- 若需查看 Mono 和 Lua 数据，需导入 `UPRTools` UnityPackage。
- 配置 UPRTools 后发布测试包。

## 平台测试流程

### Android 平台
1. 下载并安装 [UPR 安卓版](https://upr.unity.com/download)。
2. 开启悬浮窗权限。
3. 扫描网页上的测试二维码，启动游戏即可开始采集。

![Android 操作细节](/img/posts/upr-user-guide/4.png)

### Windows 平台
1. 下载并运行 [UPR PC 版](https://upr.unity.com/download)。
2. 输入网页端的 **Session ID**。
3. 通过 ADB 连接手机，点击 **Start Test**。

![Windows 测试流程](/img/posts/upr-user-guide/6.png)

## 数据查看
测试结束后，点击 **Stop and ProcessData**，即可在网页端查看详细的性能分析报告。

![查看分析结果](/img/posts/upr-user-guide/9.png)
