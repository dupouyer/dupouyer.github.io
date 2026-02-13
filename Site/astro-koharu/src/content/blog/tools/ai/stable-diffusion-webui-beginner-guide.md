---
title: Stable Diffusion WebUI 零基础入门指南
link: stable-diffusion-webui-beginner-guide
catalog: true
date: 2023-03-02 12:50:00
description: 为 AI 绘画爱好者准备的 Stable Diffusion WebUI 入门手册。包含核心原理解读、本地部署教程、主流自训练方法（Hypernetworks, LoRA, Dreambooth）及热门插件推荐。
tags:
  - AI
  - Stable Diffusion
  - 深度学习
categories:
  - [工具, AI]
---

![Stable Diffusion Banner](/img/posts/stable-diffusion-webui-beginner-guide/00022-789135319.png)

## 核心原理

想要深入理解 Stable Diffusion 的工作机制，推荐阅读以下系列文章：
- [零基础读懂 Stable Diffusion (I)：组成部分](https://zhuanlan.zhihu.com/p/597247221)
- [零基础读懂 Stable Diffusion (II)：训练过程](https://zhuanlan.zhihu.com/p/597732415)
- [零基础读懂 Stable Diffusion (III)：控制技巧](https://zhuanlan.zhihu.com/p/598070109)

## 部署与安装

可以通过以下资源进行本地或云端部署：
- [Stable Diffusion WebUI 保姆级教程 (Colab/Windows/Linux)](https://zhuanlan.zhihu.com/p/584736850)
- [PyTorch 本地版本安装指南](https://pytorch.org/get-started/locally/)
- [Xformers 加速优化配置](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Xformers)

**GitHub 项目地址**: [AUTOMATIC1111/stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui)

## 模型训练与微调

目前 SD 支持多种自训练方法，根据产出文件的不同可分为：

### 1. 产出 PT/Safetensors 小模型
- **Hypernetworks 训练**: [NovelAI Hypernetwork 调优教程](https://zhuanlan.zhihu.com/p/576041621)
- **Embedding 训练 (Textual Inversion)**: 适用于人物或风格的学习。
- **Aesthetic Gradients**: 审美梯度引导。

### 2. 产出 CKPT/Full Model 大模型
- **DreamBooth 训练**: [DreamBooth 自训练全流程攻略](https://zhuanlan.zhihu.com/p/584736850)

## 模型资源探索
建议参考：[Stable Diffusion 模型资源食用指南](https://zhuanlan.zhihu.com/p/597504900)

## 推荐插件

- **ControlNet**: 能够精准控制 AI 生成的姿态、深度和轮廓。
- **Tagcomplete**: 自动补全 Prompt，极大提升输入效率。
- [SD WebUI 插件拓展及依赖汇总](https://zhuanlan.zhihu.com/p/579538165)
