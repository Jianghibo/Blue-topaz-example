---
alias: 
tags: 学习
cdate: 2026-10-25 16:00
uid: 20261025160029 
cssclass: 
Cover: 
---

## Metadata
Status::    #笔记状态/🌱发芽
Source Type::  #📥/💭想法 
Topic:: [[笔记]]
Author:: 
Source URL:: 

## 长青笔记
一句话概括这篇笔记的内容
Summary:: 

## ELF文件
### 基础概念介绍
ELF主要包括三种类型文件：
    1. 可重定位文件(relocatable)：编译器和汇编器产生的.o文件，被Linker所处理
    2. 可执行文件(executable)：Linker对.o文件进行处理输出的文件，进程映像
    3. 共享对象文件(shared object)：动态库.so
ELF布局示意图如下：
![[IMG-20261025171251931.png]]
上图左右两侧分别呈现的不同角度的视图，左侧是链接视图(编译链接阶段，物理文件视图)，右侧是加载视图(运行时加载阶段，运行内存视图)。section是开发者可见的，而segment是开发者不可见的，一个segment可能包含多个sections。

* ELF header：描述体系结构和操作系统等基本信息，指出section header table和program header table在文件中的位置。

## 相关文章
Page Link::  
* [ELF 符号：复杂又麻烦的技术细节](https://www.bluepuni.com/archives/elf-symbols)
* [ELF文件格式简介 --- 见过最细致的ELF讲解](https://www.cnblogs.com/gongxianjin/p/16906719.html "发布于 2022-11-19 18:26")
* [Relocation](https://www.sco.com/developers/gabi/2012-12-31/ch4.reloc.html)
* [System V Application Binary Interface (or ABI)](https://www.sco.com/developers/gabi/2012-12-31/contents.html)
* [ELF for the Arm 64-bit Architecture](https://github.com/ARM-software/abi-aa/releases/download/2025Q1/aaelf64.pdf)
* [System V Application Binary Interface AMD64 Architect Processor Supplement](https://gitlab.com/x86-psABIs/x86-64-ABI)
* [Linker and Libraries Guide](https://docs.oracle.com/cd/E23824_01/html/819-0690/index.html)
* [Making our own executable packer](https://fasterthanli.me/series/making-our-own-executable-packer)
* [ELF Binaries and Relocation Entries](https://stffrdhrn.github.io/hardware/embedded/openrisc/2019/11/29/relocs.html)
* 