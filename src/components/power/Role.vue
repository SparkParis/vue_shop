<template>
  <div>
    <!--面包屑头部-->
    <bread :breadTitle="breadTitle" />
    <!-- card -->
    <el-card>
      <el-row>
        <el-button type="primary" @click="addRuleClick">添加角色</el-button>
      </el-row>
      <!-- table角色列表 -->
      <el-table :data="ruleList" stripe border>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <!-- 通过插槽作用域的方式来循环显示多级权限 -->
          <template slot-scope="scope">
            <!-- 采用layour栅格化布局 (col=24)-->
            <el-row
              v-for="(item ,index) in scope.row.children"
              :key="index"
              :class="['bbottom',index==0?'btop':'','vcenter']"
              :gutter="0"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="closeTagClick(scope.row,item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(subItem,subIndex) in item.children"
                  :key="subIndex"
                  :class="[subIndex==0?'':'btop','vcenter']"
                >
                  <!-- 渲染二级权限 -->
                  <el-col :span="5">
                    <el-tag
                      type="success"
                      closable
                      @close="closeTagClick(scope.row,subItem.id)"
                    >{{subItem.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="19">
                    <!-- 三级权限渲染 -->
                    <el-tag
                      v-for="(lastItem,lastIndex) in subItem.children"
                      :key="lastIndex"
                      type="warning"
                      closable
                      @close="closeTagClick(scope.row,lastItem.id)"
                    >{{lastItem.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <!-- 添加作用域插槽来获取当前的id值 -->
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editClick(scope.row.id)"
            ></el-button>
            <!--  删除按钮-->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteClick(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 为图标按钮设置提示信息tooltips -->
            <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRightClick(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editVisible" width="50%" @close="editFormClose">
      <!-- 对话框主题 -->
      <el-form :model="editRule" ref="editRuleRef" label-width="70px">
        <el-form-item label="角色名称">
          <!-- 给输入框动态绑定数据 -->
          <el-input v-model="editRule.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRule.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框尾部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible=false">取 消</el-button>
        <el-button type="primary" @click="editConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="seDialogVisible" width="50%" @close="setRightClose">
      <!-- 树形控件 -->
      <el-tree
        :data="rightList"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="checkedKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="seDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRightConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addRuleVisible" width="30%" :before-close="handleClose">
      <!-- 添加用户表单 -->
      <el-form :model="addUserInfo" ref="addRuleRef" :rules="addRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addUserInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addUserInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRuleVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRuleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Bread from "components/common/Bread";
import {
  getRule,
  getRuleById,
  updateRule,
  deleteRule,
  deleteRight,
  getRightByTree,
  setRuleRight,
  addRule
} from "network/power";

export default {
  name: "Role",
  data() {
    return {
      // 面包屑数据
      breadTitle: ["首页", "权限管理", "角色列表"],
      // 角色列表
      ruleList: [],
      editRule: {},
      // 编辑对话框是否显示
      editVisible: false,
      // 分配权限对话框是否显示
      seDialogVisible: false,
      //保存获取到的权限列表
      rightList: [],
      // 树形结构默认的属性绑定对象,label表示当前显示的名称,children为子节点的属性名
      defaultProps: {
        children: "children",
        label: "authName"
      },
      // 默认树形控件选中的列表,保存的是节点的id值, node-key="id"中为每个节点绑定了id值,这里的id是:data="rightList"绑定的每个节点的id属性值,选中的keys中保存的是三级节点的id值
      checkedKeys: [],
      currentRuleId: "",

      // 添加角色对话框显示与否
      addRuleVisible: false,
      addUserInfo: {
        roleName: "",
        roleDesc: ""
      },
      // 添加角色表单校验
      addRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 1, max: 5, message: "长度在 1 到 5 个字符", trigger: "blur" }
        ],
        roleDesc: [
          { min: 0, max: 15, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getRuleList();
  },
  methods: {
    // 获取角色列表
    async getRuleList() {
      const { data } = await getRule();
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg);
      // 数据请求成功保存数据
      this.ruleList = data.data;
    },

    //对话框关闭,表单重置
    editFormClose() {},

    // 编辑角色
    async editClick(id) {
      //根据角色的id获取角色列表
      const { data } = await getRuleById(id);
      // 数据获取失败
      if (data.meta.status !== 200) return this.$message(data.meta.msg);
      // 数据获取成功则弹出编辑dialog保存数据
      this.editRule = data.data;
      this.editVisible = true;
    },
    // 编辑事件
    editConfirm() {
      // 表单提交整体验证
      this.$refs.editRuleRef.validate(async isValid => {
        if (!isValid) return this.$message.error("角色编辑失败");
        // 校验成功,发送网络请求

        const { data } = await updateRule(this.editRule.roleId, {
          roleName: this.editRule.roleName,
          roleDesc: this.editRule.roleDesc
        });
        // 判断是否更新成功
        if (data.meta.status !== 200) return this.$message.error(data.meta.msg);
        // 更新成功刷新表单,隐藏dialog,显示提示信息
        this.getRuleList();
        this.editVisible = false;
        this.$message.success(data.meta.msg);
      });
    },
    // 删除角色
    deleteClick(id) {
      // 确认是否删除
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 点击确认操作执行的方法,发送删除请求
          const { data } = await deleteRule(id);
          if (data.meta.status != 200)
            return this.$message.error(data.meta.msg);

          // 删除成功,刷新页面,
          this.getRuleList();
          this.$message.success(data.meta.msg);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 删除角色的权限
    closeTagClick(rule, id) {
      // 确认是否删除
      this.$confirm("此操作将永久删除该角色下的该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 点击确认操作执行的方法,发送删除请求
          const { data } = await deleteRight(rule.id, id);
          console.log(data);
          if (data.meta.status != 200)
            return this.$message.error(data.meta.msg);

          // 删除成功,这里将返回的新的权限数据赋值给当前角色的children,避免页面重新刷新,重新点击显示权限
          rule.children = data.data;
          this.$message.success(data.meta.msg);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 分配权限点击事件
    async setRightClick(rule) {
      // 保存当前点击的ruleid
      this.currentRuleId = rule.id;

      // 获取所有权限,这里通过tree的方式获取去
      const { data } = await getRightByTree("tree");
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg);
      // 数据获取成功保存数据
      this.rightList = data.data;
      //  通过循环获取到三级权限的id列表
      this.getLeafKeys(rule, this.checkedKeys);
      this.seDialogVisible = true;
    },
    // 通过循环获取每个角色的三级权限并保存在数组checkedKeys中
    getLeafKeys(node, arr) {
      // 没有children属性百表示是三级权限
      if (!node.children) {
        return arr.push(node.id);
      }
      //遍历
      node.children.forEach(element => {
        this.getLeafKeys(element, arr);
      });
    },
    // 分配角色对话框在关闭的时候需要将默认选中的checkedKeys置空,添加close事件
    setRightClose() {
      this.checkedKeys = [];
    },
    // 设置权限确定按钮被点击,这里的roleid通过分配权限点击事件setRightClick拿到并保存在data的currentRuleId属性中
    async setRightConfirm() {
      //获取当前tree中拿到的一级,二级,三级节点的选中id并通过字符串进行拼接
      let checkedrIds = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      // 转化为字符串
      checkedrIds = checkedrIds.join(",");
      // 发送网络请求
      console.log(typeof this.currentRuleId);
      const { data } = await setRuleRight(this.currentRuleId, checkedrIds);
      // 发送失败
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg);
      // 发送成功,关闭dialog,刷新页面
      this.$message.success(data.meta.msg);
      this.getRuleList();
      this.seDialogVisible = false;
    },
    // 添加角色按钮点击事件
    addRuleClick(rule) {
      //弹出添加对话框
      this.addRuleVisible = true;
    },
    // 点击确认添加按钮
    addRuleConfirm() {
      // 对获取到的表单进行校验
      this.$refs.addRuleRef.validate(async isValide => {
        if (!isValide) return;
        // 验证通过发送请求
        const { data } = await addRule(this.addUserInfo);
        // 发送请求失败
        if (data.meta.status != 201) return this.$message.error(data.meta.msg);
        // 发送请求成功刷新列表,退出dialog,提示信息
        this.getRuleList();
        this.addRuleVisible = false;
        this.$message.success(data.meta.msg);
      });
    },
    // 角色对话框关闭操作
    handleClose() {
      // 对表单置空
      this.$refs.addRuleRef.resetFields();
    }
  },
  components: {
    Bread
  }
};
</script>

<style lang='less' scoped>
.el-col {
  margin: 5px 0;
}
.el-tag {
  margin-right: 8px;
}
.btop {
  border-top: 1px solid #eee;
}
.bbottom {
  border-bottom: 1px solid #eee;
}
//垂直居中
.vcenter {
  display: flex;
  align-items: center;
}
</style>