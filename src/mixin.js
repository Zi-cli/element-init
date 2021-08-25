import Pagination from 'components/public/Pagination'
import utils from '@/utils/util'
const mixin = {
  components: {
    Pagination
  },
  data () {
    return {
      dict: {},
      isnoIE: null,
      hegihtNum: null,
      loading: false,
      isShow: false, // 查询条件是否张开(需要展开收起改为false)
      showTxt: '展开',
      tableHeight: null, // 表格高度
      currentRows: [],
      currentIds: [],
      dialogTitle: '',
      params: {
        total: 0,
        size: 20,
        current: 1,
        page: 1
      }
    }
  },
  watch: {

  },
  computed: {},
  mounted () {
    this.$nextTick(() => {
      if (this.$refs.focusVal) {
        this.$refs.focusVal.focus()
      }
    })
  },
  methods: {
    // 展开收缩
    tabHeihgt () {
      let that = this
      this.isShow = !this.isShow
      if (this.isShow) {
        this.showTxt = '收起'
      } else {
        this.showTxt = '展开'
      }
      this.$nextTick(() => {
        that.tableHeight = utils.getTableHeight('.top', '.footer-btn', '.btn_gronp', null)
        if (this.$refs.elTable) {
          this.$refs.elTable.getheihgt()
        }
      })
    },
    // 查询
    handleQuery () {
      this.params.current = 1
      this.getTableData()
    },
    // 重置表单查询条件
    resetQueryForm (filterForm) {
        this.$confirm('是否确认重置查询条件?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            Object.keys(filterForm).forEach(key => {
              if (key !== 'projectId') {
                filterForm[key] = ''
              }
            })
            // 时间区间清空
            this.dateArr = ''
            this.getTableData()
        })
    },
    getRowsData (rows) { // 获取选中行数
      this.currentRows = rows
      this.currentIds = this.currentRows.map(row => row && row.id)
    },
    getPagination (res, page) { // 获取分页参数
      this.params.total = res.totalRows // 总条数
      this.params.size = res.pageRows // 每页条数
      this.params.current = res.currentPage // 当前页数
      this.params.page = res.currentPage // 当前页数
      // 获取完分页获取高度
      this.$nextTick(() => {
        this.getHeight()
      })
    },
    handleCurrentChange (currentPage) { // 分页触发
      this.params.current = currentPage
      this.params.page = currentPage
      this.getTableData()
    },
    handleSizeChange (currentSize) {
      this.params.current = 1
      this.params.page = 1
      this.params.size = currentSize
      this.getTableData()
    },
    handleCollapse () {
      this.advance = !this.advance
      this.$nextTick(() => {
          this.getHeight()
      })
    },
    getHeight () {
      this.tableHeight = utils.getTableHeight('.top', '.footer-btn', '.btn_gronp', null)
      let resizeTimer = null
      const that = this
      window.addEventListener('resize', () => {
        if (resizeTimer) clearTimeout(resizeTimer)
        resizeTimer = setTimeout(function () {
            // 表格高度
            that.tableHeight = utils.getTableHeight('.top', '.footer-btn', '.btn_gronp', null)
            that.hegihtNum = document.querySelector('.filterForm').clientHeight
        }, 300)
      })
    }
  }
}
export default mixin
