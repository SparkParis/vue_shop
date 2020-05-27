<template>
  <div id="app">
    <!-- 引入login组件 -->
    <router-view></router-view>
  </div>
</template>

<script>
import Login from "components/login/Login";
import Home from "components/home/Home";

export default {
  name: "app"
};
</script>

<style lang="less" scoped>
@import url("~assets/css/reset.css");
#app {
  height: 100vh;
  background-color: #2b4b6b;
}
</style>
