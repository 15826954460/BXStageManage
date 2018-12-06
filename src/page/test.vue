<template>
  <div
    v-loading="loading2"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    :data="tableData"
    style="width: 100%">
    <ul>
      <li v-for="item in intableData" :key="index">
        {{item.date}}
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        tableData: [{
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        loading2: true
      }
    },
    computed: {},
    mounted() {
    },
    methods: {}
  }
</script>

<style scoped lang="less">

</style>
