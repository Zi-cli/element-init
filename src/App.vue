
<template>
	<div id="app">
		<router-view v-if="isRouterLoad"></router-view>
	</div>
</template>

<script>
// import { } from '@/api/api'
    export default {
        name: 'App',
        provide () {
            return {
                reload: this.reload
            }
        },
        data () {
            return {
                isRouterLoad: true,
                urlLink: process.env.VUE_APP_ImgLoadUrl
            }
        },
        methods: {
            reload () {
                this.isRouterLoad = false
                this.$nextTick(() => {
                    this.isRouterLoad = true
                })
            }
        }
    }
</script>

<style>
	@import "./assets/css/base.css";
</style>
<style lang="less">
  @import "./assets/css/default.less";
</style>
