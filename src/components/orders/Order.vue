<template>
  <div>
    <!--面包屑头部-->
    <bread :breadTitle="breadTitle" />
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <!-- 搜索输入框 -->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @change="getOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- orderList 表格展示 -->
      <el-table :data="orderList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status=='0'">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <!-- 作用域插槽的方式获取当前值进行格式化(filter) -->
          <template slot-scope="scope">{{scope.row.create_time|dataFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- 作用域插槽的方式 -->
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editOrderAddressClick(scope.row)"
            ></el-button>
            <!-- 提示信息 -->
            <el-tooltip
              class="item"
              :enterable="false"
              effect="dark"
              content="物流信息"
              placement="top"
            >
              <el-button
                type="success"
                size="mini"
                icon="el-icon-location
"
                @click="addressInfoClick"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页数据 -->
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

    <!-- 编辑地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressDialogVisible"
      width="50%"
      @close="editAddressCllose"
    >
      <!-- 表单 -->
      <el-form :model="editForm" :rules="editFormRule" ref="editFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <!-- 级联选择器:省市区三级联动 -->
          <el-cascader v-model="editForm.address1" :options="cityData" :props="cityProps" clearable></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流信息对话框 -->
    <el-dialog title="物流信息" :visible.sync="addrInfoVisible" width="50%">
      <!-- 时间线显示物流信息 -->

      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(activity, index) in addressInfoList"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import Bread from "components/common/Bread";

// 导入地址的js模块
import cityData from "./citydata";

import { getOrders, getAddressInfo } from "network/orders";

export default {
  name: "Order",
  data() {
    return {
      breadTitle: ["首页", "订单管理", "订单列表"],
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderList: [],
      // 编辑订单地址
      addressDialogVisible: false,
      cityData,
      editForm: {
        address1: [],
        address2: ""
      },
      editFormRule: {
        address1: [
          { required: true, message: "请选择省市区/县", trigger: "blur" }
        ],
        address2: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ]
      },
      // 级联选择器的属性
      cityProps: {
        expandTrigger: "hover",
        label: "label",
        value: "value",
        children: "children"
      },
      // 获取物流信息
      addrInfoVisible: false,
      // 保存物流信息
      addressInfoList: []
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      //发送网络请求获取orders数据
      const { data } = await getOrders(this.queryInfo);
      if (data.meta.status != 200) return this.$message.error(data.meta.msg);
      // 数据获取成功
      this.orderList = data.data.goods;
      this.total = data.data.total;
      this.$message.success(data.meta.msg);
    },
    // 分页
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getOrderList();
    },
    handleCurrentChange(newnum) {
      this.queryInfo.pagenum = newnum;
      this.getOrderList();
    },
    // 编辑订单地址,这里只是做个演示
    editOrderAddressClick(row) {
      this.addressDialogVisible = true;
    },
    // 关闭对话框清空表单
    editAddressCllose() {
      this.$refs.editFormRef.resetFields();
    },
    // 物流信息点击事件
    async addressInfoClick() {
      // 发送请求数据
      const { data } = await getAddressInfo();
      if (data.meta.status != 200)
        return this.$message.error(data.meta.message);
      // 数据请求成功
      this.addressInfoList = data.data;
      this.$message.success(data.meta.message);
      console.log(data);
      this.addrInfoVisible = true;
    }
  },
  components: {
    Bread
  }
};
</script>

<style lang="less" scoped>
/* 级联选择器样式 */
.el-cascader {
  width: 100%;
}
</style>