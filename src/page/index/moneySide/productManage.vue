<template>
  <el-card style="width:100%;" class="big_background">
    <p class="mb14 f18 fw">产品列表</p>
    <el-card>
      <!--<template>-->
        <!--<el-tabs v-model="activeName">-->
          <!--<el-tab-pane label="产品列表" name="first"></el-tab-pane>-->
        <!--</el-tabs>-->
      <!--</template>-->

      <el-table v-if="productListData" :data="productListData.records" border
                border style="width: 100%" class="mt14">
        <el-table-column prop="id" label="产品编号" >
        </el-table-column>
        <el-table-column prop="name" label="产品名称" >
        </el-table-column>
        <el-table-column prop="annualRate" label="借款年利率" >>
        </el-table-column>
        <el-table-column prop="serviceFeeRate" label="服务费年利率" >
        </el-table-column>
        <el-table-column prop="overdueFeeRate" label="逾期管理费日利率" >
        </el-table-column>
        <el-table-column prop="isCalcCompoundInterest" label="是否计收复利" >
        </el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <el-button @click="audit(scope.row)" type="text" class="cur">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="tr pt30" v-if="productListData">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="postParam.pageNow"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="postParam.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="productListData.totalrecord">
        </el-pagination>
      </div>
    </el-card>

    <!--编辑弹框-->
    <el-dialog title="编辑" :visible.sync="dialogFormVisible"
               @close="cancel('ruleForm')"
              width="600px">
      <el-form :model="ruleFrom" :label-width="formLabelWidth" status-icon
               :rules="rules" ref="ruleForm">
        <el-form-item label="产品名称：">
          <span>{{productName}}</span>
        </el-form-item>
        <el-form-item label="借款年利率：" prop="annualRate" class="rel">
          <el-input v-model="ruleFrom.annualRate" auto-complete="off" type="text"></el-input>
          <span class="abs_bai_fen_hao">%</span>
        </el-form-item>
        <el-form-item label="服务费年利率：" prop="serviceFeeRate" class="rel">
          <el-input v-model="ruleFrom.serviceFeeRate" auto-complete="off" type="text"></el-input>
          <span class="abs_bai_fen_hao">%</span>
        </el-form-item>
        <el-form-item label="逾期管理费日利率：" prop="overdueFeeRate" class="rel">
          <el-input v-model="ruleFrom.overdueFeeRate" auto-complete="off" type="text"></el-input>
          <span class="abs_bai_fen_hao">%</span>
        </el-form-item>
        <el-form-item label="是否收复复利：">
          <span>{{isCalcCompoundInterest}}</span>
        </el-form-item>
        <el-form-item label="还款方式：">
          <span>{{payMethod}}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel('ruleForm')" size="small">取 消</el-button>
        <el-button type="primary" @click="sure('ruleForm')"
                   size="small">确 定</el-button>
      </span>
    </el-dialog>

  </el-card>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import axios from 'axios'

  export default {
    data: function () {
      const content = (rule, value, callback) => {
        if (!value) {
          callback(new Error('内容不能为空'))
        } else {
          callback()
        }
      }
      return {
        postParam: {
          pageSize: 10, //
          pageNow: 1, //
          sort: 'desc', // 排序(asc正序，desc倒序)
          sortField: 'id' // 排序字段名
        },
        // 编辑参数
        ruleFrom: {
          id: null, // 产品id
          annualRate: '', // 借款年利率
          serviceFeeRate: '', // 服务费年利率
          overdueFeeRate: '' // 逾期管理费日利率
        },
        rules: {
          annualRate: [
            {required: true, validator: content, trigger: 'blur'}
          ],
          serviceFeeRate: [
            {required: true, validator: content, trigger: 'blur'}
          ],
          overdueFeeRate: [
            {required: true, validator: content, trigger: 'blur'}
          ]
        },
        payMethod: '', // 还款方式
        productName: '', // 产品名称
        isCalcCompoundInterest: '', // 是否计收复利
        formLabelWidth: '200px',
        dialogFormVisible: false,
        activeName: 'first'
      }
    },
    mounted() {
      this.getProductList(this.postParam)
    },
    computed: {
      ...mapState(['productListData'])
    },
    methods: {
      ...mapActions(['getProductList']),
      // 改变条目大小
      handleSizeChange(val) {
        this.postParam.pageSize = val
        this.getProductList(this.postParam)
      },
      // 跳转到指定页
      handleCurrentChange(val) {
        this.postParam.pageNow = val
        this.getProductList(this.postParam)
      },
      // 取消
      cancel(formName, val) {
        this.dialogFormVisible = false
        this.$refs[formName].resetFields()
      },
      // 编辑
      audit(row) {
        axios.post('loanProduct/getProduct', {id: row.id}).then(res => {
          if (res.data.code === 200) {
            this.payMethod = res.data.body.paymentMethod
            this.productName = res.data.body.name
            this.isCalcCompoundInterest = res.data.body.isCalcCompoundInterest
            this.ruleFrom.id = res.data.body.id
            this.ruleFrom.annualRate = res.data.body.annualRate
            this.ruleFrom.serviceFeeRate = res.data.body.serviceFeeRate
            this.ruleFrom.overdueFeeRate = res.data.body.overdueFeeRate
          }
          this.dialogFormVisible = true
        })
      },
      // 确定
      sure(formName) {
        axios.post('loanProduct/updateProduct', this.ruleFrom).then(res => {
          if (res.data.code === 200) {
            this.$message.success(res.data.message)
            this.dialogFormVisible = false
            this.$refs[formName].resetFields()
            this.getProductList(this.postParam)
          } else {
            this.$message.error(res.data.message)
          }
        })
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .abs_bai_fen_hao{
    position: absolute;
    right:10px;
    top:0;
  }
</style>
