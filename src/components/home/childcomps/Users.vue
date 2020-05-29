<template>
  <div>
    <bread :breadTitle="breadTitle" />

    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索框这里通过栅格化控制组件的宽度 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- input输入框 ,动态绑定query-->
          <!-- 清空input中的方法 添加属性clearable-->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUsersList">
            <!-- 点击单击按钮就查询一次用户列表 -->
            <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUser()">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表table -->
      <el-table :data="userList" style="width: 100%" stripe border>
        <el-table-column type="index" label="索引"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <!-- 作用域插槽通过scope.row获取当前行的数据 -->
          <template slot-scope="scope">
            <!-- <div>{{scope.row}}</div> -->
            <!-- 这里是v-model动态绑定了数据值,可以同步 -->
            <el-switch v-model="scope.row.mg_state" @change="updateSate(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <!-- 添加作用域插槽来获取当前的id值 -->
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editDialogClick(scope.row.id)"
            ></el-button>
            <!--  删除按钮-->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUserClick(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 为图标按钮设置提示信息tooltips -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="alloatUserRule(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="addFormClose">
      <!-- 对话框主体 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框尾部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="addUserConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="50%" @close="editFormClose">
      <!-- 对话框主体 -->
      <el-form :model="editUserInfo" :rules="addFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUserInfo.username" disabled></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editUserInfo.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框尾部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="editUserConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色dialog -->
    <el-dialog title="分配角色" :visible.sync="ruleVisible" width="50%" @close="setRuleClose">
      <div>
        <p>当前用户: {{userInfo.username}}</p>
        <p>当前角色:{{userInfo.role_name}}</p>
        <p>
          新分配的角色:
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
              v-for="item in ruleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ruleVisible = false">取 消</el-button>
        <el-button type="primary" @click="setNewRuleConfirm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Bread from "components/common/Bread";

import {
  getUsers,
  updateState,
  addUser,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRule
} from "network/user";
import { getRule } from "network/power";
export default {
  name: "Users",
  data() {
    // 自定义验证规则
    const checkEmail = (rules, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (!regEmail.test(value)) callback(new Error("邮箱格式不正确"));
      // 验证通过直接返回函数
      callback();
    };
    const checkMobile = (rules, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (!regMobile.test(value)) callback(new Error("手机格式不正确"));
      // 验证通过直接返回函数
      callback();
    };
    return {
      queryInfo: {
        query: "",
        // 当前页码
        pagenum: 1,
        // 每页显示的条数
        pagesize: 2
      },
      userList: [],
      total: 0,
      // 控制对话框的显示
      dialogVisible: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          {
            validator: checkMobile,
            trigger: "blur"
          }
        ]
      },
      // 编辑对话框显示与否
      editDialogVisible: false,
      // 查询用户信息
      editUserInfo: {},
      // 面包屑展示内容
      breadTitle: ["首页", "用户管理", "用户列表"],

      // 分配用户角色的当前用户is
      userInfo: {},
      // 新分配角色的id
      selectRoleId: "",
      // 获取的角色列表
      ruleList: [],
      // 分配角色对话框显示
      ruleVisible: false
    };
  },
  components: {
    Bread
  },
  created() {
    this.getUsersList();
  },
  methods: {
    async getUsersList() {
      const { data, status } = await getUsers(this.queryInfo);
      if (status !== 200) return this.$message.error("用户列表获取失败");
      this.userList = data.data.users;
      this.total = data.data.total;
    },
    // 当前页显示多少条数据
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      // 点击对应的操作之后需要重新加载数据
      this.getUsersList();
    },
    // 当前页码
    handleCurrentChange(newnum) {
      this.queryInfo.pagenum = newnum;
      // 重新加载数据
      this.getUsersList();
    },

    // 修改用户状态需要发送请求
    async updateSate(userInfo) {
      // 发送网络请求修改状态
      const { data, status } = await updateState(
        `/users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (status !== 200) {
        // 更新状态失败后需要将已经修改的状态修改回来
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error("状态更新失败");
      }
      // 更新成功
      this.$message.success("状态更新成功");
    },

    //添加用户
    addUser() {
      this.dialogVisible = true;
    },
    // 关闭对话框将表单重置
    addFormClose() {
      this.$refs.addFormRef.resetFields();
    },
    // 添加用户确认事件
    addUserConfirm() {
      // 调用表单的validate方法全局验证表单
      this.$refs.addFormRef.validate(async isValid => {
        if (!isValid) return;
        // 校验通过,发送网络请求
        const { data } = await addUser(this.addForm);

        if (data.meta.status !== 201) {
          this.$message.error(data.meta.msg);
          return;
        }
        // 用户添加成功关闭dialog
        this.dialogVisible = false;
        this.$message.success(data.meta.msg);
      });
    },
    // 编辑对话框按钮点击事件,通过作用域插槽获取到id值
    async editDialogClick(id) {
      // 发送网络请求获取id值对应的数据
      const { data } = await getUserById(id);
      if (data.meta.status != 200) return this.$message.error(data.meta.msg);
      // 查询成功则显示dialog并定义变量保存查询到的信息
      // this.$message.success(data.meta.msg);
      this.editUserInfo = data.data;
      this.editDialogVisible = true;
    },

    // 对话框关闭重置表单
    editFormClose() {
      this.$refs.editFormRef.resetFields();
    },
    // 编辑按钮确认事件
    editUserConfirm() {
      // 表单整体验证是否通过
      this.$refs.editFormRef.validate(async isValid => {
        if (!isValid) return this.$message.error("用户信息编辑失败");
        // 校验成功,发送请求编辑用户操作
        const { data } = await updateUser(this.editUserInfo.id, {
          email: this.editUserInfo.email,
          mobile: this.editUserInfo.mobile
        });
        if (data.meta.status !== 200) return this.$message.error(data.meta.msg);
        // 修改成功则关闭dialog并提示
        this.editDialogVisible = false;
        this.$message.success(data.meta.msg);
        // 修改数据之后重新刷新页面
        this.getUsersList();
      });
    },

    //删除用户
    deleteUserClick(id) {
      // 方法返回的是promise对象
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 点击确认操作执行的方法,发送删除请求
          const { data } = await deleteUser(id);
          if (data.meta.status != 200)
            return this.$message.error(data.meta.msg);

          // 删除成功,刷新页面,
          this.getUsersList();
          this.$message.success(data.meta.msg);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 给用户分配角色
    async alloatUserRule(userInfo) {
      // 获取当前用户的信息
      this.userInfo = userInfo;

      // 获取角色列表
      const { data } = await getRule();
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg);
      // 数据获取成功
      // 将角色列表保存渲染在页面中
      this.ruleList = data.data;
      this.ruleVisible = true;
    },

    // 设置新角色按钮点击事件
    async setNewRuleConfirm() {
      // 没有分配角色提示
      if (!this.selectRoleId) return this.$message.error("请选择新分配的角色");
      // 新分配角色发送请求修改角色
      const { data } = await updateUserRule(
        this.userInfo.id,
        this.selectRoleId
      );
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg);
      // 修改成功
      this.getUsersList();
      this.ruleVisible = false;
      this.$message.success(data.meta.msg);
    },
    // 设置分配角色dialog关闭事件
    setRuleClose() {
      (this.selectRoleId = ""), (this.userInfo = {});
    }
  }
};
</script>

<style lang="less" scoped>
.el-table {
  font-size: 14px;
  margin: 15px;
}
</style>