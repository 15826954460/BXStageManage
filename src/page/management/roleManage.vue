<template>
  <el-card class="" style="width:100%">
    <div slot="header" class="clearfix">
      <span class="lineh-36 fw f18">角色管理</span>
      <el-button class="fr" @click="updateOrAddRole(0)" size="small" type="primary">新建角色</el-button>
    </div>

    <el-table :data="records.records" v-if="records">
      <el-table-column prop="roleId" label="角色ID"></el-table-column>
      <el-table-column prop="roleName" label="角色名称">
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">{{scope.row.createTime | dateTime}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="updateOrAddRole(scope.row.roleId)">修改</el-button>
          <el-button type="text" @click="deleteRole(scope.row.roleId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination v-if="records" class="mt20" @current-change="handleCurrentChange" @size-change="handleSizeChange"
                   :page-sizes="[10, 20, 30, 40]" :current-page="postData.pageNow" :page-size="postData.pageSize"
                   layout="total, sizes, prev, pager, next, jumper" :total="records.totalrecord">
    </el-pagination>

  </el-card>
</template>
<script>
  import axios from 'axios'

  export default {
    data() {
      return {
        records: null,
        postData: {
          pageNow: 1,
          pageSize: 10
        }
      }
    },
    created() {
      this.getRoleList()
    },
    methods: {
      handleCurrentChange(val) {
        this.postData.pageNow = val
        this.getRoleList()
      },
      handleSizeChange(val) {
        this.postData.pageSize = val
        this.getRoleList()
      },
      getRoleList() {
        axios.post('security/listRoles', this.postData).then(res => {
          if (parseInt(res.data.code) === 200) {
            this.records = res.data.body
          }
        })
      },
      updateOrAddRole(id) {
        this.$router.push({path: '/nav/security/addRole', query: {roleId: id}})
      },
      deleteRole(id) {
        this.$confirm('确定删除该角色？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.post('security/deleteRole', {
            roleId: id
          }).then(res => {
            if (res.data.code === 200) {
              this.$message.success('删除成功')
              this.getRoleList()
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
    }
  }
</script>
