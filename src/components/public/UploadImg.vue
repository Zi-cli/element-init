<!--
 * @Author: chenyiqiang
 * @Date: 2020-05-08 09:43:41
 * @LastEditTime: 2020-05-08 10:27:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \athlete-information-cli4\src\components\public\UploadImg.vue
 -->
<template>
  <el-upload
    class="upload-demo"
    :action= host
    :headers="headers"
    :accept="accept"
    :http-request="uploadHttp"
    :before-upload="beforeAvatarUpload"
    :show-file-list= "false">
    <img src="@/assets/images/up_icon.png"  alt="" class="up_icon">
    <div slot="tip" class="el-upload__tip">
    <div>{{uploadText}}</div>
    <div>{{uploadSize}}</div>
    </div>
</el-upload>
</template>

<script>
    export default {
        props: {
            accept: {
                type: String,
                default: 'image/jpeg,image/jpg,image/png'
            },
            uploadText: {
                type: String,
                default: '只能上传png、jpg文件'
            },
            uploadSize: {
                type: String,
                default: '建议尺寸1800*985px'
            },
            uploadName: {
                type: String,
                default: ''
            }
        },
        watch: {

        },
        computed: {

        },
        data () {
            return {
                host: process.env.VUE_APP_URL + '/upload', // 上传地址
                headers: {
                    Authorization: window.atob(this.$util.getPaw(sessionStorage.getItem('token'))), // 上传请求头
                    token: window.atob(this.$util.getPaw(sessionStorage.getItem('tokenCenter')))
                }
            }
        },
        methods: {
            beforeAvatarUpload (file) {
                const isPNG = file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg'
                const isLt10M = file.size / 1024 / 1024 < 10
                if (!isLt10M) {
                    this.$message.error('上传图片大小不能超过 10MB!')
                }
                if (!isPNG) {
                    this.$message.error('只支持png或jpg格式的图片哦')
                }
                return isPNG && isLt10M
            },
            uploadHttp (f) {
                this.$emit('uploadImg', f, this.uploadName)
            }
        },
        mounted () {

        }
    }
</script>

<style>
  .el-range-editor--mini.el-input__inner {
    height: 32px !important;
  }
</style>
