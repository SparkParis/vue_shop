<template>
  <el-breadcrumb>
    <el-breadcrumb-item :to="{ path: '/home' }">{{breadTitle&&breadTitle[0]}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{breadTitle&&breadTitle[1]}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{breadTitle&&breadTitle[2]}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: "Bread",
  props: {
    breadTitle: {
      type: Array,
      default() {
        return [];
      }
    }
  }
};
</script>

<style>
</style>