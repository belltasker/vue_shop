<template>
  <el-card class="box-card">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class="searchRow">
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="query" class="inputSearch">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="16">
        <el-button type="success">添加按钮</el-button>
      </el-col>
    </el-row>
    <el-table :data="userlist" style="width: 100%">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="username" label="姓名" width="80"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="创建日期">
        <template slot-scope="scope">{{scope.row.create_time | fmtdate}}</template>
      </el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_status" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" plain="true" icon="el-icon-edit" circle></el-button>
          <el-button type="danger" size="mini" plain="true" icon="el-icon-delete" circle></el-button>
          <el-button type="success" size="mini" plain="true" icon="el-icon-check" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: '',
      pagenum: 1,
      pagesize: 10,
      total: 1,
      userlist: []
    }
  },
  methods: {
    async getUserList() {
      const token = localStorage.getItem('token')
      this.$http.defaults.headers.common['Authorization'] = token

      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      )
      const {
        data: { total, users },
        meta: { msg, status }
      } = res.data
      if (status === 200) {
        this.userlist = users
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    }
  },
  mounted() {
    this.getUserList()
  }
}
</script>

<style>
.box-card {
  height: 100%;
}
.inputSearch {
  width: 50%;
}
.searchRow {
  margin-top: 20px;
}
</style>