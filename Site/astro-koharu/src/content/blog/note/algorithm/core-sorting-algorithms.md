---
title: 核心排序算法详解
link: core-sorting-algorithms
catalog: true
date: 2020-04-08 19:12:00
description: 本文详细介绍了常用的排序算法，包括冒泡排序、插入排序、归并排序、快速排序以及拓扑排序。分析了各算法的实现原理、时空复杂度及其稳定性。
tags:
  - 算法
  - 排序
  - 数据结构
categories:
  - [笔记, 算法]
---

## 冒泡排序
![Bubble Sort](http://s0.lgstatic.com/i/image2/M01/91/0B/CgoB5l2IiW2AUgXzAEVU1vdS3ek726.gif)

每一轮，从数组头部开始，每两个元素比较大小并按大小方向进行交换，直到数组末尾。不断重复这个过程。

- **数量优化**：每 $n$ 轮比较，数组末尾 $n$ 个元素都是确定的，不需要再进行比较。
- **提前中断**：在一轮比较中，如果未发生元素交换，说明数组已经排序完成，可以中断排序。

```javascript
function bubbleSort(nums) {
    let hasChange;
    for (let i = 0; i < nums.length; i++) {
        hasChange = false;
        for (let j = 0; j < nums.length - 1 - i; j++) {
            if (nums[j] > nums[j + 1]) {
                [nums[j], nums[j + 1]] = [nums[j + 1], nums[j]];
                hasChange = true;
            }
        }
        if (!hasChange) break;
    }
}
```

### 复杂度分析
- **空间复杂度**: $O(1)$
- **时间复杂度**:
  - 最佳（正序）：$O(n)$
  - 最坏（逆序）：$O(n^2)$

---

## 插入排序
![Insertion Sort](http://s0.lgstatic.com/i/image2/M01/91/0B/CgoB5l2IiW-AJFICAFSirGa8QjY019.gif)

核心思想是将未排序的元素逐个插入到已排序的数组部分中。

```javascript
function insertionSort(nums) {
    for (let i = 1; i < nums.length; i++) {
        let current = nums[i];
        let j = i - 1;
        while (j >= 0 && nums[j] > current) {
            nums[j + 1] = nums[j];
            j--;
        }
        nums[j + 1] = current;
    }
}
```

### 复杂度分析
- **空间复杂度**: $O(1)$
- **时间复杂度**:
  - 最佳：$O(n)$
  - 最坏：$O(n^2)$

---

## 归并排序
![Merge Sort](http://s0.lgstatic.com/i/image2/M01/91/0B/CgoB5l2IiXKAR7hcAFhCcVK5jAM221.gif)

采用分治思想，将大问题分解成子问题解决，最后合并子问题的解。

```javascript
function mergeSort(nums, lo, hi) {
    if (lo >= hi) return;
    let mid = lo + Math.floor((hi - lo) / 2);
    mergeSort(nums, lo, mid);
    mergeSort(nums, mid + 1, hi);
    merge(nums, lo, mid, hi);
}

function merge(nums, lo, mid, hi) {
    let copy = [...nums];
    let i = lo, j = mid + 1;
    for (let k = lo; k <= hi; k++) {
        if (i > mid) nums[k] = copy[j++];
        else if (j > hi) nums[k] = copy[i++];
        else if (copy[i] <= copy[j]) nums[k] = copy[i++];
        else nums[k] = copy[j++];
    }
}
```

### 复杂度分析
- **空间复杂度**: $O(n)$ （需要辅助空间合并）
- **时间复杂度**: $O(n \log n)$

---

## 快速排序
在分治思想上进一步优化，选择基准值（Pivot）进行划分，不需要合并操作。

```javascript
function quickSort(nums, lo, hi) {
    if (lo < hi) {
        let p = partition(nums, lo, hi);
        quickSort(nums, lo, p - 1);
        quickSort(nums, p + 1, hi);
    }
}

function partition(nums, lo, hi) {
    let pivot = nums[hi];
    let i = lo;
    for (let j = lo; j < hi; j++) {
        if (nums[j] < pivot) {
            [nums[i], nums[j]] = [nums[j], nums[i]];
            i++;
        }
    }
    [nums[i], nums[hi]] = [nums[hi], nums[i]];
    return i;
}
```

### 复杂度分析
- **空间复杂度**: $O(1)$ （原地交换）
- **时间复杂度**: $O(n \log n)$ （最坏情况下为 $O(n^2)$）

---

## 拓扑排序
![Topological Sort](http://s0.lgstatic.com/i/image2/M01/91/2B/CgotOV2IiXqAM6cFAFNa8qMI_JU260.gif)

针对有向无环图（DAG），将顶点按依赖关系排序。

1. **入度统计**: 选择入度为 0 的顶点输出。
2. **剪边**: 删除该顶点及其发出的边。
3. **循环**: 持续更新入度并输出，直到完成。

---

## 算法稳定性总结

| 算法 | 稳定性 | 原因 |
| :--- | :--- | :--- |
| **冒泡排序** | 稳定 | 仅相邻元素交换，相等时不交换 |
| **插入排序** | 稳定 | 插入位置确定，不改变相对顺序 |
| **归并排序** | 稳定 | 合并时可控制相等元素的先后关系 |
| **快速排序** | 不稳定 | 跨度交换可能破坏相对顺序 |
