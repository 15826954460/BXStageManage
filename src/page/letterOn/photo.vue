<template>
  <div>
    <div class="box-card mb14" style="width:100%;">
      <div slot="header" class="clearfix mb14">
        <span class="f20 fw">照片材料</span>
        <el-button style="float: right;" class="blue"
                   @click="dialogFormVisible=true" size="small">查看大图
        </el-button>
      </div>

      <div class="smallPhotoContent card_bg pd10">
        <p>活体比对分数：{{score}}</p>
        <ul>
          <li v-for="(item,index) in pageCutIndex(6,minImageIndex)">
            <img :src="item.url" alt="">
            <p v-html="returnPicName(item)"></p>
          </li>
        </ul>
        <el-pagination small layout="prev, pager, next"
                       :page-size="6"
                       :total="allTotalpage"
                       @current-change="minImagePageChange">
        </el-pagination>
      </div>

    </div>

    <el-dialog title="查看大图" :visible.sync="dialogFormVisible"
               width="80%" class="dialogStyle">
      <h4>选择图片</h4>
      <ul class="smallPicList">
        <li v-for="(item,index) in pageCutIndex(10,maxImageIndex)"
            @click="choiceImage(index)">
          <img :src="item.url" alt="">
          <p v-show="isInArray(index) !== false">
            <span class="iconfont">&#xe631;</span>
          </p>
        </li>
      </ul>

      <el-pagination small class="maxImage" layout="prev, pager, next"
                     :page-size="10" :total="allTotalpage"
                     @current-change="maxImagePageChange"></el-pagination>

      <div style="clear:both">
        <h4>放大图片</h4>
        <div ref="picContent">
          <photoDetails
            v-for="(item,index) in bigImgArray" :key="index"
            :typeName="returnPicName(item)"
            :url="item">
          </photoDetails>
        </div>
        <!---->
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import axios from 'axios'
  import photoDetails from '../../components/photoDetails'
  import Viewer from 'viewerjs'
  import 'viewerjs/dist/viewer.min.css'
  import {mapState} from 'vuex'

  export default {
    data() {
      return {
        orderId: this.$route.query.orderId,
        photoList: [],
        score: null,
        maxPicIndexArray: [0, 1, 2],
        dialogFormVisible: false,
        dialogIsFirstShow: true,
        Viewers: null,
        minImageIndex: 1,
        maxImageIndex: 1
      }
    },
    created() {
      this.getPhoto()
      this.getNum()
    },
    computed: {
      ...mapState(['circulation', 'fixedField']),
      bigImgArray() {
        let _arr = []
        this.maxPicIndexArray.forEach(num => {
          _arr.push(this.photoList[num])
        })
        return _arr
      },
      allTotalpage() {
        return this.photoList.length
      }
    },
    watch: {
      dialogFormVisible(val) {
        if (val && this.dialogIsFirstShow) {
          setTimeout(() => {
            this.dialogIsFirstShow = false
            this.Viewers = new Viewer(this.$refs.picContent, {
              url: 'data-original'
            })
          }, 1)
        }
      },
      'circulation.refreshAgain': {
        handler: function (val, oldVal) {
          this.orderId = this.$route.query.orderId
          this.getPhoto()
          this.getNum()
        },
        deep: true
      }
    },
    methods: {
      // 获取活体分
      getNum() {
        axios.post('audit/facePlus', {
          orderId: this.$route.query.orderId
        }).then(res => {
          if (res.data.code === 200) {
            this.score = res.data.body.socre
          }
        })
      },
      // 获取图片列表
      getPhoto() {
        axios.post('audit/photo', {
          orderId: this.orderId
        }).then(res => {
          if (res.data.code === 200) {
            let time = Date.parse(new Date())
            this.photoList = res.data.body.map(function (item) {
              item.url = `${item.url}?_=${time}`
              return item
            })
          }
        })
      },
      returnPicName(val) {
        let _html = ''
        this.fixedField.photoType.forEach(item => {
          if (val) {
            if (item.code === val.type) {
              _html = `${item.value}
                       <span style="color:${item.color};padding-left:10px">
                        ${item.type}
                       </span>`
            }
          }
        })
        return _html
      },
      minImagePageChange(page) {
        this.minImageIndex = parseInt(page)
      },
      maxImagePageChange(page) {
        this.maxImageIndex = parseInt(page)
      },
      pageCutIndex(count, page) {
        let _index = (page - 1) * count
        let _arr = this.photoList
        let _newArray = []
        for (let i = _index; i < count * page; i++) {
          _arr[i] && _newArray.push(_arr[i])
        }
        return _newArray
      },
      choiceImage(index) {
        let _index = this.isInArray(index)
        if (_index !== false) {
          this.maxPicIndexArray.splice(_index, 1)
        } else {
          if (this.maxPicIndexArray.length >= 3) {
            this.$message.error('最多只能选中3张图片')
          } else {
            this.maxPicIndexArray.push(index + (this.maxImageIndex - 1) * 10)
          }
        }
        setTimeout(() => this.Viewers.update(), 500)
      },
      isInArray(obj) {
        let _index = obj + (this.maxImageIndex - 1) * 10
        let _arr = this.maxPicIndexArray
        let i = _arr.length
        while (i--) {
          if (_arr[i] === _index) {
            return i
          }
        }
        return false
      }
    },
    components: {
      photoDetails
    }
  }
</script>
<style lang="less" scoped>
  .smallPhotoContent ul {
    list-style-type: none;
    margin-top: 20px;
    li {
      display: inline-block;
      width: 31%;
      margin: auto 1%;
      img {
        display: block;
        width: 100%;
        height: 200px;
      }
      p {
        padding: 15px 0px 15px 10px;
      }
    }
  }

  .dialogStyle {
    h4 {
      display: block;
      float: left;
      margin-right: 20px;
      clear: both;
    }
  }

  .maxImage {
    margin-top: 80px;
    margin-left: 20px;
    float: left;
  }

  .smallPicList {
    margin-bottom: 40px;
    float: left;
    li {
      display: inline-block;
      width: 100px;
      height: 100px;
      position: relative;
      margin-right: 10px;
      img {
        width: 100%;
        height: 100%;
      }
      p {
        position: absolute;
        width: 100%;
        height: 100%;
        background: #000;
        opacity: .7;
        top: 0;
        left: 0;
        text-align: center;
        line-height: 100px;
        color: #fff;
      }
    }
  }
  .viewer-in{
    opacity: 0.8 !important;
  }
</style>
