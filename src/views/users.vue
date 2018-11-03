<template>
<!-- 卡片容器(用卡片容器包裹， elementui提供) -->
<el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row class="searchRow">
        <el-col :span="24" class="searchArea">
            <el-input clearable v-model="searchVal" placeholder="请输入内容" class="input-with-select">

                <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-button type="success" @click="showDiaAddUser()">添加用户</el-button>

        </el-col>

    </el-row>

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdduser">
        <el-form :model="formData">
            <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input v-model="formData.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" :label-width="formLabelWidth">
                <el-input v-model="formData.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth">
                <el-input v-model="formData.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话" :label-width="formLabelWidth">
                <el-input v-model="formData.mobile" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleAdduser = false">取 消</el-button>
            <el-button type="primary" @click="addUser()">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 编辑用户的对话框 -->
     <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdituser">
        <el-form :model="formData">
            <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input disabled  v-model="formData.username" autocomplete="off"></el-input>
            </el-form-item>
            
            <el-form-item label="邮箱" :label-width="formLabelWidth">
                <el-input v-model="formData.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话" :label-width="formLabelWidth">
                <el-input v-model="formData.mobile" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleEdituser = false">取 消</el-button>
            <el-button type="primary" @click="editUser()">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRoleuser">
  <el-form>
    <el-form-item label="用户名" :label-width="formLabelWidth">
        {{currUserName}}
      
    </el-form-item>
    <el-form-item label="角色" :label-width="formLabelWidth">
      <el-select v-model="currRoleId">
          <!-- v-model 绑定的值和 el-option 的value值 如果一样 当前显示的就是该option的Lable值 -->
        <el-option disabled label="请选择" :value="-1"></el-option>
          <el-option
      v-for="(item,index) in roles"
      :key="index"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  
      </el-select>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleRoleuser = false">取 消</el-button>
    <el-button type="primary" @click="setRole()">确 定</el-button>
  </div>
</el-dialog>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="list" style="width: 100%">
        <el-table-column type="index" label="#" width="80">
        </el-table-column>
        <el-table-column prop="username" label="姓名" width="120">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <!-- 格式化日期， 过滤器 -->
        <el-table-column label="创建日期">
            <template slot-scope="scope">
                {{scope.row.create_time | fmtDate}}
            </template>
        </el-table-column>
        <el-table-column label="用户状态">
            <!-- 这列内容并不是prop 而是组件 要加容器 slot-scope 属性就是传值 -->
            <!-- slot-scope="scope" 此时scope就是list数组 -->
            <!-- row  表述scope数组中的每个对象 其中row是固定的 -->
            <template slot-scope="scope">

                <el-switch @change="changeMgState(scope.row)" v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
            </template>

        </el-table-column>
        <el-table-column label="操作" width="180">
            <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" circle size="mini" plain
                @click="showEditdia(scope.row)"></el-button>
                <el-button type="success" icon="el-icon-check" circle size="mini" plain
                @click="showRoledia(scope.row)"></el-button>
                <el-button type="danger" icon="el-icon-delete" circle size="mini" plain 
                @click="showDelefirm(scope.row)"></el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[2, 4, 6, 8]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
</el-card>
</template>

<script>
export default {
    mounted() {

        this.loadTableData()

    },
    methods: {
        // 修改角色
        async setRole(){
            this.dialogFormVisibleRoleuser = false
            const res = await this.$http.put(`users/${this.getRoleByUserId}/role`,{
                rid:this.currRoleId
            })
            console.log(res);
            const {meta:{status,msg}} = res.data
            if(status ===200){
                this.$message.success(msg)
            }
        },
        // 分配角色
       async showRoledia(user){
           this.getRoleByUserId = user.id
            this.dialogFormVisibleRoleuser = true
            this.currUserName = user.username
            const res = await this.$http.get('roles')
            this.roles = res.data.data
            // 显示当前用户的角色
            // 通过users/：id 查询当前用户role-id
            const res1 = await this.$http.get(`users/${user.id}`)
            this.currRoleId = res1.data.data.rid
        },
        // 编辑用户 发送请求
        async editUser(){
            this.dialogFormVisibleEdituser = false
              const res = await this.$http.put(`users/${this.currUserId}`,this.formData)
            console.log(res);
            const {
                meta:{msg, status}
            } = res.data
            if(status === 200) {
                this.$message.success(msg)
                this.loadTableData()
            }
            
          
            
        },
        // 点击按钮弹出编辑对话框
        async showEditdia(user){
            this.dialogFormVisibleEdituser = true
            this.formData = user
            this.currUserId = user.id
        },
        // 添加用户表单提交
        async addUser(){
            // 关闭对话框
            this.dialogFormVisibleAdduser = false
            const res = await this.$http.post('users',this.formData)
            const {meta:{status,msg}} = res.data
            if(status === 201){
                this.formData = {}
                this.$message.success(msg)
                this.loadTableData()
            }
        },
        // 点击添加按钮弹出对话框
        showDiaAddUser(){
            this.dialogFormVisibleAdduser = true
        },
        // 弹出删除提示框
        showDelefirm(user) {
            this.$confirm('Sure?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const res = await this.$http.delete(`users/${user.id}`)
                console.log(res);
                const {
                    meta: {
                        msg,
                        status
                    }
                } = res.data
                if (status === 200) {
                    this.pagenum = 1
                    this.loadTableData()
                }
                this.$message.success(msg);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        //修改用户状态
        async changeMgState(user) {
            // 发送请求 users/：uId/state/：type
            const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
            console.log(res);
            const {
                meta: {
                    msg,
                    status
                }
            } = res.data
            if (status === 200) {
                // 提示框
                this.$message.success(msg)
            }

        },
        // 搜索用户
        async searchUser() {
            this.pagenum = 1
            this.loadTableData()
            
             
        },
        // 分页相关方法
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.pagesize = val
            this.loadTableData()

        },

        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.pagenum = val
            this.loadTableData()
        },
        async loadTableData() {
            this.loading = true
            // 需要设置请求头：Authorization = tokin
            const AUTH_TOKEN = sessionStorage.getItem('token')
            this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN

            const res = await this.$http.
            get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchVal}`)
            console.log(res);
            const {
                meta,
                data
            } = res.data
            if (meta.status === 200) {
                this.total = res.data.data.total
                // 动画消失
                this.loading = false

                this.list = data.users
            }
        }
    },
    data() {
        return {
            list: [],
            // 加载动画
            loading: false,
            // 分页相关的数据
            //currentPage:1, // 页码
            pagesize: 2, // 每页显示的条数据
            total: 10,
            pagenum: 1, //当前页
            // 搜索关键字
            searchVal: '',
            // 添加用户对话框
            dialogFormVisibleAdduser:false,
            // 添加用户的表单数据
            formData:{
                ueername:'',
                password:'',
                email:'',
                mobile:''
            },
            formLabelWidth:'140px',
            // 编辑
            dialogFormVisibleEdituser:false,
            currUserId: -1,
            // 分配角色对话框
            dialogFormVisibleRoleuser:false,
            currUserName:'',
            // 当前角色id
            currRoleId:-1,
            // 角色
            roles:[],
            getRoleByUserId:-1

        }
    }
}
</script>

<style>
.box-card {
    height: 100%;
}

.input-with-select {
    width: 300px;
}

.searchRow {
    margin-top: 10px;
    margin-bottom: 10px;
}
</style>
