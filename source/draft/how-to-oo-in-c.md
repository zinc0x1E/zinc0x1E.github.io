# How to OOP With C

- 本文目标
  - 为 C 语言构建一套 OOP 的方法
- 本文的前置知识
  - C 语言基础
  - C++ / Java 或单纯的 OOA/D 基础
- 代码运行环境
  - ANSI C
  - Linux, GCC

---

## 需求

既然要 OOP with C，那么就一定要找到一种**类**的写法，以及实现这三项 OOP 基本特征的方法：

- 继承
- 多态
- 封装

此外，就像 C++、Java 和其他支持 OOP 的现代语言中的大多数一样，我们需要提供

- 泛型（模板类 / 模板函数）
- 接口 / 抽象类

## 目标

根据需求，具体而言，本文的最终目标是用 C 实现如下代码。

```Java

// Animal.java
public abstract class Animal implements Movable, Breathable {
  public String animalName;
  private int age;

  public void iAm() {
    System.out.println("I am " + this.animalName);
  }

  public void breathTwice() {
    System.out.println(this.iAm() + "is breathing");
    this.breath();
    this.breath();
    System.out.println(this.iAm() + "has breath twice");
  }

  // From Breathable
  @Override
  public void breath() {
    System.out.println("Animal is breathing");
  }
}

// Child.java
public class Cat extends Parent {
  public String ownerName;

  // getter, setter...

  // From Movable
  @Override
  public void move() {
    System.out.println("Cat is moving using ");
  }

  // From Animal
  @Override
  public void iAm() {
    System.out.println("I am " + this.owner + "'s cat: " + this.animalName);
  }

}

// BlackCat.java
public class BlackCat extends Cat implements Invisible {

  // From Invisible
  @Override
  public char turnInvisible() {
    System.out.println("You can't see me");
  }
}
```

并得到以下结果。