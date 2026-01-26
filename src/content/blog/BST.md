---
title: BST(二叉搜索树)
date: 2020-04-29 16:33:00
updated: 2020-04-29 16:33:00
categories: 算法
tags: 二叉树
---

## 简介
树的数据结构觉得了它能构建成索引结构，且能高效的减少集合的搜索深度，再配合上有序的插入规则，就能进行高效的搜索。这里介绍一种简单的二叉搜索树（BST），BST 的插入规则为，任意节点的左孩子比自身小，右孩子比自身大。
## 基本操作
### 插入
时间复杂度：O(log<sub>2</sub>N)
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
时间复杂度：O(log<sub>2</sub>N)
```python
    def _remove(self,node, key, parent, isLeft):
        ## 搜索节点
        if node == None:
            return
        ## 搜索较大的右子树
        elif node.value < key:
            return self._remove(node.right, key, node, False)
        ## 搜索较的左子树
        elif node.value > key:
            return self._remove(node.left, key, node, True)
        ## 执行移除
        elif node.value == key:
            rmNode = node
            ## 左右子树任意一个为空，都可以直接把另外一个子树提上一层，替换掉移除的节点
            if node.left == None:
                parent.setChild(isLeft, node.right)
            elif parent.right == None:
                parent.setChild(isLeft, node.left)
            else:
            ## 左右子树不为空
                last = node
                ## 在较大的右子树中找到最小的节点与移除的节点进行替换，并移除目标节点
                minNode = node.right
                while minNode.left:
                    last = minNode
                    minNode = minNode.left
                
                parent.setChild(isLeft, minNode)
                last.setChild(True, None)

            return rmNode
```
### 搜索
> 按照比较顺序进行搜索，可以快速确定目标元素所在子树，减少冗余枝干的遍历操作。

时间复杂度：O(log<sub>2</sub>N)
``` python
    def _search(self, parent, value):
        if parent == None:
            return None, False
        elif parent.value == value:
            return parent,True
        elif parent.value < value:
            return self._search(parent.right, value)
        elif parent.value > value:
            return self._search(parent.left, value)

```
## PS:
BST 的所有操作都与树的深度有关，在插入操作时，如果插入的顺序是有序的，那么 BST 就会变成深度为 N 的一叉树，大大降低搜索效率。所以在初始化时，可以进行随机取数，减少有序的概率。

以下是此数据结构的 python 实现  
github:[https://github.com/dupouyer/algo/tree/master/BST]
