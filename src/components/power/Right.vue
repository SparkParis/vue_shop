<template>
  <div>
    <!--面包屑头部-->
    <bread :breadTitle="breadTitle" />
    <!-- 卡片 -->
    <el-card>
      <!-- table 列表,prop来绑定值 -->
      <el-table :data="rightList" stripe border>
        <el-table-column type="index" label="索引"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="等级" prop="level">
          <!-- 等级这里采用自定义的方式显示,通过作用域插槽实现 (获取当前行的数据)-->
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-tag v-if="scope.row.level==0">一级权限</el-tag>
            <el-tag type="success" v-else-if="scope.row.level==1">二级权限</el-tag>
            <el-tag type="warning" v-else-if="scope.row.level==2">三级权限</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRightByList } from "network/power";
import Bread from "components/common/Bread";

export default {
  name: "Right",
  data() {
    return {
      rightList: [],
      breadTitle: ["首页", "权限管理", "权限列表"]
    };
  },
  components: {
    Bread
  },
  created() {
    this.getRightList();
  },
  methods: {
    async getRightList() {
      const type = "list";
      // 发送请求获取权限列表

      const { data } = await getRightByList("list");
      // 数据获取
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg);
      // 数据获取成功保存数据
      this.rightList = data.data;
    }
  }
};
</script>

<style lang="less" scoped>
</style>