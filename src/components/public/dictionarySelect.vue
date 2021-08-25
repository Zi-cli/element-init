<!--
 * @Author: your name
 * @Date: 2020-10-27 17:21:56
 * @LastEditTime: 2021-03-05 15:00:20
 * @LastEditors: zx
 * @Description: In User Settings Edit
-->
<!-- 数据字典下拉框-->

<template>
    <el-select
        v-model="value"
        :disabled="disabled"
        size="mini"
        @change="handleChange"
        filterable
        clearable
        placeholder="-- 请选择 --"
    >
        <el-option
            v-for="item in options"
            :key="Number(item.labelValue)"
            :label="item.labelName"
            :value="Number(item.labelValue)"
        >
        </el-option>
    </el-select>
</template>

<script>
// import { unitsOptions } from '@/api/api'
    export default {
        props: ['defaultVal', 'disabled', 'dicName'],
        data () {
            return {
                options: [],
                value: '',
                name: '',
                dictionaries: this.$session.get('dict')
            }
        },
        watch: {
            defaultVal (val) {
                this.value = val
            }
        },
        methods: {
            handleChange (val) {
                if (val) {
                    this.$emit('update:defaultVal', val)
                } else {
                    this.$emit('update:defaultVal', '')
                }
            }
        },
        mounted () {
            this.defaultVal && (this.value = Number(this.defaultVal))
            this.dicName && (this.options = this.dictionaries[this.dicName])
            this.options && (this.options.sort((a, b) => {
                return Number(a.labelValue) - Number(b.labelValue)
            }))
        }
    }
</script>

<style></style>
