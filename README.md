# 一、开发前必读
> 为了更好阅读该文档，建议使用vscode的小伙伴，阅读之前先安装Markdown Shortcuts插件，然后打开该文件，CTRL+Shift+V ，即可预览该文件
## 1、框架技术选型
> 1、vue-cli脚手架从2.0升级至4.0，用法一致，性能更佳 （本地有安装过旧版本，必须先卸载再安装）
```
npm uninstall vue-cli -g //或者 yarn global remove vue-cli
```
> 2、node版本需要 大于等于8.9，推荐8.11.0+

> 3、css预处理器采用sass，简化css代码，解决兼容性问题

> 4、javascript 代码检测工具使用 EsLint + Prettier(保存之后立即检测)，如用vscode需配置相关验证机制

> 5、新增图形化界面管理，可以通过命令 vue ui ，进入图形化管理项目，可进行相应性能检测


## 2、多环境配置

    2.1 本地开发环境（需用户自行创建配置文件）
        2.1.1、在根目录新建 .env.local 文件作为本地环境配置文件
        2.1.2、文件内容：
                NODE_ENV = local                          // 多环境编码
                VUE_APP_URL = http://121.40.109.53/api   // local环境api 根路径

    2.2 测试环境
        2.2.1、配置文件在根目录 .env.development
    
    2.3 生产环境
        2.3.1 配置文件在根目录  .env.development


## 3、工程目录说明
```
    |-public                    静态资源会被复制到输出目录
      |-favicon.ico
      |-index.html
    |-src
      |-api                     与后端交互使用的相关方法和配置             
      |-assets                  放置一些静态资源，例如图片、字体、css文件等等
        |-images
        |-css
      |-components              公共组件
        |-HelloWorld.vue
      |-utils                   封装的工具函数
        |-http.js
      |-views                   所有路由组件
        |-index.vue
      |-app.vue                 路由组件的顶层路由
      |-main.js
      |-router.js               vue-router 相关配置
    |-.env.development          测试环境相关配置
    |-.env.production           生产环境相关配置
    |-.eslintrc.js              代码校验规则文件
    |-.gitignore                配置不提交至git仓库的文件
    |-package.json              依赖包配置
    |-postcss.config.js         css编译工具配置
    |-README.md                 项目说明
    |-vue.config.js             webpack配置说明
 ```

 ## 4、命名约定
    
todo: 各项目根据实际情况可提前对项目中专业名次进行相关命名约定


 ## 5、待升级/开发组件、功能

todo：各项目可根据项目实际情况进行项目组件的开发和升级


  ## 5、Docker 推送镜像至远程仓库
  > 1、本地安装docker

  > 2、工程根目录创建DockerFile文件，并配置相关路径

  > 3、登陆远程仓库，命令：docker login --username admin --password Admin123 harbor.onesport.com.cn

  > 4、在项目根目录创建本地镜像，命名： docker build -f DockerFile -t harbor.onesport.com.cn/all-in-one/data-center-sys:1.0 .

  > 5、发布本地镜像至远程仓库，命令：docker push harbor.onesport.com.cn/all-in-one/data-center-sys:1.0 

  > 6、windows系统 命令前统一加call

# 二、代码规范
  ## 1、基础规范

  ### (一) 命名规范

1. **【** 强行 **】** 文件命名以烤肉串格式

> 正例：demo-test

> 反例：Demo/demoTest

2. **【** 强行 **】** 方法命名以驼峰法格式

> 正例：getTableData

> 反例：Demo / demo-test / demo\_test

3. **【** 推荐 **】** 变量命名要突出语义化

> 正例：（数组）let aTableData = []

> 正例：（字符串）let sName

4. **【** 强行 **】** 函数命名要突出语义化

> 正例：function canRead () {} 是否可阅读

> 正例：function getName() {} 获取姓名

> 反例：function tableData () {} 获取列表

5. **【推荐】** 常量命名全部大写，使用大写字母和下划线组合，下划线用来分割单词

> 正例：const MAX\_COUNT = 1

> 反例：const num = 0

  ### (二) 代码缩进
**1.【** 强行 **】** 以四个空格缩进，代码长度较长，变量较多时按下面例子换行，长度较短时保持一行
> 正例：
```
<el-tree
    ref="tree"
    :data="data"
    show-checkbox
    node-key="id"
    :default-expand-all="true"
    :props="defaultProps"
    :default-checked-keys="arrChecked"
    @check="selectChecked">
</el-tree>
```

### (三) 代码注释

**1.【** 强行 **】** 普通方法一般使用单行注释，在双斜杠后方预留一个空格，再书写注释语句。

> 正例：getTableData // 获取数据

**2.【** 强行 **】** 文件声明一般使用单行注释，其中组件描述、作者、时间、参数说明四个一定要，其它可灵活选择！
```
/**
 * Author：     xxx
 * CreateTime： 2020-03-02
 * Desc：xxxx
 * params {Object} listData [列表数据]
 */

```

### (四) 使用严格等

**1.【** 强行 **】** 总是使用 === 精确的比较操作符，由javascript的强制类型转换所造成的困扰。等同 == 和严格等 === 的区别

### (五) alt标签不能为空
> img 标签alt属性指定代替文本

### (六) 代码格式规范
关键字后面加空格、函数声明时括号与函数之间加空格
> 正例：if (condition) { .... }

> 反例：if(condition){ .... }

逗号后面加空格
> 正例：list = [1, 2, 3]

如果有更好的实现，尽量不要使用三元表达式
> 正例：let score = let || 0

> 反例：let score = let ? let : 0

代码块中避免多余空白

> 反例：
```
if (test) {

  let ban = test
}
```
## 2、Vue框架规范
 ### (一) 命名规范
 > 1、【强行】路由命名以大写字母开头的PascalBase风格，路由url统一使用kebab-case的风格。

 > 2、【强行】文件夹命名，属于components文件夹下的子文件夹，使用大写字母开头的PascalBase风格。其他文件夹统一使用kebab-case的风格。

 > 3、【强行】组件命名以大驼峰法格式
 ```
 Vue.component('MyComponent', {
   // todd...
 })

 ```

 > 4、Prop

 1、【推荐】定义 Prop 的时候应该始终以驼峰格式（camelCase）命名，在父组件赋值的时候使用连接线（-）。这里遵循每个语言的特性，因为在 HTML 标记中对大小写是不敏感的，使用连接线更加友好；而在 JavaScript 中更自然的是驼峰命名。
 ```
 正例：
 props: {
   atrStatus: Boolean
 }
 <arc-liat :atr-status="true"></arc-liat>
 ```

 2、【推荐】Prop 的定义应该尽量详细的指定其类型、默认值和验证
 ```
  props: {
    firstRow: {
      type: String
    },
    selectType: {
      type: Number,
      default: 1
    },
    selectVal: {
      type: [String, Object]
    }
  }

 ```

 ### (二) 钩子顺序
 > 【推荐】推荐尽量按照该钩子顺序编写vue文件
 ```
 export default {
   name: '',
   mixins: [], // 混入组件
   components: {}, 组件
   props: {},
   data () {
     return {}
   }, // 数据
   watch: {}, // 监听
   computed: {}, // 计算属性
   methods: {}, // 方法
   created () {}, // 创建周期
   mounted () {}, // dom挂载周期
   filters: {}, // 过滤
   directives: {}, // 指令
   destroyed: {} // 实例销毁
 }
 ```
### (三) v-for

> 1.【强行】在执行v-for 遍历的时候，总是应该带上key值使更新DOM	时渲染效率更高
```
<div 
  v-for="item in list" 
  :key="item.id"
>
  {{item.name}}
</div>
```

>2.【强行】v-for 应该避免与 v-if 在同一个元素上使用，因为 v-for 的优先级比 v-if 更高，为了避免无效计算和渲染，应该尽量将 v-if 放到容器的父元素之上。

反例：
```
<div 
  v-if=“show”
  v-for="item in list" 
  :key="item.id"
>
  {{item.name}}
</div>
```

正例

```
<div v-if=“show”>
  <div
    v-for="item in list" 
    :key="item.id"
  >
    {{item.name}}
  </div>
</div>
```

### (四) 指令的缩写
> 为了统一规范始终使用指令缩写，使用v-bind，v-on并没有什么不好，这里仅为了统一规范

### (五) 样式的规范
> 1.【强行】为了避免样式冲突，整个项目全部使用scoped特性
```
推荐：
<style scoped>
  .header {
    ...
  }
</style>

需要用到隐藏样式的新建一个不带scoped特性的style标签，样式命名用烤肉串格式
<style>
#app .header {
  ...
}
</style>
```

>2、元素选择器应该避免在 scoped 中出现。在 scoped 样式中，类选择器比元素选择器更好，因为大量使用元素选择器是很慢的。
```
反例：
<style scoped>
 button {
   color: red;
 }
</style>
```

### (六) 单文件组件的顶级元素顺序
> 【强行】为了统一和便于阅读，应该按template、script、style 的顺序放置。
```
<template>
  xxx
</template>

<script>
  xxx
</script>

<style scoped>
  xx
</style>
```

### (七) Vue文件唯一标识
> 【强行】每个vue文件必须添加相应的name，name值的命名使用UpperCamelCase 风格，遵守驼峰形式

### (八) 表单空格校验
> 【强行】表单需要进行相应空格去除，推荐实行v-model.trim实现

## 3、JavaScript

### (一) var / let / const
> 【推荐】 如果当前环境支持 let、const，则推荐不再使用 var，而使用 let / const，优先使用 const。任何一个变量的使用都要提前申明，除了 function 定义的函数可以随便放在任何位置。

### (二) 引号
> 【推荐】不再使用双引号，静态字符串使用单引号，动态字符串使用反引号衔接

```
反例：
const foov = "你好"
const bar = foo + “， xxx”

正例：
const foot = ‘你好’
const bar = `${foot},xxx`
```

### (三) 函数
> 【推荐】匿名函数统一使用箭头函数，多个参数/返回值时优先使用对象的结构赋值
```
反例：
function getInfo (name, sex) {
  return [name, sex]
}

正例：
function getInfo ({ name, sex }) {
  return { name, sex }
}
```

> 函数名统一使用驼峰命名，以大写字母开头申明的都是构造函数，使用小写字母开头的都是普通函数，也不该使用 new 操作符去操作普通函数。

### (四) 模块

> 【强行】统一使用import/export的方式管理项目的模块，import统一放在文件顶部，如果模块只有一个输出值，使用export default，否则不用

```
export default {}

import router from 'xxx'
```

## 4、HTML / CSS
### (一) 标签
>【推荐】在引用外部 CSS 或 JavaScript 时不写 type 属性。HTML5 默认 type 为 text/css 和 text/javascript 属性，所以没必要指定。

### (二) 协议
> 【推荐】省略协议头部声明，例如：http:、https:，建议不加引号。

### (三) 文档类型
> 【强制】应该总是使用 HTML5 标准。
```
<!DOCTYPE html>
```

### (四) Table
> 【推荐】应该避免使用 table 做页面布局，因为同样的布局使用 table 要多几倍的渲染时间；当然使用 table 做表格是完全正确的。

### (五) 注释
> 应该给一个模块文件写一个区块注释。

### (六) css样式的书写顺序
>1、【推荐】css样式的书写顺序如下，减少浏览器reflow（回流），提升浏览器渲染dom的性能。
```
1、位置属性(position、top、right、z-index、display、float等)；
2、大小(width, height, padding, margin等)；
3、文字系列(font、line-height、letter-spacing、color、text-align等)；
4、背景(background、border等)；
5、其他(animation、transition等)。
```

> 2、【推荐】选择器尽可能简单，能使用 .test 别使用 div.test；每个选择器和声明都要独立新行。

> 3、【推荐】如无必要，不得为 id、class 选择器添加类型选择器进行限定，在性能和维护性上，都有一定的影响

> 3、【推荐】Class 和 ID 的命名应该语义化，通过看名字就知道是干嘛的；多个单词用连接线 - 连接。

> 4、【推荐】CSS 属性尽量使用缩写，提高代码的效率和方便理解。
```
反例：
margin-top:10px;
margin-bottom:10px;
magrin-left:10px;
margin-right:10px;

正例：
margin：10px；
```

> 5、媒体查询的位置：
【推荐】媒体查询放在相关规则后面或者统一放在文档底部，若统一放在文档底部的时候，顺序应按照正常样式进行排布且注释统一。

> 6、a标签伪类书写顺序

【强制】a标签伪类书写顺序为：

:link（a标签还未被访问的状态）

:visited（a标签还未被访问的状态）

:hover（a鼠标悬停在a标签上的状态）

:active（a标签被鼠标按着时的状态）

 
 









