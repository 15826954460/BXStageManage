<template>
  <el-card style="width:100%;" class="big_background">
    <p class="mb14 fw f18">SER管理</p>
    <el-card>
      <p style="background: #EEF1F6;height: 50px;
      display: flex;align-items: center;padding-left: 20px"
         class="mb14">
        <span class="iconfont f30"
              style="color: rgb(20, 157, 235);margin-right: 30px;">&#xe644;</span>
        <span style="align-self: center">为避免出现在途订单，请避开流量高峰期，建议18点以后上传</span>
      </p>

      <el-upload
        class="upload-demo mb14"
        ref="upload"
        name="files"
        :show-file-list="showFileList"
        :action="base_url"
        :before-upload="beforeUpload"
        :on-success="onSuccess"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">
          上传到服务器
        </el-button>
        <span slot="tip" class="el-upload__tip pl30 f14">支持格式.ser，建议大小500KB以内</span>
      </el-upload>

      <el-table v-if="serManageListData"
                :data="serManageListData.records"
                border style="width: 100%;">
        <el-table-column label="上传时间">
          <template slot-scope="scope">
            {{scope.row.createTime | dateTime}}
          </template>
        </el-table-column>
        <el-table-column label="文件名称" prop="fileName"></el-table-column>
        <el-table-column label="上传结果" prop="stateText"></el-table-column>
        <el-table-column label="操作人" prop="operator"></el-table-column>
      </el-table>

      <div class="tr pt30">
        <el-pagination v-if="serManageListData"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="postParam.pageNow"
                       :page-sizes="[10, 20, 50, 100]"
                       :page-size="postParam.pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="serManageListData.totalrecord">
        </el-pagination>
      </div>
    </el-card>
  </el-card>
</template>

<script>
  import axios from 'axios'

  export default {
    data: function () {
      return {
        testURL: '',
        postParam: {
          pageNow: 1,
          pageSize: 10,
          sort: 'desc',
          sortField: 'createTime'
        },
        fileList: [],
        showFileList: true,
        base_url: null,
        serManageListData: []
      }
    },
    created() {
      let host = window.location.origin
      this.base_url = `${host}/api/strategy/uploadSer`
    },
    computed: {},
    mounted() {
      this.getSerList()
    },
    methods: {
      getSerList() {
        axios.post('strategy/listPageSerUploadRecord', this.postParam).then(res => {
          if (res.data.code === 200) {
            this.serManageListData = res.data.body
          } else {
            throw new Error('后台返回数据有误')
          }
        })
      },
      // 选择分页大小
      handleSizeChange(val) {
        this.postParam.pageSize = val
        this.getSerList(this.postParam)
      },
      // 跳转到指定页
      handleCurrentChange(val) {
        this.postParam.pageNow = val
        this.getSerList(this.postParam)
      },
      beforeUpload(files, fileList) {
        if ((files.size / 1024) > 500) {
          this.$message.error('文件大小不能超过500KB')
          return false
        }
        if (files.name.substring(files.name.lastIndexOf('.') + 1).toUpperCase() !== 'SER') {
          this.$message.error('文件格式必须是.ser文件')
          return false
        }
        return true
      },
      submitUpload() {
        this.$refs.upload.submit()
      },
      onSuccess(res, file, fileList) {
        if (res.code === 200) {
          this.$message.success(res.message)
          this.$refs.upload.clearFiles()
          this.getSerList()
        } else {
          this.$message.error(res.message)
        }
      }
    }
  }
</script>

<style scoped lang="less">

</style>
