<template>
  <el-dialog title="写催记"
             :visible.sync="showDialogTableVisible"
             @close="close('ruleForm')" @open="open"
             width="600px">
    <el-form :model="ruleForm"
             :rules="rules" ref="ruleForm"
             label-width="120px" class="demo-ruleForm">
      <el-form-item label="姓名/公司" prop="name">
        <el-col :span="14">
          <el-input v-model="ruleForm.name" size="small"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="关系" prop="relation">
        <el-col :span="14">
          <el-input v-model="ruleForm.relation" size="small"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="号码" prop="phone">
        <el-col :span="14">
          <el-input v-model="ruleForm.phone" size="small"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="案件状态" prop="caseState" required>
        <el-col :span="14">
          <el-select v-model="ruleForm.caseState" size="small">
            <el-option v-if='fixedField'
                       v-for="item in fixedField.caseType"
                       v-show="item.code"
                       :key="item.code"
                       :label="item.value"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="沟通效果" prop="valid">
        <el-radio v-model="ruleForm.valid" :label="1" @change="change(1)">有效</el-radio>
        <el-radio v-model="ruleForm.valid" :label="0" @change="change(0)">无效</el-radio>
      </el-form-item>
      <el-form-item label="沟通内容" prop="content">
        <el-col :span="14">
          <el-input type="textarea" v-model="ruleForm.content"
                    ref="textarea" :rows="4"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="下次跟进时间">
        <el-col :span="14">
          <el-date-picker
            @change="selectCallTime"
            v-model="ruleForm.nextCallTime"
            type="datetime"
            placeholder="选择日期">
          </el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item class="tr">
        <el-button @click="cancel('ruleForm')"
                   size="small">取消
        </el-button>
        <el-button type="primary"
                   @click="submitForm('ruleForm')" size="small">确定
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import axios from 'axios'
  import {filterTime} from '../../../untils/common'

  export default {
    data: function () {
      return {
        ruleForm: {
          caseId: null, // 案件id
          userId: this.$route.query.userId, // 用户id
          name: null, // 姓名、公司联系人
          relation: null, // 关系
          phone: null, // 号码
          nextCallTime: '', // 下次跟进时间
          valid: 1, // 是否有效沟通
          content: null, // 沟通内容
          caseState: null // 案件状态
        },
        rules: {
          phone: [
            {required: true, message: '号码为必填', trigger: 'blur'},
            {min: 0, max: 30, message: '号码最大长度不能超过30个数字或字符', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '沟通内容为必填', trigger: 'blur'},
            {min: 1, max: 100, message: '长度在 1 到 100 个字符以内', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      ...mapState(['fixedField', 'ruleFormData', 'collectionType']),
      showDialogTableVisible: {
        get: function () {
          return this.$store.state.showDialogTableVisible
        },
        set: function () {
        }
      }
    },
    methods: {
      ...mapActions(['getCollectionRecords', 'caseSpeed']),
      // 添加写催记
      addWriteRecord() {
        if (this.ruleForm.name.length > 30) {
          this.$message.error('姓名/公司不能超过30个字符')
          return
        }
        if (this.ruleForm.relation.length > 30) {
          this.$message.error('关系不能超过30个字符')
          return
        }
        this.fixedField.caseType.forEach((item) => {
          if (item.value === this.ruleForm.caseState) {
            this.ruleForm.caseState = item.code
          }
        })
        axios.post('dun/addDunRecord', this.ruleForm).then(res => {
          if (res.data.code === 200) {
            this.$message.success(res.data.message)
            this.$store.commit('showDialogTableVisible', false)
            // 刷新写催记列表
            this.getCollectionRecords({userId: this.$route.query.userId})
            // 刷新写催记进度
            this.caseSpeed({userId: this.$route.query.userId})
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      open() {
        // 获取更新之后的dom来实行这个方法
        this.$nextTick(() => {
          this.$refs['textarea'].focus()
        })
      },
      // 取消
      cancel(formName) {
        this.$store.commit('showDialogTableVisible', false)
        this.$refs[formName].resetFields()
      },
      // 时间进行格式化
      selectCallTime(val) {
        this.ruleForm.nextCallTime = filterTime(this.ruleForm.nextCallTime, 'dateTime')
      },
      // 确定添加写催记
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addWriteRecord()
            this.$store.commit('setCaseUserId', '')
          } else {
            return false
          }
        })
      },
      change(val) {
        this.ruleForm.valid = val
      },
      close(formName) {
        this.ruleForm.nextCallTime = ''
        this.$store.commit('showDialogTableVisible', false)
        this.$refs[formName].resetFields()
      }
    },
    // 每次页面打开获取上一个页面穿过来的数据
    watch: {
      collectionType() {
        for (let key in this.ruleFormData) {
          this.ruleForm[key] = this.ruleFormData[key]
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import '../../../style/filterStyle';

  .textarea {
    border-radius: 3px;
    border: 1px solid rgb(212, 215, 223);
  }
</style>
