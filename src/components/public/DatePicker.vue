<template>
  <el-date-picker
    :disabled="disabled"
    size="mini"
    style="width:180px"
    v-model="monthDate"
    :clearable="isClearable"
    :editable="false"
    :type="type"
    :value-format="dataFormat"
    :picker-options="pickerOptions"
    placeholder="-- 请选择 --" ref="datesRef">
  </el-date-picker>
</template>

<script>
/**
 * 参数说明：
 * 1、defaultVal：默认日期（非必传）
 * 2、dateType：组件类型（必传）
*/
    export default {
        // props: ['defaultVal','dateType'],
        props: {
            disabled: {
                type: Boolean,
                default: false
            },
            pickerDate: {},
            defaultVal: { type: [Date, String, Number] },
            dateType: {
                type: String,
                required: true
            },
            clearable: {
                type: Boolean,
                default: true
            }
        },
        data () {
            const vm = this
            return {
                dataFormat: '',
                monthDate: '',
                isClearable: true, // 是否可清除
                type: '', // 时间格式类型
                pickerOptions: {
                    disabledDate (date) {
                        if (date.getTime() > new Date(vm.pickerDate).getTime()) { return true }
                        return false
                    }
                }
            }
        },
        watch: {
            /**
             * month 获取年月
             * date 获取年月日
             * dates 获取多个日期
             */
            monthDate (date) {
                switch (this.type) {
                case 'month':
                    this.$emit('getMonthDate', date ? this.$moment(date).format('YYYY-MM') : '')
                    break
                case 'date':
                    this.$emit('getMonthDate', date ? this.$moment(date).format('YYYY-MM-DD') : '')
                    break
                case 'dates':
                    this.$emit('getMonthDate', (date && date.map(dates => this.$moment(dates).format('YYYY-MM-DD'))) || [])
                    break
                case 'year':
                    this.$emit('getMonthDate', date ? this.$moment(date).format('YYYY') : '')
                    break
                case 'datetime':
                    this.$emit('getDatetime', date ? this.$moment(date).format('YYYY-MM-DD HH:mm:ss') : '')
                    break
                default:
                    this.$emit('getMonthDate', '')
                    break
                }
            },
            defaultVal (news) {
                this.monthDate = news
                this.$nextTick(() => {
                    this.getDefaulDate(this.type)
                })
            }
            // isRefresh () {
            //   this.monthDate = ''
            // }
        },
        methods: {
            getDefaulDate (type) { // 设置默认时间
                switch (type) {
                case 'month':
                    this.defaultVal && (this.monthDate = this.$moment(this.defaultVal).format('YYYY-MM'))
                    break
                case 'date':
                    this.defaultVal && (this.monthDate = this.$moment(this.defaultVal).format('YYYY-MM-DD'))
                    break
                case 'year':
                    this.defaultVal && (this.monthDate = this.$moment(this.defaultVal).format('YYYY'))
                    break
                case 'dates':
                    this.defaultVal && (this.monthDate = this.defaultVal)
                    break
                case 'datetime':
                    this.defaultVal && (this.monthDate = this.$moment(this.defaultVal).format('YYYY-MM-DD HH:mm:ss'))
                    break
                default:
                    break
                }
            }
        },
        mounted () {
            if (this.dateType === 'dates') {
                this.dataFormat = 'yyyy-MM-dd'
            }
            this.type = this.dateType
            this.isClearable = this.clearable
            this.monthDate = this.defaultVal
            this.$nextTick(() => {
                this.getDefaulDate(this.type)
            })
        }
    }
</script>

<style>
</style>
