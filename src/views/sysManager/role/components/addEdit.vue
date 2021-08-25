<template>
  <div class="role_addEdit">
    <el-dialog :title="titleName + '角色'" class="wd800" :visible.sync="dialogVisible" :close-on-click-modal="false">
        <div v-loading="loading">
            <el-form :inline="true" :rules="rules" :model="form" label-width="100px" ref="form" v-loading="saveLoading" element-loading-text="保存中">
                <el-form-item label="角色名称:" prop="roleName">
                <el-input v-model.trim="form.roleName" size="mini" placeholder="请输入" maxlength="20" clearable></el-input>
                </el-form-item>
                <el-form-item label="角色编码:" prop="roleCode">
                <el-input v-model.trim="form.roleCode" size="mini" placeholder="请输入" maxlength="20" clearable></el-input>
                </el-form-item><br>
                <el-form-item :label="item.projectName" v-for="item in menuList" :key="item.id">
                    <div class="tree_box">
                        <el-tree
                        :ref="'tree'+item.projectId"
                        :data="item.list"
                        show-checkbox
                        node-key="id"
                        default-expand-all
                        :props="defaultProps"
                        @check="treeChange($event, item.projectId, item.list)">
                        </el-tree>
                    </div>
                </el-form-item>
            </el-form>
        </div>
      <div slot="footer" class="dialog-footer">
        <button @click="dialogVisible = false" class="cancel-btn">取 消</button>
        <button type="warning" class="success-btn" @click="submitForm('form')">确 定</button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import { menuPage, roleDetail, roleAdd, roleEdit } from '@/api/api'
    export default {
        props: {
            dialog: {
                type: Boolean
            },
            titleName: {
                default: ''
            },
            editId: {
                default: null
            }
        },
        data () {
            return {
                menuList: [], // 所有的菜单列表
                dialogVisible: false,
                loading: true,
                saveLoading: false,
                form: {
                    id: null,
                    roleType: 1,
                    roleName: null,
                    roleCode: ''
                },
                checkArr: [],
                sysRoleMenuIds: [], // 选中
                getHalfCheckedArr: [], // 半选中
                logoUrl: [],
                defaultProps: {
                    children: 'list',
                    label: 'menuName'
                },
                options: [],
                noEdit: true,
                matchObj: [],
                rules: {
                    roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
                    roleCode: [{ required: true, message: '角色编码不能为空', trigger: 'blur' }]
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
            // 编辑时查看的数据
            editDtail (ids) {
                roleDetail(ids).then(res => {
                    this.form = res.sysRole
                    this.$nextTick(() => {
                        this.getTreeList(res.sysMenuIds)
                    })
                })
            },
            // 编辑时过滤半选中
            setCheckedKeys (menuIds) {
                this.menuList.map(item => {
                    const menuArr = []
                    for (let j = 0; j < menuIds.length; j++) {
                        const menuid = menuIds[j]
                        const key = this.getNodekeys(menuid, item.list)
                        if (key !== '') {
                            menuArr.push(key)
                        }
                    }
                    console.log('menuArr', menuArr)
                    this.$refs['tree' + item.projectId][0].setCheckedKeys(menuArr)
                })
            },
            // 过滤出半选中
            getNodekeys (menuId, childrens) {
                console.log(menuId, childrens, 'menuId, childrens')
                let key = ''
                for (let i = 0; i < childrens.length; i++) {
                    const menu = childrens[i]
                    const id = menu.id
                    const childs = menu.list
                    if (id === menuId) { // 如果相等
                        if (childs && childs.length > 0) {
                            key = this.getNodekeys(menuId, childs)
                        } else { // 没有孩子节点
                            return menuId
                        }
                    } else if (childs && childs.length > 0) {
                        key = this.getNodekeys(menuId, childs)
                    }
                    if (key !== '') {
                        return key
                    }
                }
                return key
            },
            // 遍历数组匹配id
            matchingTree (data, ids) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].id === ids) {
                        this.matchObj = data[i].list
                    } else {
                        if (data[i].list) {
                            this.matchingTree(data[i].list, ids)
                        }
                    }
                }
            },
            treeChange (data, ids, itemList) {
                this.matchingTree(itemList, data.parentId)
                if (data.menuType === 2) {
                    // 如果点击的是按钮，获取同级所有按钮，并做对比筛选
                    if (data.menuName === '查询') {
                        this.matchObj.map(item => {
                            if (data.id !== item.id) {
                                this.$refs['tree' + ids][0].setChecked(item.id, false)
                            }
                        })
                    } else {
                        // 点击其他按钮需要把查询的id勾上(setChecked, 设置某个节点被勾选,第二个参需为true)
                        this.matchObj.map(item => {
                            if (item.menuName === '查询') {
                                this.$refs['tree' + ids][0].setChecked(item.id, true)
                            }
                        })
                    }
                }
                this.noEdit = false
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
            // 添加或编辑
            addForm () {
                this.getHalfCheckedArr = []
                this.sysRoleMenuIds = []
                this.menuList.map(item => {
                    this.getHalfCheckedArr = this.getHalfCheckedArr.concat(this.$refs['tree' + item.projectId][0].getHalfCheckedKeys())
                    this.sysRoleMenuIds = this.sysRoleMenuIds.concat(this.$refs['tree' + item.projectId][0].getCheckedKeys())
                })
                this.sysRoleMenuIds = this.sysRoleMenuIds.concat(this.getHalfCheckedArr) // 全选加半选
                if (this.titleName === '添加') {
                    roleAdd({
                        sysRole: this.form,
                        sysRoleMenuIds: this.sysRoleMenuIds
                    }).then(res => {
                        this.$emit('getSchemeList')
                    })
                } else {
                    roleEdit({
                        sysRole: this.form,
                        sysRoleMenuIds: this.sysRoleMenuIds
                    }).then(res => {
                        this.$emit('getSchemeList')
                    })
                }
                console.log(this.getHalfCheckedArr, this.sysRoleMenuIds)
            },
            // 获取树
            getTreeList (ids) {
                this.loading = true
                menuPage().then(res => {
                    this.menuList = res
                    this.loading = false
                    this.$nextTick(() => {
                        if (ids) {
                            this.setCheckedKeys(ids)
                        }
                    })
                })
            }
        },
        created () {
            if (this.titleName === '修改') {
                this.editDtail(this.editId)
            } else {
                this.getTreeList()
            }
        },
        mounted () {
            this.dialogVisible = this.dialog
        }
    }
</script>

<style lang="less">
  .role_addEdit {
    .el-form--inline .el-form-item__content{
      width: 220px ;
    }
    .tree_box {
      width: 220px;
      height: 320px;
      border: 1px solid #CFD5D9;
      padding:10px;
      padding-right: 10px;
      border-radius: 8px;
      overflow-y: auto;
    }
    .el-form--inline .el-form-item__content .el-input__inner{
      width: 220px !important;
    }
    .el-dialog__body{
      padding-top: 10px;
    }
  }
</style>
