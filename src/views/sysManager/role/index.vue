<template>
  <div class="role_page">
    <div class="top clearfix">
      <div class="queryInput fl" :class="isShow?'max_line_query':'min_line_query'">
        <el-form :model="filterForm" ref="filterForm" class="filterForm" :inline="true">
          <el-form-item label="角色名称:">
            <el-input v-model.trim="filterForm.roleName" size="mini" placeholder="角色名称" maxlength="50" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="queryBtn fr">
        <el-button type="primary" size="medium" @click="queryBtn">查询</el-button>
      </div>
    </div>
    <div class="tableBackgroundDiv">
      <div class="btn_gronp">
        <el-button v-if="$hasPer('新增')" type="primary" size="medium" @click="addForm('添加')">新增</el-button>
        <el-button v-if="$hasPer('删除')" type="primary" size="medium" :disabled="currentRowIds.length===0" @click="deleteForm(currentRowIds)">删除</el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="tableData"
        :height="tableHeight"
        ref="table"
        size="mini"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column type="index" fixed="left" header-align="center" align="center" width="50" label="序号"></el-table-column>
        <el-table-column prop="roleName" header-align="center" align="center" label="角色名称"></el-table-column>
        <el-table-column prop="roleCode" header-align="center" align="center" label="角色编码"></el-table-column>
        <el-table-column fixed="right" header-align="center" align="center" label="操作" minWidth="150">
          <template slot-scope="scope">
            <div class="operation">
              <span v-if="$hasPer('编辑')" class="editColor" @click="addForm('修改', scope.row.id)">修改</span>
              <span v-if="$hasPer('删除')" class="delColor" @click="deleteForm(scope.row.id)">删除</span>
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
    <addEdit v-if="addDialog" :dialog.sync="addDialog" :titleName="titleName" :editId="editId" @getSchemeList="getSchemeList"></addEdit>
  </div>
</template>
<script>
    import mixin from '@/mixin'
    import addEdit from './components/addEdit'
    import { sysRoleList, roleDelete } from '@/api/api'
    export default {
        mixins: [mixin],
        components: {
            addEdit
        },
        data () {
            return {
                filterForm: {
                    roleName: ''
                },
                addDialog: false,
                titleName: '',
                editId: null, // 修改传入的数据
                currentRow: [], // 选中的当前行数据
                currentRowIds: [], // 选中的ids
                loading: true,
                tableData: []
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
            // 查询
            queryBtn () {
                this.params.current = 1
                this.getTableData()
            },
            // 勾选
            handleSelectionChange (rows) {
                this.currentRowIds = rows.map(item => item.id)
                this.currentRow = rows
            },
            addForm (val, ids) {
                this.addDialog = true
                this.editId = ids || ''
                this.titleName = val
            },
            getSchemeList () {
                this.addDialog = false
                this.$message.success('保存成功!')
                this.getTableData()
            },
            // 删除
            deleteForm (ids) {
                this.$confirm('是否确认删除该角色?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    roleDelete(Array.isArray(ids) ? ids : [ids]).then(res => {
                        this.$message.success('删除成功')
                        this.getTableData()
                    })
                })
            },
            getTableData () {
                this.loading = true
                sysRoleList({
                    size: this.params.size,
                    page: this.params.current,
                    roleName: this.filterForm.roleName
                }).then(res => {
                    this.tableData = res.data
                    this.getPagination(res)
                    this.loading = false
                })
            }
        },
        mounted () {
            this.hegihtNum = document.querySelector('.filterForm').clientHeight
            this.getHeight()
            this.handleQuery()
        }
    }
</script>
