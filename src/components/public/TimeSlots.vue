<template>
  <div class="block" :id="showStyle? 'showStyle' : ''">
    <el-date-picker
      v-model.trim="timeSlot"
      @focus="valFocus"
      @change="valChange"
      :type="typeName"
      :value-format="timeType"
      range-separator="至"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
      :disabled = disabled
      align="right"
      size="mini"
      :picker-options="isPickerOptions? pickerOptions: '{}'">
    </el-date-picker>
  </div>
</template>

<script>
    export default {
        props: {
            disabled: {
                default: false
            },
            defaultVal: {
                default: ''
            },
            typeName: {
                default: 'daterange'
            },
            name: {
                default: null
            },
            isPickerOptions: {
                default: false
            },
            beforeTime: {
                default: null // 不得早于得时间限制
            }
        },
        watch: {
            // 需要监听原始数据的
            defaultVal (news) {
                this.timeSlot = news
            }
        },
        computed: {
            // 不同条件判断时间禁止的范围
            pickerOptions () {
                const that = this
                if (that.beforeTime) {
                    return {
                        disabledDate (time) {
                            return time.getTime() < new Date(that.beforeTime).getTime() - (24 * 60 * 60 * 1000)
                        }
                    }
                } else {
                    return {
                        disabledDate (time) {
                            return time.getTime() > Date.now()
                        }
                    }
                }
            }
        },
        data () {
            return {
                timeSlot: '',
                showStyle: false,
                timeType: null
            }
        },
        methods: {
            valChange (val) {
                this.$emit('getValChange', val, this.name)
            },
            valFocus () {
                if (this.beforeTime) {
                    this.pickerOptions.num = 1
                }
            }
        },
        mounted () {
            if (navigator.userAgent.indexOf('MSIE 9.0') > 0) {
                this.showStyle = true
            }
            if (this.typeName === 'date') {
                this.timeType = 'yyyy-MM-dd'
            } else if (this.typeName === 'daterange') {
                this.timeType = 'yyyy-MM-dd'
            }
            if (this.defaultVal) {
                this.timeSlot = this.defaultVal
            }
        }
    }
</script>

<style>
  .el-range-editor--mini.el-input__inner {
    height: 30px !important;
  }
</style>
