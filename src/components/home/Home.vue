<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="~assets/img/logo.png" alt />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logoutClick">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse?'64px' :'200px'">
        <!-- 添加折叠栏 -->
        <div class="toggle-collapse" @click="toggleClick">|||</div>
        <!-- 菜单栏 -->
        <el-menu
          background-color="#090723"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="currentIndex"
        >
          <!-- 一级菜单栏 -->
          <!-- 这里的index的值唯一的表示每个空间不能相同 -->
          <el-submenu :index="item.id+''" v-for="(item,currentIndex) of menulist" :key="item.id">
            <template slot="title">
              <i :class="iconList[currentIndex]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单栏-->
            <!-- index不能是数字必须是字符串,需要将数字转为字符串,开启el-menu的router属性,将index给为跳转路径 -->
            <el-menu-item
              :index="'/'+subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="menuItemClick('/'+subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 二级路由显示位置 ,注意router-view是路由跳转的视图位置,在router的index.js中的结构目录决定的,当吧子路由放在哪个一级组件的下面,哪个一级组件下放router-view来展示一级组件对应的二级组件对应路由的位置-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// 导入封装网络模块
import { getMenu } from "network/home";

export default {
  name: "Home",
  data() {
    return {
      menulist: [],
      iconList: [
        "iconfont icon-users",
        "iconfont icon-tijikongjian",
        "iconfont icon-shangpin",
        "iconfont icon-danju",
        "iconfont icon-baobiao"
      ],
      isCollapse: false,
      currentIndex: ""
    };
  },

  created() {
    // 创建时就请求数据,这里将请求的方法放在methods中,并且在data声明变量来存储获取返回的值
    this.getMenulist();
    // 页面刷洗将session中的值赋值给currentIndex
    this.currentIndex = window.sessionStorage.getItem("currentIndex");
  },
  methods: {
    // 事件点击
    logoutClick() {
      // 退出功能
      // 删除token
      window.sessionStorage.clear();
      // 重定向到login
      this.$router.push("/login");
    },
    // 折叠栏
    toggleClick() {
      this.isCollapse = !this.isCollapse;
    },
    menuItemClick(index) {
      // 保存 在session中刷新页面也可以直接展示
      window.sessionStorage.setItem("currentIndex", index);
      this.currentIndex = index;
    },
    // axios方法
    // 获取菜单列表,这里通过异步函数的方式来获取返回值
    async getMenulist() {
      const menulist = await getMenu();
      // 保存返回的值
      this.menulist = menulist.data.data;
    }
  }
};
</script>

<style lang="less" scoped>
// 注意elementui中的标签就是类名
.home-container {
  height: 100%;
}
.el-header {
  background-color: #0e0f33;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0px;
  color: #fff;
  font-size: 20px;
  img {
    width: 60px;
    height: 60px;
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    margin-right: 20px;
  }
  > div {
    display: flex;
    //  元素垂直居中
    align-items: center;
  }
}
.el-aside {
  background-color: #090723;
  .el-menu {
    // 去除多出来的1px
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-collapse {
  background-color: #999999;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  color: #fff;
}
</style>