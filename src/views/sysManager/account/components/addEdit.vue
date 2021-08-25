<template>
  <div class="account_addEdit">
    <el-dialog :title="titleName + '账号'" class="wd650" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :inline="true" :rules="rules" :model="form" ref="form" v-loading="loading">
        <el-form-item label="账号:" prop="accountName">
          <el-input size="mini" v-model.trim="form.accountName" maxlength="30" :disabled="titleName==='修改'" clearable autocomplete="new-password"></el-input>
        </el-form-item>
        <el-form-item label="姓名:" prop="userName">
          <el-input size="mini" v-model.trim="form.userName" maxlength="30" clearable></el-input>
        </el-form-item>
        <span v-if="titleName==='添加'">
          <el-form-item label="密码:" prop="accountPwd">
            <el-input type="passWord" size="mini" v-model.trim="form.accountPwd" maxlength="18" clearable autocomplete="new-password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码:" prop="affirmPwd">
            <el-input type="passWord" size="mini" v-model.trim="form.affirmPwd" maxlength="18" clearable></el-input>
          </el-form-item>
        </span>
        <el-form-item label="手机号:" prop="phone">
          <el-input size="mini" v-model.trim="form.phone" clearable></el-input>
        </el-form-item>
        <el-form-item label="角色:" prop="roleId">
          <el-select v-model="form.roleId" placeholder="-- 请选择 --" size="mini">
            <el-option
              v-for="item in roleTypeList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目权限:" prop="projectArr">
          <el-checkbox-group v-model="form.projectArr">
            <el-checkbox :label="item.id" v-for="item in projectOpt" :key="item.id">{{item.projectName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="状态:">
          <el-tooltip :content="form.status === 1 ? '启用' : '禁用'" placement="top">
            <el-switch
              v-model="form.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="2">
            </el-switch>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <button @click="dialogVisible = false" class="cancel-btn">取 消</button>
        <button type="warning" class="success-btn" @click="submitForm('form')">确 定</button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    // import md5 from 'js-md5'
    import { account, accountEdit, sysRoleOpt, projectList } from '@/api/api'
    import mixin from '@/mixin'
    export default {
        mixins: [mixin],
        props: {
            dialog: {
                type: Boolean
            },
            titleName: {
                default: ''
            },
            editData: {
                default: null
            }
        },
        data () {
            const validatePass2 = (rule, value, callback) => {
                console.log(1, value)
                if (!value) {
                    console.log(2)
                    callback(new Error('确认密码不能为空'))
                } else if (value !== this.form.accountPwd) {
                    console.log(3)
                    callback(new Error('两次输入密码不一致'))
                } else {
                    callback()
                }
            }
            return {
                dialogVisible: false,
                loading: false,
                form: {
                    id: null,
                    accountName: '',
                    userName: '',
                    accountPwd: '',
                    phone: '',
                    status: 1,
                    roleId: '',
                    projectNames: [],
                    projectIds: [],
                    projectArr: []
                },
                roleTypeList: [], // 角色类型下拉
                projectOpt: [], // 项目列表
                baseArr: [],
                rules: {
                    accountName: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
                    userName: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
                    accountPwd: [{ required: true, validator: this.$validate.AccountPassword, trigger: 'blur' }],
                    affirmPwd: [{ required: true, validator: validatePass2, trigger: 'blur' }],
                    phone: [{ required: true, validator: this.$validate.validateTelNum, trigger: 'blur' }],
                    roleId: [{ required: true, message: '请选择角色', trigger: 'change' }],
                    projectArr: [{ required: true, message: '请选择项目', trigger: 'change' }]
                }
            }
        },
        computed: {
        },
        watch: {
            dialogVisible () {
                this.$emit('update:dialog', this.dialogVisible)
            }
        },
        methods: {
            // 获取角色下拉
            getRoleTypeList () {
                sysRoleOpt().then(res => {
                    this.roleTypeList = res
                })
            },
            // 获取项目列表
            getProjectList () {
                projectList().then(res => {
                    this.projectOpt = res
                })
            },
            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.addForm()
                    } else {
                        return false
                    }
                })
            },
            addForm () {
                // 添加修改
                if (this.form.projectArr.length === 0) {
                    this.$message.error('请选择项目')
                    return false
                }
                let projectIds = []
                let projectNames = []
                console.log(this.form.projectArr, 'bao', this.projectOpt)
                this.projectOpt.map(lis => {
                    this.form.projectArr.map(item => {
                        if (lis.id === item) {
                            console.log('会进来')
                            projectIds.push(lis.id)
                            projectNames.push(lis.projectName)
                        }
                    })
                })
                console.log('这两个', projectIds, projectNames)
                this.loading = true
                if (this.titleName === '添加') {
                    // this.form.accountPwd = md5(this.form.accountPwd)
                    account({
                        ...this.form,
                        accountPwd: this.form.accountPwd,
                        projectIds: projectIds.join(','),
                        projectNames: projectNames.join('、')
                    }).then(res => {
                        this.$emit('getSchemeList')
                    }).catch(() => {
                        this.loading = false
                    })
                } else {
                    // this.form.accountPwd = md5(this.form.accountPwd)
                    accountEdit({
                        ...this.form,
                        accountPwd: this.form.accountPwd,
                        projectIds: projectIds.join(','),
                        projectNames: projectNames.join('、')
                    }).then(res => {
                        this.$emit('getSchemeList')
                    }).catch(() => {
                        this.loading = false
                    })
                }
            }
        },
        mounted () {
            this.dialogVisible = this.dialog
            this.form.projectArr = []
            if (this.editData) {
                console.log(this.editData)
                this.form = JSON.parse(JSON.stringify(this.editData))
                if (this.editData.projectIds) {
                    // this.form.projectArr = this.editData.projectIds.split(',').map(Number)
                    this.$set(this.form, 'projectArr', this.editData.projectIds.split(',').map(Number))
                }
            }
            this.getRoleTypeList()
            this.getProjectList(0)
        }
    }
</script>

<style lang="less">
  .account_addEdit {
    .el-input--suffix {
      .el-input__inner {
        height: 30px;
      }
    }
    .el-form-item__content{
      width: 175px !important;
    }
    .el-dialog__body .el-form-item  .el-form-item__label{
      width: 100px !important;
    }
    .el-input--prefix {
      .el-input__inner {
        padding-left: 16px;
      }
    }
    .el-select__tags{
      min-width: 155px !important;
    }
    .el-input-group__append{
      position: relative;
      left: -3px;
    }
    .el-form-item__content .el-input-group{
      vertical-align: baseline;
    }
  }
</style>
