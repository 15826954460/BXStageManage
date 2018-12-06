<template>
  <el-card :body-style="{ padding: '0px' }" class="bigPicContent">
    <div class="picIntroShadow">
      <p v-html="typeName"></p>
    </div>
    <div class="imgContent">
      <img :src="url.url" :data-original="url.url" alt="" ref="picDetails">
    </div>
    <div class="control">
      <span class="iconfont" @click="controlTransform(0)">&#xe626;</span>
      <span class="iconfont" @click="controlTransform(1)">&#xe6da;</span>
      <span class="iconfont" @click="controlTransform(2)">&#xe601;</span>
    </div>
  </el-card>
</template>
<script>
  export default {
    props: ['typeName', 'url'],
    data() {
      return {
        rotateDeg: 0,
        scaleCountX: 1,
        scaleCountY: 1
      }
    },
    methods: {
      controlTransform(state) {
        let obj = this.$refs.picDetails
        if (state === 1) {
          this.scaleCountX = -this.scaleCountX
        } else if (state === 0) {
          let deg = 90
          this.rotateDeg = this.rotateDeg - deg
        } else {
          let scaleCount = 0.2
          this.scaleCountX = this.scaleCountX > 0 ? this.scaleCountX + scaleCount : this.scaleCountX - scaleCount
          this.scaleCountY = this.scaleCountY + scaleCount
        }
        obj.style.transform = `rotate(${this.rotateDeg}deg) scale(${this.scaleCountX}, ${this.scaleCountY})`
      }
    }
  }
</script>
<style lang="less" scoped>
  .bigPicContent {
    width: 360px;
    display: inline-block;
    margin-right: 10px;
    position: relative;
    .picIntroShadow {
      position: absolute;
      background: #fff;
      opacity: 0.8;
      top: 0;
      width: 100%;
      z-index: 9;
      p {
        padding-left: 10px;
      }
    }
    .control {
      text-align: center;
      z-index: 8;
      span {
        margin: 10px 10px;
        font-size: 25px;
        cursor: pointer;
      }
    }
    .imgContent {
      width: 100%;
      height: 360px;
      overflow: hidden;
    }
    img {
      width: 100%;
      height: 100%;
      display: block;
      transition: all .5s;
      -webkit-transition: all .5s;
    }
  }

</style>
