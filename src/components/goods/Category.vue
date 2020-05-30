<template>
  <div>
    <!-- 面包屑区域 -->
    <bread :breadTitle="breadTitle" />
    <!-- card区域 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCateClick">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 分类列表展示 -->
      <!-- 这里使用第三方插件vue-table-with-tree-grid -->
      <tree-table
        :data="cateList"
        :columns="columns"
        show-index
        index-text="#"
        stripe
        border
        :show-row-hover="false"
        :expand-type="false"
        :selection-type="false"
      >
        <!-- 是否有效:通过自定义模板template和作用域插槽来实现 -->
        <template v-slot:isok="scope">
          <i class="el-icon-success" style="color:lightblue" v-if="scope.row.cat_deleted==false"></i>
          <i class="el-icon-error" style="color:red" v-else></i>
        </template>
        <!-- 排序: -->
        <template slot="sort" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level==0">标签一</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level==1">标签二</el-tag>
          <el-tag type="warning" size="mini" v-else>标签三</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editCateClick(scope.row.cat_id)"
          >编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCateClick(scope.row.cat_id)"
          >删除</el-button>
        </template>
      </tree-table>
      <!-- 分页效果展示 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5,10,15]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateVisible" width="50%" @close="addHandleClose">
      <!-- 添加分类表单主题 -->
      <el-form :model="addCateForm" :rules="addCateRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- 级联选择器:显示父级分类 -->
          <el-cascader
            v-model="selectKeys"
            :options="cateType2List"
            :props="{ 
              expandTrigger: 'hover',label:'cat_name',value:'cat_id',children:'children' ,
              checkStrictly:'true'
              }"
            @change="selectParantChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editdialogVisible" width="50%" @close="editHandClose">
      <el-form
        :model="editCateForm"
        :rules="addCateRules"
        ref="editCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Bread from "components/common/Bread";

import { getGoodsCate, addCate, updateCate, deleteCate } from "network/goods";

export default {
  name: "Category",
  data() {
    return {
      breadTitle: ["首页", "商品管理", "商品分类"],
      // 分类目录列表
      cateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },

      total: 1,
      columns: [
        { label: "分类名称", prop: "cat_name" },
        {
          label: "是否有效",
          // 类型设置为自定义模板
          type: "template",
          // 自定义模板名称
          template: "isok"
        },
        {
          label: "排序",
          // 类型设置为自定义模板
          type: "template",
          // 自定义模板名称
          template: "sort"
        },
        {
          label: "操作",
          // 类型设置为自定义模板
          type: "template",
          // 自定义模板名称
          template: "opt"
        }
      ],
      // 添加分类对话框显示是否
      addCateVisible: false,
      addCateForm: {
        cat_pid: 0,
        cat_name: "",
        cat_level: 0
      },
      addCateRules: {
        cat_name: [
          { required: true, message: "请输入份分类名称", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" }
        ]
      },
      // 保存级联选项中的选择的id数组值
      selectKeys: [],
      // 级联选项中所有的选项值
      cateType2List: [],

      // 编辑对话框
      editdialogVisible: false,
      editCateForm: {
        cat_name: ""
      },
      editCateId: ""
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    // 获取分类目录
    async getGoodsCate() {
      const { data } = await getGoodsCate(this.queryInfo);
      this.total = data.data.total;
      if (data.meta.status != 200) return this.$message.error(data.meta.msg);
      // 数据请求成功,保存数据
      this.cateList = data.data.result;
    },
    // 分页显示中修改页面显示数据操作
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getGoodsCate();
    },
    // 当前页点击事件
    handleCurrentChange(newsize) {
      this.queryInfo.pagenum = newsize;
      this.getGoodsCate();
    },
    // 添加分类
    addCateClick() {
      // 获取添加的分类数据
      this.getGoodsCateByType();
      this.addCateVisible = true;
    },
    // 获取二级分类目录
    async getGoodsCateByType() {
      const { data } = await getGoodsCate({ type: 2 });
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg);
      // 数据获取成功
      this.cateType2List = data.data;
    },
    // 级联选择器中的父级选项触发事件
    selectParantChange() {
      // 事件触发之后selectKeys动态绑定的值会自动修改,之后修改表单中的值
      if (this.selectKeys.length != 0) {
        // 修改
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1];
        this.addCateForm.cat_level = this.selectKeys.length;
      } else {
        // 如果当前的选项为空返回原先的设置
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    // 添加分类的表单提交确定按钮点击事件
    addCateConfirm() {
      // 对表单进行验证
      this.$refs.addCateFormRef.validate(async isValid => {
        // 验证不通过则直接返回
        if (!isValid) return;
        //验证通过,发送添加请求
        const { data } = await addCate(this.addCateForm);
        if (data.meta.status != 201) return this.$message.error(data.meta.msg);
        // 添加成功,关闭dialog,刷新列表,提示
        this.getGoodsCate();
        this.addCateVisible = false;
        this.$message.success(data.meta.msg);
      });
    },
    // 关闭添加分类对话框,表单置空
    addHandleClose() {
      this.$refs.addCateFormRef.resetFields();
      // 清空选中的节点
      this.selectKeys = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },
    // 编辑分类按钮点击事件
    editCateClick(id) {
      this.editCateId = id;
      this.editdialogVisible = true;
    },
    // 编辑确定按钮点击事件
    editCateConfirm() {
      this.$refs.editCateFormRef.validate(async isValid => {
        if (!isValid) return;
        const { data } = await updateCate(this.editCateId, this.editCateForm);
        this.$message.success(data.meta.msg);
        this.getGoodsCate();
        this.editdialogVisible = false;
        if (data.meta.status != 200) return this.$message.error(data.meta.msg);
      });
    },
    // 编辑对话框关闭
    editHandClose() {
      this.$refs.editCateFormRef.resetFields();
    },
    // 删除分类
    deleteCateClick(id) {
      // 方法返回的是promise对象
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 点击确认操作执行的方法,发送删除请求
          const { data } = await deleteCate(id);
          if (data.meta.status != 200)
            return this.$message.error(data.meta.msg);

          // 删除成功,刷新页面,
          this.getGoodsCate();
          this.$message.success(data.meta.msg);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  components: {
    Bread
  }
};
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
