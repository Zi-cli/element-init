<!--
 * @Date: 2021-02-20 11:40:46
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-04-12 18:07:40
 * @FilePath: \association-competition-admin\src\components\public\pay_dialog.vue
 * 支付
-->
<template>
    <div id="payUp">
        <el-dialog title="会员缴费" :visible.sync="dialogVisible" width="500px">
            <!-- 支付 -->
            <div class="up_payImg" v-if="showType===1">
              <div class="pay_money">
                <p class="money_title">订单金额</p>
                <p class="money_number">￥{{fee}}</p>
              </div>
                <el-upload
                    class="avatar-uploader"
                    :action="upUrl"
                     name="files"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                >
                    <img v-if="imageUrl" :src="$util.photoShow(imageUrl)" class="avatar" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <div v-if="!imageUrl" slot="tip" class="el-upload__tip">
                        上传凭证
                    </div>
                </el-upload>
            </div>
            <!-- 支付成功 -->
            <div v-if="showType===2">
                <div class="success-box">
                    <img src="@/assets/images/new/u42.png" alt="">
                    <p>提交转账凭证成功！等待协会审核</p>
                    <p>审核结果会发送到您注册的手机号！</p>
                    <div class="login_button_container" style="text-align:center;">
                        <el-button type="primary" size="mini" style="width:100px !important;" @click="closeChange">关闭</el-button>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer" v-if="showType===1">
                <button  class="cancel-btn" @click="dialogVisible = false">取 消</button>
                <button class="success-btn" type="primary" @click="submit()">确 定</button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { unitPay, memberPay } from '@/api/api'
    export default {
        props: {
            dialog: {
                type: Boolean
            },
            type: {
                type: Number
            },
            money: {
                default: null
            },
            childTypeList: {
                default: null
            }

        },
        data () {
            return {
                showType: 1,
                dialogVisible: true,
                imageUrl: '',
                projectId: this.$session.get('projectId'),
                fee: '',
                upUrl: '/api/public/upload',
                imgUrl: process.env.VUE_APP_ImgLoadUrl

            }
        },
        watch: {
            dialogVisible () {
                this.$emit('update:dialog', this.dialogVisible)
            }
        },
        methods: {
            handleAvatarSuccess (res, file) {
                this.imageUrl = res[0]
            },
            beforeAvatarUpload (file) {
                const types = ['image/jpeg', 'image/jpg', 'image/png']
                const isImage = types.includes(file.type)
                const isLt5M = file.size / 1024 / 1024 < 5

                if (!isImage) {
                    this.$message.error('上传图片只能是 JPG/PNG 格式!')
                    return false
                }
                if (!isLt5M) {
                    this.$message.error('上传图片大小不能超过 5MB!')
                }
                return isLt5M
            },
            // // // 缴费金额查询
            // isPayInfo () {
            //     let childTypeList = JSON.parse(JSON.stringify(this.childTypeList))

            //     // memberType 1 为单位 2为个人
            //     if (this.type === 2) {
            //         let arr = []
            //         childTypeList.map((res) => {
            //             arr.push(res.memberType)
            //         })
            //         childTypeList = arr
            //     }
            //     if (childTypeList.langth === 0) {
            //         return
            //     }
            //     let obj = {
            //         childTypeList,
            //         memberType: this.type,
            //         projectId: this.projectId
            //     }
            //     chargeStandardDetail(obj).then(res => {
            //         this.fee = res
            //     })
            // },
            // 缴费
            submit () {
                if (!this.imageUrl) {
                    this.$message.error('请上传图片!')
                    return
                }
                if (this.type === 1) {
                    // 单位
                    let obj = {
                        payImage: this.imageUrl
                    }
                    unitPay(obj).then(res => {
                        this.showType = 2
                        this.$emit('getUnit')
                    })
                } else {
                    // 个人批量缴费
                    let orderDetailDTOList = []

                    this.childTypeList.map((res) => {
                        let obj = {
                            childType: res.memberType,
                            projectName: res.userName,
                            userId: res.personnelInfoId
                        }
                        orderDetailDTOList.push(obj)
                    })
                    if (orderDetailDTOList.langth === 0) {
                        return
                    }
                    let obj = {
                        memberType: this.type,
                        orderDetailDTOList, // 人员id数组
                        payImage: this.imageUrl, // 图片
                        payMoney: this.fee// 金额
                    }
                    memberPay(obj).then(res => {
                        this.showType = 2
                        this.$emit('getUnit')
                    })
                }
            },
            closeChange () {
                this.dialogVisible = false // 让弹窗消失掉
            },
            isPelPay () {

            }
        },
        mounted () {
            this.imageUrl = ''
            this.fee = this.money
        }
    }
</script>

<style lang="less" >
#payUp {
    /deep/ .el-dialog__footer {
        text-align: center;
    }
    .up_payImg{
      width: 100%;
      text-align: center;
      height: 250px;
      .pay_money{
        margin-bottom: 20px;
        .money_title{
          font-size: 14px;
          color: #8c939d;
          margin-bottom: 20px;
        }
        .money_number{
          font-size: 20px;
          font-weight: bold;
        }
      }
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        background: rgba(0, 0, 0, 0.04);
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409eff;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 120px;
        height: 120px;
        line-height: 120px;
        text-align: center;
    }
    .el-upload__tip {
        font-size: 12px;
        color: #606266;
        margin-top: -40px;
        margin-left: 0px;
    }
    .avatar {
        width: 120px;
        height: 120px;
        display: block;
    }
    .success-box{
          text-align: center;
          img{
              width: 80px;
          }
            p{
                font-size: 16px;
                margin: 15px 0;
            }
        button{
            margin-top: 40px;
            margin-bottom: 40px;
        }
      }
}
</style>
