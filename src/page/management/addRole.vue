<template>
  <el-card class="" style="width:100%">
    <div slot="header" class="clearfix">
      <span class="lineh-36">{{status == '0' ? '新建角色' : '修改角色'}}</span>
    </div>
    <el-form :model="ruleForm" style="width: 300px" :rules="rules"
             ref="ruleForm" label-width="80px" class="demo-ruleForm">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="ruleForm.name"
                  placeholder="请输入角色名称，限20字内"></el-input>
      </el-form-item>
    </el-form>

    <el-form label-width="80px" class="demo-ruleForm">
      <el-form-item label="权限设置">
        <el-tabs v-if="roleTreeData">
          <el-tab-pane v-for="(item,key) in roleTreeData" :key="key" :label="item.appName">
            <el-tree :check-strictly="true" :data="item.data" show-checkbox node-key="menuId"
                     :default-expanded-keys="item.expandDatas" ref="tree" :default-checked-keys="item.checkDatas"
                     :props="defaultProps"></el-tree>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
    </el-form>
    <div class="fr mt20">
      <el-button @click="cancel" size="small">取消</el-button>
      <el-button type="primary" @click="addOrUpdateRole" size="small">确定</el-button>
    </div>
    <div class="clearBoth"></div>
  </el-card>
</template>
<script>
  import axios from 'axios'

  export default {
    data() {
      return {
        roleTreeData: null,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        ruleForm: {
          name: null
        },
        rules: {
          name: [
            {required: true, message: '请输入角色名称', trigger: 'blur'},
            {max: 20, message: '最大 20 个字符', trigger: 'blur'}
          ]
        },
        status: this.$route.query.roleId
      }
    },
    mounted() {
      this.getTreeData()
    },
    methods: {
      // 获取角色信息
      getTreeData() {
        const id = this.status !== 0 ? this.status : null
        axios.post('security/listTreeMenus', {
          roleId: id
        }).then(res => {
          if (res.data.code === 200) {
            this.roleTreeData = res.data.body
            id && (this.ruleForm.name = this.roleTreeData.app_1.roleName)
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
      cancel() {
        this.$confirm('此操作将放弃之前操作, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$refs['ruleForm'].resetFields()
          this.$router.push({path: '/nav/security/roleManage'})
        }).catch()
      },
      addOrUpdateRole() {
        if (this.ruleForm.name === '' || this.ruleForm.name === null) {
          this.$message.error('请填写角色名称')
          return
        }
        if (this.ruleForm.name.length > 20) {
          this.$message.error('最大长度不能超过20个字符')
          return
        }
        let arr = []
        let menuIds = ''
        this.$refs.tree.forEach(item => {
          arr = arr.concat(item.getCheckedKeys())
        })
        arr.forEach(item => {
          menuIds += item + ','
        })
        this.ruleForm.name = this.trim(this.ruleForm.name, 'g')
        this.status !== 0 ? this.updateRole(this.status, menuIds) : this.addRole(menuIds)
      },
      // 添加角色
      addRole(menuIds) {
        axios.post('/security/addRole', {
          roleName: this.ruleForm.name,
          menuIds: menuIds
        }).then(res => {
          if (res.data.code === 200) {
            this.$message.success('角色创建成功')
            setTimeout(() => {
              this.$router.push('/nav/security/roleManage')
            }, 1000)
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      // 修改角色
      updateRole(id, menuIds) {
        axios.post('/security/modifyRole', {
          roleId: id,
          roleName: this.ruleForm.name,
          menuIds: menuIds
        }).then(res => {
          if (res.data.code === 200) {
            this.$message.success('角色修改成功')
            setTimeout(() => {
              this.$router.push('/nav/security/roleManage')
            }, 1000)
          } else {
            this.$message.error(res.data.message)
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .el-tree {
    border: 0
  }

  .el-tabs {
    border: 1px solid #ddd
  }
</style>
