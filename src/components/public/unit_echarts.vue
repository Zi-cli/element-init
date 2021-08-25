<!--
 * @Description:单位饼图
 * @Version: 1.0
 * @Autor: zx
 * @Date: 2021-03-01 17:05:32
 * @LastEditors: zx
 * @LastEditTime: 2021-03-18 20:22:34
-->

<template>
<div style="width:100%;  height: 100%;">
    <div id="pie_unit" class="echarts_main">

    </div>
</div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';

    export default {
        props: ['dataList'],
        // import引入的组件需要注入到对象中才能使用
        components: {},
        data () {
            // 这里存放数据
            return {
                list: []
            }
        },
        // 监听属性 类似于data概念
        computed: {},
        // 监控data中的数据变化
        watch: {
            dataList () {
                this.showCharts()
            }
        },
        // 方法集合
        methods: {
            showCharts () {
                let colorList = [
                    { color: '#63DAAB' },
                    { color: '#657798' },
                    { color: '#5B8FF9' },
                    { color: '#EFBA1D' }
                ]
                let data = []
                this.dataList.map((res) => {
                    let obj = {
                        value: res.percentage,
                        name: this.$util.dicShow('UNIT_TYPE', res.unitType),
                        itemStyle: colorList[res.unitType - 1]
                    }
                    data.push(obj)
                })
                let myChart = this.$echarts.init(document.getElementById('pie_unit'))
                let option

                option = {
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        type: 'scroll',
                        orient: 'vertical',
                        right: 0,
                        bottom: 105,
                        icon: 'circle'
                    },
                    series: [
                        {
                            name: '单位',
                            type: 'pie',
                            radius: ['45%', '70%'],
                            center: ['40%', '53%'],
                            avoidLabelOverlap: false,
                            label: {
                                show: false,
                                position: 'center',
                                normal: {
                                    show: true,
                                    position: 'inner', // 标签的位置
                                    textStyle: {
                                        fontWeight: 300,
                                        fontSize: 12, // 文字的字体大小
                                        color: '#fff'
                                    },
                                    formatter: function (obj) {
                                        return obj.percent.toFixed(0) + '%'
                                    }

                                }
                            },
                            tooltip: {
                                show: true,
                                formatter: '{b0}: {c0} 个'
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: '12',
                                    fontWeight: 'bold'
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            data: data
                        }
                    ]
                }
                option && myChart.setOption(option)
                window.addEventListener('resize', () => {
                    myChart.resize()
                })
            }
        },
        // 生命周期 - 创建完成（可以访问当前this实例）
        created () {

        },
        // 生命周期 - 挂载完成（可以访问DOM元素）
        mounted () {
            this.showCharts()
        }
    }
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
.echarts_main{
  height: 100%;
  width: 100%;
}
</style>
