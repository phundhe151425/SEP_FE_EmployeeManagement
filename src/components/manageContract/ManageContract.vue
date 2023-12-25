<template>
  <div class="manage-contract">
    <h3 class="text-start" style="font-weight: bold">Quản lý hợp đồng</h3>
    <hr style="margin-bottom: 2%" />
    <div style="padding-bottom: 20px">
      <div className="" style="width: 100%; margin: auto">
        <el-row :gutter="20">
          <el-col :md="6" :lg="6" :xl="6">
            <span style="">Phòng ban</span> &ensp;
            <el-select
              v-model="deptIdSelect"
              placeholder="Chọn một giá trị"
              @change="handleDeptChange"
            >
              <el-option
                v-for="item in deptList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>

          <el-col :md="6" :lg="6" :xl="6" style="margin-bottom: 20px">
            <div class="">
              <span style="">Tìm kiếm</span> &ensp;
              <el-input
                v-model="search"
                @input="handleDeptChange"
                size="medium"
                placeholder="Tìm theo tên"
                style="width: 200px; padding: 2px 0"
              />
            </div>
          </el-col>
          <el-col :md="6" :lg="6" :xl="6" style="margin-bottom: 20px">
            <div class="">
              <span style="">Tìm kiếm</span> &ensp;
              <el-input
                v-model="empId"
                @input="handleDeptChange"
                size="medium"
                placeholder="Tìm theo mã nhân viên"
                style="width: 200px; padding: 2px 0"
              />
            </div>
          </el-col>
          <el-col :md="6" :lg="6" :xl="6" class="div-buttons">
            <div class="grid-content div-buttons">
              <el-button
                class="buttons btn-add"
                type="danger"
                style=""
                round
                @click="showCreateContractDialog"
                ><i class="el-icon-plus"></i> Thêm hợp đồng
              </el-button>
            </div>
          </el-col>
        </el-row>
        <br />
        <div>
          <el-table
            :data="contracts"
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
              align="center"
              width="100px"
              type="index"
            ></el-table-column>

            <el-table-column
              label="Mã nhân viên"
              prop="user.userCode"
              align="center"
            ></el-table-column>

            <el-table-column
              label="Tên nhân viên"
              prop="user.fullName"
              align="center"
            ></el-table-column>

            <el-table-column
              label="Tên phòng ban"
              prop="user.department.name"
              align="center"
            ></el-table-column>

            <el-table-column
              label="Tên hợp đồng"
              prop="contractName"
              align="center"
            ></el-table-column>

            <el-table-column
              label="Ngày bắt đầu"
              prop="startWork"
              align="center"
            ></el-table-column>

            <el-table-column
              label="Ngày kết thúc"
              prop="endWork"
              align="center"
            ></el-table-column>

            <el-table-column label="Hợp đồng" align="center" v-slot:="data">
              <button
                style="margin-right: 10px; background: none"
                class="btn-action"
                @click="downloadFileContract(data.row.fileName)"
              >
                {{ data.row.fileName }}
              </button>
            </el-table-column>

            <el-table-column
              v-slot:="data"
              label="Thao tác"
              width="150px"
              align="center"
            >
              <!-- <button
                                    style="margin-right: 10px"
                                    class="btn-action"
                                    @click="showEditContractDialog(data.row.id)"
                            >
                                <i class="el-icon-edit-outline" style="width: 30px"></i>
                            </button> -->

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
      :visible.sync="editContractDialogVisible"
      width="50%"
      title="Sửa hợp đồng"
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
            <el-form-item label="Nhập tên hợp đồng" prop="contractName">
              <el-input
                v-model="ruleForm.contractName"
                name="contractName"
                autocomplete="off"
                maxlength="50"
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <el-form-item label="Chọn file hợp đồng" prop="contractFile">
              <input
                id="contractFile"
                type="file"
                name="contractFile"
                style="width: 90%"
              />
              <span style="display: block"></span>
              <el-link
                :href="this.beUrl + `api/file/contract/` + contractFile"
                type="warning"
                target="_blank"
              >
                {{ contractFile }}
              </el-link>
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
                  style="width: 100%; background-color: #ed9696; color: white"
                  @click="cancelEditForm('ruleForm')"
                  >Hủy
                </el-button>
              </el-form-item>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2">
            <div style="bottom: 40px">
              <el-form-item>
                <el-button
                  type="primary"
                  style="width: 100%; background-color: #75c4c0; color: white"
                  @click="submitEditForm('ruleForm')"
                  >Lưu
                </el-button>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog
      :visible.sync="createContractDialogVisible"
      width="50%"
      title="Thêm hợp đồng"
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
            <el-form-item label="Nhập tên hợp đồng" prop="contractName">
              <el-input
                v-model="ruleForm.contractName"
                name="contractName"
                autocomplete="off"
                maxlength="50"
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <el-form-item label="Chọn file hợp đồng" prop="contractFile">
              <input type="file" @change="handleFileChange" />
            </el-form-item>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <!-- modal select -->
            <el-form-item label="Chọn phòng ban">
              <el-select
                v-model="deptIdAdd"
                placeholder="Chọn"
                @change="handleDeptChangeAdd"
              >
                <el-option
                  v-for="item in deptList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <!-- mode select -->
            <el-form-item label="Chọn nhân viên" prop="userId">
              <el-select
                v-model="valueSelect"
                placeholder="Chọn"
                @change="handleUserChange"
              >
                <el-option
                  v-for="item in selectedOption"
                  :key="item.id"
                  :label="item.fullName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>

        <div class="row">
          <div class="col-xs-8 col-sm-8 col-md-8 col-lg-8">
            <div class="col-xs-5 col-sm-5 col-md-5 col-lg-5">
              <!-- mode select -->
              <!-- <span
                >Ngày bắt đầu hợp đồng<span style="color: red">*</span></span
              ><br /> -->
              <el-form-item label="Chọn ngày bắt đầu" prop="startWork">
                <el-date-picker
                  id="startWork"
                  v-model="ruleForm.startWork"
                  name="startWork"
                  autocomplete="off"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  :editable="false"
                  placeholder="Chọn ngày"
                  style="width: 90%"
                ></el-date-picker>
              </el-form-item>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-xs-8 col-sm-8 col-md-8 col-lg-8">
            <div class="col-xs-5 col-sm-5 col-md-5 col-lg-5">
              <!-- mode select -->
              <!-- <span
                >Ngày kết thúc hợp đồng<span style="color: red"> *</span></span
              ><br /> -->
              <el-form-item label="Chọn ngày kết thúc" prop="endWork">
                <el-date-picker
                  id="endWork"
                  v-model="ruleForm.endWork"
                  name="endWork"
                  autocomplete="off"
                  format="yyyy-MM-dd"
                  :editable="false"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptionEndDate"
                  placeholder="Chọn ngày"
                  style="width: 90%"
                ></el-date-picker>
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="row" style="display: flex; justify-content: flex-end">
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2">
            <div style="bottom: 40px">
              <el-form-item>
                <el-button
                  class="btn btn-outline-danger"
                  type="primary"
                  style="width: 100%; background-color: #ed9696; color: white"
                  @click="cancelCreateForm('ruleForm')"
                  >Hủy
                </el-button>
              </el-form-item>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2">
            <div style="bottom: 40px">
              <el-form-item>
                <el-button
                  class="btn btn-success"
                  type="primary"
                  style="width: 100%; background-color: #75c4c0; color: white"
                  @click="submitForm()"
                  >Lưu
                </el-button>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog
      :visible.sync="deleteContractDialogVisible"
      width="30%"
      title="Xóa hợp đồng"
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
        <p style="text-align: center">Xác nhận xóa hợp đồng</p>
        <p style="text-align: center">{{ ruleForm.contractName }}</p>
        <div
          class="row"
          style="margin-top: 20px; display: flex; justify-content: center"
        >
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4">
            <el-form-item>
              <el-button
                class="btn"
                style="width: 100%; background-color: #ed9696; color: white"
                @click="deleteContractDialogVisible = false"
                >Huỷ
              </el-button>
            </el-form-item>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4">
            <el-form-item>
              <el-button
                style="width: 100%; background-color: #75c4c0; color: white"
                class="btn"
                @click="acceptDelete()"
                >Xác nhận
              </el-button>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import ContractService from "@/services/contract-service";
import moment from "moment/moment";
import departmentService from "@/services/department-service";

import { BE_URL } from "@/http-common";
export default {
  components: {},
  name: "ManageContract",
  data() {
    //data-show
    return {
      contracts: [], // Dữ liệu hợp đồng
      deptList: [],
      deptIdSelect: "", //o thanh search
      deptIdAdd: "", // o dialog add
      contractId: "",
      page: 0,
      pageSize: 10,
      search: "",
      empId: "",
      date: "",
      totalItems: 0,
      selectedOption: [],
      valueSelect: "",
      beUrl: BE_URL,
      contractFile: "",
      ruleForm: {
        contractName: "",
        contractFile: null,
        userId: "",
        startWork: "",
        endWork: "",
        // Các trường khác của hợp đồng
      },
      rules: {
        contractName: [
          {
            required: true,
            message: "Vui lòng nhập tên hợp đồng",
            trigger: "blur",
          },
        ],
        // contractFile: [
        //   {
        //     required: true,
        //     message: "Vui lòng nhập tên file",
        //     trigger: "change",
        //   },
        // ],
        userId: [
          {
            required: true,
            message: "Vui lòng chọn nhân viên",
            trigger: "blur",
          },
        ],

        startWork: [
          {
            required: true,
            message: "Vui lòng chọn ngày",
            trigger: "blur",
          },
        ],
        endWork: [
          {
            required: true,
            message: "Vui lòng chọn ngày",
            trigger: "blur",
          },
        ],
      },
      editContractDialogVisible: false,
      createContractDialogVisible: false,
      deleteContractDialogVisible: false,
    };
  },
  computed: {
    pickerOptionEndDate() {
      return {
        disabledDate: this.disableOneDayAgoEndDate,
      };
    },
  },
  created() {
    this.getData();
  },
  methods: {
    submitForm() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          // api create
          console.log("123456");
          console.log(this.ruleForm.contractName);
          console.log(this.ruleForm.contractFile);
          console.log(this.ruleForm.userId);
          let dataObject = {};
          dataObject.contractName = this.ruleForm.contractName;
          dataObject.userId = Number(this.ruleForm.userId);
          dataObject.startWork = this.ruleForm.startWork;
          dataObject.endWork = this.ruleForm.endWork;
          ContractService.save(dataObject, this.ruleForm.contractFile)
            .then(() => {
              this.createContractDialogVisible = false;
              this.$notify.success({
                message: "Tạo hợp đồng thành công",
                title: "Thành công",
                timer: 2000,
                timerProgressBar: true,
              });
              this.getData();
              this.ruleForm = {
                contractName: "",
                contractFile: null,
                userId: "",
                startWork: "",
                endWork: "",
              };
              this.contractFile = "";
              this.valueSelect = "";
              this.deptIdAdd = "";
            })
            .catch((e) => {
              console.log(e);
              if (e.response.data.status == 401)
                this.$store.dispatch("auth/logout");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // submitForm(formName) {
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       ContractService.save(this.ruleForm).then(() => {
    //         this.editContractDialogVisible = false;
    //         this.createContractDialogVisible = false;
    //         this.deleteContractDialogVisible = false;
    //         this.$notify.success({
    //           message: "Tạo hop dong thành công",
    //           title: "Success",
    //           timer: 2000,
    //           timerProgressBar: true,
    //         });
    //         this.getData();
    //       });
    //     } else {
    //       console.log("error submit!!");
    //       return false;
    //     }
    //   });
    // },

    cancelCreateForm(formName) {
      this.$refs[formName].resetFields();
      this.createContractDialogVisible = false;
    },

    submitEditForm(formName) {
      // api-update
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let dataObject = {};
          dataObject.contractName = this.ruleForm.contractName;
          dataObject.userId = Number(this.ruleForm.userId);
          ContractService.updateContract(
            this.contractId,
            dataObject,
            this.ruleForm.contractFile
          )
            .then(() => {
              this.createContractDialogVisible = false;
              this.editContractDialogVisible = false;
              this.deleteContractDialogVisible = false;
              this.$notify.success({
                message: "Sửa thành công",
                title: "Success",
                timer: 2000,
                timerProgressBar: true,
              });
              this.getData();
            })
            .catch((e) => {
              console.log(e);
              if (e.response.data.status == 401)
                this.$store.dispatch("auth/logout");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    cancelEditForm(formName) {
      this.$refs[formName].resetFields();
      this.editContractDialogVisible = false;
    },

    showCreateContractDialog() {
      this.getEmployee();
      this.createContractDialogVisible = true;
      this.editContractDialogVisible = false;
      this.deleteContractDialogVisible = false;
      console.log("abc");
      //this.ruleForm = {};
    },

    showEditContractDialog(id) {
      this.editContractDialogVisible = true;
      this.createContractDialogVisible = false;
      this.deleteContractDialogVisible = false;
      this.departmentId = id;
      // api getById
      ContractService.getContractByID(id)
        .then((response) => {
          console.log(response.data.nameContract);
          this.ruleForm.contractName = response.data.nameContract;
          this.contractFile = response.data.fileContract;
          this.ruleForm.userId = response.data.user.id;
          this.contractId = response.data.id;
          console.log(this.ruleForm.userId);
        })
        .catch((e) => {
          console.log(e);
          if (e.response.data.status == 401)
            this.$store.dispatch("auth/logout");
        });
    },

    downloadFileContract(fileName) {
      var link = document.createElement("a");
      link.href = this.beUrl + `api/file/contract/` + fileName;
      // link.download = [[${productFinancial.productTerms}]] // Đặt tên tệp tin tại đây
      document.body.appendChild(link);
      link.click();

      // Hủy đường link và phần tử a sau khi đã tải xuống xong
      link.remove();
    },

    showDeleteDepartmentDialog(id) {
      this.editContractDialogVisible = false;
      this.createContractDialogVisible = false;
      this.deleteContractDialogVisible = true;
      this.contractId = id;

      ContractService.getContractByID(id)
        .then((response) => {
          this.ruleForm.contractName = response.data.nameContract;
        })
        .catch((e) => {
          console.log(e);
          if (e.response.data.status == 401)
            this.$store.dispatch("auth/logout");
        });
    },

    deleteContract(id) {
      this.$swal
        .fire({
          title: "Xoá hợp đồng " + id + "?",
          showDenyButton: true,
          confirmButtonColor: "#ED9696",
          confirmButtonText: "Xoá",
          denyButtonColor: "#75C4C0",
          denyButtonText: "Đóng",
          customClass: {
            actions: "my-actions",
            cancelButton: "order-1 right-gap",
            confirmButton: "order-2",
            denyButton: "order-3",
          },
        })
        .then((result) => {
          if (result.isConfirmed) {
            ContractService.deleteContract(id)
              .then((response) => {
                this.$swal.fire({
                  title: response.data.message,
                  icon: "success",
                  timer: 2000,
                  timerProgressBar: true,
                  toast: true,
                  position: "top-end",
                  showConfirmButton: false,
                  width: "24em",
                });
                this.getData();
              })
              .catch((e) => {
                console.log(e);
                if (e.response.data.status == 401)
                  this.$store.dispatch("auth/logout");
              });
          } else if (result.isDenied) {
            this.$swal.fire({
              title: "Thay đổi thất bại",
              icon: "error",
              timer: 2000,
              timerProgressBar: true,
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              width: "24em",
            });
          }
        });
    },

    showDeleteContractDialog(id) {
      this.editContractDialogVisible = false;
      this.createContractDialogVisible = false;
      this.deleteContractDialogVisible = true;
      this.contractId = id;
      console.log(this.contractId);

      ContractService.deleteContract(id)
        .then((response) => {
          console(response);
          this.$notify.success({
            message: "Xóa thành công",
            title: "Thành công",
            timer: 2000,
            timerProgressBar: true,
          });
          this.getData();
        })
        .catch((e) => {
          console.log(e);
          if (e.response.data.status == 401)
            this.$store.dispatch("auth/logout");
        });
    },

    acceptDelete() {
      ContractService.deleteContract(this.contractId)
        .then((response) => {
          console.log(response.data);
          this.editContractDialogVisible = false;
          this.createContractDialogVisible = false;
          this.deleteContractDialogVisible = false;
          this.$notify.success({
            message: "Xóa thành công",
            title: "Thành công",
            timer: 2000,
            timerProgressBar: true,
          });
          this.getData();
        })
        .catch((e) => {
          console.log(e);
          if (e.response.data.status == 401)
            this.$store.dispatch("auth/logout");
          this.editContractDialogVisible = false;
          this.createContractDialogVisible = false;
          this.deleteContractDialogVisible = false;
          this.$notify.success({
            message: "Xóa thành công!",
            title: "Thành công",
            timer: 2000,
            timerProgressBar: true,
          });
          this.getData();
        });
    },
    getData() {
      // get deptList
      departmentService
        .getAllDepartment()
        .then((response) => {
          this.deptList = [
            {
              id: "",
              name: "Tẩt cả phòng ban",
            },
            ...response.data,
          ];
        })
        .catch((e) => {
          if (e.response.data.status == 401)
            this.$store.dispatch("auth/logout");
        });

      ContractService.getContracts(
        this.page,
        this.pageSize,
        this.search,
        this.deptIdSelect,
        this.empId
      )
        .then((response) => {
          this.contracts = response.data.content;
          for (const key in this.contracts) {
            if (Object.hasOwnProperty.call(this.contracts, key)) {
              this.contracts[key].createdDate = moment(
                String(this.contracts[key].createdDate)
              ).format("DD/MM/yyyy");
            }
          }
          this.page = response.data.number;
          this.totalItems = response.data.totalElements;
        })
        .catch((e) => {
          console.log(e);
          if (e.response.data.status == 401)
            this.$store.dispatch("auth/logout");
        });
    },
    handlePageChange(value) {
      this.page = value - 1;
      this.getData();
    },
    getEmployee() {
      ContractService.getEmployee(this.deptIdAdd).then((response) => {
        console.log(response.data);
        this.selectedOption = response.data;
        console.log(this.selectedOption);
      });
    },
    handleFileChange(event) {
      const fileInput = event.target;
      if (fileInput.files.length > 0) {
        // Lấy tên của file và cập nhật vào ruleForm
        this.ruleForm.contractFile = fileInput.files[0];
      }
    },

    disableOneDayAgoEndDate(date) {
      const endWork = new Date(this.ruleForm.startWork);
      endWork.setDate(endWork.getDate());
      return date < endWork;
    },
    logout() {
      this.$store.dispatch("auth/logout");
      window.location.replace("/login");
      localStorage.removeItem("user");
    },

    handleUserChange() {
      // Cập nhật giá trị userId trong ruleForm khi có sự thay đổi trong el-select
      console.log("Selected user ID:", this.valueSelect);
      this.ruleForm.userId = this.valueSelect;
    }, //handleDeptChange

    handleDeptChange() {
      this.page = 0;
      this.totalItems = 0;
      this.getData();
    },

    handleDeptChangeAdd() {
      this.getEmployee();
    },

    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return "warning-row";
      } else if (rowIndex % 2 === 0) {
        return "success-row";
      }
      return "success-row";
    },
  },
};
</script>

<style>
* {
  font-size: 16px;
}

.manage-contract .el-form-item__label {
  text-align: left;
}

.manage-contract .el-form-item__content {
  margin-left: 0px !important;
}

.manage-contract .el-form-item {
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
