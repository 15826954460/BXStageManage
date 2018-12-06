<template>
  <el-card style="width:100%;" class="big_background">
    <p class="mb14 f18 fw">用户反馈</p>
    <el-card>
      <el-tabs v-model="activeTypeName" type="card" @tab-click="tabClick">
        <el-tab-pane v-for="(item, index) in menuListType" :key="index"
                     :label="item.label" :name="item.name"></el-tab-pane>
      </el-tabs>
      <el-table v-if="userFeedbackData"
                :data="userFeedbackData.records"
                border style="width: 100%;">
        <el-table-column label="反馈时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | dateTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户ID" prop="userId">
          <template slot-scope="scope">
            <span @click="goToUserDetail(scope.row)" class="blue cur">
              {{scope.row.userId}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="realName"></el-table-column>
        <el-table-column label="手机号" prop="mobile"></el-table-column>
        <el-table-column label="反馈内容" prop="feedbackContent"></el-table-column>
        <el-table-column label="图片">
          <template slot-scope="scope">
            <el-button
              @click="lookImg(scope.row)"
              type="text" class="cur ml14">{{scope.row.feedbackImgs.length}} 张
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="回复内容" prop="revert"
          v-if="Number.parseInt(activeTypeName) === 1">
        </el-table-column>
        <el-table-column
          label="回复人" prop="operator"
          v-if="Number.parseInt(activeTypeName) === 1">
        </el-table-column>
        <el-table-column
          label="回复时间"
          v-if="Number.parseInt(activeTypeName) === 1">
          <template slot-scope="scope">
            <span>{{scope.row.updateTime | dateTime}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          v-if="Number.parseInt(activeTypeName) === 0">
          <template slot-scope="scope">
            <el-button
              v-show="showRepalyBtn"
              @click="showReply(scope.row)"
              type="text" class="cur ml14">回复
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="tr pt30" v-if="userFeedbackData">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="postParam.pageNow"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="postParam.PageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="userFeedbackData.totalrecord">
        </el-pagination>
      </div>
    </el-card>

    <el-dialog width="500px" @close="form.revert = ''"
               :visible.sync="replayDialog">
      <el-form :model="form" ref="ruleForm" class="mt14">
        <el-form-item label="回复内容：" label-width="120px">
          <el-input v-model="form.revert" type="textarea" :rows="8"
                    placeholder="请输入300字以内的回复内容"></el-input>
        </el-form-item>

        <el-form-item class="tr">
          <el-button @click="cancel('ruleForm')" size="small">取 消</el-button>
          <el-button type="primary" @click="sureReplay('ruleForm')" size="small">确 定</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>

    <!--:class="{ isLoading: loading }"-->
    <!--v-loading="loading"-->
    <!--element-loading-text="拼命加载中"-->
    <!--element-loading-spinner="el-icon-loading"-->

    <div v-if="carouselShow">
      <el-dialog
        :visible.sync="carouselShow"
        :show-close="false"
        width="1000px"
        @close="closeDialog">
        <swiper :options="swiperOption"
                ref="mySwiper"
        >
          <swiper-slide
            v-if="imageList.length > 0"
            v-for="(item, key) in imageList" :key="key"
          >
            <div style="height:510px;" class="img_wrapper">
              <img :src="item.url"
                   :style="{width:item.width, height: item.height}"/>
            </div>
          </swiper-slide>
          <div class="swiper-button-prev" slot="button-prev" ref="btn_prev"></div>
          <div class="swiper-button-next" slot="button-next" ref="btn_next"></div>
        </swiper>
      </el-dialog>
    </div>

    <userDetailDialog
      :userId="userId"
      @listenChildEvent="hideUserDetail"
      v-if="isShowDetail"></userDetailDialog>

  </el-card>
</template>

<script>
  import {mapActions} from 'vuex'
  import axios from 'axios'
  import {swiper, swiperSlide} from 'vue-awesome-swiper'
  import userDetailDialog from '../../index/userManage/userDetailDialog'
  import {judgeLimit} from '../../../untils/common'

  export default {
    data: function () {
      return {
        swiperOption: {
          notNextTick: true,
          direction: 'horizontal',
          navigation: {
            prevEl: '.swiper-button-prev', // 上一张
            nextEl: '.swiper-button-next' // 下一张
          },
          onTransitionStart(swiper) { //  //这个位置放swiper的回调方法
            // this.activeitem = swiper.activeIndex
          }
        },
        fixWidth: 800,
        fixHeight: 500,
        imageList: [],
        carouselShow: false,
        menuListType: [
          {label: '待处理', name: '0'},
          {label: '已处理', name: '1'}
        ],
        postParam: {
          state: 0,
          pageNow: 1,
          pageSize: 10,
          sort: 'desc', // 排序(asc正序，desc倒序)
          sortField: 'createTime' // 排序字段名
        },
        form: {
          revert: null,
          feedbackId: null
        },
        loading: true,
        isShowDetail: false,
        replayDialog: false,
        activeTypeName: '0',
        carouselIndex: 0, // 图片轮播的下表
        userDetailMenuId: 58, // 用户详情
        userFeedBackMenuId: 114, // 回复权限
        userFeedbackData: null  // 用户反馈数据
      }
    },
    computed: {
      showRepalyBtn: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.userFeedBackMenuId)
      },
      showDetail: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.userDetailMenuId)
      }
    },
    components: {
      userDetailDialog,
      swiper,
      swiperSlide
    },
    created() {
      this.buttonLimit()
    },
    // 页面销毁前清楚定时器
    beforeDestroy() {
      this.timer = null
    },
    mounted() {
      this.getUserFeedBack()
    },
    methods: {
      ...mapActions(['buttonLimit']),
      // 获取用户反馈信息
      getUserFeedBack() {
        axios.post('feedback/listPageFeedback', this.postParam).then(res => {
          if (res.data.code === 200) {
            this.userFeedbackData = res.data.body
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      // 打开用户详情
      goToUserDetail(row) {
        if (this.showDetail) {
          this.isShowDetail = true
          this.userId = row.userId
          this.$store.commit('setUserDetailDialogTableVisible', true)
        } else {
          this.$message.error('您没有权限进行该操作')
        }
      },
      hideUserDetail() {
        this.isShowDetail = false
      },
      // 打开回复弹框
      showReply(row) {
        this.replayDialog = true
        this.form.feedbackId = row.id
      },
      // 确认回复
      sureReplay() {
        if (this.form.revert.length > 300) {
          this.$message.error('回复内容不能超过300字')
          return
        }
        axios.post('feedback/writeBack', this.form).then(res => {
          if (res.data.code === 200) {
            this.$message.success(res.data.message)
            this.getUserFeedBack()
            this.replayDialog = false
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      cancel(ruleForm) {
        this.replayDialog = false
        this.form.revert = ''
      },
      tabClick() {
        this.postParam.state = Number.parseInt(this.activeTypeName)
        this.getUserFeedBack()
      },
      handleSizeChange(val) {
        this.postParam.pageSize = val
        this.getUserFeedBack(this.operationLogParam)
      },
      handleCurrentChange(val) {
        this.postParam.pageNow = val
        this.getUserFeedBack(this.operationLogParam)
      },
      createImg(url) {
        return new Promise((resolve, reject) => {
          let img = new Image()
          img.src = url
          img.onload = () => {
            this.imageList.push({
              url: url,
              width: this.imgWidth(img.width, img.height, 'w'),
              height: this.imgWidth(img.width, img.height, 'h')
            })
            // 图片加载完成之后继续 resolve
            resolve()
          }
        })
      },
      // 查看照片
      async lookImg(row) {
        this.carouselShow = true
        if (row.feedbackImgs.length > 0) {
          for (let i = 0; i < row.feedbackImgs.length; i++) {
            await this.createImg(row.feedbackImgs[i])
          }
          // this.loading = false
        } else {
          this.$message.error('暂无可查看图片')
        }
      },
      imgWidth(width, height, type) {
        // 根据最大高度来布局
        if (height > this.fixHeight) {
          width = this.fixHeight / height * width
          height = this.fixHeight
        }
        // 根据最大width来布局
        if (width > this.fixWidth) {
          height = this.fixWidth / width * height
          width = this.fixWidth
        }
        if (type === 'w') {
          return width + 'px'
        } else {
          return height + 'px'
        }
      },
      // 关闭定时器
      closeDialog() {
        this.loading = true
        this.imageList = []
        this.carouselShow = false
        this.carouselIndex = 0
      }
    }
  }
</script>

<style scoped lang="less">
  .img_wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.9);
  }

  .user_feed_back_wrapper {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 2100;
    background: rgba(0, 0, 0, 0.6);
  }

  .isLoading {
    height: 510px;
    width: 1000px;
    position: fixed;
    top: 15vh;
    left: 50%;
    transform: translateX(-50%);
  }

</style>
