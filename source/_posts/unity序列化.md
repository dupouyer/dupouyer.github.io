---
title: Unity序列化
date: 2020-05-18 18:16:10
updated: 2020-05-18 18:16:10
categories: 
- Unity
tags:
- Unity
- 序列化
---

# 概念
序列化是为了将对象存储（或传输）到内存、数据库或文件中，把对象状态转化为一组字节的过程

![avatar](./img/2020_5_18/1.png)

# Unity 如何序列化
Unity 中 UnityEngine.Object 类提供序列化能力，任何继承自它的类（MonoBehaviour,ScriptableObject）， 都可被序列化。 其中大部分使用都是隐形的，开发中不需要在意。

## MonoBehavior 编写
可被序列化的字段必须符合以下几点：
- 设为public，或者添加[SerializeField]属性
- 不要设为static
- 不要设为const
- 不要设为readonly
- 字段类型必须是可以序列化的类型

## 哪些类型可以序列化？
- 来自UntiyEngine.Object的对象引用
- 有 [Serializable] 属性的自定义非抽象类
- 基础数据类型（int，float，double，bool，string等等）
- 可序列化的数组Array字段类型
- 可序列化的泛型列表List<T>字段类型
结构体

> 一个很常见的不可被序列化的数据结构：**Dictionaries**，即使把它们声明为公有并且有 [SerializeField] 属性。在开发游戏时要记住这点。

## 自定义序列化类型
添加 [System.Serializable] 修饰符

```csharp
[System.Serializable]
public class TestData
{
    public BehaviorNode obj;
}
```

### 会出现的问题
- 任然依赖于 MonoBehaviour 并且需要 GameObject 才可存在
- 无法支持多态，对一个基类数组添加三个同样的子类对象，序列化后是三个基类对象。
- 耦合引用, 对一个泛型列表添加同一个对象三次，序列化后是三个不同的对象。
- 递归声明  
 自定义类型的序列化不支持空引用，在递归引用时，会陷入循环创建的的死循环。 unity 为解决这个问题，限制了最大层深度为 7 层。

### 解决方法 ScriptableObjects
- 可存储为 xx.asset 资源，不再依托于 GameObject
- ScriptableObjects 继承自 Unity.Object， 在序列化时创建的是对象的引用。

# Unity Edtior 对序列化数据的使用

![avatar](./img/2020_5_18/2.png)

Editor 通过修改序列化数据修改以及显示目标对象

## 操作 API

**EditorWIndow**  
> 创建一个窗口

```csharp
public class EditStartWindow: EditorWindow
{
    Editor editor;

    [MenuItem("Behavior/Edit")]
    public static void ShowWindow()
    {
        EditStartWindow window = EditorWindow.CreateInstance<EditStartWindow>();
        window.Show();
    }
     private void OnGUI()
    {
        if (GUILayout.Button("Open"))
        {
        }
    }
}
```

**Inspector**
> 定制 Class 在 Inspector 中的显示

```csharp
[CustomEditor(typeof(BehaviorRunTime))]
public class BehaviorRunTimeEditor: Editor
{
    public override void OnInspectorGUI()
    {
        base.OnInspectorGUI();

        if (GUILayout.Button("Run"))
        {
            BehaviorRunTime runTime = target as BehaviorRunTime;
            runTime.Invoke("Run", 0);
        }
    }
}
```

**CustomPropertyDrawer**  
> 自定义字段的显示方案

- PropertyDrawer  
   对自定义属性的字段调用此方法渲染

- DecoratorDrawer  
   以装饰模式进行渲染，区别是
   - 不会改变检查器的原始行为，而是扩展它 
   - 一个属性上能加不止一个DecoratorDrawer 
   - 数组或List上加DecoratorDrawer只会对第一个起作用。
![avatar](./img/2020_5_18/3.png)

# 问题的解决
## 不可序列化的类型
- 高维数组低维化，底层使用一维数组来替代
- 字典把 Key 和 Value 各种存储为 List , 运行时用字典，序列化时用数组

## 自定义序列化接口
**ISerializationCallbackReceiver**  
Unity 提供的一个接口，通过实现 OnBeforeSerialize 和 OnAfterDeserialize 使的原本不能被序列化成功的类可以被加工成合格的类型。

## .Net 序列化机制
通过实现 ISerializable 自定义序列化和反序列化过程
> 另外还有其它的解决方案：
Json Xml yaml 和 二进制

## 新的版本支持 2019.x
新增 [SerializeReference]  支持对引用类型序列化，支持接口以及抽象类

PS：
- 引用的类必须是可序列化类型
- 引用值无法在 UnityEngine.Object 实例间进行共享

# 总结
在使用 Unity 的序列化时必须明确了解那些字段能够被序列化，从而减少因为序列化，反序列化后对象数据不一致导致的问题。



