<!--
 * @Author: your name
 * @Date: 2020-05-21 14:58:55
 * @LastEditTime: 2020-05-22 11:54:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \venue-booking\src\components\public\Nation.vue
-->
<template>
  <el-select v-model="value" size="mini" @change="handleChange" filterable value-key="id" clearable placeholder="输入搜索">
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.baseName"
      :value="item">
    </el-option>
  </el-select>
</template>

<script>
    import { baseList } from '@/api/api'
    export default {
        props: ['defaultVal'],
        data () {
            return {
                options: [],
                value: ''
            }
        },
        watch: {
        },
        methods: {
            handleChange (val) {
                if (val) {
                    this.$emit('getBaseData', val)
                } else {
                    this.$emit('getBaseData', this.options)
                }
            },
            getAllNation () {
                baseList({ baseName: null }).then(res => {
                    this.options = res
                    this.$emit('getBaseData', this.options)
                })
            }
        },
        mounted () {
            this.getAllNation()
            this.defaultVal && (this.value = this.defaultVal)
        }
    }
</script>

<style>
</style>
