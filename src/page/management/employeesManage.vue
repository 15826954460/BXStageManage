<template>
  <el-card v-if="records" style="width:100%">
    <div slot="header" class="clearfix">
      <span class="lineh-36 f18 fw">员工管理</span>
      <el-form :model="postData" class="fr" label-position="left" inline>
        <el-form-item label="姓名">
          <el-input type="text" placeholder="请输入姓名，限20字内" size="small"
                    v-model="postData.realName"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select size="small" v-model="postData.roleId" placeholder="请选择">
            <el-option :key=null label="全部" value=null></el-option>
            <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName"
                       :value="item.roleId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getEmployeesList" size="small" type="primary">查询</el-button>
          <el-button @click="newOrUpdate(0)" size="small" type="primary">新增员工</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="records.records">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="员工ID">
              <span>{{ props.row.userId }}</span>
            </el-form-item>
            <el-form-item label="入职日期">
              <span>{{ props.row.joinTime | date }}</span>
            </el-form-item>
            <el-form-item label="性别">
              <span>{{ props.row.genderStr }}</span>
            </el-form-item>
            <el-form-item label="邮箱">
              <span>{{ props.row.email }}</span>
            </el-form-item>
            <el-form-item label="手机">
              <span>{{ props.row.mobile }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="realName" label="员工姓名"></el-table-column>
      <el-table-column prop="username" label="登录名"></el-table-column>
      <el-table-column prop="application" label="所属系统"></el-table-column>
      <el-table-column prop="roleName" label="角色"></el-table-column>
      <el-table-column prop="visableStr" label="状态"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-dropdown @command="handleCommand($event,scope.row.userId)">
                        <span class="el-dropdown-link cur">
                            设置<i class="el-icon-caret-bottom el-icon--right"></i>
                        </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="1">个人资料</el-dropdown-item>
              <el-dropdown-item command="2">员工权限</el-dropdown-item>
              <el-dropdown-item command="3" class="error">删除员工</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="mt20" @current-change="handleCurrentChange" @size-change="handleSizeChange"
                   :page-sizes="[10, 20, 30, 40]" :current-page="postData.pageNow" :page-size="postData.pageSize"
                   layout="total, sizes, prev, pager, next, jumper" :total="records.totalrecord">
    </el-pagination>

    <!--todo:信息弹框-->
    <el-dialog width="400px" :title="addStatus?'个人资料':'新增员工'"
               :before-close="cancel" :visible.sync="dialogFormVisible">
      <el-form label-position="left" :rules="rules" ref="ruleForm" :model="form" label-width="80px">
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="form.realName" type="text" placeholder="请输入真实姓名，限20字内"></el-input>
        </el-form-item>
        <el-form-item label="登录名" prop="username">
          <el-input :disabled="addStatus && 'disabled'"
                    placeholder="请输入登录名，限20字内" v-model="form.username"
                    type="text"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码，限20字内"
                    type="password"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile" required>
          <el-input v-model="form.mobile" placeholder="请输入手机号" type="text"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" required>
          <el-input v-model="form.email" placeholder="请输入邮箱" type="email"></el-input>
        </el-form-item>
        <el-form-item label="入职时间" required>
          <el-date-picker @change="isChangeTime=true" :editable="false" v-model="form.jointime" type="date"
                          placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio class="radio" v-model="form.gender" label="0">男</el-radio>
          <el-radio class="radio" v-model="form.gender" label="1">女</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel" size="small">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" size="small">确 定</el-button>
      </div>
    </el-dialog>

    <!--todo: 权限弹框-->
    <el-dialog title="修改权限" :visible.sync="dialogVisible"
               v-if="userRoleSwitchList" width="400px">
      <h3>角色</h3>
      <el-radio class="mt10 radioLabel" v-model="roleSolt.roleId" label="-1">新员工</el-radio>
      <el-radio class="mt10 radioLabel"
                v-for="(item,key) in userRoleSwitchList.allroles"
                :key="key" v-model="roleSolt.roleId"
                :label="item.roleId">
        {{ item.roleName | minStr12 }}
      </el-radio>
      <p class="mb20 mt20">所属系统：{{belongapp}}</p>
      <h3 class="mt20">登录权限</h3>
      <el-radio class="radio mt20" v-model="roleSolt.visable" label="0">禁用</el-radio>
      <el-radio class="radio mt20" v-model="roleSolt.visable" label="1">启用</el-radio>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitRoleVisible" size="small">确 定</el-button>
      </div>
    </el-dialog>

  </el-card>
</template>
<script>
  import axios from 'axios'

  export default {
    data() {
      // 验证邮箱
      const validateEmail = (rule, value, callback) => {
        // eslint-disable-next-line
        const reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/ //
        if (!value) {
          callback(new Error('请输入邮箱'))
        } else if (!reg.test(value)) {
          callback(new Error('请输入正确的邮箱'))
        } else {
          callback()
        }
      }
      // 验证手机号
      const validateMobile = (rule, value, callback) => {
        const reg = /^1(3|4|5|7|8)\d{9}$/
        if (!value) {
          callback(new Error('请输入手机号'))
        } else if (!reg.test(value)) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      }
      return {
        records: null,
        dialogFormVisible: false,
        postData: {
          pageNow: 1,
          pageSize: 10,
          realName: null,
          roleId: null
        },
        roleList: null,
        roleSolt: {
          userId: null,
          visable: '1',
          roleId: '1'
        },
        form: {
          username: null,
          password: null,
          realName: null,
          email: null,
          mobile: null,
          jointime: null,
          gender: '0'
        },
        rules: {
          username: [{
            required: true,
            message: '请输入登录名',
            trigger: 'blur'
          }, {
            min: 4,
            max: 20,
            message: '长度在 4 到 20 个字符',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }, {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur'
          }],
          realName: [{
            required: true,
            message: '请输入真实姓名',
            trigger: 'blur'
          }],
          email: [{
            validator: validateEmail,
            trigger: 'blur'
          }],
          mobile: [{
            validator: validateMobile,
            trigger: 'blur'
          }]
        },
        addStatus: false,
        controllerId: null,
        dialogVisible: false,
        userRoleSwitchList: {
        },
        belongapp: '',
        isChangeTime: false
      }
    },
    mounted() {
      this.getEmployeesList()
    },
    methods: {
      cancel() {
        this.$refs['ruleForm'].resetFields()
        this.dialogFormVisible = false
      },
      // 清空表单
      resetForm() {
        this.form = {
          username: null,
          password: null,
          realName: null,
          email: null,
          mobile: null,
          jointime: null,
          gender: '0'
        }
      },
      // 获取用户角色
      changeSys(val) {
        if (val < 0) {
          this.belongapp = ''
//          this.userRoleSwitchList.belongapp = ''
          return
        }
        axios.post('security/roleApp', {
          roleId: val
        }).then(res => {
          if (parseInt(res.data.code) === 200) {
            console.log(this)
            this.belongapp = res.data.body
//            this.$set(this.userRoleSwitchList, 'belongapp', res.data.body)
//            this.userRoleSwitchList.belongapp = res.data.body
            console.log(this.userRoleSwitchList)
          }
        })
      },
      getEmployeesList() {
        if (this.postData.roleId === 'null') this.postData.roleId = null
        axios.post('security/listSysUsers', this.postData).then(res => {
          if (res.data.code === 200) {
            this.records = res.data.body
          }
        })
      },
      getRoleList() {
        axios.post('security/listAllRole').then(res => {
          if (res.data.code === 200) {
            this.roleList = res.data.body
          }
        })
      },
      // 提交权限
      submitRoleVisible() {
        axios.post('security/modifyUserRole', this.roleSolt).then(res => {
          if (res.data.code === 200) {
            this.$message.success('修改成功')
            this.dialogVisible = false
            this.getEmployeesList()
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      // 获取个人信息接口
      getUserInformation(id) {
        axios.post('security/showSysUserInfo', {
          userId: id
        }).then(res => {
          if (res.data.code === 200) {
            this.form = {
              username: res.data.body.username,
              password: res.data.body.password,
              realName: res.data.body.realname,
              email: res.data.body.email,
              jointime: this.$moment(res.data.body.joinTime)._d,
              mobile: res.data.body.mobile,
              gender: res.data.body.gender ? '1' : '0'
            }
            this.newOrUpdate(1)
            this.controllerId = id
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      // 新增员工
      newOrUpdate(status) {
        status || this.resetForm()
        this.addStatus = !!status
        this.dialogFormVisible = true
      },
      // 添加员工
      submitForm(formName) {
        if (!this.isChangeTime && !this.addStatus) {
          this.$message.error('请选择时间')
          return
        }
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.addUser(formName)
          }
        })
      },
      handleCurrentChange(val) {
        this.postData.pageNow = val
        this.getEmployeesList()
      },
      handleSizeChange(val) {
        this.postData.pageSize = val
        this.getEmployeesList()
      },
      // 设置下拉菜单
      handleCommand(status, id) {
        if (parseInt(status) === 1) {
          this.getUserInformation(id)
        }
        if (parseInt(status) === 2) {
          this.getUserRole(id)
        }
        if (parseInt(status) === 3) {
          this.deleteEmployees(id)
        }
      },
      // 获取用户角色列表
      getUserRole(id) {
        axios.post('security/showUserRole', {
          userId: id
        }).then(res => {
          if (res.data.code === 200) {
            this.userRoleSwitchList = res.data.body
            this.dialogVisible = true
            if (res.data.body.userroles.length) {
              this.roleSolt.roleId = res.data.body.userroles[0].roleId
//              this.userRoleSwitchList.belongapp = res.data.body.beIntegerapp
              this.belongapp = res.data.body.beIntegerapp
            } else {
              this.roleSolt.roleId = '-1'
            }
            this.roleSolt.userId = id
            this.roleSolt.visable = res.data.body.visable.toString() || '1'
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      trim(str, isGlobal) {
        let result
        result = str.replace(/(^\s+)|(\s+$)/g, '')
        if (isGlobal.toLowerCase() === 'g') {
          result = result.replace(/\s/g, '')
        }
        return result
      },
      // 添加员工
      addUser() {
        const urlStr = this.controllerId ? 'modifySysUser' : 'addUser'
        if (this.controllerId) this.form.userId = this.controllerId
        this.form.jointime = this.$moment(this.form.jointime).format('YYYY-MM-DD')
        this.form.username = this.trim(this.form.username, 'g')
        this.form.realName = this.trim(this.form.realName, 'g')
        axios.post('security/' + urlStr, this.form).then(res => {
          if (res.data.code === 200) {
            this.$message.success(this.controllerId ? '修改成功' : '员工创建成功')
            this.dialogFormVisible = false
            this.controllerId = null
            this.getEmployeesList()
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      deleteEmployees(id) {
        this.$confirm('确定删除该员工？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.post('security/deleteSysUser', {
            userId: id
          }).then(res => {
            if (res.data.code === 200) {
              this.$message.success('删除成功')
              this.getEmployeesList()
            } else {
              this.$message.error(res.data.message)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    created() {
      this.getEmployeesList()
      this.getRoleList()
    },
    computed: {
      getRoleId() {
        return this.roleSolt.roleId
      }
    },
    watch: {
      getRoleId(val, old) {
        if (val !== old) {
          this.changeSys(val)
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .demo-table-expand {
    .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 19.5%;
    }
  }

  .radioLabel {
    width: 30%;
    margin-left: 0 !important;
    margin-top: 10px;
  }
</style>
