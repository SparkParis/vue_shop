<template>
  <div class="login">
    <div class="login-box">
      <div class="avatar">
        <img src="~assets/img/logo.png" alt />
      </div>
      <!--b -->
      <el-form
        label-width="0px"
        class="form"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
      >
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="loginClick">登录</el-button>
          <el-button type="info" @click="resetClick">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 导入封装好的axios请求
import { postLogin } from "network/login";
export default {
  name: "Login",
  data() {
    return {
      // 为表单动态绑定属性
      loginForm: {
        username: "admin",
        password: "123456"
      },
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 15, message: "长度在3-15之间", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    resetClick() {
      this.$refs.loginFormRef.resetFields();
    },
    loginClick() {
      // validate表单验证方法,返回的是一个promise对象的函数,传入回调函数来接收返回值,验证通过发挥true,反之则返回false
      // (1)传入参数的方式接收返回值
      // this.$refs.loginFormRef.validate(isValid => {
      //   console.log(isValid);
      // });
      // (2)返回的本身就是promise对象,通过then,catch返回结果
      this.$refs.loginFormRef.validate().then(async isValid => {
        if (!isValid) return;
        // 表单验证请求通过,则发送请求
        //注意这里返回的都是promise对象可以通过异步函数解决得到返回值
        // 这里使用了对象解构的方式获取返回值
        const { data, status } = await postLogin(this.loginForm);
        if (status != 200) this.$message.error(data.meta.msg);
        this.$message.success(data.meta.msg);
        // 将返回的token值保存在sessionStorage中
        window.sessionStorage.setItem("token", data.data.token);
        // 通过编程是导航跳转路由
        this.$router.push("/home");
      });
    }
  }
};
</script>

<style lang="less" scoped>
// 导入图标库
@import url("~assets/fonts/iconfont.css");
.login {
  background-color: #2b4b6b;
  height: 100%;
}
.login-box {
  // 模块居中显示
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  width: 500px;
  height: 300px;
  background-color: #fff;
}
.avatar {
  width: 160px;
  height: 160px;
  position: absolute;
  left: 50%;
  right: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid #eee;
  border-radius: 50%;
  box-shadow: 0 0 10px #eaeaea;
  padding: 10px;
  background-color: #88acdb;
  img {
    width: 100%;
    height: 100%;
    background-color: #fff;
    border: 1px solid #eee;
    border-radius: 50%;
  }
}
.form {
  position: absolute;
  bottom: 0;
  // form默认box-sizing:content-box(以内容为布局),这里设置为以边框为主
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
}
.btns {
  display: flex;
  // 设置弹性布局,内容尾部对齐
  justify-content: flex-end;
}
</style>