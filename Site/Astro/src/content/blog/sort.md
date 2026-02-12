---
title: "排序"
date: 2020-04-08
updated: 2020-04-08
categories:
  - 算法
tags:
  - 算法
  - 排序
---


## 冒泡排序
![avatar](http://s0.lgstatic.com/i/image2/M01/91/0B/CgoB5l2IiW2AUgXzAEVU1vdS3ek726.gif)

每一轮，从数组头部开始，每两个元素比较大小按大小方向进行交换，直到数组末尾。然后不断的重复这个过程。
> **数量优化**：每 n 轮比较，数组末尾 n 个元素都是确定的，不需要再进行比较。  
**提前中断**： 在一轮比较中，如果未发生元素交换，说明这个数组已经排序好了，可以中断排序。

```javascript
function sort(nums) {
    var hasChange
    for(var i = 0 ; i < nums.length ; i ++ ) {
        hasChange = false;
        for(var j = 0 ; j < nums.length - 1 - i ; j ++) {
            if(nums[j] > nums[j + 1]) {
                var tmp = nums[j + 1];
                nums[j + 1] = nums[j];
                nums[j] = tmp;
                hasChange = true;
            }
        }

        if(!hasChange) {
            break;
        }
    }
}
```
### 算法的空间
复杂度上是 o(1)， 
### 时间复杂度
- 最佳：正序数组，需要 n-1 次比较，复杂度为 O(n) 。
- 最坏：逆序数组，需要 n * (n - 1) /  2 次比较，复杂度为 O(n<sup>2</sup>) 。

## 插入排序
![avatar](http://s0.lgstatic.com/i/image2/M01/91/0B/CgoB5l2IiW-AJFICAFSirGa8QjY019.gif)  
不断的将未排序的元素插入已排序的数组内。

```javascript
function sort(nums) {
    var current;
    for(var i = 0 ; i < nums.length ; i ++) {
        current = nums[i]
        for(var j = i - 1 ; j >= 0 ; j --) {
            if(current > nums[j]) {
                nums[j] = current;
                break;
            }
            else {
                nums[j + 1] = nums[j]
            }
        }
    }
}
```
### 算法的空间
复杂度上是 o(1)， 

### 时间复杂度
- 最佳：正序数组，需要 n-1 次比较，复杂度为 O(n) 。
- 最坏：逆序数组，需要 n * (n - 1) /  2 次比较，复杂度为 O(n<sup>2</sup>) 。

## 归并排序
![avatar](http://s0.lgstatic.com/i/image2/M01/91/0B/CgoB5l2IiXKAR7hcAFhCcVK5jAM221.gif)

核心思路是把大问题分解成两个或者多个子问题，然后再不断的划分下去直到问题能直接解决, 原始问题的解就是子问题的合并。

把数组不断分解成左右两个子数组，直到只剩单个元素，然后再进行排序合并

```javascript
function sort(nums, lo , hi){
    // 问题到最小子集了
    if(lo >= hi) {
        return
    }

    var mid = lo + int((hi - lo) / 2);
    // 分成两个子问题
    sort(nums, lo, mid);
    sort(nums, mid, hi);

    // 合并两个子问题
    merge(nums, lo, mid, hi);
}

function merge(nums, lo ,mid, hi) {
    var copy = nums.clone();
    var k = lo, i = lo, j = mid;

    while(k <= hi) {
        if(copy[i] < copy[j]) {
            nums[k] = copy[i];
            k ++;
            i ++;
        }
        elseif(copy[j] < copy[i]) {
            nums[k] = copy[j]
            k ++;
            j ++;
        }
        elseif(i > mid) {
            nums[k] = copy[j]
            k ++ ;
            j ++;
        }
        elseif(j > hi) {
            nums[k] = copy[i]
            k ++;
            i ++;
        }
    }
}
```
### 空间复杂度
合并是需要拷贝原数组，所以是 O(n)
### 时间复杂度
对于规模为 n 的问题来说，每次都是分解成 n / 2 的问题，直到规模为 1 ，类似一个二叉树的结构。二叉树的平均深度是 log(n), 所以需要进行 log(n) 层的划分，每一层都要进行一次合并，合并的元素是所有的元素规模为 n ，也就是 O(n) 的复杂度。 那么真题的复杂度就是 O(nlogn)

## 快速排序
在分治思想上再进一步优化的就是快速排序，在数组中挑选一个基准值，分解成较大和较小的两个子数组，然后以此继续分解子数组直到问题规模为1。

```javascript
function sort(nums,int lo, int hi) {
    var p = partiton(nums, lo, hi)
    sort(nums, lo , p - 1)
    sort(nums, p + 1, hi)
}

function partiton(nums, lo, hi) {
    var p = swap(nums,random(lo, hi), hi)
    var i,j
    for(i = lo , j  = lo, j < hi ; j ++) {
        if (nums[j] < nums[hi]) {
            swap(nums, i , j);
            i ++
        }
    }
    swap(nums, i , j)
}
```

### 空间复杂度
因为不需要合并操作，只采用交换，所以只要 O(1)
### 时间复杂度
时间上和归并re排序一样是分成了 logn 层， 每一层都要进行 n - 1 次比较，所以复杂度是 O(nlogn)

## 拓扑排序
![avatar](http://s0.lgstatic.com/i/image2/M01/91/2B/CgotOV2IiXqAM6cFAFNa8qMI_JU260.gif)

和前面介绍的几种排序不同，拓扑排序应用的场合不再是一个简单的数组，而是研究图论里面顶点和顶点连线之间的性质。拓扑排序就是要将这些顶点按照相连的性质进行排序。

拓扑排序的前提是：  
1. 图必须没有环
2. 图必须是有向图

统计每个顶点的前驱（入度）, 选择入度为 0 的顶点输出。删除此顶点以及以此顶点为起点的有向边。更新顶点前驱，再次选择入度为 0 的顶点输出、剪边。 持续下去直到最后一个顶点。

算法实现上，核心点是对图的搜索。图的搜索算法分广度搜索和深度搜索。

## 算法的稳定性
- 冒泡排序  
每次排序都只是相邻元素交换位置，即使元素相等，但是在交换过程中先后顺序并不会发生变化。算法是稳定的
- 插入排序  
插入排序每次都是插入一个有序数组，也不会改变元素的先后关系，算法是稳定的
- 归并排序  
规模为 1 的子问题中，元素的稳定性不会收到破坏。在两个有序数组合并时,我们可以设置两个元素相等时，永远是前一个子数组的数子在前面，这样就保证了排序的稳定。
- 快速排序  
在一次划分大小数组结束时，会对 i 和 j 两个元素进行交换。这个交换过程会破坏稳定性。
