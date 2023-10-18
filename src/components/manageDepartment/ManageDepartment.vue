<template>
  <div>
    <h3>Quản lý phòng ban</h3>
    <hr style="margin-bottom: 5%" />
    <div style="padding-bottom: 20px">
      <div className="" style="width: 100%; margin: auto">
        <el-row :gutter="20">
          <!-- <el-col :md="6" :lg="6" :xl="6">
            <div class="grid-content" style="margin-bottom: 20px">
              <span>Năm</span> &ensp;
              <el-select
                v-model="year"
                @change="getData"
                placeholder="Chọn Phòng ban"
              >
                <el-option
                  v-for="item in years"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </div>
          </el-col> -->

          <el-col :md="6" :lg="6" :xl="6" style="margin-bottom: 20px">
            <div class="grid-content">
              <span style="">Tìm kiếm</span> &ensp;
              <el-input
                v-model="search"
                @input="getData"
                size="medium"
                placeholder="Tìm theo tên"
                style="width: 200px; padding: 2px 0"
              />
            </div>
          </el-col>
          <el-col :md="6" :lg="6" :xl="6" class="div-buttons">
            <div class="grid-content div-buttons">
              <import-excel
                class="text-start buttons btn-import"
                header="Thêm phòng ban"
                format="1"
                @getData="getData"
                style="margin-right: 10px"
              />
              <el-button
                class="buttons btn-add"
                type="danger"
                style=""
                round
                @click="showCreateDepartmentDialog"
                ><i class="el-icon-plus"></i> Thêm phòng ban
              </el-button>
            </div>
          </el-col>
        </el-row>
        <br />
        <div>
          <el-table
            :data="departments"
            height="700px"
            :header-cell-style="{
              background: '#D9D9D9',
              color: 'black',
              align: 'center',
            }"
            style="
              width: 100%;
              display: inline-block;
              font-size: 16px;
              border-radius: 10px;
              box-shadow: rgb(149 157 165 / 20%) 0px 8px 24px;
            "
            :row-class-name="tableRowClassName"
          >
            <el-table-column
              label="STT"
              type="index"
              align="center"
              width="100px"
            ></el-table-column>
            <el-table-column label="Ngày tạo" prop="createdDate" align="center">
            </el-table-column>
            <el-table-column
              label="Tên phòng ban"
              prop="name"
              align="center"
            ></el-table-column>

            <el-table-column
              v-slot:="data"
              label="Thao tác"
              width="150px"
              align="center"
            >
              <button
                style="margin-right: 10px"
                class="btn-action"
                @click="showEditDepartmentDialog(data.row.id)"
              >
                <i class="el-icon-edit-outline" style="width: 30px"></i>
              </button>
              <button
                style="margin-right: 10px"
                class="btn-action"
                @click="showDeleteDepartmentDialog(data.row.id)"
              >
                <i class="el-icon-delete" style="width: 30px"></i>
              </button>

              <button v-if="data.row.status == 1" class="btn-action">
                <!--                                @click="changeStatus(-->
                <!--                                data.row.id,-->
                <!--                                data.row.fullName,-->
                <!--                                data.row.status) "-->
                <i class="el-icon-unlock" style="width: 30px"></i>
              </button>

              <!--          </div>-->
            </el-table-column>
          </el-table>
        </div>
        <el-pagination
          class="text-end"
          background
          layout="prev, pager, next"
          :total="totalItems"
          :page-size="pageSize"
          @current-change="handlePageChange"
        >
        </el-pagination>
      </div>
    </div>

    <el-dialog
      :visible.sync="editDepartmentDialogVisible"
      width="50%"
      title="Sửa phòng ban"
      left
    >
      <el-form
        id="formCreate"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="200px"
        class="demo-ruleForm"
      >
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <el-form-item label="Nhập tên phòng ban" prop="name">
              <el-input
                v-model="ruleForm.name"
                name="positionName"
                autocomplete="off"
                maxlength="50"
              ></el-input>
            </el-form-item>
          </div>
        </div>

        <div class="row" style="display: flex; justify-content: flex-end">
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2">
            <div style="bottom: 40px">
              <el-form-item>
                <el-button
                  class="btn btn-outline-danger"
                  type="primary"
                  style="width: 90%"
                  @click="cancelEditForm('ruleForm')"
                  >Hủy</el-button
                >
              </el-form-item>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2">
            <div style="bottom: 40px">
              <el-form-item>
                <el-button
                  class="btn btn-success"
                  type="primary"
                  style="width: 90%"
                  @click="submitEditForm('ruleForm')"
                  >Lưu</el-button
                >
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog
      :visible.sync="createDepartmentDialogVisible"
      width="50%"
      title="Thêm phòng ban"
      left
    >
      <el-form
        id="formCreate"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="200px"
        class="demo-ruleForm"
      >
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <el-form-item label="Nhập tên phòng ban" prop="name">
              <el-input
                v-model="ruleForm.name"
                name="positionName"
                autocomplete="off"
                maxlength="50"
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="row" style="display: flex; justify-content: flex-end">
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2">
            <div style="bottom: 40px">
              <el-form-item>
                <el-button
                  class="btn btn-outline-danger"
                  type="primary"
                  style="width: 90%"
                  @click="cancelCreateForm('ruleForm')"
                  >Hủy</el-button
                >
              </el-form-item>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2">
            <div style="bottom: 40px">
              <el-form-item>
                <el-button
                  class="btn btn-success"
                  type="primary"
                  style="width: 90%"
                  @click="submitForm('ruleForm')"
                  >Lưu</el-button
                >
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog
      :visible.sync="deleteDepartmentDialogVisible"
      width="30%"
      title="Xóa phòng ban"
      left
    >
      <el-form
        id="formCreate"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="200px"
        class="demo-ruleForm"
      >
        <p style="text-align: center">Xác nhận xóa phòng ban</p>
        <p style="text-align: center">{{ ruleForm.name }}</p>

        <div class="row" style="margin-top: 70px">
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <el-form-item>
              <el-button
                class="btn btn-success"
                style="width: 100%"
                @click="deleteDepartmentDialogVisible = false"
                >Huỷ</el-button
              >
            </el-form-item>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <el-form-item>
              <el-button
                style="width: 100%"
                class="btn btn-outline-danger"
                @click="acceptDelete()"
                >Xác nhận</el-button
              >
            </el-form-item>
          </div>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// import HolidayService from "@/services/holiday-service";
import DepartmentService from "@/services/department-service";
import moment from "moment";
export default {
  components: {},
  name: "ManageDepartment",
  data() {
    var date = new Date();
    var currentYear = date.getFullYear();
    return {
      year: currentYear,
      years: [],
      departmentId: "",
      roles: [],
      ruleForm: {
        name: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "Vui lòng nhập tên phòng ban!",
            trigger: "blur",
          },
            {
            min: 1,
            max: 100,
            message: "Tên phòng ban từ 1 đến 100 kí tự",
            trigger: "blur",
          },
        ],
      },
      departments: [],
      page: 0,
      pageSize: 5,
      search: "",
      date: "",
      totalItems: 0,
      fit: "fill",
      editDepartmentDialogVisible: false,
      createDepartmentDialogVisible: false,
      deleteDepartmentDialogVisible: false,
    };
  },

  created() {
    this.getData();
    // this.getAllYear();
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          DepartmentService.save(this.ruleForm).then(() => {
            this.createPositionDialogVisible = false;
            this.$notify.success({
              message: "Tạo chức vụ thành công",
              title: "Success",
              timer: 2000,
              timerProgressBar: true,
            });
            this.getData();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    cancelCreateForm(formName) {
      this.$refs[formName].resetFields();
      this.createDepartmentDialogVisible = false;
    },

    submitEditForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          DepartmentService.updateDepartment(
            this.departmentId,
            this.ruleForm
          ).then(() => {
            this.createDepartmentDialogVisible = false;
            this.editDepartmentDialogVisible = false;
            this.deleteDepartmentDialogVisible = false;
            this.$notify.success({
              message: "Sửa thành công",
              title: "Success",
              timer: 2000,
              timerProgressBar: true,
            });
            this.getData();
          });
        } else {
          return false;
        }
      });
    },

    cancelEditForm(formName) {
      this.$refs[formName].resetFields();
      this.editDepartmentDialogVisible = false;
    },

    showCreateDepartmentDialog() {
      this.createDepartmentDialogVisible = true;
      this.editDepartmentDialogVisible = false;
      this.deleteDepartmentDialogVisible = false;
      this.ruleForm = {};
    },

    showEditDepartmentDialog(id) {
      this.editDepartmentDialogVisible = true;
      this.createDepartmentDialogVisible = false;
      this.deleteDepartmentDialogVisible = false;
      this.departmentId = id;
      DepartmentService.getDepartment(id)
        .then((response) => {
          this.ruleForm.name = response.data.name;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    showDeleteDepartmentDialog(id) {
      this.editDepartmentDialogVisible = false;
      this.createDepartmentDialogVisible = false;
      this.deleteDepartmentDialogVisible = true;
      this.departmentId = id;

      DepartmentService.getDepartment(id)
        .then((response) => {
          this.ruleForm.name = response.data.name;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    acceptDelete() {
      DepartmentService.deleteDepartment(this.departmentId)
        .then((response) => {
          console.log(response.data);
          this.editDepartmentDialogVisible = false;
          this.createDepartmentDialogVisible = false;
          this.deleteDepartmentDialogVisible = false;
          this.$notify.success({
            message: "Xóa thành công",
            title: "Success",
            timer: 2000,
            timerProgressBar: true,
          });
          this.getData();
        })
        .catch((e) => {
          this.editDepartmentDialogVisible = false;
          this.createDepartmentDialogVisible = false;
          this.deleteDepartmentDialogVisible = false;
          this.$notify.error({
            message: "Không thể xóa phòng ban!",
            title: "Failed",
            timer: 2000,
            timerProgressBar: true,
          });
          this.getData();
          console.log(e);
        });
    },

    getData() {
      DepartmentService.getDepartments(
        this.page,
        this.pageSize,
        this.search
      ).then((response) => {
        this.departments = response.data.content;
        for (const key in this.departments) {
          if (Object.hasOwnProperty.call(this.departments, key)) {
            this.departments[key].createdDate = moment(
              String(this.departments[key].createdDate)
            ).format("DD/MM/yyyy");
          }
        }
        this.page = response.data.pageable.pageNumber;
        this.totalItems = response.data.totalElements;
      });
    },

    // getAllYear() {
    //   HolidayService.getYears().then((response) => {
    //     this.years = response.data;
    //   });
    // },



    handlePageChange(value) {
      this.page = value - 1;
      this.getData();
    },

    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return "warning-row";
      } else if (rowIndex % 2 === 0) {
        return "success-row";
      }
      return "success-row";
    },
    restrictToNumbers() {
      // Xóa bất kỳ ký tự nào không phải số khỏi chuỗi
      this.numberInput = this.numberInput.replace(/[^0-9]/g, "");
    },
  },
};
</script>

<style>
* {
  font-size: 16px;
}
.el-form-item__label {
  text-align: left;
}
.el-form-item__content {
  margin-left: 0px !important;
}

.el-form-item {
  display: flex;
  flex-direction: column;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.el-table .warning-row {
  background: #ededed;
}

.el-table .success-row {
  background: #f5f5f5;
}

.save {
  cursor: default;
  color: white;
  background-color: #75c4c0;
  border: none;
  border-radius: 5px;
  padding: 6px 36px;
}

.save:hover {
  cursor: pointer;
  color: white;
  background-color: #75c4c0;
  border: none;
  border-radius: 5px;
  padding: 6px 36px;
}

.el-table .tt1 {
  cursor: default;
  color: black;
  background-color: #75c4c0;
  border: none;
  border-radius: 5px;
  padding: 3px 20px;
}

.el-table .tt2 {
  cursor: default;
  color: black;
  background-color: #ed9696;
  border: none;
  border-radius: 5px;
  padding: 3px 20px;
}

.el-table .btn-action {
  border: none;
  padding: 5px 5px;
  background-color: #f8cbad;
  border-radius: 5px;
}

.el-table .btn-action:hover {
  border: none;
  padding: 5px 5px;
  background-color: #f4e4d4;
  border-radius: 5px;
}

.el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #c9f5eb !important;
}

/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.loading {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: none;
  align-items: center;
  justify-content: center;
  /* background: rgba(0, 0, 0, 0.479); */
}

.loading img {
  width: 25rem;
}

@media only screen and (min-width: 150px) {
  .el-col-md-6 {
    width: 108%;
  }

  .buttons {
    text-align: left;
  }
}

@media only screen and (min-width: 992px) {
  .el-col-md-6 {
    width: 100%;
  }

  .buttons {
    text-align: left;
  }
}

@media only screen and (min-width: 1440px) {
  .el-col-md-6 {
    width: 23%;
  }

  .buttons {
    text-align: right;
  }

  .div-buttons {
    float: right;
  }
}

@media only screen and (min-width: 1689px) {
  .el-col-md-6 {
    width: 23%;
  }

  .buttons {
    text-align: right;
  }

  .div-buttons {
    float: right;
  }
}

@media only screen and (min-width: 1920px) {
  .el-col-md-6 {
    width: 23%;
  }

  .buttons {
    text-align: right;
  }

  .div-buttons {
    float: right;
  }
}
</style>