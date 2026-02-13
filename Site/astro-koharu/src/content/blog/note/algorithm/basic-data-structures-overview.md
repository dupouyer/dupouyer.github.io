---
title: 计算机基础数据结构概览
link: basic-data-structures-overview
catalog: true
date: 2020-04-07 19:30:00
description: 回顾计算机科学中的基础数据结构，包括数组、链表、List、队列、栈、哈希表以及脚本语言中字典的实现原理。
tags:
  - 算法
  - 数据结构
  - 计算机基础
categories:
  - [笔记, 算法]
---

## 数组 (Array)
> 最常用的数据结构。

在内存中申请一块固定长度的连续空间，可通过下标直接访问。
```c
array = malloc(n);
```
**挑战**: 内存需提前申请。对于长度可变的存储需求，频繁申请新内存会有较高开销。

## 链表 (LinkList)
以节点为存储单元，每个节点包含值与下一个节点的地址。
```c
linkNode = malloc(2);
linkNode[1] = value;
linkNode[2] = &nextNode;
```
**特点**: 可根据需求动态开辟空间，但在访问单个节点时效率较低（需从头遍历）。

## 列表 (List)
现代编程语言综合了数组和链表的优点。一种可能的实现方案：
1. 设置子数组长度 $k$。
2. 使用链表存储子数组的头节点。
3. 访问公式：`List[i] = nodes[i / k][i % k]`（注：此处公式根据实际逻辑修正）。

## 队列 (Queue)
**先进先出 (FIFO)**。
应用：广度优先搜索 (BFS) 中记录待搜索节点。

## 栈 (Stack)
**先进后出 (LIFO)**。
应用：深度优先搜索 (DFS) 中辅助搜索记录。

## 哈希表 (Hash Table)
给定 Key，通过 Hash 函数计算地址：`address = hash(key)`。
- **冲突解决**: 通过冲突解决函数获得偏移地址。
- **底层实现**: 通常依赖数组和链表共同实现。

## 脚本语言中的 Dictionary
字典通常使用多个链表：一个存储哈希值，一个存储 Value 引用。
![Dictionary implementation](https://upload-images.jianshu.io/upload_images/2381726-fb4e3aaa4b98af99.png?imageMogr2/auto-orient/strip|imageView2/2/w/450/format/webp)
虽然空间代价略高，但换取了极快的访问速度。

---

> [!NOTE]
> 高级数据结构通常都无法脱离数组和链表这两类基础结构，它们是更高层次逻辑实现的基础单元。
