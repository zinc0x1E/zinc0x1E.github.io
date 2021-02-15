---
title:  "Method Chaining Pros & Cons"
date:   2021-02-11 10:15:02 +0800
categories: SE
tags:
  - Design Pattern
  - OOP
---

# Method Chaining -- Pros & Cons

## 什么是 Method Chaining

Method chaining（方法链，是一种 API 设计方式）。这种设计方式中，每个返回值本来应当为 `void` 的方法返回调用者本身而不是 `void`，以使得调用可以链式地延续下去。

使用这种风格设计的 API 被称作 fluent interface。

> 这种设计风格有时也被称为：
> - named parameter idion（命名参数惯用法）（似乎在 C++ 社区中用的比较多）
> - pipline

### Example

简单来说，就是一种支持以下这种链式操作的一种在设计 API 时的惯用技巧（也可以说是一种语法糖）。

```java
list.add(1)
    .add(2)
    .add(2)
    .add(5);
// [1, 2, 2, 5]
```

在 Java 的 stream API 和 JavaScript 的 Array 的某些方法使用了这个设计方式。

```js
somethings
  .filter(x => x.count > 10)
  .sort((a, b) => a.count - b.count)
  .map(x => x.name)
```

C++ 中也有这个语法糖：

```c++
std::cout << b << c;

// 这等价于
std::cout << b;
std::cout << c;
```

### Pros & Cons

尽管 method chaining 的好坏是一件非常主观的事情，过度深究下去就会变成类似于 `{}` 位置的宗教战争，但我还是尽可能的列举一些较多人认可的、多少有一些实质性影响的观点。这也是为什么可能在 Pros 和 Cons 中看到相反观点的原因。

## Pros

- 有时候，method chaining 是非常自然的，因为很多方法的返回值是另一个对象

```java
List<Dog> dogs = new ArrayList<>();
// 返回 dogs 中第一只狗距离 (0, 0) 的距离
double dist = dogs.get(0).getPosition().distanceFrom(0, 0);
```

- 某些情况下，可以使代码更加简洁，同时也不会牺牲多少可读性，甚至有时会提高可读性

```java
dog.moveUp(2);
dog.moveLeft(3);
Position position = dog.getPosition();
```

v.s.

```java
Position position = dog.moveUp(2).moveLeft(3).getPosition();
```

- 可以省略一些临时变量

```java
SomeObject someObject = new SomeObject(1, 2);
someObject.moveUp(2);
someObject.moveLeft(3);
Position newPosition = someObject.getPosition();
```

v.s.

```java
Position newPosition = new SomeObject()
                             .moveUp(2)
                             .moveLeft(3)
                             .getPosition();
```


## Cons

- 测试和 Debug 会变得复杂一些
  - 当发生异常时，通常使用 stack trace 返回的 method call 和行号来定位错误
  - 但使用 chianing method 的话就会难以准确定位到具体是哪一次调用出现了异常

```java
list.add(0).add(1).add(2).add(3); // 无法通过行号定位到错误
```

- 会使得返回另一个同类型对象的 API 与 fluent API 之间易被混淆

```java
// 函数签名，可以有两种解释方式
MyBigInteger add(MyBigInteger another);

// 1. 非 method chaining 风格，java.math.BigInteger 的做法。a 本身不发生变化，result 是一个新的值为 (a + b + c) * d 的 MyBigInteger
MyBigInteger result = a.add(b).add(c).mult(d);

// 2. method chaining 风格。 a 发生变化，a 的值变为 a + b，即 a := (a + b + c) * d
a.add(b).add(c).mult(d);
```

- 一定程度上破坏了 `.` 运算符的原有语义
  - 有人认为 `.` 运算符的语义本质上是 `调用者.操作名`
  - Chaining method 尽管语法上合规，但它隐藏了 `调用者`，一定程度上破坏了语义

- 一定程度上违背 CQRS (Command Query Responsibility Segregation)

## 总结 & 个人选择

Method chaining 说到底只是一种编程风格，更多的讨论集中于这样子做自己能不能“写得爽”和别人能不能“看得懂”，无关乎性能（大部分情况下）。所以这个总结更多的还是一种我自己个人的喜好和总结。

1. Fluent interface 不能与 CQRS 风格的接口混用
2. 使用 Method chaining 时，最好能在文档中特别注明，因为 CQRS 是更加直觉的
2. Method chaining 能简化代码中的一些重复内容
3. 可能会增加一定的理解成本，但**这是值得的**

总之，我觉得 Method chaining 写起来爽而且并不需要很高的理解成本。