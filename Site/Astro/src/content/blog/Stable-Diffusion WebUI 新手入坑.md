---
title: Stable-Diffusion WebUI 新手入坑
date: 2026-01-27
categories:
  - 工具
tags:
  - AI
  - Stable Diffusion
---

---
title: 动画
date: 2023-03-02 12:50:00
updated: 2023-03-02 12:50:00
categories:
- Stable-Diffusion-WebUI
tags:
- AI
---

![[00022-789135319.png]]
#Stable-Diffusion-WebUI

### 原理
[# 零基础读懂Stable Diffusion（I）：怎么组成](https://zhuanlan.zhihu.com/p/597247221)
[# 零基础读懂Stable Diffusion（II）：怎么训练](https://zhuanlan.zhihu.com/p/597732415)
[# 零基础读懂Stable Diffusion（III）：怎么控制](https://zhuanlan.zhihu.com/p/598070109)

### 部署
[# 使用stable-diffusion-webui部署NovelAi/Stable Diffusion 保姆级教程、命令解释、原理讲解(colab、windows、Linux )](https://zhuanlan.zhihu.com/p/584736850)

[PyTorch 版本](https://pytorch.org/get-started/locally/)
[Xformers](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Xformers)
[Stable-Diffusion-WebUI Github 地址](https://github.com/AUTOMATIC1111/stable-diffusion-webui)

### 训练
-   目前为止SD的自训练方法
	-   训练出pt
		-   hypernetworks训练 [# NovelAI hypernetwork 自训练教程](https://zhuanlan.zhihu.com/p/576041621)
		-   embedding训练(Textual Inversion)
		-   Aesthetic Gradients embedding
-   训练出ckpt文件
	-   dreambooth训练 [# StableDiffusion/NAI DreamBooth自训练全教程](https://zhuanlan.zhihu.com/p/584736850) 

### 模型资源探索
[# StableDiffusion模型资源探索食用指南](https://zhuanlan.zhihu.com/p/597504900)

### 插件推荐
[ControlNet](https://github.com/lllyasviel/ControlNet) 
[# 庖丁解牛 Stable-diffusion-webui 插件拓展及依赖汇总](https://zhuanlan.zhihu.com/p/579538165)
[tagcomplete](https://jihulab.com/hunter0725/a1111-sd-webui-tagcomplete)
