<template>
  <div>
    <!-- 面包屑区域 -->
    <bread :breadTitle="breadTitle" />
    <!-- card区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <!--  带有搜索的输入框-->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @change="getGoogsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoogsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- 添加商品按钮 -->
          <el-button type="primary" @click="addGoodsClick">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表展示table -->
      <el-table :data="goodsList" border stripe width="100%">
        <el-table-column type="index" label="#" width="100px"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="140px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="100px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="180px">
          <!-- 对时间进行自定义,通过全局的过滤器自行格式化处理 -->
          <template slot-scope="scope">{{scope.row.add_time|dataFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="140px">
          <!-- 这里通过作用域插槽 -->
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editGoodsClick(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteGoodsClick(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5,10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 编辑商品对话框 -->
    <el-dialog title="编辑商品" :visible.sync="editGoodsVisible" width="50%">
      <!-- 编辑见添加 -->
      <span>编辑见添加,后续待封装</span>
      <span slot="footer">
        <el-button @click="editGoodsVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoodsVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Bread from "components/common/Bread";
import { getGoods, deleteGoods, updateGoods } from "network/goods";
import { request } from "network/request";

export default {
  name: "GoodsList",
  data() {
    return {
      breadTitle: ["首页", "商品管理", "商品列表"],
      // 获取商品的参数保存
      queryInfo: {
        query: "",
        pagesize: 5,
        pagenum: 1
      },
      goodsList: [],
      total: 0,
      editGoodsVisible: false
    };
  },
  components: {
    Bread
  },
  created() {
    this.getGoogsList();
  },
  methods: {
    // 获取商品列表
    async getGoogsList() {
      // 发送请求获取数据,数据获取不到,封装造成的原因,params没有拼接到url后面,在网络请求的封装中没有return导致的
      const data = await getGoods(this.queryInfo);
      // const data = await request(
      //   `goods?query=${this.queryInfo.query}&pagenum=${this.queryInfo.pagenum}&pagesize=${this.queryInfo.pagesize}`
      // );

      // console.log(data.data);
      if (data.data.meta.status != 200)
        return this.$message.error(data.meta.msg);
      // 获取数据成功,保存数据
      this.goodsList = data.data.data.goods;
      this.total = data.data.data.total;
    },

    // 分页功能实现
    // 分页每页数据展示点击\
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoogsList();
    },
    // 选定指定页数展示
    handleCurrentChange(newsize) {
      this.queryInfo.pagenum = newsize;
      this.getGoogsList();
    },

    //编辑商品
    editGoodsClick(row) {
      this.editGoodsVisible = true;
    },
    // editGoodsConfirm() {
    //   updataGoods;
    // },
    deleteGoodsClick(goodsId) {
      // messagebox
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data } = await deleteGoods(goodsId);

          if (data.meta.status != 200)
            return this.$message.error(data.meta.msg);
          // 删除成功刷新界面
          this.getGoogsList();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 添加商品点击事件
    addGoodsClick() {
      // this.addVisible = true;
      // 通过路由导航的方式跳转到添加商品的页面
      this.$router.push("/goods/add");
    }
  }
};
</script>

<style lang="less" scoped>
</style>