---
title: 二叉搜索树 (BST) 的原理与实现
link: binary-search-tree-introduction
catalog: true
date: 2020-04-29 16:33:00
description: 深入浅出地介绍了二叉搜索树（BST）的基本概念、核心操作（插入、移除、搜索）及其 Python 实现，并探讨了树深度对效率的影响。
tags:
  - 算法
  - 二叉树
  - 数据结构
categories:
  - [笔记, 算法]
---

## 简介
二叉搜索树（BST）是一种高效的索引结构。其核心规则是：对于任意节点，其左子树中所有节点的值均小于自身，右子树中所有节点的值均大于自身。这种有序性使得搜索操作的时间复杂度可以达到 $O(\log n)$。

## 基本操作

### 插入
时间复杂度：$O(\log_2 N)$

```python
def _insert(self, parent, node):
    ## 这里不处理相同的数
    if parent.value == node.value:
        return
    ## 比较顺序后放入较小的左子树
    elif parent.value > node.value:
        ## 孩子为空，可以插入
        if parent.left == None:
            parent.left = node
            return
        else:
            self._insert(parent.left, node)
            return
    ## 比较顺序后放入较大的右子树
    elif parent.value < node.value:
        ## 孩子为空，可以插入
        if parent.right == None:
            parent.right = node
            return
        else:
            self._insert(parent.right, node)
            return
```

### 移除 
时间复杂度：$O(\log_2 N)$

```python
def _remove(self, node, key, parent, isLeft):
    ## 搜索节点
    if node == None:
        return
    ## 搜索较大的右子树
    elif node.value < key:
        return self._remove(node.right, key, node, False)
    ## 搜索小的左子树
    elif node.value > key:
        return self._remove(node.left, key, node, True)
    
    ## 执行移除
    elif node.value == key:
        rmNode = node
        ## 左右子树任意一个为空，直接替换
        if node.left == None:
            parent.setChild(isLeft, node.right)
        elif parent.right == None:
            parent.setChild(isLeft, node.left)
        else:
            ## 左右子树均不为空：在右子树中找到最小节点进行替换
            last = node
            minNode = node.right
            while minNode.left:
                last = minNode
                minNode = minNode.left
            
            parent.setChild(isLeft, minNode)
            last.setChild(True, None)

        return rmNode
```

### 搜索
按照比较顺序进行搜索，可以快速确定目标元素所在子树，减少冗余枝干的遍历。

时间复杂度：$O(\log_2 N)$

```python
def _search(self, parent, value):
    if parent == None:
        return None, False
    elif parent.value == value:
        return parent, True
    elif parent.value < value:
        return self._search(parent.right, value)
    elif parent.value > value:
        return self._search(parent.left, value)
```

## 注意事项
BST 的性能高度依赖于树的深度。在极端情况下（如按序插入），BST 会退化为链表，导致时间复杂度劣化为 $O(n)$。在实际应用中，可以通过随机化插入顺序或使用平衡二叉树（如 AVL、红黑树）来优化。

---

> [!TIP]
> **代码实现参考：**
> GitHub: [dupouyer/algo/BST](https://github.com/dupouyer/algo/tree/master/BST)
