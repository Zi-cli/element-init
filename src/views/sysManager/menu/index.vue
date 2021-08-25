<template>
  <div class="menu_page" v-loading="loading">
    <div>
      <div class="clearfix btn_box">
        <div>
          <el-button type="primary" size="medium" @click="addForm('添加一级', null, null, '水球')">添加一级菜单(水球)</el-button>
        </div>
      </div>
      <zk-table
      ref="table"
      width="100%"
      size="mini"
      border
      :columns="tableColumns"
      :data="tableData"
      :treeType="!isexpand"
      :selectionType="isexpand"
      :expandType="isexpand"
      :is-fold="false"
      >
      <template slot="menuName" slot-scope="scope">
          {{scope.row.menuName+'-'+ scope.row.remark}}
        </template>
        <!-- <template slot="sss" slot-scope="scope">
          {{conversionFun(scope.row.projectId) +'-'+(scope.row.remark||'')}}
        </template> -->
        <template slot="type" slot-scope="scope">
          {{scope.row.menuType === 1 ? '菜单' : '按钮'}}
        </template>
        <template slot="actions" slot-scope="scope">
            <div class="operation">
              <el-tooltip content="添加" placement="top">
                <img src="@/assets/images/add_icon.png" alt="添加" @click="addForm('添加下级', scope.row.id,scope.row)">
              </el-tooltip>
              <el-tooltip content="编辑" placement="top">
                <img src="@/assets/images/edit.png" alt="编辑" @click="addForm('编辑', null, scope.row)">
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <img src="@/assets/images/delete.png" alt="删除" @click="deleteForm(scope.row.id, $event)">
              </el-tooltip>
            </div>
        </template>
      </zk-table>
    </div>
    <!-- 橄榄球 -->
    <div>
      <div class="clearfix btn_box">
        <div>
          <el-button type="primary" size="medium" @click="addForm('添加一级', null, null, '橄榄球')">添加一级菜单(橄榄球)</el-button>
        </div>
      </div>
      <zk-table
      ref="table"
      width="100%"
      size="mini"
      border
      :columns="tableColumns"
      :data="rightData"
      :treeType="!isexpand"
      :selectionType="isexpand"
      :expandType="isexpand"
      :is-fold="false"
      >
      <template slot="menuName" slot-scope="scope">
          {{scope.row.menuName+'-'+ scope.row.remark}}
        </template>
        <!-- <template slot="sss" slot-scope="scope">
          {{conversionFun(scope.row.projectId)}}
        </template> -->
        <template slot="type" slot-scope="scope">
          {{scope.row.menuType === 1 ? '菜单' : '按钮'}}
        </template>
        <template slot="actions" slot-scope="scope">
            <div class="operation">
              <el-tooltip content="添加" placement="top">
                <img src="@/assets/images/add_icon.png" alt="添加" @click="addForm('添加下级', scope.row.id,scope.row)">
              </el-tooltip>
              <el-tooltip content="编辑" placement="top">
                <img src="@/assets/images/edit.png" alt="编辑" @click="addForm('编辑', null, scope.row)">
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <img src="@/assets/images/delete.png" alt="删除" @click="deleteForm(scope.row.id, $event)">
              </el-tooltip>
            </div>
        </template>
      </zk-table>
    </div>
    <addEdit
      v-if="addDialog"
      :dialog.sync="addDialog"
      :titleName="titleName"
      :isCreated="isCreated"
      :lineParentId="lineParentId"
      :projectId="projectId"
      :editData="editData"
      @getSchemeList="getSchemeList"
      ></addEdit>
  </div>
</template>
<script>
    import addEdit from './components/addEdit'
    import { menuList, menuDelete, projectList } from '@/api/api'
    export default {
        components: {
            addEdit
        },
        data () {
            return {
                filterForm: {
                    a: ''
                },
                projectId: null,
                isCreated: true,
                projectOpt: [], // 项目列表
                addDialog: false,
                titleName: '',
                editData: null, // 编辑传入的数据
                loading: true,
                isexpand: false,
                lineParentId: null,
                tableColumns: [
                    { label: '菜单名称', align: 'left', headerAlign: 'center', prop: 'menuName', type: 'template', template: 'menuName' },
                    { label: '备注', align: 'center', headerAlign: 'center', prop: 'remark' },
                    { label: '链接', align: 'center', headerAlign: 'center', prop: 'url' },
                    { label: '类型', align: 'center', headerAlign: 'center', width: '80', type: 'template', template: 'type' },
                    { label: '操作', align: 'center', headerAlign: 'center', width: '150', type: 'template', template: 'actions' }
                ],
                tableData: [],
                rightData: []
            }
        },
        methods: {
            // 获取项目列表
            getProjectList () {
                projectList().then(res => {
                    this.projectOpt = res
                })
            },
            // 转化项目名称
            conversionFun (val) {
                let name = ''
                this.projectOpt.map(item => {
                    if (item.id === val) {
                        name = item.projectName
                    }
                })
                return name
                // this.projectOpt.map
            },
            addForm (val, parentId, item, names) {
                this.addDialog = true
                this.lineParentId = parentId
                this.editData = typeof item === 'object' ? item : ''
                this.isCreated = val !== '编辑'
                this.titleName = val
                if (names) {
                    this.projectOpt.map(item => {
                        if (item.projectName === names) {
                            this.projectId = item.id
                        }
                        if (item.projectName === names) {
                            this.projectId = item.id
                        }
                    })
                }
            },
            getSchemeList () {
                this.getTableData()
                this.addDialog = false
            },
            // 删除
            deleteForm (ids, e) {
                e.target.blur()
                this.$confirm('是否确认删除该菜单?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    menuDelete(ids).then(res => {
                        this.$message.success('删除成功')
                        this.getTableData()
                    })
                })
            },
            getTableData () {
                this.loading = false
                console.log('获取菜单', this.$api)
                menuList().then(res => {
                    res.map(item => {
                        if (item.projectName === '水球') {
                            this.tableData = this.getDefaultId(item.list)
                        }
                        if (item.projectName === '橄榄球') {
                            this.rightData = this.getDefaultId(item.list)
                        }
                    })
                    this.loading = false
                })
            },
            // 递归
            getDefaultId (data) {
                data.map(item => {
                    if (item.list && item.list.length !== 0) { // 有下级，即是父级
                        this.getDefaultId(item.list)
                        item.children = item.list
                    } else { // 无下级
                        item.children = item.list
                    }
                })
                return data
            }
        },
        mounted () {
            this.getProjectList()
            this.getTableData()
        }
    }
</script>
<style lang="less">
.menu_page{
  overflow-y: auto !important;
  display:flex;
  &>div{
    width: 49%;
    margin-right: 1%;
  }
  .btn_box{
    margin-bottom: 15px;
  }
}
</style>
