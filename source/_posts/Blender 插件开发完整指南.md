---
title: Blender 插件开发完整指南
date: 2025-01-26 12:00:00
updated: 2025-01-26 12:00:00
categories:
- DCC
- Blender
tags:
- Blender
- Python
- 插件开发
- DCC
---

# Blender 插件开发完整指南

本文档介绍 Blender Python 插件的完整开发流程，包括环境搭建、基础结构、常用 API、UI 开发、调试技巧和发布流程。

## 环境搭建

### Blender

#### Python 环境
- Blender 内置 Python，无需额外安装
- 路径：Blender 安装目录下的 `python/` 文件夹
- 版本匹配：需注意 Blender 版本对应的 Python 版本（Blender 3.x 通常使用 Python 3.10+）

#### 开发工具
- **Scripting 工作区**：Blender 内置的 Python 脚本编辑器
- **IDE 推荐**：VSCode + Python 扩展，可配置远程调试
- **API 文档**：[Blender Python API](https://docs.blender.org/api/current/)

#### 代码目录结构
```
blender_dev/
├── extensions/           # Blender add-ons
│   ├── YourAddon/       # 插件目录
│   │   ├── __init__.py  # 插件入口，必须包含 register/unregister
│   │   ├── auto_load.py # 自动加载模块（可选）
│   │   └── *.py         # 其他模块文件
└── config/              # 配置文件
```

---

## Blender 插件开发流程

### 1. 插件基础结构

#### 最小插件模板
```python
bl_info = {
    "name": "My Addon",
    "author": "Your Name",
    "version": (1, 0, 0),
    "blender": (2, 80, 0),
    "location": "View3D > Sidebar",
    "description": "Description",
    "category": "3D View",
}

import bpy

class MyProperties(bpy.types.PropertyGroup):
    my_string: bpy.props.StringProperty(name="My String")

class MY_OT_operator(bpy.types.Operator):
    bl_idname = "my.operator"
    bl_label = "My Operator"
    bl_options = {'REGISTER', 'UNDO'}

    def execute(self, context):
        # 执行逻辑
        return {'FINISHED'}

class MY_PT_panel(bpy.types.Panel):
    bl_label = "My Panel"
    bl_idname = "MY_PT_panel"
    bl_space_type = 'VIEW_3D'
    bl_region_type = 'UI'
    bl_category = "My Tab"

    def draw(self, context):
        layout = self.layout
        props = context.scene.my_props
        layout.prop(props, "my_string")

classes = (MyProperties, MY_OT_operator, MY_PT_panel)

def register():
    for cls in classes:
        bpy.utils.register_class(cls)
    bpy.types.Scene.my_props = bpy.props.PointerProperty(type=MyProperties)

def unregister():
    for cls in reversed(classes):
        bpy.utils.unregister_class(cls)
    del bpy.types.Scene.my_props

if __name__ == "__main__":
    register()
```

### 2. 开发工作流

#### 加载插件方式
**方式一：通过 Scripting 工作区（推荐用于开发）**
1. 打开 Blender
2. 切换到 **Scripting** 工作区
3. 打开插件的 `__init__.py` 文件
4. 点击 "Run Script" 按钮（▶）或按 `Alt+P`

**方式二：标准安装（用于发布）**
1. Edit → Preferences → Add-ons → Install...
2. 选择插件 ZIP 文件或包含 `__init__.py` 的目录
3. 勾选插件启用

#### 调试技巧
```python
# 打印到 Blender 控制台
print(f"Debug: {context.object.name}")

# 显示错误弹窗
self.report({'ERROR'}, "Something went wrong")
self.report({'WARNING'}, "Warning message")
self.report({'INFO'}, "Info message")

# 使用 Python 控制台快速测试
# 在 Blender 中：Window → Toggle System Console
```

#### 热重载
开发时修改代码后：
1. 重新运行 `__init__.py`
2. 或在 Python 控制台中执行：
```python
import sys
import importlib

# 重载模块
if 'my_module' in sys.modules:
    importlib.reload(sys.modules['my_module'])

# 重新注册
bpy.utils.unregister_class(MY_PT_panel)
bpy.utils.register_class(MY_PT_panel)
```

### 3. 自动加载系统

使用 `auto_load.py` 简化类注册：

```python
# auto_load.py 核心思想
import bpy
import sys
import importlib
from pathlib import Path

def get_addon_modules():
    """获取插件的所有模块"""
    addon_package = sys.modules[__name__]
    addon_path = Path(addon_package.__file__).parent
    module_names = []

    for file in addon_path.rglob("*.py"):
        if file.name.startswith("_"):
            continue
        rel_path = file.relative_to(addon_path)
        module_name = f"{addon_package.__name__}.{'.'.join(rel_path.with_suffix('').parts)}"
        module_names.append(module_name)

    return module_names

def register():
    """自动注册所有类"""
    for module_name in get_addon_modules():
        importlib.import_module(module_name)

    # 按依赖顺序注册类
    from bpy.utils import register_class
    for cls in sorted_classes_by_dependency():
        register_class(cls)

def unregister():
    """自动注销所有类"""
    from bpy.utils import unregister_class
    for cls in reversed(sorted_classes_by_dependency()):
        unregister_class(cls)
```

### 4. 常用 Blender API

#### 场景访问
```python
context.scene              # 当前场景
context.object             # 当前选中物体
context.active_object      # 活动物体
context.selected_objects   # 所有选中物体
bpy.data.objects          # 所有物体
bpy.data.meshes           # 所有网格
bpy.data.materials        # 所有材质
```

#### 操作符（Operators）
```python
# 调用内置操作符
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.primitive_cube_add(location=(0, 0, 0))

# 自定义操作符
class MY_OT_operator(bpy.types.Operator):
    bl_idname = "my.operator"
    bl_label = "My Operator"

    def execute(self, context):
        # 执行逻辑
        return {'FINISHED'}

    def invoke(self, context, event):
        # 调用时（用于弹出对话框）
        return context.window_manager.invoke_props_dialog(self)

    def modal(self, context, event):
        # 模态操作（持续交互）
        if event.type == 'ESC':
            return {'CANCELLED'}
        return {'RUNNING_MODAL'}
```

#### 属性定义
```python
# 基本属性
bpy.props.StringProperty(name="Name", default="value")
bpy.props.IntProperty(name="Count", default=1, min=0, max=100)
bpy.props.FloatProperty(name="Scale", default=1.0)
bpy.props.BoolProperty(name="Enable", default=False)
bpy.props.EnumProperty(
    name="Mode",
    items=[
        ('A', "Option A", ""),
        ('B', "Option B", ""),
    ]
)
bpy.props.PointerProperty(type=SomePropertyGroup)
bpy.props.CollectionProperty(type=SomePropertyGroup)
```

#### 网格操作（BMesh）
```python
import bmesh

# 创建 BMesh
bm = bmesh.new()
bm.from_mesh(obj.data)

# 访问元素
verts = bm.verts
edges = bm.edges
faces = bm.faces

# 选择元素
for vert in bm.verts:
    if vert.co.z < 0:
        vert.select = True

# 修改几何
bmesh.ops.transform(bm, verts=bm.verts, matrix=matrix)
bm.to_mesh(obj.data)
bm.free()
```

#### UV 操作
```python
# 访问 UV 层
mesh = obj.data
uv_layer = mesh.uv_layers.active.data

# 修改 UV 坐标
for poly in mesh.polygons:
    for loop_idx in poly.loop_indices:
        uv_data = uv_layer[loop_idx]
        uv_data.uv.x = new_u
        uv_data.uv.y = new_v
```

#### 渲染控制
```python
# 渲染设置
scene.render.filepath = "//render_"
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_depth = '16'

# 执行渲染
bpy.ops.render.render(write_still=True)
```

### 5. UI 开发

#### Panel（面板）
```python
class MY_PT_panel(bpy.types.Panel):
    bl_label = "My Panel"
    bl_idname = "MY_PT_panel"
    bl_space_type = 'VIEW_3D'        # VIEW_3D, IMAGE_EDITOR, NODE_EDITOR
    bl_region_type = 'UI'            # UI, TOOLS, HEADER, WINDOW
    bl_category = "My Tab"           # 侧边栏标签名
    bl_context = "render"            # 仅在特定上下文显示（可选）

    def draw(self, context):
        layout = self.layout
        scene = context.scene

        # 基础控件
        layout.prop(scene, "my_prop")
        layout.operator("my.operator")

        # 布局
        row = layout.row()
        col = layout.column()
        box = layout.box()
        split = layout.split()
```

#### 菜单位置
```python
def menu_func(self, context):
    self.layout.operator("my.operator")

# 注册菜单
def register():
    bpy.types.VIEW3D_MT_uv_map.append(menu_func)

def unregister():
    bpy.types.VIEW3D_MT_uv_map.remove(menu_func)
```

### 6. 常见问题和解决方案

#### EnumProperty 回调缓存问题
```python
# 问题：items 回调函数结果被缓存
items = [
    ('A', "Option A", ""),
    ('B', "Option B", ""),
]

# 解决：使用动态更新的枚举
def update_enum_items(self, context):
    return get_dynamic_items()

my_enum: bpy.props.EnumProperty(
    items=update_enum_items,
    update=lambda self, context: self.tag_redraw()  # 强制刷新
)
```

#### 选择集操作
```python
# 链式选择（选择连接元素）
import bpy

def expand_selection(obj):
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='DESELECT')
    bpy.ops.mesh.select_linked()
    bpy.ops.object.mode_set(mode='OBJECT')
```

#### GPU 编程
```python
import gpu
from gpu_extras.batch import batch_for_shader

shader = gpu.shader.from_builtin('2D_UNIFORM_COLOR')
batch = batch_for_shader(
    shader,
    'LINES',
    {
        "pos": [(0, 0), (1, 1)],
        "color": [(1, 0, 0, 1), (0, 1, 0, 1)]
    }
)

def draw():
    shader.bind()
    shader.uniform_float("color", (0.5, 0.5, 0.5, 1.0))
    batch.draw()

import bpy
bpy.types.SpaceView3D.draw_handler_add(draw, (), 'WINDOW', 'POST_VIEW')
```

### 7. 发布和分发

#### 打包插件
1. 将插件目录打包为 ZIP
2. 确保包含 `__init__.py` 和 `bl_info`
3. 上传到：
   - Blender Market（付费）
   - GitHub（开源）
   - Blender Extensions Platform（官方）

#### 版本兼容性
```python
bl_info = {
    "blender": (2, 80, 0),  # 最低支持版本
}

# 代码中检查版本
if bpy.app.version >= (3, 0, 0):
    # Blender 3.0+ 特定代码
    pass
```

### 8. 调试工具

#### 启用开发者工具
- Edit → Preferences → Interface → Developer Extras
- 右键菜单 → "Online Python Reference"
- 右键菜单 → "Source" → 查看源代码

#### 使用外部调试器
```python
# 在代码中插入断点
import pdb; pdb.set_trace()

# 或使用 VSCode 远程调试
import ptvsd
ptvsd.enable_attach(address=('localhost', 5678))
ptvsd.wait_for_attach()
```

### 9. 性能优化

```python
# 批量操作而非循环调用 API
bpy.ops.object.select_all(action='DESELECT')

# 使用上下文管理器
with bpy.context.temp_override(selected_objects=objects):
    bpy.ops.object.join()

# 避免频繁的场景更新
bpy.context.view_layer.update()  # 仅在必要时调用
```

---

## Reference

- [Blender Python API 官方文档](https://docs.blender.org/api/current/)
- [Blender 2.8+ 插件开发入门 - 知乎](https://zhuanlan.zhihu.com/p/63095684)
- [Blender 手册 - 插件开发](https://docs.blender.org/manual/en/latest/advanced/extensions.html)
- [Blender Stack Exchange](https://blender.stackexchange.com/)
