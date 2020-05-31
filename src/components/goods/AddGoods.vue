<template>
  <div>
    <!-- 面包屑区域 -->
    <bread :breadTitle="breadTitle" />
    <!-- 卡片区域 -->
    <el-card>
      <!-- 提示框 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 进度条,这里的active是数值通过-0转化为数值 -->
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 注意这里只能是form来包裹tab,tab-panel只能在tab之下 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addRuleForm" label-position="top">
        <!-- tab栏区域 -->
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="changeTabBefore"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 级联选择器选择商品分类 -->
              <el-cascader
                v-model="addForm.goods_cat"
                :options="allGoodsCate"
                :props="cateProps"
                @change="selectCateClick"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单对应的item项 -->
            <el-form-item :label="item.attr_name" v-for="item in manyDataList" :key="item.attr_id">
              <!-- 循环内部的attr_vals ,这里通过复选框的形式实现,动态绑定数组-->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb,index) in item.attr_vals" :key="index" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <!-- 渲染表单对应的item项 -->
            <el-form-item :label="item.attr_name" v-for="item in onlyDataList" :key="item.attr_id">
              <!-- 循环内部的attr_vals ,这里通过input的形式实现,动态绑定数组-->
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 请求参数的图片上传功能 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加按钮 -->
            <el-button type="primary" class="addButton" @click="addGoodsSubmit">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 文件预览对话框 -->
    <el-dialog title="提示" :visible.sync="previewVisible" width="50%">
      <img :src="previewURL" alt class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import Bread from "components/common/Bread";
import { getGoodsCate, getCateParams, addGoods } from "network/goods";

// 导入工具包lodash
import _ from "lodash";

export default {
  name: "AddGoods",
  data() {
    return {
      breadTitle: ["首页", "商品管理", "添加商品"],
      // 当前进度条索引,通过该变量巧妙的实现tab和step的同步操作
      activeIndex: "0",
      addForm: {
        goods_name: "",
        // 商品所属的分类数组,通过级联选择器获取
        goods_cat: [],
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: "",
        pics: [],
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        // 通过级联选择器获取
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ]
      },
      // 所有商品分类
      allGoodsCate: [],
      // 级联选择器的属性设置
      cateProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      //商品参数和商品属性
      manyDataList: [],
      onlyDataList: [],
      // 图片上传的服务器端地址
      uploadURL: "http://182.92.102.182:88/api/private/v1/upload",
      // 上传图片并没有发送axios请求,而是upload内部自定义的发送请求,没有携带token属性值,这里需要手动为上传添加token值
      headerObj: {
        Authorization: window.sessionStorage.getItem("token")
      },
      // 图片预览功能
      previewURL: "",
      previewFullURL: `http://182.92.102.182:88/`,
      previewVisible: false
    };
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
    // 级联选择器点击触发的事件函数
    selectCateClick() {
      // 动态绑定的分类的选择数组打印出来
      // console.log(this.addForm.goods_cat);
      // 注意这里只能选中三级目录,选中二级目录则置空即可
      if (this.addForm.goods_cat.length != 3) {
        this.addForm.goods_cat = [];
      }
    },
    // tab切换之前调用的before-leave属性,绑定的是一个函数,当没有选择分类的时候阻止tab的切换(函数返回为false则会阻止)
    changeTabBefore(newActiveName, oldActiveName) {
      //这里的参数是默认就会传入的name值,参数1表示即将切换的tab name,参数2百事以前的tab name
      // console.log(newActiveName);
      // console.log(oldActiveName);
      if (oldActiveName == "0" && this.addForm.goods_cat.length != 3) {
        // 没有选择三级分类则不允许切换tab
        this.$message.error("请选择三级分类");
        return false;
      }
    },
    //tab点击触发的事件tab-click
    async tabClicked() {
      // console.log(this.activeIndex);
      if (this.activeIndex == "1") {
        // 点击的1是商品参数就获取当前参数的值
        const { data } = await getCateParams(this.cateId, "many");
        if (data.meta.status != 200) return this.$message.error(data.meta.msg);

        data.data.forEach(item => {
          // 为空则直接返回[]数组
          item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        });

        this.manyDataList = data.data;
        this.$message.success(data.meta.msg);
      } else if (this.activeIndex == "2") {
        const { data } = await getCateParams(this.cateId, "only");
        if (data.meta.status != 200) return this.$message.error(data.meta.msg);

        // 这里的attr_vals通过字符串的方式展示,
        this.onlyDataList = data.data;
        this.$message.success(data.meta.msg);
      }
    },

    // 处理图片移出操作
    handleRemove(file) {
      // console.log(file);
      // 1.获取去移出的图片path
      const picpath = file.response.data.tmp_path;
      // 2.查找图片在pics中的索引
      const index = this.addForm.pics.findIndex(x => x.pic == picpath);
      // 通过splice()删除图片
      this.addForm.pics.splice(index, 1);
    },
    //图片上传成功代用的函数
    handleSuccess(response) {
      // response是图片上传成功之后返回的信息,将返回的图片地址保存在对象中并添加到addForm的pics数组中
      // console.log(response);
      const pic = { pic: response.data.tmp_path };
      this.addForm.pics.push(pic);
    },
    // 点击图片的名称实现图片的预览,点击上传的图片文字会自动触发
    handlePreview(file) {
      console.log(file);
      // 1.保存图片总的url到变量中
      this.previewURL = this.previewFullURL + file.response.data.tmp_path;
      console.log(this.previewURL);
      // 2.点击图片弹出对话框
      this.previewVisible = true;
      // 3.对话框中显示img,url为file的url,
    },

    // 添加分类提交按钮点击事件
    addGoodsSubmit() {
      // 进行表单验证
      this.$refs.addRuleForm.validate(async isValid => {
        if (!isValid) return;

        // 注意:goods_cat在级联选择器中双向绑定,要求必须是一个数组,但是在添加商品的请求中需要逗号分隔的字符串传入,在这里进行转化的时候会报错.解决方案:借用工具包lodash的深拷贝CloneDeep()重新拷贝之后再机型修改goods_cat
        const form = _.cloneDeep(this.addForm);
        form.goods_cat = form.goods_cat.join(",");

        // 处理动态参数和静态属性添加到attrs的数组中
        this.manyDataList.forEach(item => {
          // 注意这里需要将attr_vals转化为字符串
          const newAttr = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(",")
          };
          // 添加attr到attrs属性中
          this.addForm.attrs.push(newAttr);
        });
        this.onlyDataList.forEach(item => {
          // 这里的attr_vals本身就是String不用在转化
          const newAttr = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          };
          // 添加attr到attrs属性中
          this.addForm.attrs.push(newAttr);
        });
        // 将attrs赋值给是你拷贝的form
        form.attrs = this.addForm.attrs;

        // 验证通过添加商品
        const { data } = await addGoods(form);
        if (data.meta.status != 201) return this.$message.error(data.meta.msg);
        // 添加商品成功,路由导航到商品列表页面
        this.$message.success(data.meta.msg);
        this.$router.push("/goods");
      });
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length == 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    }
  },
  components: {
    Bread
  }
};
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}

.addButton {
  margin-top: 30px;
}
</style>