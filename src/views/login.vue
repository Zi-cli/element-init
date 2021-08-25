<template>
 <div class="login_wrap">
    <div class="user_title">
        <!-- <img src="../assets/images/new/logo_nav.png" alt="" > -->
    </div>
      <div class="user_login">
        <img src="@/assets/images/new/logo_nav.png" alt="" >
        <p class="loginTitle">瑞丰康体</p>
        <p class="loginTitle">竞赛管理系统</p>
        <div class="input_container">
          <input type="text" class="inputName" placeholder="账号" ref="username" @keyup.enter="handleLogin" v-model.trim="username" maxlength="20">
          <div>
            <input :type="showPwd ? 'text' : 'password'" class="password_class" placeholder="密码" ref="password" @keyup.enter="handleLogin" v-model.trim="password" autocomplete="new-password">
            <img class="password_img" @click="showPwd=!showPwd" :src="showPwd ? require('../assets/images/new/iconeye.png') : require('../assets/images/new/eyes_close.png')" alt="">
          </div>
          <div class="code_box">
            <input type="text" class="input_code" placeholder="验证码" ref="usercode" @keyup.enter="handleLogin" v-model.trim="validateCode">
            <img v-if="validateCodeImg" class="codeImg" :src="validateCodeImg" alt="验证码" @click="getPictureValidate">
          </div>
        </div>
        <div class="edit_box">
          <el-checkbox v-model="checked">记住密码</el-checkbox>
        </div>
        <div class="login_button_container">
          <el-button type="primary" :loading="loading" @click="handleLogin">登 录</el-button>
        </div>
      </div>
    </div>
</template>
<script>
    // import qs from 'qs'
    import axios from 'axios'
    // import { } from 'api/api'
    export default {
        data () {
            return {
                validateCode: '',
                validateCodeImg: '',
                numCode: '',
                showPwd: false,
                loading: false,
                username: '',
                password: '',
                checked: false,
                upUrl: process.env.VUE_APP_URL + '/public/upload'
            }
        },
        computed: {
        },
        methods: {
            // 获取验证码图片
            getPictureValidate () {
                let code = '' // 存放验证码
                const codes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
                const codeLg = 8
                for (let i = 0; i < codeLg; i++) {
                    const newCode = Math.floor(Math.random() * codes.length)
                    code = code + codes[newCode]
                }
                this.numCode = code
                let data = {
                    key: this.numCode
                }
                axios.get(process.env.VUE_APP_URL + '/public/createImg', {
                    responseType: 'arraybuffer',
                    params: data
                }).then(res => {
                    return 'data:image/png;base64,' + btoa(
                        new Uint8Array(res)
                            .reduce((data, byte) => data + String.fromCharCode(byte), '')
                    )
                })
                    .then(data => {
                        this.validateCodeImg = data
                    })
                    .catch(ex => {
                        console.error(ex)
                    })
            },
            handleLogin () {
                if (this.username.trim() === '') {
                    this.$message.error('请填写账号！')
                    return false
                }
                if (this.password.trim() === '') {
                    this.$message.error('请填写密码！')
                    return false
                }
                if (this.validateCode.trim() === '') {
                    this.$message.error('请填写验证码！')
                    return false
                }
                this.loading = true
                // 模拟
                const associationData = [
                    { name: '课程预约', url: '' },
                    { name: '指标维护', url: '' },
                    { name: '动作库维护', url: '' },
                    {
                        name: '人员管理',
                        children: [
                            { name: '教练管理', url: '' },
                            { name: '学员管理', url: '' }
                        ]
                    },
                    {
                        name: '运营统计',
                        children: [
                            { name: '订单管理', url: '' },
                            { name: '会员卡管理', url: '' }
                        ]
                    },
                    {
                        name: '基础信息',
                        children: [
                            { name: '新闻管理', url: '' },
                            { name: '场馆管理', url: '' },
                            { name: '产品管理', url: '' },
                            { name: '课堂管理', url: '' }
                        ]
                    },
                    {
                        name: '系统管理',
                        children: [
                            {
                                name: '用户管理', url: '/account'
                            },
                            {
                                name: '机构管理', url: ''
                            },
                            {
                                name: '角色管理', url: '/role'
                            },
                            {
                                name: '系统日志', url: ''
                            },
                            {
                                name: '菜单管理', url: '/menu'
                            }
                        ]
                    }
                ]
                console.log('%c [ associationData ]', 'font-size:13px; background:pink; color:#bf2c9f;', associationData)
                sessionStorage.setItem('token', 'token')
                this.$session.set('userAuthorities', associationData)
                this.$session.set('userName', 1)
                this.$session.set('userName', 1)
                this.$router.push('/account')
                // login({
                //     account: this.username,
                //     password: md5(this.password),
                //     key: this.numCode,
                //     verifyCode: this.validateCode
                // }).then(res => {
                //     if (res) {
                //         if (res.sysMenuList.length === 0) {
                //             this.$message.error('您无权限登录系统！')
                //             this.loading = false
                //             return false
                //         }
                //         if (this.checked) {
                //             localStorage.setItem('userNumber', this.username)
                //             localStorage.setItem('password', this.$util.setPaw(window.btoa(this.password)))
                //         } else {
                //             localStorage.clear()
                //         }
                //         sessionStorage.setItem('authorization', this.$util.setPaw(window.btoa(res.authorization)))
                //         sessionStorage.setItem('token', this.$util.setPaw(window.btoa(res.token)))
                //         this.$session.set('userName', res.accountAuthVO.userName)
                //         this.$session.set('projectName', res.associationProject.projectName) // 当前项目名
                //         this.$session.set('projectId', res.associationProject.id) // 当前项目ID
                //         this.$session.set('sysProjectId', res.accountAuthVO.projectIds || '') // 拥有的项目权限
                //         this.$session.set('unitId', res.accountAuthVO.unitId || '') // 单位ID
                //         this.$session.set('unitName', res.accountAuthVO.unitName || '') // 单位名称
                //         // 模拟返回的权限菜单
                //         const data = res.sysMenuList
                //         for (let i = 0; i < data.length; i++) {
                //             data[i].name = data[i].menuName
                //             if (data[i].list) {
                //                 data[i].children = data[i].list
                //                 for (let j = 0; j < data[i].children.length; j++) {
                //                     data[i].children[j].name = data[i].children[j].menuName
                //                 }
                //             }
                //         }
                //         this.$session.set('userAuthorities', data)
                //         if (data[0].url) {
                //             this.$router.push({ path: data[0].url })
                //         } else {
                //             this.$router.push({ path: data[0].children[0].url })
                //         }
                //     }
                //     this.loading = false
                // }).catch(error => {
                //     console.error(error)
                //     this.getPictureValidate()
                //     this.loading = false
                // })
            }
        },
        mounted () {
            this.getPictureValidate()
            if (localStorage.getItem('userNumber')) {
                this.username = localStorage.getItem('userNumber')
                this.password = window.atob(this.$util.getPaw(localStorage.getItem('password')))
                this.checked = true
            }
            if (!this.username) {
                this.$refs.username.focus()
            } else if (!this.password) {
                this.$refs.password.focus()
            }
        }
    }
</script>
<style lang="less">
  @import "../assets/css/login.less";
</style>
