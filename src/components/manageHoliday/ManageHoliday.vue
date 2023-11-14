<template>
  <div class="manage-holiday">
    <h3>Quản lý ngày nghỉ</h3>
    <hr style="margin-bottom: 5%" />
    <div style="padding-bottom: 20px">
      <div className="" style="width: 100%; margin: auto">
        <el-row :gutter="20">
          <el-col :md="6" :lg="6" :xl="6">
            <div class="grid-content" style="margin-bottom: 20px">
              <span>Năm</span> &ensp;
              <el-select
                v-model="year"
                @change="getData"
                placeholder="Chọn Năm"
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
          </el-col>

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
                header="Thêm ngày nghỉ"
                format="1"
                @getData="getData"
                style="margin-right: 10px"
              />
              <el-button
                class="buttons btn-add"
                type="danger"
                style=""
                round
                @click="showCreateHolidayDialog"
                ><i class="el-icon-plus"></i> Thêm ngày nghỉ
              </el-button>
            </div>
          </el-col>
        </el-row>
        <br />
        <div>
          <el-table
            :data="holidays"
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
            <el-table-column
              label="Ngày bắt đầu"
              prop="startDate"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="Ngày kết thúc"
              prop="endDate"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="Tên ngày nghỉ"
              prop="holidayName"
              align="center"
            ></el-table-column>
            <el-table-column
              label="Số ngày nghỉ"
              prop="totalDayOff"
              align="center"
            >
            </el-table-column>
            <el-table-column
              v-slot:="data"
              label="Thao tác"
              width="150px"
              align="center"
            >
              <button
                style="margin-right: 10px"
                class="btn-action"
                @click="showEditHolidayDialog(data.row.id)"
              >
                <i class="el-icon-edit-outline" style="width: 30px"></i>
              </button>
              <button
                style="margin-right: 10px"
                class="btn-action"
                @click="showDeleteHolidayDialog(data.row.id)"
              >
                <i class="el-icon-delete" style="width: 30px"></i>
              </button>
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
      :visible.sync="editHolidayDialogVisible"
      width="50%"
      title="Sửa ngày nghi"
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
            <el-form-item label="Nhập tên ngày nghỉ" prop="holidayName">
              <el-input
                v-model="ruleForm.holidayName"
                name="holidayName"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </div>
        </div>

        <div class="row" style="margin-top: 20px">
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <el-form-item label="Nghỉ từ" required>
              <el-form-item prop="startDate">
                <el-date-picker
                  type="date"
                  v-model="ruleForm.startDate"
                  format="dd/MM/yyyy"
                  value-format="yyyy-MM-dd"
                  name="startDate"
                  placeholder="Chọn ngày"
                  style="width: 100%"
                  :picker-options="pickerOptionStartDate"
                ></el-date-picker>
              </el-form-item>
            </el-form-item>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <el-form-item label="Nghỉ đến" required>
              <el-form-item prop="endDate">
                <el-date-picker
                  type="date"
                  v-model="ruleForm.endDate"
                  name="endDate"
                  format="dd/MM/yyyy"
                  value-format="yyyy-MM-dd"
                  placeholder="Chọn ngày"
                  style="width: 100%"
                  :picker-options="pickerOptionEndDate"
                ></el-date-picker>
              </el-form-item>
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
      :visible.sync="createHolidayDialogVisible"
      width="50%"
      title="Thêm ngày nghi"
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
            <el-form-item label="Nhập tên ngày nghỉ" prop="holidayName">
              <el-input
                v-model="ruleForm.holidayName"
                name="holidayName"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </div>
        </div>

        <div class="row" style="margin-top: 20px">
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <el-form-item label="Nghỉ từ" required>
              <el-form-item prop="startDate">
                <el-date-picker
                  type="date"
                  v-model="ruleForm.startDate"
                  format="dd/MM/yyyy"
                  value-format="yyyy-MM-dd"
                  name="startDate"
                  placeholder="Chọn ngày"
                  style="width: 100%"
                  :picker-options="pickerOptionStartDate"
                ></el-date-picker>
              </el-form-item>
            </el-form-item>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <el-form-item label="Nghỉ đến" required>
              <el-form-item prop="endDate">
                <el-date-picker
                  type="date"
                  v-model="ruleForm.endDate"
                  name="endDate"
                  format="dd/MM/yyyy"
                  value-format="yyyy-MM-dd"
                  placeholder="Chọn ngày"
                  style="width: 100%"
                  :picker-options="pickerOptionEndDate"
                ></el-date-picker>
              </el-form-item>
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
      :visible.sync="deleteHolidayDialogVisible"
      width="30%"
      title="Xóa ngày nghi"
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
        <p style="text-align: center">Xác nhận xóa ngày nghỉ</p>
        <p style="text-align: center">{{ ruleForm.holidayName }}</p>

        <div class="row" style="margin-top: 70px">
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <el-form-item>
              <el-button
                class="btn btn-success"
                style="width: 100%"
                @click="deleteHolidayDialogVisible = false"
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
import HolidayService from "@/services/holiday-service";
import moment from "moment";
export default {
  components: {},
  name: "ManageHoliday",
  data() {
    var date = new Date();
    var currentYear = date.getFullYear();
    var validateEndDate = (rule, value, callback) => {
      if (this.ruleForm.startDate == "" && this.ruleForm.endDate != "") {
        this.ruleForm.endDate = "";
        callback(new Error("Vui lòng nhập ngày bắt đầu trước!"));
      } else {
        callback();
      }
    };

    return {
      year: currentYear,
      currentDate: date,
      years: [],
      holidayId: "",
      ruleForm: {
        endDate: "",
        holidayName: "",
        startDate: "",
      },
      startHolidayDate: "",
      endHolidayDate: "",

      rules: {
        holidayName: [
          {
            required: true,
            message: "Vui lòng nhập tên ngày nghỉ!",
            trigger: "blur",
          },
          {
            min: 1,
            max: 100,
            message: "Tên ngày nghỉ từ 1 đến 100 kí tự",
            trigger: "blur",
          },
        ],
        startDate: [
          {
            required: true,
            message: "Vui lòng nhập ngày bắt đầu kỳ nghỉ!",
            trigger: "change",
          },
        ],
        endDate: [
          {
            required: true,
            message: "Vui lòng nhập ngày kết thúc kỳ nghỉ!",
            trigger: "change",
          },
          { validator: validateEndDate, trigger: "blur" },
        ],
      },
      holidays: [],
      page: 0,
      pageSize: 5,
      search: "",
      date: "",
      totalItems: 0,
      fit: "fill",
      editHolidayDialogVisible: false,
      createHolidayDialogVisible: false,
      deleteHolidayDialogVisible: false,
    };
  },

  created() {
    this.getData();
    this.getAllYear();
  },
  computed: {
    pickerOptionStartDate() {
      return {
        disabledDate: this.disableOneDayAgoStartDate,
      };
    },
    pickerOptionEndDate() {
      return {
        disabledDate: this.disableOneDayAgoEndDate,
      };
    },
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          HolidayService.save(this.ruleForm).then(() => {
            this.createHolidayDialogVisible = false;
            this.$notify.success({
              message: "Tạo ngày nghỉ thành công!",
              title: "Success",
              timer: 2000,
              timerProgressBar: true,
            });
            this.getData();
          });
          this.$refs[formName].resetFields();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    cancelCreateForm(formName) {
      this.$refs[formName].resetFields();
      this.createHolidayDialogVisible = false;
    },

    submitEditForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm)
          HolidayService.updateHoliday(this.holidayId, this.ruleForm).then(
            () => {
              this.createHolidayDialogVisible = false;
              this.editHolidayDialogVisible = false;
              this.$notify.success({
                message: "Sửa ngày nghỉ thành công!",
                title: "Success",
                timer: 2000,
                timerProgressBar: true,
              });
              this.getData();
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    cancelEditForm(formName) {
      this.$refs[formName].resetFields();
      this.editHolidayDialogVisible = false;
    },

    showCreateHolidayDialog() {
      this.createHolidayDialogVisible = true;
      this.editHolidayDialogVisible = false;
      this.deleteHolidayDialogVisible = false;
      this.ruleForm.endDate = "";
      this.ruleForm.startDate = "";
      this.ruleForm.holidayName = "";
    },

    showEditHolidayDialog(id) {
      HolidayService.getHoliday(id)
        .then((response) => {
          this.startHolidayDate = response.data.startDate;
          this.endHolidayDate = response.data.endDate;
          this.ruleForm = response.data;
        })
        .catch((e) => {
          this.logout();
          console.log(e);
        });
      setTimeout(() => {
        this.startHolidayDate = new Date(this.startHolidayDate);
        this.endHolidayDate = new Date(this.endHolidayDate);
         this.currentDate.setHours(7, 0, 0, 0);
        if (
          this.startHolidayDate <= this.currentDate &&
          this.currentDate <= this.endHolidayDate
        ) {
          this.$notify.error({
            message: "Không thể sửa vì đang trong kỳ nghỉ!.",
            title: "Failed",
            timer: 2000,
            timerProgressBar: true,
          });
        } else if (this.currentDate > this.endHolidayDate) {
          this.$notify.error({
            message: "Không thể sửa vì kỳ nghỉ đã qua!.",
            title: "Failed",
            timer: 2000,
            timerProgressBar: true,
          });
        } else {
          this.editHolidayDialogVisible = true;
          this.createHolidayDialogVisible = false;
          this.deleteHolidayDialogVisible = false;
          this.holidayId = id;
        }
      }, 50);
    },

    showDeleteHolidayDialog(id) {
      HolidayService.getHoliday(id)
        .then((response) => {
          this.startHolidayDate = response.data.startDate;
          this.endHolidayDate = response.data.endDate;
          this.ruleForm = response.data;
        })
        .catch((e) => {
          this.logout();
          console.log(e);
        });
      setTimeout(() => {
        this.startHolidayDate = new Date(this.startHolidayDate);
        this.endHolidayDate = new Date(this.endHolidayDate);
        this.currentDate.setHours(7, 0, 0, 0);
        if (
          this.startHolidayDate <= this.currentDate &&
          this.currentDate <= this.endHolidayDate
        ) {
          this.$notify.error({
            message: "Không thể xóa vì đang trong kỳ nghỉ!.",
            title: "Failed",
            timer: 2000,
            timerProgressBar: true,
          });
        } else if (this.currentDate > this.endHolidayDate) {
          this.$notify.error({
            message: "Không thể xóa vì kỳ nghỉ đã qua!.",
            title: "Failed",
            timer: 2000,
            timerProgressBar: true,
          });
        } else {
          this.editHolidayDialogVisible = false;
          this.createHolidayDialogVisible = false;
          this.deleteHolidayDialogVisible = true;
          this.holidayId = id;
        }
      }, 50);
    },

    acceptDelete() {
      HolidayService.deleteHoliday(this.holidayId)
        .then((response) => {
          console.log(response.data);
          this.editHolidayDialogVisible = false;
          this.createHolidayDialogVisible = false;
          this.deleteHolidayDialogVisible = false;
          this.$notify.success({
            message: "Xóa ngày nghỉ thành công!",
            title: "Success",
            timer: 2000,
            timerProgressBar: true,
          });
          this.getData();
        })
        .catch((e) => {
          this.editHolidayDialogVisible = false;
          this.createHolidayDialogVisible = false;
          this.deleteHolidayDialogVisible = false;
          this.$notify.error({
            message: "Không thể xóa ngày nghỉ này vì đã được sử dụng!",
            title: "Failed",
            timer: 2000,
            timerProgressBar: true,
          });
          this.getData();
          console.log(e);
        });
    },

    getData() {
      console.log(this.page);
      HolidayService.getData(this.page, this.pageSize, this.search, this.year)
        .then((response) => {
          this.holidays = response.data.content;
          console.log(response.data);
          for (const key in this.holidays) {
            if (Object.hasOwnProperty.call(this.holidays, key)) {
              this.holidays[key].startDate = moment(
                String(this.holidays[key].startDate)
              ).format("DD/MM/yyyy");
              this.holidays[key].endDate = moment(
                String(this.holidays[key].endDate)
              ).format("DD/MM/yyyy");
            }
          }
          this.page = response.data.pageable.pageNumber;
          this.totalItems = response.data.totalElements;
        })
        .catch((e) => {
          this.logout();
          console.log(e);
        });
    },

    getAllYear() {
      HolidayService.getYears()
        .then((response) => {
          this.years = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    disableOneDayAgoStartDate(date) {
      const startWork = new Date();
      startWork.setDate(startWork.getDate());
      return date < startWork;
    },

    disableOneDayAgoEndDate(date) {
      const endWork = new Date(this.ruleForm.startDate);
      endWork.setDate(endWork.getDate() - 1);
      return date < endWork;
    },
    logout() {
      this.$store.dispatch("auth/logout");
     window.location.replace("/login");
      localStorage.removeItem("user");
    },

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
.manage-holiday .el-form-item__label {
  text-align: left;
}
.manage-holiday .el-form-item__content {
  margin-left: 0px !important;
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
  .manage-holiday .el-col-md-6 {
    width: 108%;
  }

  .manage-holiday .buttons {
    text-align: left;
  }
}

@media only screen and (min-width: 992px) {
  .manage-holiday .el-col-md-6 {
    width: 100%;
  }

  .manage-holiday .buttons {
    text-align: left;
  }
}

@media only screen and (min-width: 1440px) {
  .manage-holiday .el-col-md-6 {
    width: 23%;
  }

  .manage-holiday .buttons {
    text-align: right;
  }

  .manage-holiday .div-buttons {
    float: right;
  }
}

@media only screen and (min-width: 1689px) {
  .manage-holiday .el-col-md-6 {
    width: 23%;
  }

  .manage-holiday .buttons {
    text-align: right;
  }

  .manage-holiday .div-buttons {
    float: right;
  }
}

@media only screen and (min-width: 1920px) {
  .manage-holiday .el-col-md-6 {
    width: 23%;
  }

  .manage-holiday .buttons {
    text-align: right;
  }

  .manage-holiday .div-buttons {
    float: right;
  }
}
</style>

