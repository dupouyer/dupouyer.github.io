---
title: "UWA使用"
date: 2020-06-03
updated: 2020-06-03
categories:
  - Unity
tags:
  - tools
---


# 环境准备
## 准备内容
下载最新的 UWA_SDK,包含了三个平台的 unitypackage 以及目标真机平台和 windows 的UWATools安装包
![SDK内容](https://raw.githubusercontent.com/dupouyer/dupouyer.github.io/hexo/source/_posts/img/2020-6-3/1.png)
## 准备步骤
这里以安卓平台为例
### Unity 工程准备
- 导入目标平台的 unitypackage ( UWA_SDKV2.2.0_Android.unitypackage ) 到需要测试的 unity 工程内。
![导入SDK](https://raw.githubusercontent.com/dupouyer/dupouyer.github.io/hexo/source/_posts/img/2020-6-3/6.png)
- 拖入 sdk 内的 prefab 至 scenes 下
![setPrefab](https://raw.githubusercontent.com/dupouyer/dupouyer.github.io/hexo/source/_posts/img/2020-6-3/5.png)
Game窗口下出现 UWA 的插件 UI 并无报错信息，表示 SDK 接入成功。
![SDK Completed](https://raw.githubusercontent.com/dupouyer/dupouyer.github.io/hexo/source/_posts/img/2020-6-3/7.png)
- 点开 tools/UWASDK 进行 SDK 的配置
![SDK Completed](https://raw.githubusercontent.com/dupouyer/dupouyer.github.io/hexo/source/_posts/img/2020-6-3/2.png)
按照警告的提示进行编译设置或者选择自动配置，GOT 和 GPM 的选项表示 SDK 能以那种测试模式进行测试
    - GOT 模式  
    支持 Android，iOS 和 Windows 发布平台，支持 Development Build 和 Release 打包方式
    - GPM 模式  
    只支持 Development Build 打包方式。支持四种测试模式，包含：

        | 模式 | android | ios | windows |
        | :----- | :----: | :----: | :----: |
        |Overview（总体性能分析）| √ | √ | √ |
        |Mono（Mono 堆内存分析）| √ | × | √ |
        |Assets（运行时资源）| √ |√ | √ |
        |Lua（Lua 性能分析）| √ |× | √ |
    注：若使用 il2cpp 发布设置时，各发布平台的 Mono 模式均不支持  
    Lua 模块仅适用于使用 Lua 的项目

### 目标测试平台准备
- 安装 UWA_tools 并登入账号

### 发布目标平台包体
- 可以使用 SDK 的发布设置也可以用 buildplay 进行发布
- 安装此测试包至测试平台

## 测试步骤
- 启动游戏后，在右上角的 UWA 窗口选择测试模式。
![set Mode](https://raw.githubusercontent.com/dupouyer/dupouyer.github.io/hexo/source/_posts/img/2020-6-3/8.png)  
Direct Mode 点击后，按钮会变绿，并自动关闭项目。再次启动项目后，会自动进入上一次选择的模式，可以用来测试项目启动时的性能。

- 点击 start 开启采集, 此 UI 可随意拖动  
![start](https://raw.githubusercontent.com/dupouyer/dupouyer.github.io/hexo/source/_posts/img/2020-6-3/9.png)  
- 点击 stop 停止采集  
![start](https://raw.githubusercontent.com/dupouyer/dupouyer.github.io/hexo/source/_posts/img/2020-6-3/10.png)  

- 打开 UWA_tools 上传测试数据，可选择上传至 online 也可以上传 local server

### 上传 online 
- 在 UWA_Tools 工具下选择要上传的数据，选择 Online ，选择目标项目或者新建项目。点击提交数据
- 打开 uwa 官网，进入 GOT_Oline 选项，选择上传的项目进行查看

### 上传本地服务器
如果没钱上传 online 也可以通过设置 local server 上传到本地服务器进行查看
- 选择 GOT ，点击提交数据，
- 在本地服务器也就是 UnityEditor 中进行查看。

local server 设置
![set Mode](https://raw.githubusercontent.com/dupouyer/dupouyer.github.io/hexo/source/_posts/img/2020-6-3/4.png)  
点击 WIFI 运行。ip 地址是自动获取的本机地址，在 UWA_Tools 中输入服务器的地址（注意不需要输入端口）, 测试通过后即可提交数据  
如果地址连接不上也可进入目标平台的资源管理器中找到对应数据复制到本地服务器的保存目录下。
- 本地服务器保存地址在 Assets 同级下的 TestData 目录内
- 目标平台测试数据地址在 UWA-DataCenter/ProfileData 内


# 数据分析
待更新
## 用例1
用例简述
### 基本情况
### CPU情况
### GPU情况
### 内存情况