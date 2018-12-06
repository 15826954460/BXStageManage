<template>
  <el-menu default-active="0" class="el-menu" background-color="#f2f2f2"
           @open="handleOpen" @close="handleClose">

    <div v-for="(item,index) in navList" :key="index">
      <el-submenu background-color="red"
                  v-if="item.children" :index="item.menuId + ''" :key="index">
        <template slot="title">{{item.label}}</template>
        <el-menu-item v-for="items in item.children"
                      :key="items.menuId +''"
                      :index="items.menuId + ''"
                      @click="childItem(items.url, items.menuId)">
          {{items.label}}
        </el-menu-item>
      </el-submenu>

      <el-menu-item v-else :index="item.menuId + ''" @click="childItem(item.url, item.menuId)">
        <span slot="title">{{item.label}}</span>
      </el-menu-item>
    </div>

  </el-menu>
</template>

<script>
  import {mapState} from 'vuex'
  import axios from 'axios'

  export default {
    data: function () {
      return {
        navList: []
      }
    },
    created() {
      // 获取左侧列表接口
      this.getNavList()
      let key = window.sessionStorage.getItem('activeIndex')
      if (key) {
        this.$store.commit('changeTopicType', Number(key))
      }
    },
    computed: {
      ...mapState(['fixedField', 'topicType'])
    },
    methods: {
      getNavList() {
        axios.post('/security/userDirectoryMenu', {
          applicationId: this.topicType
        }).then((res) => {
          if (res.data.code === 200) {
            this.navList = res.data.body
          }
        })
      },
      childItem(path, url) {
        // console.log(url)
        this.$router.push({path: path})
      },
      handleOpen(key, keyPath) {
//        this.routerPath(key)
      },
      handleClose(key, keyPath) {
//        this.routerPath(key)
      }
    },
    watch: {
      topicType(oldVal, newVal) {
        this.getNavList()
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .el-menu {
    border-right: none;
    height: 100%;
    overflow: auto;
  }
</style>
