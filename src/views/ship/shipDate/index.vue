<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >

      <el-form-item label="中文名称" prop="chineseName">
        <el-input
          v-model="queryParams.chineseName"
          placeholder="请输入中文名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="英文名称" prop="englishName">
        <el-input
          v-model="queryParams.englishName"
          placeholder="请输入英文名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="泊位" prop="berth">
        <el-input
          v-model="queryParams.berth"
          placeholder="请输入泊位"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="企业名称" prop="shipEnterName">
        <el-input
          v-model="queryParams.shipEnterName"
          placeholder="请输入企业名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="船舶呼号" prop="shipCallSign">
        <el-input
          v-model="queryParams.shipCallSign"
          placeholder="请输入船舶呼号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="船IMO" prop="shipImo">
        <el-input
          v-model="queryParams.shipImo"
          placeholder="请输入船IMO"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="进港航次" prop="inVoyagesNumber">
        <el-input
          v-model="queryParams.inVoyagesNumber"
          placeholder="请输入进港航次"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
        >
          <el-option
            v-for="dict in dict.type.ship_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="船MMSI" prop="shipMmsi">
        <el-input
          v-model="queryParams.shipMmsi"
          placeholder="请输入船MMSI"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['ship:shipDate:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['ship:shipDate:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['ship:shipDate:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['ship:shipDate:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="shipDateList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="中文名称" align="center" prop="chineseName" />
      <!-- <el-table-column label="船期ID" align="center" prop="operatingId" /> -->
      <!-- <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.ship_status"
            :value="scope.row.status"
          />
        </template>
      </el-table-column> -->

      <el-table-column label="英文名称" align="center" prop="englishName" />
      <el-table-column label="进港航次" align="center" prop="inVoyagesNumber" />
      <el-table-column
        label="出港航次"
        align="center"
        prop="outVoyagesNumber"
      />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.ship_status"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="计划靠泊时间"
        align="center"
        prop="planBerthingTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.planBerthingTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="实际靠泊时间"
        align="center"
        prop="realityBerthingTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.realityBerthingTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="计划离泊时间"
        align="center"
        prop="planUnberthingTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.planUnberthingTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="实际离泊时间"
        align="center"
        prop="realityUnberthingTime"
        width="180"
      >
        <template slot-scope="scope">
          <!-- <span>{{ parseTime(scope.row.realityUnberthingTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span> -->
          <span>{{ parseTime(scope.row.realityUnberthingTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="泊位" align="center" prop="berth" />
      <el-table-column label="企业名称" align="center" prop="shipEnterName" />
      <el-table-column label="进港航线" align="center" prop="importRoute" />
      <el-table-column label="出港航线" align="center" prop="exportRoute" />
      <el-table-column label="船舶呼号" align="center" prop="shipCallSign" />
      <el-table-column label="船IMO" align="center" prop="shipImo" />
      <el-table-column label="船MMSI" align="center" prop="shipMmsi" />
      <el-table-column label="船长" align="center" prop="shipLength" />
      <el-table-column label="船宽" align="center" prop="shipWidth" />
      <el-table-column label="船高" align="center" prop="shipHeight" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['ship:shipDate:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ship:shipDate:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改船期管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width=auto>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type.ship_status"
              :key="dict.value"
              :label="dict.value"
              >{{ dict.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="中文名称" prop="chineseName">
          <el-input v-model="form.chineseName" placeholder="请输入中文名称" />
        </el-form-item>
        <el-form-item label="英文名称" prop="englishName">
          <el-input v-model="form.englishName" placeholder="请输入英文名称" />
        </el-form-item>
        <el-form-item label="进港航次" prop="inVoyagesNumber">
          <el-input
            v-model="form.inVoyagesNumber"
            placeholder="请输入进港航次"
          />
        </el-form-item>
        <el-form-item label="出港航次" prop="outVoyagesNumber">
          <el-input
            v-model="form.outVoyagesNumber"
            placeholder="请输入出港航次"
          />
        </el-form-item>
        <el-form-item label="计划靠泊时间" prop="planBerthingTime">
          <el-date-picker
            clearable
            v-model="form.planBerthingTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择计划靠泊时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="实际靠泊时间" prop="realityBerthingTime">
          <el-date-picker
            clearable
            v-model="form.realityBerthingTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择实际靠泊时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="计划离泊时间" prop="planUnberthingTime">
          <el-date-picker
            clearable
            v-model="form.planUnberthingTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择计划离泊时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="实际离泊时间" prop="realityUnberthingTime">
          <el-date-picker
            clearable
            v-model="form.realityUnberthingTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择实际离泊时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="泊位" prop="berth">
          <el-input v-model="form.berth" placeholder="请输入泊位" />
        </el-form-item>
        <el-form-item label="企业名称" prop="shipEnterName">
          <el-input v-model="form.shipEnterName" placeholder="请输入企业名称" />
        </el-form-item>
        <el-form-item label="进港航线" prop="importRoute">
          <el-input v-model="form.importRoute" placeholder="请输入进港航线" />
        </el-form-item>
        <el-form-item label="出港航线" prop="exportRoute">
          <el-input v-model="form.exportRoute" placeholder="请输入出港航线" />
        </el-form-item>
        <el-form-item label="船舶呼号" prop="shipCallSign">
          <el-input v-model="form.shipCallSign" placeholder="请输入船舶呼号" />
        </el-form-item>
        <el-form-item label="船IMO" prop="shipImo">
          <el-input v-model="form.shipImo" placeholder="请输入船IMO" />
        </el-form-item>
        <el-form-item label="船MMSI" prop="shipMmsi">
          <el-input v-model="form.shipMmsi" placeholder="请输入船MMSI" />
        </el-form-item>
        <el-form-item label="船长" prop="shipLength">
          <el-input v-model="form.shipLength" placeholder="请输入船长" />
        </el-form-item>
        <el-form-item label="船宽" prop="shipWidth">
          <el-input v-model="form.shipWidth" placeholder="请输入船宽" />
        </el-form-item>
        <el-form-item label="船高" prop="shipHeight">
          <el-input v-model="form.shipHeight" placeholder="请输入船高" />
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
  listShipDate,
  getShipDate,
  delShipDate,
  addShipDate,
  updateShipDate,
} from "@/api/ship/shipDate";
import { checkIsPositive } from "@/utils/validate.js";

export default {
  name: "ShipDate",
  dicts: ["ship_status"],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      selectedRows:[],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 船期管理表格数据
      shipDateList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        status: null,
        chineseName: null,
        englishName: null,
        inVoyagesNumber: null,
        outVoyagesNumber: null,
        planBerthingTime: null,
        realityBerthingTime: null,
        planUnberthingTime: null,
        realityUnberthingTime: null,
        berth: null,
        shipEnterName: null,
        importRoute: null,
        exportRoute: null,
        shipCallSign: null,
        shipImo: null,
        shipMmsi: null,
        shipLength: null,
        shipWidth: null,
        shipHeight: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        status: [
          {
            required: true,
            message: "请选择状态",
            trigger: "blur",
          },
        ],
        chineseName: [
          {
            required: true,
            message: "请输入中文名称",
            trigger: "blur",
          },
        ],
        englishName: [
          {
            required: true,
            message: "请输入英文名称",
            trigger: "blur",
          },
        ],
        inVoyagesNumber: [
          {
            required: true,
            message: "请输入进港航次",
            trigger: "blur",
          },
        ],
        // outVoyagesNumber: [{
        // 	// required: true,
        // 	message: "内容不能为空",
        // 	trigger: "blur"
        // }],
        planBerthingTime: [
          {
            required: true,
            message: "请选择计划靠泊时间",
            trigger: "blur",
          },
        ],
        // realityBerthingTime: [{
        // 	required: true,
        // 	message: "内容不能为空",
        // 	trigger: "blur"
        // }],
        planUnberthingTime: [
          {
            required: true,
            message: "请选择计划离泊时间",
            trigger: "blur",
          },
        ],
        // realityUnberthingTime: [{
        // 	required: true,
        // 	message: "内容不能为空",
        // 	trigger: "blur"
        // }],
        berth: [
          {
            required: true,
            message: "请输入泊位",
            trigger: "blur",
          },
        ],

        // shipEnterName: [{
        // 	required: true,
        // 	message: "内容不能为空",
        // 	trigger: "blur"
        // }],
        // importRoute: [{
        // 	required: true,
        // 	message: "内容不能为空",
        // 	trigger: "blur"
        // }],
        // exportRoute: [{
        // 	required: true,
        // 	message: "内容不能为空",
        // 	trigger: "blur"
        // }],
        // shipCallSign: [{
        // 	required: true,
        // 	message: "内容不能为空",
        // 	trigger: "blur"
        // }],
        shipImo: [
          {
            required: true,
            message: "请输入船IMO",
            trigger: "blur",
          },
        ],
        // shipMmsi: [{
        // 	required: true,
        // 	message: "内容不能为空",
        // 	trigger: "blur"
        // }],
        shipLength: [
          {
            // required: true,
            validator: checkIsPositive,

            trigger: "blur",
          },
        ],
        shipWidth: [
          {
            // required: true,
            validator: checkIsPositive,

            trigger: "blur",
          },
        ],

        shipHeight: [
          {
            // required: true,
            validator: checkIsPositive,

            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询船期管理列表 */
    getList() {

      this.loading = true;
      listShipDate(this.queryParams).then((response) => {
       
        this.shipDateList = response.rows;
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
        operatingId: null,
        status: null,
        chineseName: null,
        englishName: null,
        inVoyagesNumber: null,
        outVoyagesNumber: null,
        planBerthingTime: null,
        realityBerthingTime: null,
        planUnberthingTime: null,
        realityUnberthingTime: null,
        berth: null,
        shipEnterId: null,
        shipEnterName: null,
        importRoute: null,
        exportRoute: null,
        shipCallSign: null,
        shipImo: null,
        shipMmsi: null,
        shipLength: null,
        shipWidth: null,
        shipHeight: null,
        delFlag: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
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
      this.selectedRows = selection;
      this.ids = selection.map((item) => item.operatingId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加船期管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
     
      this.reset();
      const operatingId = row.operatingId || this.ids;
      getShipDate(operatingId).then((response) => {
        console.log(response);
        this.form = response.data;
        this.open = true;
        this.title = "修改船期管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.operatingId != null) {
            updateShipDate(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addShipDate(this.form).then((response) => {
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
      const operatingIds = row.operatingId || this.ids;
      this.$modal
        .confirm(`是否确认删除这${this.selectedRows.length} 项的数据？`)
        .then(function () {
          return delShipDate(operatingIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "ship/shipDate/export",
        {
          ...this.queryParams,
        },
        `shipDate_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
