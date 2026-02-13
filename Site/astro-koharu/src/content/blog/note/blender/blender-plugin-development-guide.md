---
title: Blender 插件开发完整指南
link: blender-plugin-development-guide
catalog: true
date: 2025-01-26 12:00:00
description: 本文档详细介绍了 Blender Python 插件的完整开发流程，从环境搭建、代码目录结构到核心 API（BMesh、UV、渲染）的使用技巧，并涵盖了 UI 开发与发布分发建议。
tags:
  - Blender
  - Python
  - 插件开发
  - DCC
categories:
  - [笔记, Blender]
---

## 环境搭建

### Blender 内置环境
- **Python**: Blender 自带 Python 环境，无需额外安装。通常位于安装目录下的 `python/` 文件夹。
- **Scripting 工作区**: 内置代码编辑器和控制台，可直接运行预览脚本。
- **IDE 推荐**: VSCode + Python 扩展（支持代码补全和远程调试）。

### 代码目录结构
```text
your_addon/
├── __init__.py  # 插件入口，包含 bl_info 和 register/unregister
├── auto_load.py # (可选) 自动加载模块脚本
└── *.py         # 功能模块文件
```

## 插件基础结构

### 最小插件模板
```python
bl_info = {
    "name": "My Addon",
    "author": "Your Name",
    "version": (1, 0, 0),
    "blender": (3, 0, 0),
    "location": "View3D > Sidebar",
    "category": "3D View",
}

import bpy

class MY_OT_operator(bpy.types.Operator):
    bl_idname = "my.operator"
    bl_label = "My Operator"
    
    def execute(self, context):
        self.report({'INFO'}, "Hello Blender!")
        return {'FINISHED'}

def register():
    bpy.utils.register_class(MY_OT_operator)

def unregister():
    bpy.utils.unregister_class(MY_OT_operator)
```

## 常用工具与 API

### 调试技巧
- **控制台打印**: `print(f"Debug: {context.object.name}")`（需开启系统控制台）。
- **GUI 反馈**: `self.report({'ERROR'}, "Message")` 可在 UI 顶部显示信息。
- **热重载**: 开发过程中可结合 `importlib.reload` 快速刷新模块代码。

### 核心 API 访问
- **场景数据**: `context.scene`, `context.active_object`
- **物体集合**: `bpy.data.objects`, `bpy.data.materials`
- **内置操作符**: `bpy.ops.mesh.primitive_cube_add()`

### BMesh 高级网格操作
```python
import bmesh
bm = bmesh.new()
bm.from_mesh(obj.data)
# 遍历面
for face in bm.faces:
    # 处理逻辑
    pass
bm.to_mesh(obj.data)
bm.free()
```

## UI 开发
支持在 `3D View`、`Image Editor` 或 `Node Editor` 等区域自定义面板（Panel）和菜单（Menu）。利用 `layout.prop()` 和 `layout.operator()` 可快速构建标准化界面。

## 发布建议
1. **打包**: 确保包含 `__init__.py` 并使用 ZIP 压缩。
2. **兼容性**: 在 `bl_info` 中声明最低支持的 Blender 版本。
3. **分发平台**: Blender Market, GitHub, 或者官方 Extensions 平台。

---

> [!TIP]
> **官方文档参考：**
> [Blender Python API](https://docs.blender.org/api/current/)
