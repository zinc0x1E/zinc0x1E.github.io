---
title:  "Redis 数据类型总结 - Intro"
date:   2021-03-09 18:10:02 +0800
categories: database
type: note
publish: false
archive: false
tags:
  - Redis
  - 源码解析
---

# Redis 数据类型总结 - Intro

> 本篇笔记主要针对《Redis 设计与实现》第八章，亦参考了包括其他章节和 Redis 官方文档在内的一些其他资料，完整参考资料详见文末“参考资料”部分。

> **Prerequisite**:
> 
> 1. Redis 使用 C 语言实现
> 2. 

> 本文基于 Redis 6.2 进行分析，会与《Redis 设计与分析》第二版略有偏差。

## Redis 类型与编码

- Redis 使用对象存储 Key 和 Value
- 每当创建 KV 对时，Redis 会至少创建两个对象，其中一个键对象，另一个是值对象
- Redis 中的对象由 `redisObject` 结构体表示
- 对应源码位于 `server.h`

```C
typedef struct redisObject {
    unsigned type:4;
    unsigned encoding:4;
    unsigned lru:LRU_BITS; /* LRU time (relative to global lru_clock) or
                            * LFU data (least significant 8 bits frequency
                            * and most significant 16 bits access time). */
    int refcount;
    void *ptr; // 指向底层数据结构的指针
} robj;
```

### 类型 （对应 `robj.type` 字段）

- Redis 中现有 7 种类型
  - `string`
  - `list`
  - `set`
  - `zset`
    - Sorted set
  - `hash`
  - `module`
    - 一种内部类型，type 为 module 的对象由 Redis 模块直接管理
    - 不能作为值对象类型
    - 后文不具体展开讨论此类型
  - `stream`
    - 不能作为值对象类型
    - 后文不具体展开讨论此类型
- Redis 的键对象总是一个 `string` 类对象
- 当称呼一个键是“xx 键”时，意为这个键所对应的值是 xx 类型
  - e.g. “列表键” 指这个键所对应的值是列表类型

```C
/* The actual Redis Object */
#define OBJ_STRING 0    /* String object. */
#define OBJ_LIST 1      /* List object. */
#define OBJ_SET 2       /* Set object. */
#define OBJ_ZSET 3      /* Sorted set object. */
#define OBJ_HASH 4      /* Hash object. */

/* The "module" object type is a special one that signals that the object
 * is one directly managed by a Redis module. In this case the value points
 * to a moduleValue struct, which contains the object value (which is only
 * handled by the module itself) and the RedisModuleType struct which lists
 * function pointers in order to serialize, deserialize, AOF-rewrite and
 * free the object.
 *
 * Inside the RDB file, module types are encoded as OBJ_MODULE followed
 * by a 64 bit module type ID, which has a 54 bits module-specific signature
 * in order to dispatch the loading to the right module, plus a 10 bits
 * encoding version. */
#define OBJ_MODULE 5    /* Module object. */
#define OBJ_STREAM 6    /* Stream object. */
```

### 编码（对应 `robj.encoding` 字段）

- `robj.ptr` 指向作为数据内容
- `robj.encoding` 为数据内容的存储结构类型


```C
/* Objects encoding. Some kind of objects like Strings and Hashes can be
 * internally represented in multiple ways. The 'encoding' field of the object
 * is set to one of this fields for this object. */
#define OBJ_ENCODING_RAW 0     /* Raw representation */ /* 对应 SDS，底层是 char[]，可以视作是 raw bytes */
#define OBJ_ENCODING_INT 1     /* Encoded as integer */ /* 底层是 long 型整数 */
#define OBJ_ENCODING_HT 2      /* Encoded as hash table */ /* 《Redis 设计与实现》中称作“字典” */
#define OBJ_ENCODING_ZIPMAP 3  /* Encoded as zipmap */
#define OBJ_ENCODING_LINKEDLIST 4 /* No longer used: old list encoding. */ /* 双端链表 */
#define OBJ_ENCODING_ZIPLIST 5 /* Encoded as ziplist */ /* 压缩列表 */
#define OBJ_ENCODING_INTSET 6  /* Encoded as intset */
#define OBJ_ENCODING_SKIPLIST 7  /* Encoded as skiplist */ /* 《Redis 设计与实现》中称作“跳跃表” */
#define OBJ_ENCODING_EMBSTR 8  /* Embedded sds string encoding */
#define OBJ_ENCODING_QUICKLIST 9 /* Encoded as linked list of ziplists */
#define OBJ_ENCODING_STREAM 10 /* Encoded as a radix tree of listpacks */
```

## 参考资料

1. 黄健宏，《Redis 设计与实现》第二版第八章
2. https://github.com/redis/redis/blob/6.2/src

