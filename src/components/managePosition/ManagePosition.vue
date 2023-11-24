<template>
  <div class="manage-position">
    <h3 class="text-start" style="font-weight: bold">Quản lý chức vụ</h3>
    <hr style="margin-bottom: 2%" />
    <div style="padding-bottom: 20px">
      <div className="" style="width: 100%; margin: auto">
        <el-row :gutter="20">
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
                header="Thêm chức vụ"
                format="1"
                @getData="getData"
                style="margin-right: 10px"
              />
              <el-button
                class="buttons btn-add"
                type="danger"
                style=""
                round
                @click="showCreatePositionDialog"
                ><i class="el-icon-plus"></i> Thêm chức vụ
              </el-button>
            </div>
          </el-col>
        </el-row>
        <br />
        <div>
          <el-table
            :data="positions"
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
              label="Tên chức vụ"
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
                @click="showEditPositionDialog(data.row.id)"
              >
                <i class="el-icon-edit-outline" style="width: 30px"></i>
              </button>
              <button
                style="margin-right: 10px"
                class="btn-action"
                @click="showDeletePositionDialog(data.row.id)"
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
      :visible.sync="editPositionDialogVisible"
      width="50%"
      title="Sửa chức vụ"
      left
    >
      <el-form
        id="formEdit"
        :model="positionEdit"
        :rules="rules"
        ref="positionEdit"
        label-width="200px"
        class="demo-ruleForm"
      >
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <el-form-item label="Nhập tên chức vụ" prop="positionName">
              <el-input
                v-model="positionEdit.positionName"
                name="positionName"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <el-form-item label="Phân quyền" prop="roleId">
              <el-select
                v-model="positionEdit.roleId"
                @change="getData"
                placeholder="Chọn quyền"
              >
                <el-option
                  v-for="item in roles"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
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
                  @click="cancelEditForm('positionEdit')"
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
                  @click="submitEditForm('positionEdit')"
                  >Lưu</el-button
                >
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog
      :visible.sync="createPositionDialogVisible"
      width="50%"
      title="Thêm chức vụ"
      left
    >
      <el-form
        id="formCreate"
        :model="positionCreate"
        :rules="rules"
        ref="positionCreate"
        label-width="200px"
        class="demo-ruleForm"
      >
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <el-form-item label="Nhập tên chức vụ" prop="positionName">
              <el-input
                v-model="positionCreate.positionName"
                name="positionName"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <el-form-item label="Phân quyền" prop="roleId">
              <el-select
                v-model="positionCreate.roleId"
                @change="getData"
                placeholder="Chọn quyền"
              >
                <el-option
                  v-for="item in roles"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
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
                  @click="cancelCreateForm('positionCreate')"
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
                  @click="submitForm('positionCreate')"
                  >Lưu</el-button
                >
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog
      :visible.sync="deletePositionDialogVisible"
      width="30%"
      title="Xóa chức vụ"
      left
    >
      <el-form
        id="formDelete"
        :model="positionDelete"
        :rules="rules"
        ref="positionDelete"
        label-width="200px"
        class="demo-ruleForm"
      >
        <p style="text-align: center">Xác nhận xóa chức vụ</p>
        <p style="text-align: center">{{ positionDelete.positionName }}</p>

        <div class="row" style="margin-top: 70px">
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <el-form-item>
              <el-button
                class="btn btn-success"
                style="width: 100%"
                @click="deletePositionDialogVisible = false"
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
import PositionService from "@/services/position-service";
import moment from "moment";
export default {
  components: {},
  name: "ManagePosition",
  data() {
    return {
      positionId: "",
      roles: [],
      positionCreate: {
        positionName: "",
        roleId: "",
      },
      positionEdit: {
        positionName: "",
        roleId: "",
      },
      positionDelete: {
        positionName: "",
      },
      rules: {
        positionName: [
          {
            required: true,
            message: "Vui lòng nhập tên chức vụ!",
            trigger: "blur",
          },
          {
            min: 1,
            max: 200,
            message: "Tên chức vụ từ 1 đến 200 kí tự!",
            trigger: "blur",
          },
        ],
        roleId: [
          {
            required: true,
            message: "Vui lòng chọn quyền!",
            trigger: "change",
          },
        ],
      },
      positions: [],
      page: 0,
      pageSize: 5,
      search: "",
      date: "",
      totalItems: 0,
      fit: "fill",
      editPositionDialogVisible: false,
      createPositionDialogVisible: false,
      deletePositionDialogVisible: false,
    };
  },

  created() {
    this.getData();
    this.getAllRole();
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          PositionService.save(this.positionCreate)
            .then(() => {
              this.createPositionDialogVisible = false;
              this.$notify.success({
                message: "Tạo chức vụ thành công!",
                title: "Success",
                timer: 2000,
                timerProgressBar: true,
              });
              this.getData();
            })
            .catch((e) => {
              if (e.response.status == 401) {
                this.logout();
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    cancelCreateForm(formName) {
      this.$refs[formName].resetFields();
      this.createPositionDialogVisible = false;
    },

    submitEditForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          PositionService.updatePosition(this.positionId, this.positionEdit)
            .then(() => {
              this.editPositionDialogVisible = false;
              this.$notify.success({
                message: "Sửa chức vụ thành công!",
                title: "Success",
                timer: 2000,
                timerProgressBar: true,
              });
              this.getData();
            })
            .catch((e) => {
              if (e.response.status == 401) {
                this.logout();
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    cancelEditForm(formName) {
      this.$refs[formName].resetFields();
      this.editPositionDialogVisible = false;
    },

    showCreatePositionDialog() {
      this.createPositionDialogVisible = true;
      this.$refs["positionCreate"].resetFields();
      this.editPositionDialogVisible = false;
      this.deletePositionDialogVisible = false;
    },

    showEditPositionDialog(id) {
      this.editPositionDialogVisible = true;
      setTimeout(() => {
        this.$refs["positionEdit"].resetFields();
      }, 5);
      this.createPositionDialogVisible = false;
      this.deletePositionDialogVisible = false;
      this.positionId = id;
      setTimeout(() => {
        PositionService.getPosition(id)
          .then((response) => {
            console.log(response.data);
            this.positionEdit.positionName = response.data.name;
            this.positionEdit.roleId = response.data.role[0].id;
          })
          .catch((e) => {
            console.log(e);
            if (e.response.status == 401) {
              this.logout();
            }
          });
      }, 10);
    },

    showDeletePositionDialog(id) {
      this.editPositionDialogVisible = false;
      this.createPositionDialogVisible = false;
      this.deletePositionDialogVisible = true;
      setTimeout(() => {
        this.$refs["positionDelete"].resetFields();
      }, 5);
      this.positionId = id;
      setTimeout(() => {
        PositionService.getPosition(id)
          .then((response) => {
            this.positionDelete.positionName = response.data.name;
          })
          .catch((e) => {
            console.log(e);
            if (e.response.status == 401) {
              this.logout();
            }
          });
      }, 10);
    },

    acceptDelete() {
      PositionService.deletePosition(this.positionId)
        .then((response) => {
          console.log(response.data);
          this.deletePositionDialogVisible = false;
          this.$notify.success({
            message: "Xóa chức vụ thành công!",
            title: "Success",
            timer: 2000,
            timerProgressBar: true,
          });
          this.getData();
        })
        .catch((e) => {
          if (e.response.status == 401) {
            this.logout();
          } else {
            this.deletePositionDialogVisible = false;
            this.$notify.error({
              message: "Không thể xóa chức vụ này vì đã được sử dụng!",
              title: "Failed",
              timer: 2000,
              timerProgressBar: true,
            });
            this.getData();
          }
          console.log(e.response.status);
        });
    },

    getData() {
      PositionService.getPositions(this.page, this.pageSize, this.search)
        .then((response) => {
          this.positions = response.data.content;
          for (const key in this.positions) {
            if (Object.hasOwnProperty.call(this.positions, key)) {
              this.positions[key].createdDate = moment(
                String(this.positions[key].createdDate)
              ).format("DD/MM/yyyy");
            }
          }
          this.page = response.data.pageable.pageNumber;
          this.totalItems = response.data.totalElements;
        })
        .catch((e) => {
          if (e.response.status == 401) {
            this.logout();
          }
        });
    },

    getAllRole() {
      PositionService.getRoles(1, 30, "")
        .then((response) => {
          console.log(response.data);
          this.roles = response.data.content;
        })
        .catch((e) => {
          console.log(e);
        });
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
.manage-position .el-form-item__label {
  text-align: left;
}
.manage-position .el-form-item__content {
  margin-left: 0px !important;
}

.manage-position .el-form-item {
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
.manage-position .slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.manage-position .loading {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: none;
  align-items: center;
  justify-content: center;
  /* background: rgba(0, 0, 0, 0.479); */
}

.manage-position .loading img {
  width: 25rem;
}

@media only screen and (min-width: 150px) {
  .manage-position .el-col-md-6 {
    width: 108%;
  }

  .manage-position .buttons {
    text-align: left;
  }
}

@media only screen and (min-width: 992px) {
  .manage-position .el-col-md-6 {
    width: 100%;
  }

  .manage-position .buttons {
    text-align: left;
  }
}

@media only screen and (min-width: 1440px) {
  .manage-position .el-col-md-6 {
    width: 23%;
  }

  .manage-position .buttons {
    text-align: right;
  }

  .manage-position .div-buttons {
    float: right;
  }
}

@media only screen and (min-width: 1689px) {
  .manage-position .el-col-md-6 {
    width: 23%;
  }

  .manage-position .buttons {
    text-align: right;
  }

  .manage-position .div-buttons {
    float: right;
  }
}

@media only screen and (min-width: 1920px) {
  .manage-position .el-col-md-6 {
    width: 23%;
  }

  .manage-position .buttons {
    text-align: right;
  }

  .manage-position .div-buttons {
    float: right;
  }
}
</style>