<template>
  <div class="account_page">
    <div class="top clearfix">
      <div class="queryInput fl" :class="isShow?'max_line_query':'min_line_query'">
        <el-form :model="filterForm" ref="filterForm" class="filterForm" :inline="true">
          <el-form-item label="账号:">
            <el-input v-model.trim="filterForm.accountName" size="mini" placeholder="请输入" maxlength="16" clearable></el-input>
          </el-form-item>
          <el-form-item label="姓名:">
            <el-input v-model.trim="filterForm.userName" size="mini" placeholder="请输入" maxlength="10" clearable></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model.trim="filterForm.roleType" placeholder="-- 请选择 --" size="mini" clearable>
              <el-option
                v-for="item in roleTypeList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="会员单位:">
            <el-input v-model.trim="filterForm.unitName" size="mini" placeholder="请输入" maxlength="20" clearable></el-input>
          </el-form-item>
          <el-form-item label="状态:">
            <el-select v-model.trim="filterForm.status" placeholder="-- 请选择 --" size="mini" clearable>
              <el-option
                v-for="item in statusOpt"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="queryBtn fr">
        <el-button size="medium" @click="resetQueryForm(filterForm)">重置</el-button>
        <el-button type="primary" size="medium" @click="handleQuery">查询</el-button>
        <span v-if='hegihtNum>60' @click="tabHeihgt" class="showTextQuery">
              {{showTxt}}
              <img v-if="showTxt === '展开'" src="@/assets/images/new/icon-arrow-down.png" alt="展开图标">
              <img v-if="showTxt === '收起'" src="@/assets/images/new/icon-arrow-up.png" alt="收起图标">
          </span>
      </div>
    </div>
    <div class="tableBackgroundDiv">
      <div class="btn_gronp">
          <el-button v-if="$hasPer('新增')" type="primary" size="medium" @click="addForm('添加')">新增</el-button>
          <!-- <el-button v-if="$hasPer('删除')" type="primary" size="medium" @click="deleteForm(currentRowIds)" :disabled="currentRowIds.length === 0">删除</el-button> -->
          <el-button v-if="$hasPer('启用')" type="primary" size="medium" :disabled="currentIds.length===0" @click="switchFun(1)">批量启用</el-button>
          <el-button v-if="$hasPer('禁用')" type="primary" size="medium" :disabled="currentIds.length===0" @click="switchFun(2)">批量禁用</el-button>
          <el-button v-if="$hasPer('导出')" type="primary" size="medium" @click="exportBtn">导出</el-button>
          <!-- <el-popover v-if="$hasPer('导入')" trigger="hover" placement="top" style="margin-left:10px;">
            <div class="export_popper" style="width: 220px!important;display: flex;justify-content: space-between;">
                <el-button @click="downloadMode">下载导入模板</el-button>
                <el-upload
                  name="file"
                  class="fileUp"
                  :action = host
                  :headers="headers"
                  accept=".xls,.xlsx"
                  :on-success="uploadSuc"
                  :on-error="uploadErr"
                  :show-file-list = false
                  :before-upload="importExcel">
                  <el-button>导入</el-button>
                </el-upload>
            </div>
            <el-button type="primary" size="medium" slot="reference">导入</el-button>
          </el-popover> -->
      </div>
      <el-table
        v-loading="loading"
        :data="tableData"
        :height="tableHeight"
        ref="table"
        size="mini"
        style="width: 100%"
        @selection-change="getRowsData">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column type="index" fixed="left" header-align="center" align="center" width="50" label="序号"></el-table-column>
        <el-table-column header-align="center" align="center" label="类型">
          <template slot-scope="scope">{{$util.dicShow('ROLE_TYPE',scope.row.roleType)}}</template>
        </el-table-column>
        <el-table-column prop="unitName" header-align="center" align="center" label="会员单位"></el-table-column>
        <el-table-column prop="accountName" header-align="center" align="center" label="账号"></el-table-column>
        <el-table-column prop="userName" header-align="center" align="center" label="姓名"></el-table-column>
        <el-table-column prop="phone" header-align="center" align="center" label="手机号"></el-table-column>
        <el-table-column prop="projectNames" header-align="center" align="center" label="项目权限"></el-table-column>
        <el-table-column prop="roleName" header-align="center" align="center" label="角色"></el-table-column>
        <el-table-column header-align="center" align="center" label="状态">
          <template slot-scope="scope">{{$util.dicShow('USER_STATUS',scope.row.status)}}</template>
        </el-table-column>
        <el-table-column fixed="right" header-align="center" align="left" label="操作" minWidth="130">
          <template slot-scope="scope">
            <div class="operation" v-if="scope.row.id !== 1">
              <span v-if="$hasPer('重置密码')" class="defaultColor" @click="resetChange(scope.row.accountName)">重置密码</span>
              <span v-if="$hasPer('编辑') && scope.row.roleType === 1" class="defaultColor" @click="addForm('修改', scope.row)">修改</span>
              <span v-if="$hasPer('删除') && scope.row.roleType === 1" class="defaultColor" @click="deleteForm(scope.row.id)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-form :inline="true" class="footer-btn clearfix">
      <Pagination class="pageClass"
        :params="params"
        @hanlePage="handleCurrentChange"
        @hanleSize="handleSizeChange">
      </Pagination>
    </el-form>
    <addEdit v-if="addDialog" :dialog.sync="addDialog" :titleName="titleName" :editData="editData" @getSchemeList="getSchemeList"></addEdit>
    <!-- 修改密码 -->
    <el-dialog title="重置密码" class="wd30" v-if="dialogVisible2" :visible.sync="dialogVisible2">
      <el-form :inline="true" label-width="70px" :rules="rules" :model="form" ref="wpdform" style="text-align:center">
            <el-form-item label="新密码" size="mini" prop="newPwd">
              <el-input type="password" v-model.trim="form.newPwd" placeholder="请输入新密码" min="6" maxlength="12"></el-input>
            </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <button @click="dialogVisible2 = false" class="cancel-btn">取 消</button>
        <button type="primary" class="success-btn" @click="handleSubmit">确 定</button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
    // import md5 from 'js-md5'
    import mixin from '@/mixin'
    import addEdit from './components/addEdit'
    import { accountPage, accountDelete, resetPassWrod, bathHandlerStatus } from '@/api/api'
    import qs from 'qs'
    export default {
        mixins: [mixin],
        components: {
            addEdit
        },
        data () {
            return {
                filterForm: {
                    accountName: '',
                    userName: '',
                    roleType: '',
                    unitName: '',
                    status: ''
                },
                statusOpt: [
                    { name: '启用', value: 1 },
                    { name: '禁用', value: 2 }
                ],
                RowAccountName: '', // 单行账号名称
                roleIds: null, // 账号id
                form: {
                    newPwd: ''
                },
                roleDialog: false,
                dialogVisible2: false,
                addDialog: false,
                titleName: '',
                editData: null, // 修改传入的数据
                currentRow: [], // 选中的当前行数据
                currentRowIds: [], // 选中的ids
                loading: true,
                tableData: [
                    { name: '1' }
                ],
                roleTypeList: [
                    { roleName: '后台用户', id: 1 },
                    { roleName: '单位会员', id: 2 },
                    { roleName: '个人会员', id: 3 }
                ],
                // host: process.env.VUE_APP_URL + '/reserve/import_account', // 上传地址
                host: '/api/inventory/import_account', // 上传地址
                headers: {
                    Authorization: sessionStorage.getItem('token') // 上传请求头
                },
                rules: {
                    newPwd: [{ required: true, validator: this.$validate.AccountPassword, trigger: 'blur' }]
                }
            }
        },
        watch: {
            'params.total': function () {
                if (this.params.total === (this.params.current - 1) * this.params.size && this.params.total !== 0) {
                    this.params.current -= 1
                    this.getTableData()
                }
            }
        },
        methods: {
            // 下载模板
            downloadMode () {
                window.location.href = '/api/inventory/public/account_download_template?access_token=' + sessionStorage.getItem('access_token')
            },
            uploadSuc () { // 导入成功
                this.getTableData()
                this.loading = false
                this.$message.success('导入成功')
            },
            uploadErr (err) {
                this.loading = false
                this.$message.error(JSON.parse(err.message))
            },
            importExcel (file) {
                const testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
                const isExcel = testmsg === 'xls' || testmsg === 'xlsx'
                const isLt10M = file.size / 1024 / 1024 < 10
                if (!isLt10M) {
                    this.$message.error('上传大小不能超过 10MB!')
                    return false
                }
                if (!isExcel) {
                    this.$message.error('只支持excel文件!')
                    return false
                }
                this.loading = true
            },
            // 导出
            exportBtn () {
                let data = {
                    ...this.filterForm
                    // Authorization: window.atob(this.$util.getPaw(sessionStorage.getItem('authorization'))),
                    // token: window.atob(this.$util.getPaw(sessionStorage.getItem('token')))
                }
                window.location.href = '/api/public/account_export?' + qs.stringify(data)
            },
            // 启用禁用
            switchFun (type) {
                let data = {
                    ids: this.currentIds.join(','),
                    status: type
                }
                bathHandlerStatus(data).then(res => {
                    this.$message.success('操作成功')
                    this.getTableData()
                })
            },
            // 修改密码
            handleSubmit () {
                this.$refs.wpdform.validate((valid) => {
                    if (valid) {
                        resetPassWrod({
                            accountName: this.RowAccountName,
                            newPwd: this.form.newPwd
                        }).then(res => {
                            this.$message.success('密码重置成功')
                            this.dialogVisible2 = false
                        })
                    } else {
                        return false
                    }
                })
            },
            addForm (val, item) {
                this.addDialog = true
                this.editData = item || ''
                this.titleName = val
            },
            getSchemeList () {
                this.$message.success('保存成功')
                this.getTableData()
                this.addDialog = false
            },
            editRole (ids) {
                this.roleIds = ids
                this.roleDialog = true
            },
            // 更新权限
            getRolesData () {
                this.roleDialog = false
            },
            // 删除
            deleteForm (ids) {
                this.$confirm('是否确认删除选中的账号?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    accountDelete(ids).then(res => {
                        this.$message.success('删除成功')
                        this.getTableData()
                    })
                })
            },
            getTableData () {
                this.loading = true
                accountPage({
                    page: this.params.current,
                    size: this.params.size,
                    ...this.filterForm
                }).then(res => {
                    this.tableData = res.data
                    this.getPagination(res)
                    this.loading = false
                }).catch(err => {
                    console.log(err)
                    this.loading = false
                })
                console.log('查询')
            },
            resetChange (val) {
                this.$confirm('是否确认重置密码?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    resetPassWrod({
                        accountName: val
                    }).then(res => {
                        this.$message.success('密码重置成功')
                        this.handleQuery()
                    })
                }).catch(() => {

                })
            }
        },
        mounted () {
            this.hegihtNum = document.querySelector('.filterForm').clientHeight
            this.getHeight()
            // this.handleQuery()
        }
    }
</script>
<style lang="less">
.account_page{
  .el-dialog .el-form--inline .el-form-item{
    margin-right: 0;
  }
  .queryInput{
    width: calc(100% - 210px)
  }
}
</style>
