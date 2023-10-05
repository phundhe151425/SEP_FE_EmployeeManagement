<template>
    <div>
        <div style="padding-bottom: 20px">
            <div className="" style="width: 100%; margin: auto">
                <el-row :gutter="20">
                    <el-col :md="6" :lg="6" :xl="6">
                        <div class="grid-content" style="margin-bottom: 20px">
                            <span>Phòng ban</span> &ensp;
                            <el-select
                                    v-model="departmentId"
                                    @change="getData"
                                    placeholder="Chọn Phòng ban"
                            >
                                <el-option value="" label="Tất cả các phòng ban"></el-option>
                                <el-option
                                        v-for="item in departments"
                                        :key="item.department"
                                        :label="item.name"
                                        :value="item.id"
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
                                    placeholder="Tìm theo tên, email"
                                    style="width: 200px; padding: 2px 0"
                            />
                        </div>
                    </el-col>
                    <el-col :md="6" :lg="6" :xl="6" style="margin-bottom: 20px">
                        <div class="grid-content">
                            <span style="">Trạng thái</span> &ensp;
                            <el-select
                                    v-model="status"
                                    @change="getData"
                                    placeholder="Trạng thái"
                            >
                                <el-option value="" label="Tất cả"></el-option>
                                <el-option label="Có hiệu lực" value="1"></el-option>
                                <el-option label="Vô hiệu lực" value="0"></el-option>
                            </el-select>
                        </div>
                    </el-col>

                    <el-col :md="6" :lg="6" :xl="6" class="div-buttons">
                        <div class="grid-content div-buttons">
                            <import-excel
                                    class="text-start buttons btn-import"
                                    header="Thêm nhân viên"
                                    format="1"
                                    @getData="getData"
                                    style="margin-right: 10px"
                            />
                            <el-button
                                    class="buttons btn-add"
                                    type="danger"
                                    style=""
                                    round
                                    @click="showCreateEmployeeDialog"

                            ><i class="el-icon-plus"></i> Thêm nhân viên
                            </el-button>


                            <el-button
                                    class="buttons btn-add"
                                    type="danger"
                                    style=""
                                    @click="exportUsers"
                                    round
                            ><i class="el-icon-plus"></i> Xuất file
                            </el-button>
                        </div>
                    </el-col>
                </el-row>
                <br/>
                <div>
                    <el-table
                            :data="users"
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
                                label="Mã NV"
                                prop="userCode"
                                align="center"
                                width="120px"
                        >
                        </el-table-column
                        >
                        <el-table-column
                                label="Ho và tên"
                                prop="fullName"
                                align="center"
                        ></el-table-column>
                        <el-table-column
                                label="Phòng ban"
                                prop="department.name"
                                align="center"
                        >
                        </el-table-column>
                        <el-table-column
                                label="Ngày vào làm"
                                prop="startWork"
                                align="center"
                        >
                        </el-table-column>
                        <el-table-column
                                label="Email"
                                prop="email"
                                align="center"
                        ></el-table-column>
                        <el-table-column
                                label="Ảnh"
                                v-slot:="data"
                                align="center"
                                width="210px"
                        >
                            <el-image
                                    style="width: 100px; height: 100px"
                                    v-if="data.row.userImage != null"
                                    v-bind:src="`http://localhost:2000/api/file/avatar/` + data.row.userImage"
                                    :fit="fit"
                            ></el-image>
                            <el-image
                                    style="width: 100px; height: 100px"
                                    v-if="data.row.userImage == null"
                                    src="../../../avatar/default.png"
                                    :fit="fit"
                            ></el-image>
                            <!--                            <img  src="../../../avatar/default.png" height="127" width="127"/>-->
                        </el-table-column>
                        <el-table-column
                                prop="position.positionName"
                                label="Chức vụ"
                                width="150px"
                                align="center"
                        >
                        </el-table-column>
                        <el-table-column
                                v-slot:="data"
                                label="Trạng thái"
                                width="150px"
                                align="center"
                        >
                            <button v-if="data.row.status == 1" class="tt1">
                                Có hiệu lực
                            </button>
                            <button v-if="data.row.status == 0" class="tt2">
                                Vô hiệu lực
                            </button>
                        </el-table-column>
                        <el-table-column
                                v-slot:="data"
                                label="Thao tác"
                                width="150px"
                                align="center"
                        >

                            <router-link :to="`/user/${data.row.id}`">
                                <!--            <el-button type="danger" icon="el-icon-edit-outline" circle></el-button>-->
                                <button style="margin-right: 10px" class="btn-action">
                                    <i class="el-icon-edit-outline" style="width: 30px"></i>
                                </button>
                            </router-link>
                            <button
                                    v-if="data.row.status == 1"
                                    class="btn-action">
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

                :visible.sync="createEmployeeDialogVisible"
                width="50%"
                title="Tạo mới Nhân viên"
                left>
            <form id="formCreate">
                <div class="row">
                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                        <span>Nhập họ tên nhân viên<span style="color: red"> *</span></span><br>
                        <el-input v-model="user.fullName" name="fullName" autocomplete="off" maxlength="50"
                                  style="width: 90%"></el-input>
                    </div>
                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                        <span>Mã nhân viên<span style="color: red"> *</span></span><br>
                        <el-input v-model="user.username" name="userCode" autocomplete="off" maxlength="8"
                                  style="width: 90%"></el-input>
                    </div>
                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                        <span>Giới tính<span style="color: red"> *</span></span><br>
                        <el-radio-group v-model="user.gender" name="gender" @change="changeGender()">
                            <el-radio-button value="1" label="1">Nam</el-radio-button>
                            <el-radio-button value="0" label="0">Nữ</el-radio-button>
                        </el-radio-group>
                    </div>
                </div>
                <div class="row" style="margin-top: 20px">
                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                        <span>Nhập địa chỉ<span style="color: red"> *</span></span><br>
                        <el-input v-model="user.address" name="address" autocomplete="off" maxlength="100"
                                  style="width: 90%"></el-input>
                    </div>
                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                        <span>Nhập email nhân viên<span style="color: red"> *</span></span><br>
                        <el-input v-model="user.email" name="email" autocomplete="off" maxlength="50"
                                  style="width: 90%"></el-input>
                    </div>
                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                        <span>Nhập số điện thoại<span style="color: red"> *</span></span><br>
                        <el-input v-model="user.phone" name="phone" autocomplete="off" maxlength="11"
                                  @input="restrictToNumbers"
                                  style="width: 90%"></el-input>
                    </div>
                </div>
                <div class="row" style="margin-top: 20px">
                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                        <span>Nhập ngày sinh<span style="color: red"> *</span></span><br>
                        <el-date-picker v-model="user.birthDay" name="birthDay" autocomplete="off"
                                        format='dd/MM/yyyy'
                                        value-format="dd/MM/yyyy"
                                        placeholder="Chọn ngày" style="width: 90%"></el-date-picker>
                    </div>
                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                        <span>Vị trí<span style="color: red"> *</span></span><br>
                        <el-select v-model="user.positionId" name="positionId" autocomplete="off" style="width: 90%">
                            <!--                            <el-option v-for="item in positions" :key="item.position" :label="item.positionId" :value="item.id"></el-option>-->
                            <el-option
                                    v-for="item in positions"
                                    :key="item.position"
                                    :label="item.positionName"
                                    :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </div>
                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                        <span>Bộ phận<span style="color: red"> *</span></span><br>
                        <el-select v-model="user.departmentId" name="departmentId" autocomplete="off"
                                   @change="this.changeGender"
                                   style="width: 90%">
                            <!--                          <el-option value=""  label="Tất cả các phòng ban"></el-option>-->
                            <el-option
                                    v-for="item in departments"
                                    :key="item.department"
                                    :label="item.name"
                                    :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </div>
                </div>

                <div class="row" style="margin-top: 30px">
                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                        <span>Nhập ảnh nhân viên<span style="color: red"> *</span></span><br>
                        <input
                                id="fileUser"
                                type="file"
                                name="userImage"
                                class="form-control"
                                placeholder="Title"
                                @change="previewFiles($event)"
                                style="width: 90%"
                        />

                        <img alt=""
                             :src=" imageUrl ||'https://www.namepros.com/attachments/empty-png.89209/'"
                             style="width: 90%"/>
                    </div>
                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                        <!--                        <span>Nhập hồ sơ nhân viên<span style="color: red"> *</span></span><br>-->
                        <!--                        &lt;!&ndash;                    <b-form-file multiple :file-name-formatter="formatNames" accept="pdf,doc,docx"></b-form-file>&ndash;&gt;-->
                        <!--                        &lt;!&ndash;                    <div style="border: dotted; width: 90%; height: 80px">&ndash;&gt;-->
                        <!--                        &lt;!&ndash;                        <input type="file" multiple style="width: 90%; height: 80px;display: none">&ndash;&gt;-->
                        <!--                        &lt;!&ndash;                    </div>&ndash;&gt;-->
                        <!--                        <input-->
                        <!--                                type="file"-->
                        <!--                                id="fileInput"-->
                        <!--                                name="contractFile"-->
                        <!--                                ref="fileInput"-->
                        <!--                                style="display: none"-->
                        <!--                                multiple-->
                        <!--                                @change="handleContractFileInputChange"-->
                        <!--                        />-->
                        <!--                        &lt;!&ndash; Sử dụng button để kích hoạt việc chọn tệp &ndash;&gt;-->
                        <!--                        <button @click="triggerFileInput" style="width: 90%; height: 80px">-->
                        <!--                            Chọn tệp-->
                        <!--                        </button>-->
                    </div>
                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                        <div style="position: absolute;bottom: 40px;right: 40px">
                            <!--                        <el-button  @click="createEmployeeDialogVisible = false">Huỷ</el-button>-->
                            <button class="save" @click="sendForm">Thêm</button>
                        </div>

                    </div>
                </div>
            </form>
        </el-dialog>


    </div>
</template>

<script>
import DepartmentService from "@/services/department-service";
import UserService from "@/services/user-service";
import ExcelService from "@/services/excel-service";
import PositionService from "@/services/position-service";

export default {
    components: {},
    name: "ManageUser",
    data() {
        return {
            users: [],
            page: 0,
            pageSize: 5,
            user_code: "",
            search: "",
            departmentId: "",
            status: "",
            date: "",
            totalItems: 0,
            fit: "fill",
            departments: [],
            positions: [],


            createEmployeeDialogVisible: false,
            user: {
                username: '',
                fullName: '',
                gender: 1,
                address: '',
                email: '',
                phone: '',
                birthDay: '',
                positionId: 1,
                departmentId: 1,

            },

            imageUrl: '',
            contractFile: ''
        };
    },
    created() {

        this.getData()
        this.getAllDepartment()
        this.getAllPosition()
    },
    methods: {

        // triggerFileInput() {
        //     // Khi button được nhấp, gọi sự kiện click của input type="file"
        //     this.$refs.fileInput.click();
        // },
        async sendForm() {
            this.createEmployeeDialogVisible = false;
            let form = document.querySelector("#formCreate");
            console.log(14, form.cover.value);
            UserService.save(form).then(() => {
                this.$notify.success({
                    message: "Tạo tài khoản thành công",
                    title: "Success",
                    timer: 2000,
                    timerProgressBar: true,
                });
                this.hideLoading();
                this.getAll();
            });

        },

        getAllDepartment() {
            DepartmentService.getAllDepartment().then((response) => {
                this.departments = response.data
            })
        },
        getAllPosition() {
            console.log(this.gender)
            PositionService.getAllPosition().then((response) => {
                this.positions = response.data
                console.log(this.positions)
            })
        },
        showCreateEmployeeDialog() {
            this.createEmployeeDialogVisible = true;
        },
        changeGender() {
            console.log("123 " + this.user.departmentId)
        },
        getData() {

            // let params;
            //
            // params = {
            //     'page': this.page,
            //     'size': this.pageSize,
            //     'departmentId': this.departmentId,
            //     'search': this.search,
            //     'status': this.status
            //
            // }
            UserService.getData(this.page, this.pageSize, this.departmentId, this.search, this.status).then((response) => {
                this.users = response.data.content;
                console.log("123" + this.users)

                this.page = response.data.pageable.pageNumber;
                this.totalItems = response.data.totalElements;
            })
        },
        exportUsers() {
            const params = {
                'departmentId': this.departmentId,
                'search': this.search,
                'status': this.status
            }
            ExcelService.exportExcelUser(params)
        },
        handlePageChange(value) {
            this.page = value - 1;
            this.getData();
        },
        tableRowClassName({rowIndex}) {
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
        previewFiles(event) {
            const file = event.target.files[0];

            const theReader = new FileReader();
            theReader.onloadend = async () => {
                this.imageUrl = await theReader.result;
            };
            theReader.readAsDataURL(file);
        },
    }
}
</script>

<style scoped>
* {
    font-size: 16px;
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