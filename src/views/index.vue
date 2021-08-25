<template>
  <div class="indexWrap">
    <!--头部栏 开始-->
    <header :class="showMenu===true?'topWrap':'fullTopWrap'">
      <!--顶部栏 上侧-->
      <div class="header_top clearfix">
        <!-- tab页 -->
        <div class="left-tab">
          <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="closeTag" @tab-click="clickItem">
            <el-tab-pane
              v-for="item in tags"
              :key="item.url"
              :label="item.name"
              :name="item.url"
            >
            </el-tab-pane>
          </el-tabs>
        </div>
        <!-- 右侧 -->
        <div>
          <div class="user">
            <span :title="userName">欢迎您，{{userName}}</span>
            <div class="pwd-box">
              <img src="../assets/images/new/update.png" alt="修改密码">
              <span @click="updatePwd">修改密码</span>
            </div>
            <div>
              <span @click="dialogVisible=true">退出</span>
              <img src="../assets/images/new/esc.png" alt="退出" style="margin-left:5px">
            </div>
          </div>
        </div>
      </div>
      <!--顶部栏 下侧-->
    </header>
    <!--头部栏 结束-->
    <!--主框架 开始-->
    <div class="middleWrap">
      <!--左侧 开始-->
        <!-- 菜单背景图 -->
        <aside class="left" :class="showMenu? '': 'left_pro'">
          <div v-if="showMenu" style="width:210px;overflow:hidden;">
            <img src="../assets/images/new/logo_nav.png" class="logo_nav" alt="">
            <p style="font-size: 18px;color:#749E25;font-weight: bold;">瑞丰康体</p>
          </div>
          <div v-else style="height:130px;">
            <img src="../assets/images/new/logo_nav.png" class="logo_nav_nimi" alt="">
          </div>
          <el-menu v-if="canShow" :default-active="currentRoute" unique-opened
          router class="fixed-left" style="margin-top:15px;" :collapse="!showMenu">
            <div v-for="(info,index) in menuList" :key="index" >
              <!-- && info.children[0].menuType===1 -->
              <el-submenu :index="index+'2'"  v-if="info.children&&info.children.length !== 0">
                <template slot="title">
                  <img v-if="info.imgs" :src="info.imgs" alt="">
                  <span slot="title" v-if="showMenu">{{info.name}}</span>
                </template>
                <!-- 二级菜单 -->
                <el-menu-item v-for="(childMenu,key) in info.children" :index="childMenu.url" :key="key+'00'">
                  {{childMenu.name}}
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="info.url">
                <img v-if="info.imgs" :src="info.imgs" alt="">
                <span slot="title">{{info.name}}</span>
              </el-menu-item>
            </div>
          </el-menu>
          <!-- 底部伸缩 -->
          <div class="switch_box">
              <img v-if="showMenu" @click="showHideMenu(false)" src="../assets/images/new/tabLeft.png" alt="">
              <img v-if="!showMenu" @click="showHideMenu(true)" src="../assets/images/new/tabRight.png" alt="">
          </div>
        </aside>
      <!--左侧 结束-->

      <!--右侧 开始-->
      <div :class="showMenu===true?'right':'rightFull'">
        <keep-alive >
          <router-view v-if="isIndex && $route.meta.keepAlive" class="routerView"></router-view>
        </keep-alive>
        <router-view v-if="isIndex &&!$route.meta.keepAlive" class="routerView"></router-view>
      </div>
      <!--右侧 结束-->
    </div>
    <!--主框架 结束-->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" class="dialog__header_left">
      <span>是否退出登录？</span>
      <span slot="footer" class="dialog-footer">
        <button @click="dialogVisible = false" class="cancel-btn">取 消</button>
        <button type="primary" class="success-btn" @click="exit">确 定</button>
      </span>
    </el-dialog>
    <el-dialog title="修改密码" class="wd30" :visible.sync="dialogVisible2" id="updatePsw">
      <el-form :inline="true" label-width="80px" :rules="rules" :model="form" ref="ruleForm">
        <el-row>
          <el-col :span="24">
            <el-form-item label="原密码" size="mini" prop="oldPwd">
              <el-input type="password" v-model.trim="form.oldPwd" placeholder="请输入原密码" min="6" maxlength="18"></el-input>
            </el-form-item>
            <el-form-item label="新密码" size="mini" prop="newPwd">
              <el-input type="password" v-model.trim="form.newPwd" placeholder="请输入新密码" min="6" maxlength="18"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" size="mini" prop="affirmPwd">
              <el-input type="password" v-model.trim="form.affirmPwd" placeholder="请再次输入新密码" min="6" maxlength="18"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <button @click="dialogVisible2 = false" class="cancel-btn">取 消</button>
        <button type="primary" class="success-btn" @click="handleSubmit">确 定</button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import md5 from 'js-md5'
    // import ase from '@/utils/ase'
    import { editPassWrod, sysProjectMenuAuth } from '@/api/api'
    export default {
        inject: ['reload'],
        data () {
            const validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入新密码'))
                } else if (value !== this.form.newPwd) {
                    callback(new Error('两次输入密码不一致!'))
                } else {
                    callback()
                }
            }
            const orgPsw = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入原密码'))
                } else {
                    callback()
                }
            }
            return {
                canShow: true,
                currentRoute: '',
                editableTabsValue: '',
                userName: this.$session.get('userName'),
                showMenu: true, // 是否显示左侧菜单
                showMenu2: false, // 是否显示左侧2菜单
                dialogVisible: false, // 提示弹框
                dialogVisible2: false, // 提示弹框
                dialogVisible3: false,
                rollArr: [], // 滚动数组
                form: {
                    oldPwd: '', // 原密码
                    newPwd: '', // 新密码
                    affirmPwd: '' // 确认新密码
                },
                menuListData: [],
                menuList: [],
                projectType: this.$session.get('projectId') || '',
                hasProject: [],
                tags: [],
                rules: {
                    oldPwd: [{ required: true, validator: orgPsw, trigger: 'blur' }],
                    newPwd: [{ required: true, validator: this.$validate.AccountPassword, trigger: 'blur' }],
                    affirmPwd: [{ required: true, validator: validatePass2, trigger: 'blur' }]
                },
                isIndex: true,
                urlLink: process.env.VUE_APP_ImgLoadUrl
            }
        },
        // 换标签头的时候要解开
        watch: {
            currentRoute () {
                this.editableTabsValue = this.$route.path
            },
            $route (to, from) {
                let menuListData = this.menuListData
                this.currentRoute = to.path
                // 获取权限按钮数据
                this.menuListData.map(res => {
                    if (to.path === res.url) {
                        if (res.list) {
                            console.log(res.list, 'res.list')
                            sessionStorage.setItem('btnPermissions', JSON.stringify(res.list ? res.list : []))
                        }
                    }
                })
                let curTag = null
                for (let i = 0; i < menuListData.length; i++) {
                    if (to.path === menuListData[i].url) {
                        curTag = {
                            name: menuListData[i].name,
                            url: to.path
                        }
                    }
                }
                // 如果当前菜单找不到当前url,说明这是个tab页，只需要显示标签头
                if (!curTag) {
                    // 进入彼得详情页，需要把之前的替换掉
                    this.tags.map((item, dex) => {
                        if (item.name === to.name) {
                            this.tags.splice(dex, 1)
                        }
                    })
                    curTag = {
                        name: to.name,
                        url: to.path
                    }
                    this.editableTabsValue = to.path
                }
                let tags = this.tags
                let hash = {}
                tags = [...tags, curTag]
                const newArr = tags.reduce((item, next) => {
                    if (hash[next.name]) {
                        hash[next.name] = ''
                    } else {
                        hash[next.name] = true && item.push(next)
                    }
                    return item
                }, [])
                this.tags = newArr
                sessionStorage.setItem('tags', JSON.stringify(this.tags))
            }
        },
        methods: {
            // 整理菜单列表数据
            handleMenuData (val) {
                const menuListLength = this.menuList.length
                const menuListData = []
                for (let i = 0; i < menuListLength; i++) {
                    // 菜单图标
                    if (this.menuList[i].icon) {
                        this.menuList[i].imgs = this.menuList[i].icon ? require(`@/assets/images/new/${this.menuList[i].icon}.png`) : ''
                    }
                    if (this.menuList[i].children && this.menuList[i].children.length !== 0 && this.menuList[i].children[0].menuType === 1) { // 有二级菜单
                        const childrenLength = this.menuList[i].children.length
                        for (let j = 0; j < childrenLength; j++) {
                            menuListData.push(this.menuList[i].children[j])
                        }
                    } else { // 无二级菜单
                        menuListData.push(this.menuList[i])
                    }
                }
                this.menuListData = menuListData
                if (val) { // 如果是手动更新菜单，一定要先销毁
                    this.$router.push({ path: this.menuListData[0].url })
                    this.canShow = false
                    this.$nextTick(() => {
                        this.canShow = true
                    })
                }
                // 更新导航栏信息
                let tags = sessionStorage.getItem('tags')
                if (!tags) {
                    this.tags = [{ name: this.$route.name, url: this.$route.path }]
                } else {
                    this.tags = JSON.parse(tags)
                }
                // 存入按钮权限
                this.menuListData.map(res => {
                    if (this.$route.path === res.url) {
                        console.log('第一次进来存储', res.list)
                        sessionStorage.setItem('btnPermissions', JSON.stringify(res.list ? res.list : []))
                    }
                })
            },
            // 更新菜单列表
            updataMenu () {
                sysProjectMenuAuth().then(res => {
                    // 模拟返回的权限菜单
                    const data = res
                    for (let i = 0; i < data.length; i++) {
                        data[i].name = data[i].menuName
                        if (data[i].list) {
                            data[i].children = data[i].list
                            for (let j = 0; j < data[i].children.length; j++) {
                                data[i].children[j].name = data[i].children[j].menuName
                            }
                        }
                    }
                    this.$session.set('userAuthorities', data)
                    this.menuList = data
                    this.$nextTick(() => {
                        this.handleMenuData(this.menuList)
                        // this.reload()
                    })
                })
            },
            updatePwd () {
                this.dialogVisible2 = true
                if (this.$refs.ruleForm) {
                    this.$refs.ruleForm.clearValidate()
                }
                this.form.oldPwd = ''
                this.form.newPwd = ''
                this.form.affirmPwd = ''
            },
            handleSubmit () {
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        this.updatePsw()
                    } else {
                        return false
                    }
                })
            },
            // 修改密码
            updatePsw () {
                this.loading = true
                editPassWrod({
                    oldPwd: md5(this.form.oldPwd),
                    newPwd: md5(this.form.newPwd)
                }).then(res => {
                    this.$message.success('修改成功')
                    this.oldPwd = ''
                    this.newPwd = ''
                    this.affirmPwd = ''
                    this.dialogVisible2 = false
                    this.loading = false
                    sessionStorage.clear()
                    localStorage.removeItem('token')
                    this.$router.push('/login')
                })
            },
            // 退出登录
            exit () {
                sessionStorage.clear()
                localStorage.removeItem('token')
                this.$router.push('/login')
            },
            // 显示/隐藏 主菜单
            showHideMenu (bool) {
                this.showMenu = bool
            },
            // 关闭面包屑
            closeTag (path) {
                let tagName
                this.tags.map(item => {
                    if (item.url === path) {
                        tagName = item.name
                    }
                })
                let tab = JSON.parse(sessionStorage.getItem('tags'))
                let tags = []
                for (let i = 0; i < tab.length; i++) {
                    if (tagName === tab[i].name) { // 关闭当前页面的tag
                        if (path === this.currentRoute) {
                            if (i === tab.length - 1) {
                                if (tab.length - 1 !== 0) {
                                    this.$router.push(tab[i - 1].url)
                                }
                            } else {
                                this.$router.push(tab[i + 1].url)
                            }
                        }
                    } else { // 关闭当前tag(不是当前页面的tag)
                        tags.push(tab[i])
                        this.tags = tags
                        sessionStorage.setItem('tags', JSON.stringify(tags))
                    }
                }
            },
            clickItem (data) {
                this.$router.push({ path: data.name })
            }
        },
        created () {

        },
        mounted () {
            this.editableTabsValue = this.$route.path
            this.menuList = this.$session.get('userAuthorities')
            this.handleMenuData()
            this.currentRoute = this.$route.path
        }
    }
</script>
<!--公共样式-->
<style lang="less">
 #updatePsw .el-form-item__label{
    width: 100px !important;
  }
  #updatePsw .el-select>.el-input, .el-input--mini .el-input__inner{
    width: 100% !important;
  }
  #updatePsw .el-input,
  #updatePsw .el-textarea__inner{
    width: 250px !important;
  }
  #updatePsw .el-input--suffix .el-input__inner{
    padding-right: 0px !important;
    padding: 0px 15px !important;
  }
  .indexWrap{
    /* tab样式 */
    .left-tab{
      float: left;
      width: calc(100% - 600px) ;
    }
    .el-tabs--card>.el-tabs__header{
      border-bottom: none;
    }
    .el-tabs--card>.el-tabs__header .el-tabs__nav{
      border: none;
    }
    .el-tabs__nav-wrap{
      height: 48px;
      line-height: 48px;
    }
    .el-tabs__item:hover{
      color: #749E25;
    }
    .el-tabs__item{
      height:20px;
      line-height: 20px;
      padding: 0 10px;
    }
    .el-tabs--top.el-tabs--card>.el-tabs__header .el-tabs__item:nth-child(2){
      padding-left: 10px !important;
    }
    .el-tabs__item.is-active{
      padding-left: 10px !important;
      padding-right: 10px !important;
      color: #749E25 !important;
    }
  }
</style>

<!--私有样式-->
<style scoped>
  @import "../assets/css/index.css";
  @import "../assets/css/cover.css";
</style>
