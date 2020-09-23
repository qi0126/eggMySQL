<template>
  <div id="app" v-loading="pageLoadingTF">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="名字" width="180"> </el-table-column>
      <el-table-column prop="url" label="url地址" width="360">
      </el-table-column>
      <el-table-column prop="alexa" label="区域邮编" width="180">
      </el-table-column>
      <el-table-column prop="country" label="国家" width="180">
      </el-table-column>
      <el-table-column prop="country" label="操作">
        <template slot-scope="scope">
          <el-button @click="viewFun(scope.row)" size="small" v-if="!editTF"
            >编辑</el-button
          >
          <el-button
            size="small"
            @click="editFun()"
            v-if="editTF == true && editId == scope.row.id"
            >保存</el-button
          >
          <el-button
            type="danger"
            size="small"
            @click="delFun(scope.row)"
            v-if="!editTF"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-row class="lineHeight50">
      <el-col :span="3" class="txtRight">id：</el-col>
      <el-col :span="10">
        {{ editOBj.id || "-" }}
        <span class="floatRight" v-if="!editTF">
          <el-button size="small" @click="addFun()">新增</el-button>
        </span>
      </el-col>
    </el-row>
    <el-row class="lineHeight50">
      <el-col :span="3" class="txtRight">名字：</el-col>
      <el-col :span="21">
        <el-input
          v-model="editOBj.name"
          placeholder="请输入名字"
          size="small"
          class="inputWidth300"
        ></el-input>
      </el-col>
      <el-col :span="3" class="txtRight">url地址：</el-col>
      <el-col :span="21">
        <el-input
          v-model="editOBj.url"
          placeholder="请输入url地址"
          size="small"
          class="inputWidth300"
        ></el-input>
      </el-col>
      <el-col :span="3" class="txtRight">区域邮编：</el-col>
      <el-col :span="21">
        <el-input
          v-model="editOBj.alexa"
          placeholder="请输入区域邮编"
          size="small"
          class="inputWidth300"
        ></el-input>
      </el-col>
      <el-col :span="3" class="txtRight">国家：</el-col>
      <el-col :span="21">
        <el-input
          v-model="editOBj.country"
          placeholder="请输入国家"
          size="small"
          class="inputWidth300"
        ></el-input>
      </el-col>
    </el-row>
  </div>
</template>

<script>
const url = "http://localhost:7002"
import qs from "qs";
export default {
  name: "app",
  filters: {},
  data: () => ({
    pageLoadingTF: false,
    editOBj: {},
    tableData: [],
    editTF: false, //编辑状态，默认为否
    editId: null
  }),
  computed: {},
  watch: {},
  created() {
    this.create_fun();
  },
  methods: {
    create_fun() {
      let self = this;
      this.requestGet({
        url: `${url}/findAll`
      }).then(function(res) {
        self.tableData = JSON.parse(res.data);
      });
    },
    //查看按钮
    viewFun(elem) {
      let self = this;
      this.requestGet({
        url: `${url}/detail/${elem.id}`
      }).then(function(res) {
        self.editOBj = JSON.parse(res.data)[0];
        self.editTF = true;
        self.editId = elem.id;
      });
    },
    //删除
    delFun(elem) {
      let self = this;
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          console.log("elem", elem);
          self
            .requestGet({
              url: `${url}/delete/${elem.id}`
            })
            .then(function(res) {
              console.log("res:", JSON.parse(res.data));
              self.create_fun();
            });
        })
        .catch(() => {});
    },
    addFun() {
      let self = this;
      if (!self.editOBj.name || self.editOBj.name.length <= 0) {
        self.$message.error("名字为必填项！");
        return;
      }
      self
        .requestPost({
          url: `${url}/insert`,
          data: qs.stringify(self.editOBj)
        })
        .then(function() {
          self.editTF = false;
          self.editId = null;
          self.create_fun();
        });
    },
    editFun() {
      let self = this;
      if (!self.editOBj.name || self.editOBj.name.length <= 0) {
        self.$message.error("名字为必填项！");
        return;
      }
      self
        .requestPost({
          url: `${url}/edit`,
          data: qs.stringify(self.editOBj)
        })
        .then(function() {
          self.editTF = false;
          self.editId = null;
          self.editOBj = {};
          self.create_fun();
        });
    },
    //get请求
    requestGet({
      url,
      method = "get",
      data,
      headers = {},
      onProgress = e => e,
      requestList
    }) {
      return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = onProgress;
        xhr.open(method, url);
        Object.keys(headers).forEach(key =>
          xhr.setRequestHeader(key, headers[key])
        );
        xhr.send(data);
        xhr.onload = e => {
          // 将请求成功的 xhr 从列表中删除
          if (requestList) {
            const xhrIndex = requestList.findIndex(item => item === xhr);
            requestList.splice(xhrIndex, 1);
          }
          resolve({
            data: e.target.response
          });
        };
        // 暴露当前 xhr 给外部
        requestList?.push(xhr);
      });
    },
    // POST请求
    requestPost({
      url,
      method = "POST",
      data,
      headers = {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      onProgress = e => e,
      requestList
    }) {
      return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = onProgress;
        xhr.open(method, url);
        Object.keys(headers).forEach(key =>
          xhr.setRequestHeader(key, headers[key])
        );
        xhr.send(data);
        xhr.onload = e => {
          // 将请求成功的 xhr 从列表中删除
          if (requestList) {
            const xhrIndex = requestList.findIndex(item => item === xhr);
            requestList.splice(xhrIndex, 1);
          }
          resolve({
            data: e.target.response
          });
        };
        // 暴露当前 xhr 给外部
        requestList?.push(xhr);
      });
    }
  }
};
</script>

<style scoped>
.lineHeight50 {
  line-height: 50px;
}
.inputWidth300 {
  width: 300px;
}
.txtRight {
  text-align: right;
}
.floatRight {
  float: right;
}
</style>
