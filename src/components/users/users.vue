<template>
  <el-card class="box-card">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class="searchRow">
      <el-col :span="8">
        <el-input
          placeholder="请输入内容"
          v-model="query"
          class="inputSearch"
          clearable
          @clear="loadUserList"
        >
          <el-button slot="append" icon="el-icon-search" @click="searchUserList"></el-button>
        </el-input>
      </el-col>
      <el-col :span="16">
        <el-button type="success" @click="showUserAddDialog">添加按钮</el-button>
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
          <el-switch
            v-model="scope.row.mg_state"
            @change="changeMgState(scope.row)"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            plain
            icon="el-icon-edit"
            circle
            @click="showModifyUserDialog(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            size="mini"
            plain
            icon="el-icon-delete"
            circle
            @click="showDelUserDialog(scope.row.id)"
          ></el-button>
          <el-button
            @click="showSetUserRoleDialog(scope.row)"
            type="success"
            size="mini"
            plain
            icon="el-icon-check"
            circle
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleModify">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="form.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleModify = false">取 消</el-button>
        <el-button type="primary" @click="modifyUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">{{currUserName}}</el-form-item>
        <el-form-item label="角色" label-width="100px">
          <el-select v-model="currRole" placeholder="角色">
            <el-option label="请选择" :value="-1"></el-option>
            <el-option
              :label="item.roleName"
              :value="item.id"
              :key="index"
              v-for="(item,index) in roles"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="setRole">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: '',
      pagenum: 1,
      pagesize: 2,
      total: -1,
      userlist: [],
      form: { username: '', password: '', email: '', mobile: '' },
      dialogFormVisibleAdd: false,
      dialogFormVisibleModify: false,
      dialogFormVisibleRole: false,
      currRole: -1,
      roles: [],
      currUserName: '',
      currUserId: -1
    }
  },

  methods: {
    async setRole() {
      await this.$http.put(`users/${this.currUserId}/role`, {
        rid: this.currRole
      })
      this.dialogFormVisibleRole = false
    },

    async showSetUserRoleDialog(user) {
      this.dialogFormVisibleRole = true
      this.currUserName = user.username
      this.currUserId = user.id
      const resRoles = await this.$http.get(`roles`)
      this.roles = resRoles.data.data
      const resUser = await this.$http.get(`users/${user.id}`)
      this.currRole = resUser.data.data.rid
    },

    showUserAddDialog() {
      this.dialogFormVisibleAdd = true
    },

    showDelUserDialog(userId) {
      this.$confirm('删除用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$http.delete(`users/${userId}`)
          console.log(res)
          const {
            meta: { msg, status }
          } = res.data
          if (status === 200) {
            this.getUserList()
            this.$message({
              type: 'success',
              message: msg
            })
          } else {
            this.$message({
              type: 'info',
              message: msg
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    showModifyUserDialog(user) {
      this.dialogFormVisibleModify = true
      this.form = user
    },

    async addUser() {
      this.dialogFormVisibleAdd = false
      const res = await this.$http.post(`users`, this.form)
      const {
        meta: { msg, status }
      } = res.data
      if (status === 201) {
        this.$message.success('用户添加成功')
        this.getUserList()
        this.form = {}
      } else {
        this.$message.warning('用户添加失败')
        this.form = {}
      }
    },

    async modifyUser() {
      const res = await this.$http.put(`users/${this.form.id}`, this.form)
      this.dialogFormVisibleModify = false
      this.getUserList()
    },

    async changeMgState(user) {
      console.log(user)
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      )
      console.log(res)
    },

    async getUserList() {
      const token = localStorage.getItem('token')
      this.$http.defaults.headers.common['Authorization'] = token

      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      )
      // console.log(res)
      const {
        data: { total, users },
        meta: { msg, status }
      } = res.data
      if (status === 200) {
        this.userlist = users
        this.total = total
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    },

    searchUserList() {
      this.getUserList()
    },

    loadUserList() {
      this.getUserList()
    },

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.pagenum = 1
      this.getUserList()
    },

    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getUserList()
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