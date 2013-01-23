# {lib}util/query


## 组成

包含3个部分: 

1. __nes.js__ —— 外部依赖选择器nes([项目地址](https://github.com/leeluolee/nes))
2. __query.js__ —— 选择器接口适配
3. __chainable.js__ —— 提供链式调用API的包装器


## 使用

### 1. 只需要使用选择器
```
var f = function(){
    var _e = 
}
define('xxx.js', ['{lib}util/query/query.js'], f)

```
其中`_$`、`_$$`  `_e._$one` 与 `_e._$all` 相对应。

 
## 风格选取

* 走jQuery的老路, 如 Kissy、Tangram。现在已经近乎是最佳实践的方案(因为社区庞大). 

__缺点是__: 1. 二义性(jQuery火了这么久，基本已经熟悉了这个约定) 2. 方法中经常会需要判断是否是单节点，做不同操作，在后面扩展中，迈不开步子容易扯着蛋

*. 延续走变向的prototype、mootools(YUI3也类似, 不过Node跟NodeList的维系要弱的多)的路, 两个接口_$与_$$, 仍然是包装器的形势

__缺点是__: 1. 两个接口  2. 维护两份包装类(比如有多情况下你的要求只是对所有的这些节点做一次相同的set操作)

昨天飞哥没来 我先简单实现了__风格2__.只是对可以链式的接口做了转移(如_$addClassName等), 对于上面提到的两个问题: 

1. 首先nej是个框架，接口的限制在这里不是很明显,(Mootools、Prototype都暴露了百来个全局, 当然这个不是典型案例, 已经与时代脱节)。
2. 两份包装类(_Node、_NodeList)，某些方法是可以共生的，我暂时是利用跟Mootools类似的方式，留个hook，在_Node扩展时，给_NodeList也做一份，这之中当然要有一些简单的约定


