<template>
  <div>
    <!-- 面包屑区域 -->
    <bread :breadTitle="breadTitle" />
    <!-- 卡片区域 -->

    <el-card>
      <!-- 警告区域 -->
      <el-alert :closable="false" show-icon title="注意：只允许为第三级分类设置相关参数！" type="warning"></el-alert>
      <!-- 商品分类 -->
      <el-row>
        <el-col>
          <span>选择商品分类:</span>
          <!-- 选择商品分类的级联选择框 :注意change事件触发的时候v-model动态绑定的数值会被自动赋值-->
          <el-cascader
            v-model="selectKeys"
            :options="allGoodsCate"
            :props="cateProps"
            @change="selectGoodsClick"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab标签页:点击不同的tabpane对应的name值会自动赋值非activename,声明activename保存变量即可 -->
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button size="mini" type="primary" :disabled="isSelected3" @click="addParamClick">添加参数</el-button>
          <!-- 动态参数table -->
          <el-table :data="manyDataList" style="width: 100%" stripe border>
            <el-table-column type="expand">
              <!-- 作用域插槽的方式循环展示 attr_vals中的数据-->
              <template slot-scope="scope">
                <el-tag
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="closeTagClick(index,scope.row)"
                >{{item}}</el-tag>
                <!-- 添加动态编辑标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" />
            <el-table-column prop="attr_name" label="属性名称" />
            <el-table-column label="操作">
              <!-- 通过作用域插槽获取当前的值 -->
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editParamsClick(scope.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParamsClick(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            size="mini"
            type="primary"
            :disabled="isSelected3"
            @click="addAttributeClick"
          >添加属性</el-button>
          <!-- 静态table -->
          <el-table :data="onlyDataList" style="width: 100%" stripe border>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="closeTagClick(index,scope.row)"
                >{{item}}</el-tag>
                <!-- 编辑tag -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#" />
            <el-table-column prop="attr_name" label="属性名称" />
            <el-table-column label="操作">
              <!-- 通过作用域插槽获取当前的值 -->
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editParamsClick(scope.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParamsClick(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加属性和添加参数对话框 -->
    <el-dialog
      :title="addDialogName"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="addFormClose"
    >
      <!-- 对话框主体 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRefs">
        <el-form-item :label="addLabel" prop="attr_name" label-width="100px">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框尾部 -->
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog
      :title="editDialogName"
      :visible.sync="editDialogVisible"
      width="40%"
      @close="editFormClose"
    >
      <!-- 对话框主体 -->
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRefs">
        <el-form-item :label="addLabel" prop="attr_name" label-width="100px">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框尾部 -->
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Bread from "components/common/Bread";

import {
  getGoodsCate,
  getCateParams,
  addGoodsParamAttr,
  updateParams,
  deleteParams
} from "network/goods";

export default {
  name: "Params",
  data() {
    return {
      breadTitle: ["首页", "商品管理", "参数列表"],
      // 获取所有的分类列表
      allGoodsCate: [],
      cateProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      selectKeys: [],
      // 标签默认选项
      activeName: "many",
      // 保存数据
      manyDataList: [],
      onlyDataList: [],
      // 添加对话框
      addDialogVisible: false,
      // 添加属性或者参数
      addForm: {
        attr_name: ""
      },
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ]
      },
      // 编辑对话框
      editDialogVisible: false,
      editForm: {
        attr_name: ""
      },
      // 保存编辑信息
      editInfo: {
        // 待编辑的属性id
        attr_id: "",
        // 待编辑的分类id
        cat_id: ""
      }
      // 动态添加tag,所有的共用会出现联动效果,定义在各自的内部(分隔attr_vals)
      // inputVisible: false,
      // inputValue: ""
    };
  },
  computed: {
    // 如果没有选中三级级联玄子昂按钮被禁用
    isSelected3() {
      return this.selectKeys.length < 3;
    },
    // 获取当前级联选择器选中的三级id
    selectedId() {
      return this.selectKeys[this.selectKeys.length - 1];
    },
    // 添加对话框的名称
    addDialogName() {
      return this.activeName == "many" ? "添加参数" : "添加属性";
    },
    addLabel() {
      return this.activeName == "many" ? "参数名称" : "属性名称";
    },
    editDialogName() {
      return this.activeName == "many" ? "编辑动态参数" : "编辑静态属性";
    }
  },
  created() {
    this.getAllGoodsCate();
  },
  methods: {
    // 获取所有的分类
    async getAllGoodsCate() {
      const { data } = await getGoodsCate();
      if (data.meta.status != 200) return this.$message.error(data.meta.msg);
      this.allGoodsCate = data.data;
    },
    // 获取参数
    async getParamsData() {
      //这里只能选中三级分类
      if (this.selectKeys.length != 3) {
        this.selectKeys = [];
        // 当点击的不是三级选择器则需要将保存在 this.manyDataList this.onlyDataList中的数据要清空
        this.manyDataList = [];
        this.onlyDataList = [];
      }
      // 如果选中的是三级就要获取对应的tab数据
      // 注意:这里通过巧妙的借用activename作为获取不同tab的参数,将选中的级联选择器中的三级id作为查询的另外一个参数
      const { data } = await getCateParams(this.selectedId, this.activeName);

      // 修改attr_vals的字符串的值为数组
      data.data.forEach(item => {
        // 为空则直接返回[]数组
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];

        // 为每个item设定编辑的tag
        item.inputVisible = false;
        item.inputValue = "";
      });

      if (data.meta.status != 200) return this.$message.error(data.meta.msg);
      // 获取数据成功保存数据到不同的表格数据源
      if (this.activeName == "many") {
        this.manyDataList = data.data;
      } else {
        this.onlyDataList = data.data;
      }
    },
    // 级联选择器点击事件
    selectGoodsClick() {
      //  需要获取参数
      this.getParamsData();
      // 当点击的不是三级选择器则需要将保存在 this.manyDataList this.onlyDataList中的数据要清空
    },
    // tab点击事件
    tabClick() {
      // 点击不同的tab发送网络请求获取对应的参数
      this.getParamsData();
      //  console.log(this.activeName)
    },
    // 添加参数点击事件:
    addParamClick() {
      this.addDialogVisible = true;
    },
    // 添加属性点击事件
    addAttributeClick() {
      this.addDialogVisible = true;
    },
    // 添加事件被点击
    addDialogConfirm() {
      // 表单验证
      this.$refs.addFormRefs.validate(async isValid => {
        if (!isValid) return;
        // 表单验证通过提交表单
        const { data } = await addGoodsParamAttr(
          this.selectedId,
          this.addForm.attr_name,
          this.activeName
        );
        if (data.meta.status != 201) return this.$message.error(data.meta.msg);
        // 创建成功
        this.getParamsData();
        this.addDialogVisible = false;
        this.$message.success(data.meta.msg);
      });
    },

    // 对话框关闭事件
    addFormClose() {
      this.$refs.addFormRefs.resetFields();
    },

    // 编辑table点击事件
    editParamsClick(params) {
      // 保存待编辑的信息
      this.editInfo.attr_id = params.attr_id;
      this.editInfo.cat_id = params.cat_id;
      this.editDialogVisible = true;
    },
    // 编辑对话框确认点击事件
    editDialogConfirm() {
      // 验证表单
      this.$refs.editFormRefs.validate(async isValid => {
        if (!isValid) return;
        const { data } = await updateParams(
          this.editInfo.cat_id,
          this.editInfo.attr_id,
          this.editForm.attr_name,
          this.activeName
        );
        console.log(data);

        if (data.meta.status != 200) return this.$message.error(data.meta.msg);
        // 数据更新成功
        this.getParamsData();
        this.$message.success(data.meta.msg);
        this.editDialogVisible = false;
      });
    },
    // 编辑对话框事件
    editFormClose() {
      this.$refs.editFormRefs.resetFields();
    },
    deleteParamsClick(params) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 点击确认操作执行的方法,发送删除请求
          const { data } = await deleteParams(params.cat_id, params.attr_id);

          if (data.meta.status != 200)
            return this.$message.error(data.meta.msg);

          // 删除成功,刷新页面,
          this.getParamsData();
          this.$message.success(data.meta.msg);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 动态添加tag点击事件,实现按钮和input对话框的切换
    handleInputConfirm(row) {
      // 如果input中的值为0则置空,别切换button
      if (row.inputValue.trim().length == 0) {
        this.inputValue = "";
        row.inputVisible = false;
        return;
      }
      // 如果不为空,则说明添加了合法内容需要为attr_vals添加内容
      row.attr_vals.push(row.inputValue.trim());
      // 添加完成之后置空
      row.inputValue = "";
      row.inputVisible = false;
      // 发起请求将attr_vals发送网络请求,注意这里发送请求需要将attr_vals中的数组值转化为字符串在发送
      this.saveAttrVals(row);
    },

    // 保存attr_vals中的数据到数据库
    async saveAttrVals(row) {
      // 发起请求将attr_vals发送网络请求,注意这里发送请求需要将attr_vals中的数组值转化为字符串在发送
      const { data } = await updateParams(
        row.cat_id,
        row.attr_id,
        row.attr_name,
        row.attr_sel,
        row.attr_vals.join(" ")
      );
      if (data.meta.status != 200) return this.$message.error(data.meta.msg);
      // 更新成功,将当前attr_row的值显示即可,不用整体刷新页面
      this.$message.success(data.meta.msg);
    },

    // 点击按钮展示输入对话框事件
    showInput(row) {
      row.inputVisible = true;
      // 页面在次刷新的时候执行函数内部的代码
      this.$nextTick(_ => {
        // 自动获取input并通过focus()方法获取的焦点
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // tag标签中的clse事件被点击,传入点击的索引号和当前行的值
    closeTagClick(index, row) {
      // 删除点击的tag
      row.attr_vals.splice(index, 1);
      // 保存数据到数据库
      this.saveAttrVals(row);
    }
  },
  components: {
    Bread
  }
};
</script>

<style lang="less" scoped>
.el-alert {
  margin: 15px;
  width: 100%;
}
.el-row {
  font-size: 16px;
}
.el-tabs {
  margin: 10px;
}
.el-tag {
  margin: 0 10px;
}
.input-new-tag {
  width: 120px;
}
</style>>
