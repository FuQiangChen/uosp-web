<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="企业名称" prop="enterId">
        <el-input v-model="queryParams.enterId" placeholder="请输入企业名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="企业税号" prop="enterNumber">
        <el-input v-model="queryParams.enterNumber" placeholder="请输入企业税号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="账户类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择账户类型" clearable>
          <el-option v-for="dict in dict.type.account_type" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="银行卡号" prop="bankCard">
        <el-input v-model="queryParams.bankCard" placeholder="请输入银行卡号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="银行类型" prop="bankType">
        <el-select v-model="queryParams.bankType" placeholder="请选择银行类型" clearable>
          <el-option v-for="dict in dict.type.bank_type" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="账户状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择账户状态" clearable>
          <el-option v-for="dict in dict.type.account_status" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="金额" prop="amount">
        <el-input v-model="queryParams.amount" placeholder="请输入金额" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="联系人" prop="accountMan">
        <el-input v-model="queryParams.accountMan" placeholder="请输入联系人" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="联系电话" prop="accountPhone">
        <el-input v-model="queryParams.accountPhone" placeholder="请输入联系电话" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="账号邮箱" prop="accountEmail">
        <el-input v-model="queryParams.accountEmail" placeholder="请输入账号邮箱" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:account:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:account:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:account:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['system:account:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="accountList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="企业名称" align="center" prop="enterName" />
      <el-table-column label="企业税号" align="center" prop="enterNumber" />
      <el-table-column label="账户类型" align="center" prop="type">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.account_type" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="银行卡号" align="center" prop="bankCard" />
      <el-table-column label="银行类型" align="center" prop="bankType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.bank_type" :value="scope.row.bankType" />
        </template>
      </el-table-column>
      <el-table-column label="金额" align="center" prop="amount" />
      <el-table-column label="联系人" align="center" prop="accountMan" />
      <el-table-column label="联系电话" align="center" prop="accountPhone" />
      <el-table-column label="账户状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.account_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="账号邮箱" align="center" prop="accountEmail" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:account:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:account:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改企业账户对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="企业名称" prop="enterId">
          <el-input v-model="form.enterId" placeholder="请输入企业名称" />
        </el-form-item>
        <el-form-item label="企业税号" prop="enterNumber">
          <el-input v-model="form.enterNumber" placeholder="请输入企业税号" />
        </el-form-item>
        <el-form-item label="账户类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择账户类型">
            <el-option v-for="dict in dict.type.account_type" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="银行卡号" prop="bankCard">
          <el-input v-model="form.bankCard" placeholder="请输入银行卡号" />
        </el-form-item>
        <el-form-item label="银行类型" prop="bankType">
          <el-select v-model="form.bankType" placeholder="请选择银行类型">
            <el-option v-for="dict in dict.type.bank_type" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item label="联系人" prop="accountMan">
          <el-input v-model="form.accountMan" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="accountPhone">
          <el-input v-model="form.accountPhone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="账户状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择账户状态">
            <el-option v-for="dict in dict.type.account_status" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号邮箱" prop="accountEmail">
          <el-input v-model="form.accountEmail" placeholder="请输入账号邮箱" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listAccount,
    getAccount,
    delAccount,
    addAccount,
    updateAccount
  } from "@/api/system/account";

  export default {
    name: "Account",
    dicts: ['bank_type', 'account_type', 'account_status'],
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 企业账户表格数据
        accountList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          enterId: null,
          enterNumber: null,
          type: null,
          bankCard: null,
          bankType: null,
          status: null,
          amount: null,
          accountMan: null,
          accountPhone: null,
          accountEmail: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          enterName: [{
            required: true,
            message: "企业名称不能为空",
            trigger: "blur"
          }],
          enterNumber: [{
            required: true,
            message: "企业税号不能为空",
            trigger: "blur"
          }],
          type: [{
            required: true,
            message: "账户类型不能为空",
            trigger: "change"
          }],
          bankCard: [{
            required: true,
            message: "银行卡号不能为空",
            trigger: "blur"
          }],
          bankType: [{
            required: true,
            message: "银行类型不能为空",
            trigger: "change"
          }],
          status: [{
            required: true,
            message: "账户状态不能为空",
            trigger: "change"
          }],
          amount: [{
            required: true,
            message: "金额不能为空",
            trigger: "blur"
          }],
          accountMan: [{
            required: true,
            message: "联系人不能为空",
            trigger: "blur"
          }],
          accountPhone: [{
            required: true,
            message: "联系电话不能为空",
            trigger: "blur"
          }],
          accountEmail: [{
            required: true,
            message: "账号邮箱不能为空",
            trigger: "blur"
          }],
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询企业账户列表 */
      getList() {
        this.loading = true;
        listAccount(this.queryParams).then(response => {
          this.accountList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          id: null,
          enterId: null,
          enterNumber: null,
          type: null,
          bankCard: null,
          bankType: null,
          status: null,
          amount: null,
          accountMan: null,
          accountPhone: null,
          accountEmail: null,
          delFlag: null,
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加企业账户";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getAccount(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改企业账户";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateAccount(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addAccount(this.form).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$modal.confirm('是否确认删除企业账户编号为"' + ids + '"的数据项？').then(function() {
          return delAccount(ids);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('system/account/export', {
          ...this.queryParams
        }, `account_${new Date().getTime()}.xlsx`)
      }
    }
  };
</script>
