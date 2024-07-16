<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
			label-width="68px">
			<el-form-item label="企业名称" prop="enterName">
				<el-input v-model="queryParams.enterName" placeholder="请输入企业名称" clearable
					@keyup.enter.native="handleQuery" />
			</el-form-item>
			<el-form-item label="企业编号" prop="enterCode">
				<el-input v-model="queryParams.enterCode" placeholder="请输入企业编号" clearable
					@keyup.enter.native="handleQuery" />
			</el-form-item>
			<el-form-item label="企业类型" prop="type">
				<el-select v-model="queryParams.type" placeholder="请选择企业类型" clearable>
					<el-option v-for="dict in dict.type.enter_type" :key="dict.value" :label="dict.label"
						:value="dict.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="企业状态" prop="status">
				<el-select v-model="queryParams.status" placeholder="请选择企业状态" clearable>
					<el-option v-for="dict in dict.type.enter_status" :key="dict.value" :label="dict.label"
						:value="dict.value" />
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
				<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
			</el-form-item>
		</el-form>

		<el-row :gutter="10" class="mb8">
			<el-col :span="1.5">
				<el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
					v-hasPermi="['system:enter:add']">新增</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
					v-hasPermi="['system:enter:edit']">修改</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple"
					@click="handleDelete" v-hasPermi="['system:enter:remove']">删除</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
					v-hasPermi="['system:enter:export']">导出</el-button>
			</el-col>
			<right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
		</el-row>

		<el-table v-loading="loading" :data="enterList" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55" align="center" />
			<el-table-column label="企业名称" align="center" prop="enterName" />
			<el-table-column label="企业简称" align="center" prop="shortName" />
			<el-table-column label="英文名称" align="center" prop="enName" />
			<el-table-column label="信用代码" align="center" prop="creditCode" />
			<el-table-column label="企业编号" align="center" prop="enterCode" />
			<el-table-column label="企业类型" align="center" prop="type">
				<template slot-scope="scope">
					<dict-tag :options="dict.type.enter_type" :value="scope.row.type" />
				</template>
			</el-table-column>
			<el-table-column label="企业状态" align="center" prop="status">
				<template slot-scope="scope">
					<dict-tag :options="dict.type.enter_status" :value="scope.row.status" />
				</template>
			</el-table-column>
			<el-table-column label="企业联系人" align="center" prop="linkMan" />
			<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
				<template slot-scope="scope">
					<el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
						v-hasPermi="['system:enter:edit']">修改</el-button>
					<el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
						v-hasPermi="['system:enter:remove']">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
			@pagination="getList" />

		<!-- 添加或修改企业信息对话框 -->
		<el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
			<el-form ref="form" :model="form" :rules="rules" label-width="80px">
				<el-form-item label="企业名称" prop="enterName">
					<el-input v-model="form.enterName" placeholder="请输入企业名称" />
				</el-form-item>
				<el-form-item label="企业简称" prop="shortName">
					<el-input v-model="form.shortName" placeholder="请输入企业简称" />
				</el-form-item>
				<el-form-item label="英文名称" prop="enName">
					<el-input v-model="form.enName" placeholder="请输入英文名称" />
				</el-form-item>
				<el-form-item label="信用代码" prop="creditCode">
					<el-input v-model="form.creditCode" placeholder="请输入统一社会信用代码" />
				</el-form-item>
				<el-form-item label="企业编号" prop="enterCode">
					<el-input v-model="form.enterCode" placeholder="请输入企业编号" />
				</el-form-item>
				<el-form-item label="企业类型" prop="type">
					<el-select v-model="form.type" placeholder="请选择企业类型">
						<el-option v-for="dict in dict.type.enter_type" :key="dict.value" :label="dict.label"
							:value="parseInt(dict.value)"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="企业地址" prop="address">
					<el-input v-model="form.address" placeholder="请输入企业地址" />
				</el-form-item>
				<el-form-item label="企业邮编" prop="zipCode">
					<el-input v-model="form.zipCode" placeholder="请输入企业邮编" />
				</el-form-item>
				<el-form-item label="企业图标" prop="logo">
					<el-input v-model="form.logo" placeholder="请输入企业图标" />
				</el-form-item>
				<el-form-item label="企业状态" prop="status">
					<el-select v-model="form.status" placeholder="请选择企业状态">
						<el-option v-for="dict in dict.type.enter_status" :key="dict.value" :label="dict.label"
							:value="parseInt(dict.value)"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="联系人" prop="linkMan">
					<el-input v-model="form.linkMan" placeholder="请输入联系人" />
				</el-form-item>
				<el-form-item label="联系电话" prop="phone">
					<el-input v-model="form.phone" placeholder="请输入联系电话" />
				</el-form-item>
				<el-form-item label="企业网站" prop="website">
					<el-input v-model="form.website" placeholder="请输入企业网站" />
				</el-form-item>
				<el-form-item label="企业邮箱" prop="email">
					<el-input v-model="form.email" placeholder="请输入企业邮箱" />
				</el-form-item>
				<el-form-item label="经营范围" prop="scope">
					<el-input v-model="form.scope" type="textarea" placeholder="请输入经营范围" />
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
		listEnter,
		getEnter,
		delEnter,
		addEnter,
		updateEnter
	} from "@/api/system/enter";

	export default {
		name: "Enter",
		dicts: ['enter_status', 'enter_type'],
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
				// 企业信息表格数据
				enterList: [],
				// 弹出层标题
				title: "",
				// 是否显示弹出层
				open: false,
				// 查询参数
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					enterName: null,
					shortName: null,
					enName: null,
					creditCode: null,
					enterCode: null,
					type: null,
					address: null,
					zipCode: null,
					logo: null,
					status: null,
					linkMan: null,
					phone: null,
					website: null,
					email: null,
					scope: null,
				},
				// 表单参数
				form: {},
				// 表单校验
				rules: {
					enterName: [{
						required: true,
						message: "企业名称(全名)不能为空",
						trigger: "blur"
					}],
					creditCode: [{
						required: true,
						message: "统一社会信用代码不能为空",
						trigger: "blur"
					}],
					enterCode: [{
						required: true,
						message: "企业编号不能为空",
						trigger: "blur"
					}],
					type: [{
						required: true,
						message: "企业类型不能为空",
						trigger: "change"
					}],
					address: [{
						required: true,
						message: "企业地址不能为空",
						trigger: "blur"
					}],
					zipCode: [{
						required: true,
						message: "企业邮编不能为空",
						trigger: "blur"
					}],
					status: [{
						required: true,
						message: "企业状态不能为空",
						trigger: "change"
					}],
					linkMan: [{
						required: true,
						message: "企业联系人不能为空",
						trigger: "blur"
					}],
					phone: [{
						required: true,
						message: "联系电话不能为空",
						trigger: "blur"
					}],
					email: [{
						required: true,
						message: "企业邮箱不能为空",
						trigger: "blur"
					}],
				}
			};
		},
		created() {
			this.getList();
		},
		methods: {
			/** 查询企业信息列表 */
			getList() {
				this.loading = true;
				listEnter(this.queryParams).then(response => {
					this.enterList = response.rows;
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
					enterName: null,
					shortName: null,
					enName: null,
					creditCode: null,
					enterCode: null,
					type: null,
					address: null,
					zipCode: null,
					logo: null,
					status: null,
					linkMan: null,
					phone: null,
					website: null,
					email: null,
					scope: null,
					delFlag: null,
					createBy: null,
					createTime: null,
					updateBy: null,
					updateTime: null,
					remark: null
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
				this.title = "添加企业信息";
			},
			/** 修改按钮操作 */
			handleUpdate(row) {
				this.reset();
				const id = row.id || this.ids
				getEnter(id).then(response => {
					this.form = response.data;
					this.open = true;
					this.title = "修改企业信息";
				});
			},
			/** 提交按钮 */
			submitForm() {
				this.$refs["form"].validate(valid => {
					if (valid) {
						if (this.form.id != null) {
							updateEnter(this.form).then(response => {
								this.$modal.msgSuccess("修改成功");
								this.open = false;
								this.getList();
							});
						} else {
							addEnter(this.form).then(response => {
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
				this.$modal.confirm('是否确认删除企业信息编号为"' + ids + '"的数据项？').then(function() {
					return delEnter(ids);
				}).then(() => {
					this.getList();
					this.$modal.msgSuccess("删除成功");
				}).catch(() => {});
			},
			/** 导出按钮操作 */
			handleExport() {
				this.download('system/enter/export', {
					...this.queryParams
				}, `enter_${new Date().getTime()}.xlsx`)
			}
		}
	};
</script>