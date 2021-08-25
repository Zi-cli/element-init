<!--
 * @Author: your name
 * @Date: 2020-10-27 17:21:56
 * @LastEditTime: 2021-02-24 09:41:42
 * @LastEditors: OBKoro1
 * @Description: In User Settings Edit
-->
<!-- 数据字典单选框-->

<template>
    <el-radio-group v-model="value" :disabled="disabled">
        <el-radio
            v-for="item in options"
            :key="Number(item.labelValue)"
            :label="Number(item.labelValue)"
            >{{ item.labelName }}</el-radio
        >
    </el-radio-group>
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
            value (val) {
                this.$emit('update:defaultVal', val)
            },
            defaultVal (val) {
                this.value = val
            }
        },
        methods: {},
        mounted () {
            this.defaultVal && (this.value = Number(this.defaultVal))
            this.dicName && (this.options = this.dictionaries[this.dicName])
            this.options &&
                this.options.sort((a, b) => {
                    return Number(a.labelValue) - Number(b.labelValue)
                })
        }
    }
</script>

<style></style>
