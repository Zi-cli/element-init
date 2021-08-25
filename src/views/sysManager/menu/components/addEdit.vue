<template>
  <div class="menu_addEdit">
    <el-dialog :title="titleName + '菜单'" class="wd600" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :inline="true" :rules="rules" :model="form" ref="form">
        <el-form-item label="项目" prop="projectId">
          <el-select v-model="form.projectId" placeholder="-- 请选择 --" size="mini" disabled>
            <el-option
              v-for="item in projectOpt"
              :key="item.id"
              :label="item.projectName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户端类型" prop="clientType">
          <el-select v-model="form.clientType" placeholder="-- 请选择 --" size="mini" :disabled="titleName==='添加下级'">
            <el-option
              v-for="item in clientTypeOpt"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model.trim="form.menuName" size="mini" placeholder="请输入" maxlength="50" clearable></el-input>
        </el-form-item>
        <el-form-item label="链接">
          <el-input v-model.trim="form.url" size="mini" placeholder="请输入" maxlength="50" clearable></el-input>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-select v-model.trim="form.menuType" placeholder="-- 请选择 --" size="mini" :disabled="titleName === '添加一级'? true: false">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="接口权限码" v-if="form.menuType===2">
          <el-input v-model.trim="form.interfaceCode" size="mini" placeholder="请输入" maxlength="30" clearable></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="rank">
          <el-input v-model.trim="form.rank" size="mini" placeholder="请输入" maxlength="4" clearable></el-input>
        </el-form-item>
        <el-form-item label="图标名称">
          <el-input v-model.trim="form.icon" size="mini" placeholder="请输入" maxlength="16" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model.trim="form.remark" size="mini" placeholder="请输入" maxlength="16" clearable></el-input>
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
    import { menuAdd, menuEdit, projectList } from '@/api/api'
    import mixin from '@/mixin'
    export default {
        mixins: [mixin],
        props: {
            dialog: {
                type: Boolean
            },
            // 标题
            titleName: {
                default: ''
            },
            // 是否新增
            isCreated: {
                default: true
            },
            // 上级id
            lineParentId: {
                default: null
            },
            // 项目id
            projectId: {
                default: null
            },
            editData: {
                default: null
            }
        },
        data () {
            return {
                dialogVisible: false,
                form: {
                    projectId: '',
                    clientType: '',
                    menuName: '',
                    url: '',
                    menuType: '',
                    rank: '',
                    interfaceCode: null,
                    icon: null,
                    id: null,
                    parentId: null,
                    remark: ''
                },
                projectOpt: [], // 项目下拉
                clientTypeOpt: [
                    { label: 'PC-协会端', value: 1 },
                    { label: 'PC-会员端', value: 2 }
                ],
                options: [
                    {
                        label: '菜单',
                        value: 1
                    },
                    {
                        label: '按钮',
                        value: 2
                    }
                ],
                logoUrl: [],
                rules: {
                    projectId: [{ required: true, message: '请选择项目', trigger: 'change' }],
                    clientType: [{ required: true, message: '请选择客户端类型', trigger: 'change' }],
                    menuName: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
                    menuType: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
                    rank: [{ required: true, message: '排序不能为空', trigger: 'blur' }]
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
                if (this.titleName === '编辑') {
                    menuEdit(this.form).then(res => {
                        this.$message.success('编辑成功!')
                        this.$emit('getSchemeList', false)
                    })
                } else {
                    menuAdd(this.form).then(res => {
                        this.$message.success('添加成功!')
                        this.$emit('getSchemeList', false)
                    })
                }
            }
        },
        mounted () {
            this.dialogVisible = this.dialog
            if (this.titleName === '添加一级') {
                this.form.menuType = 1
                this.form.projectId = this.projectId
            }
            if (this.lineParentId) {
                this.form.parentId = this.lineParentId
            }
            if (this.editData && !this.isCreated) {
                this.form = JSON.parse(JSON.stringify(this.editData))
            }
            // 新增下级的情况
            if (this.editData && this.isCreated) {
                let data = JSON.parse(JSON.stringify(this.editData))
                this.form.projectId = data.projectId
                this.form.clientType = data.clientType
            }
            this.getProjectList()
        }
    }
</script>

<style lang="less">
  .menu_addEdit {
    .el-input--suffix {
      .el-input__inner {
        padding-right: 16px;
      }
    }
    .el-form-item__label {
      width: 100px !important;
    }
    .el-form-item__content{
      width: 160px !important;
    }
    .el-dialog {
      width: 30%;
    }
    .el-input--prefix {
      .el-input__inner {
        padding-left: 16px;
      }
    }
    .avatar-uploader-icon{
      width: 160px;
      height: 160px;
      line-height: 160px;
    }
    .avatar{
      width: 145px;
      height: 145px;
      border-radius: 0;
    }
  }
</style>
