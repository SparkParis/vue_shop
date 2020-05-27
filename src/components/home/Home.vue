<template>
  <div class="home">
    <el-button type="info" @click="logoutClick">退出</el-button>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods: {
    logoutClick() {
      // 退出功能
      // 删除token
      window.sessionStorage.clear();
      // 重定向到login
      this.$router.push("/login");
    }
  }
};
</script>

<style lang="less" scoped>
.home {
  height: 100vh;
  background-color: #fff;
}
</style>