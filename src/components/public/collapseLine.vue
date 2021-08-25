<!--
 * @Author: your name
 * @Date: 2020-04-24 17:32:43
 * @LastEditTime: 2020-04-24 17:36:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \code\fitness-admin\src\components\public\collapse-line.vue
 -->

<template>
    <div class="collapse-wrap">
        <div class="collapse-icon_wrap" @click="$emit('trigger')">
            <i :class="[advance ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"></i>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'collapseLine',
        props: {
            advance: {
                type: Boolean
            }
        }
    }
</script>

<style lang="less">
.collapse-wrap{
  float: left;
  width: 100%;
  border-top: 1px solid #EDEEF1;
  margin: 11px 0 22px 0;
  position: relative;
//   &::before{
//     content: "";
//     display: inline-block;
//     width: 20px;
//     height: 1px;
//     background-color: #EDEEF1;
//     position: absolute;
//     // left: -20px;
//     // top: -1px;
//   }
//   &::after{
//     content: "";
//     display: inline-block;
//     width: 20px;
//     height: 1px;
//     background-color: #EDEEF1;
//     position: absolute;
//     right: -20px;
//     top: -1px;
//   }
  .collapse-icon_wrap{
    cursor: pointer;
    width: 42px;
    height: 12px;
    background-image: url('~@/assets/images/collapse.png');
    background-size: 100% 100%;
    position: absolute;
    left: calc(50% - 21px);
    text-align: center;
    line-height: 12px;
  }
}
</style>
