<!--
 * @Date: 2021-02-20 09:51:05
 * @LastEditors: zx
 * @LastEditTime: 2021-03-10 17:46:06
 * @FilePath: \association-competition-admin\src\views\member\home\components\people_echarts.vue
-->
<template>
<div style="width:100%;  height: 100%;">
    <div id="bar_people" class="echarts_main">

    </div>
</div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';

    export default {
        props: ['memberList', 'type'],
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
            memberList () {
                this.showCharts()
            }
        },
        // 方法集合
        methods: {
            showCharts () {
                let [Xdata, manData, wData, useMemerData] = [[], [], [], []]
                let projectId = this.$session.get('projectId')
                let memBerType = projectId === 1 ? 'MEMBER_TYPE_1' : 'MEMBER_TYPE_2'
                this.memberList.map((item) => {
                    Xdata.push((this.$util.dicShow(memBerType, item.memberType)))
                    manData.push(item.maleCount)
                    wData.push(item.femaleCount)
                    useMemerData.push(item.normalCount)
                })
                let myChart = this.$echarts.init(document.getElementById('bar_people'))
                let tip
                if (Number(this.type) === 1) {
                    tip = ['男', '女', '有效会员数']
                } else {
                    tip = ['男', '女']
                }
                let option

                option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    legend: {
                        data: tip,
                        left: '10',
                        top: '10'
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: Xdata,
                            axisTick: {
                                alignWithLabel: true
                            },
                            axisLabel: {
                                rotate: 37, // 字体倾斜度数
                                textStyle: {
                                    fontSize: 12 // 字体大小
                                },
                                margin: 15
                            }

                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            minInterval: 1
                        }
                    ],
                    series: [
                        {
                            name: '男',
                            type: 'bar',
                            barWidth: '20%',
                            data: manData,
                            color: ['#6EB8FC']
                            // barMinHeight: 10
                        },
                        {
                            name: '女',
                            type: 'bar',
                            barWidth: '20%',
                            data: wData,
                            color: ['#94CC59']
                            // barMinHeight: 10
                        }
                    ]
                }
                if (Number(this.type) === 1) {
                    // 曲线
                    let obj = {
                        name: '有效会员数',
                        data: useMemerData,
                        color: ['#FF8B17'],
                        type: 'line',
                        smooth: true
                    }
                    option.series.push(obj)
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
            if (this.memberList) {
                this.list = this.memberList
            }
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
