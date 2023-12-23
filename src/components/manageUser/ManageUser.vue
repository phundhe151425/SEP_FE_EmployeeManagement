<template>
  <div>
    <h3 class="text-start" style="font-weight: bold">Quản lý nhân viên</h3>
    <hr style="margin-bottom: 2%"/>
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
                label="Số điên thoại"
                prop="phone"
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
                  v-bind:src="beUrl+ `api/file/avatar/` + data.row.userImage"
                  :fit="fit"
              ></el-image>
              <el-image
                  style="width: 100px; height: 100px"
                  v-if="data.row.userImage == null"
                  src="../../../avatar/default.png"
                  :fit="fit"
              ></el-image>

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

              <!--                            <router-link :to="`/user/${data.row.id}`">-->
              <!--            <el-button type="danger" icon="el-icon-edit-outline" circle></el-button>-->
              <button style="margin-right: 10px" class="btn-action"
                      @click="showEditEmployeeDialog(data.row.id)">
                <i class="el-icon-edit-outline" style="width: 30px"></i>
              </button>
              <!--                            </router-link>-->
              <button
                  v-if="data.row.status == 1 && data.row.id == logInUser.id"
                  class="btn-action"
                  disabled>
                <i class="el-icon-unlock" style="width: 30px"></i>
              </button>
              <button
                  v-if="data.row.status == 0 && data.row.id == logInUser.id"
                  class="btn-action"
                  disabled>
                <i class="el-icon-lock" style="width: 30px"></i>
              </button>
              <button
                  v-if="data.row.status == 1 && data.row.id != logInUser.id"
                  class="btn-action"
                  @click="changeStatus(data.row.id, data.row.userCode, data.row.status)">
                <i class="el-icon-unlock" style="width: 30px"></i>
              </button>
              <button
                  v-if="data.row.status == 0 && data.row.id != logInUser.id"
                  class="btn-action"
                  @click="changeStatus(data.row.id, data.row.userCode, data.row.status)">
                <i class="el-icon-lock" style="width: 30px"></i>
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
        :visible.sync="createEmployeeDialogVisible"
        width="50%"
        title="Tạo mới nhân viên"
        left>
      <form id="formCreate" :style="{ height: user.userImage== '' || user.userImage== null ? '600px' : 'auto'   }">
        <div class="row">
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <span>Nhập họ tên nhân viên<span style="color: red"> *</span></span><br>
            <el-input id="fullName" v-model="user.fullName" name="fullName" autocomplete="off"
                      maxlength="50"
                      :class="{'error-border':errFullName !== null && errFullName !== ''}"
                      @input="clearErrorFullName('fullName')"
                      style="width: 90%;"></el-input>
            <div>
              <small v-if="errFullName !== null" style="color: red">
                {{ errFullName }}
              </small>
            </div>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <span>Mã nhân viên<span style="color: red"> *</span></span><br>
            <el-input id="userCode" v-model="user.userCode" name="userCode" autocomplete="off" maxlength="5"
                      :class="{'error-border':errUserCode !== null && errUserCode !== ''}"
                      @input="clearErrorFullName('userCode')"
                      style="width: 90%">
              <template slot="prepend">FPT_</template>
            </el-input>
            <div>
              <small v-if="errUserCode !== null" style="color: red">
                {{ errUserCode }}
              </small>
            </div>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <span>Giới tính<span style="color: red"> *</span></span><br>
            <el-radio-group id="gender" v-model="user.gender" name="gender"
                            :class="{'error-border':errGender !== null && errGender !== ''}"
                            @change="clearErrorFullName('gender')">
              <el-radio-button value="1" label="1" name="gender">Nam</el-radio-button>
              <el-radio-button value="0" label="0" name="gender">Nữ</el-radio-button>
            </el-radio-group>
            <div>
              <small v-if="errGender !== null" style="color: red">
                {{ errGender }}
              </small>
            </div>
          </div>
        </div>
        <div class="row" style="margin-top: 20px">
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <span>Nhập địa chỉ<span style="color: red"> *</span></span><br>
            <el-input id="address" v-model="user.address" name="address" autocomplete="off" maxlength="100"
                      :class="{'error-border':errAddress !== null && errAddress !== ''}"
                      @input="clearErrorFullName('address')"
                      style="width: 90%"></el-input>
            <div>
              <small v-if="errAddress !== null" style="color: red">
                {{ errAddress }}
              </small>
            </div>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <span>Nhập email nhân viên<span style="color: red"> *</span></span><br>
            <el-input id="email" v-model="user.email" name="email" autocomplete="off" maxlength="50"
                      :class="{'error-border':errEmail !== null && errEmail !== ''}"
                      @input="clearErrorFullName('email')"
                      style="width: 90%"></el-input>
            <div>
              <small v-if="errEmail !== null" style="color: red">
                {{ errEmail }}
              </small>
            </div>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <span>Nhập số điện thoại<span style="color: red"> *</span></span><br>
            <el-input id="phone" v-model="user.phone" name="phone" autocomplete="off" maxlength="11"
                      :class="{'error-border':errPhone !== null && errPhone !== ''}"
                      @input="validateIsNumbers"
                      style="width: 90%"></el-input>

            <div>
              <small v-if="errPhone !== null" style="color: red">
                {{ errPhone }}
              </small>
            </div>
          </div>
        </div>
        <div class="row" style="margin-top: 20px">
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <span>Nhập ngày sinh<span style="color: red"> *</span></span><br>
            <el-date-picker id="birthDay" v-model="user.birthDay" name="birthDay" autocomplete="off"
                            format='yyyy-MM-dd'
                            value-format='yyyy-MM-dd'
                            :editable="false"
                            :class="{'error-border':errBirthDay !== null && errBirthDay !== ''}"
                            @change="clearErrorFullName('birthDay')"
                            placeholder="Chọn ngày" style="width: 90%"></el-date-picker>

            <div>
              <small v-if="errBirthDay !== null" style="color: red">
                {{ errBirthDay }}
              </small>
            </div>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <span>Vị trí<span style="color: red"> *</span></span><br>

            <el-select id="positionId" v-model="user.positionId" name="positionId" autocomplete="off"
                       :class="{'error-border':errPositionId !== null && errPositionId !== ''}"
                       @change="clearErrorFullName('positionId')"
                       style="width: 90%">
              <el-option
                  v-for="item in positions"
                  :key="item.position"
                  :label="item.positionName"
                  :value="item.id"
              ></el-option>
            </el-select>
            <div>
              <small v-if="errPositionId !== null" style="color: red">
                {{ errPositionId }}
              </small>
            </div>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <span>Bộ phận<span style="color: red"> *</span></span><br>
            <el-select id="departmentId" v-model="user.departmentId" name="departmentId" autocomplete="off"
                       :class="{'error-border':errDepartmentId !== null && errDepartmentId !== ''}"
                       @change="clearErrorFullName('departmentId')"
                       style="width: 90%">
              <el-option
                  v-for="item in departments"
                  :key="item.department"
                  :label="item.name"
                  :value="item.id"
              ></el-option>
            </el-select>
            <div>
              <small v-if="errDepartmentId !== null" style="color: red">
                {{ errDepartmentId }}
              </small>
            </div>
          </div>
        </div>
        <div class="row" style="margin-top: 30px">
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <span>Nhập ảnh nhân viên<span style="color: red"> *</span></span><br>
            <input
                id="userImage"
                type="file"
                name="userImage"
                class="form-control"
                placeholder="Title"
                @change="previewFiles($event),clearErrorFullName('userImage')"
                :class="{'error-border':errUserImage !== null && errUserImage !== ''}"
                style="width: 90%"
            />

            <img alt=""
                 :src=" user.userImage ||'https://www.namepros.com/attachments/empty-png.89209/'"
                 style="width: 90%"/>
            <div>
              <small v-if="errUserImage !== null" style="color: red">
                {{ errUserImage }}
              </small>
            </div>
          </div>
          <div class="col-xs-12 col-sm-8 col-md-8 col-lg-8">
            <div class="row">
              <div class="col">
                <span>Hợp đồng<span style="color: red"> *</span></span><br>
                <input id="contractFile" type="file" name="contractFile"
                       :class="{'error-border':errContractFile !== null && errContractFile !== ''}"
                       @change="clearErrorFullName('contractFile')"
                       style="width: 90%"/>
                <div>
                  <small v-if="errContractFile !== null" style="color: red">
                    {{ errContractFile }}
                  </small>
                </div>
              </div>
              <div class="col">
                <span>Tài khoản<span style="color: red"> *</span></span><br>
                <el-input id="username" v-model="user.username" name="username" autocomplete="off"
                          maxlength="50"
                          :class="{'error-border':errUserName !== null && errUserName !== ''}"
                          @change="clearErrorFullName('username')"
                          style="width: 90%"></el-input>

                <div>
                  <small v-if="errUserName !== null" style="color: red">
                    {{ errUserName }}
                  </small>
                </div>
              </div>
              <div class="w-100"></div>
              <div class="col" style="margin-top: 30px">
                <span>Ngày bắt đầu hợp đồng<span style="color: red"> *</span></span><br>
                <el-date-picker id="startWork" v-model="user.startWork" name="startWork"
                                autocomplete="off"
                                :class="{'error-border':errStartWork !== null && errStartWork !== ''}"
                                @change="clearErrorFullName('startWork')"
                                format='yyyy-MM-dd'
                                value-format='yyyy-MM-dd'
                                :editable="false"
                                placeholder="Chọn ngày" style="width: 90%"></el-date-picker>

                <div>
                  <small v-if="errStartWork !== null" style="color: red">
                    {{ errStartWork }}
                  </small>
                </div>
              </div>
              <div class="col" style="margin-top: 30px">
                <span>Ngày kết thúc hợp đồng<span style="color: red"> *</span></span><br>
                <el-date-picker id="endWork" v-model="user.endWork" name="endWork" autocomplete="off"
                                :class="{'error-border':errEndWork !== null && errEndWork !== ''}"
                                @change="clearErrorFullName('endWork')"
                                format='yyyy-MM-dd'
                                :editable="false"
                                value-format='yyyy-MM-dd'
                                :picker-options="pickerOptionsCreate"
                                placeholder="Chọn ngày" style="width: 90%"></el-date-picker>

                <div>
                  <small v-if="errEndWork !== null" style="color: red">
                    {{ errEndWork }}
                  </small>
                </div>
              </div>
            </div>
            <div style="position: absolute;bottom: 40px;right: 40px">
              <!--                        <el-button  @click="createEmployeeDialogVisible = false">Huỷ</el-button>-->
              <button class="save" type="button" @click="sendForm">Thêm</button>
            </div>
          </div>
        </div>
      </form>
    </el-dialog>
    <el-dialog
        :visible.sync="editEmployeeDialogVisible"
        width="50%"
        title="Sửa thông tin nhân viên"
        left>
      <form id="formEdit" :style="{ height: userImageEdit== '' || userImageEdit== null ? '600px' : 'auto'   }">
        <div class="row">
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <span>Nhập họ tên nhân viên<span style="color: red"> *</span></span><br>
            <el-input id="fullNameEdit" v-model="userEdit.fullName" name="fullName" autocomplete="off"
                      maxlength="50"
                      :class="{'error-border':errFullName !== null && errFullName !== ''}"
                      @input="clearErrorFullName('fullName')"
                      style="width: 90%;"></el-input>
            <div>
              <small v-if="errFullName !== null" style="color: red">
                {{ errFullName }}
              </small>
            </div>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <span>Mã nhân viên<span style="color: red"> *</span></span><br>
            <el-input id="userCodeEdit" v-model="userEdit.userCode" name="userCode" autocomplete="off"
                      maxlength="5"
                      :class="{'error-border':errUserCode !== null && errUserCode !== ''}"
                      @input="clearErrorFullName('userCode')"
                      style="width: 90%">
              <template slot="prepend">FPT_</template>
            </el-input>
            <div>
              <small v-if="errUserCode !== null" style="color: red">
                {{ errUserCode }}
              </small>
            </div>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <span>Giới tính<span style="color: red"> *</span></span><br>
            <el-radio-group id="genderEdit" v-model="userEdit.gender" name="gender"
                            :class="{'error-border':errGender !== null && errGender !== ''}"
                            @change="clearErrorFullName('gender')">
              <el-radio-button value="1" label="1" name="gender">Nam</el-radio-button>
              <el-radio-button value="0" label="0" name="gender">Nữ</el-radio-button>
            </el-radio-group>
            <div>
              <small v-if="errGender !== null" style="color: red">
                {{ errGender }}
              </small>
            </div>
          </div>
        </div>
        <div class="row" style="margin-top: 20px">
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <span>Nhập địa chỉ<span style="color: red"> *</span></span><br>
            <el-input id="addressEdit" v-model="userEdit.address" name="address" autocomplete="off"
                      maxlength="100"
                      :class="{'error-border':errAddress !== null && errAddress !== ''}"
                      @input="clearErrorFullName('address')"
                      style="width: 90%"></el-input>
            <div>
              <small v-if="errAddress !== null" style="color: red">
                {{ errAddress }}
              </small>
            </div>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <span>Nhập email nhân viên<span style="color: red"> *</span></span><br>
            <el-input id="emailEdit" v-model="userEdit.email" name="email" autocomplete="off" maxlength="50"
                      :class="{'error-border':errEmail !== null && errEmail !== ''}"
                      @input="clearErrorFullName('email')"
                      style="width: 90%"></el-input>
            <div>
              <small v-if="errEmail !== null" style="color: red">
                {{ errEmail }}
              </small>
            </div>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <span>Nhập số điện thoại<span style="color: red"> *</span></span><br>
            <el-input id="phoneEdit" v-model="userEdit.phone" name="phone" autocomplete="off" maxlength="11"
                      :class="{'error-border':errPhone !== null && errPhone !== ''}"
                      @input="validateIsNumbers,clearErrorFullName('birthDay')"
                      style="width: 90%"></el-input>
            <div>
              <small v-if="errPhone !== null" style="color: red">
                {{ errPhone }}
              </small>
            </div>
          </div>
        </div>
        <div class="row" style="margin-top: 20px">
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <span>Nhập ngày sinh<span style="color: red"> *</span></span><br>
            <el-date-picker id="birthDayEdit" v-model="userEdit.birthDay" name="birthDay" autocomplete="off"
                            format='yyyy-MM-dd'
                            value-format='yyyy-MM-dd'
                            :editable="false"
                            :class="{'error-border':errBirthDay !== null && errBirthDay !== ''}"
                            @change="clearErrorFullName('birthDay')"
                            placeholder="Chọn ngày" style="width: 90%"></el-date-picker>
            <div>
              <small v-if="errBirthDay !== null" style="color: red">
                {{ errBirthDay }}
              </small>
            </div>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <span>Vị trí<span style="color: red"> *</span></span><br>
            <el-select id="positionIdEdit" v-model="positionEditName" name="positionId" autocomplete="off"
                       :class="{'error-border':errPositionId !== null && errPositionId !== ''}"
                       @change="clearErrorFullName('positionId')"
                       style="width: 90%">
              <el-option
                  v-for="item in positions"
                  :key="item.position"
                  :label="item.positionName"
                  :value="item.id"

              ></el-option>
            </el-select>
            <div>
              <small v-if="errPositionId !== null" style="color: red">
                {{ errPositionId }}
              </small>
            </div>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <span>Bộ phận<span style="color: red"> *</span></span><br>
            <el-select id="departmentIdEdit" v-model="this.deparmentEditName" name="departmentId"
                       autocomplete="off"
                       :class="{'error-border':errDepartmentId !== null && errDepartmentId !== ''}"
                       @change="clearErrorFullName('departmentId')"
                       style="width: 90%">
              <el-option
                  v-for="item in departments"
                  :key="item.department"
                  :label="item.name"
                  :value="item.id"
              ></el-option>
            </el-select>
            <div>
              <small v-if="errDepartmentId !== null" style="color: red">
                {{ errDepartmentId }}
              </small>
            </div>
          </div>
        </div>
        <div class="row" style="margin-top: 30px">
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <span>Nhập ảnh nhân viên<span style="color: red"> *</span></span><br>
            <input
                id="userImageEdit"
                type="file"
                name="userImage"
                class="form-control"
                placeholder="Title"
                @change="previewFilesEdit($event),clearErrorFullName('userImage')"
                :class="{'error-border':errUserImage !== null && errUserImage !== ''}"
                style="width: 90%"
            />
            <img alt=""
                 :src="userImageEdit ||'https://www.namepros.com/attachments/empty-png.89209/'"
                 style="width: 90%"/>
            <div>
              <small v-if="errUserImage !== null" style="color: red">
                {{ errUserImage }}
              </small>
            </div>
          </div>
          <div class="col-xs-12 col-sm-8 col-md-8 col-lg-8">
            <div class="row">
              <div class="col">
                <span>Hợp đồng<span style="color: red"> *</span></span><br>
                <input id="contractFileEdit" type="file" name="contractFile"
                       :class="{'error-border':errContractFile !== null && errContractFile !== ''}"
                       @change="clearErrorFullName('contractFile')"
                       style="width: 90%"/>
                <el-link :href="this.beUrl+`api/file/contract/`+contractFileEdit" type="warning"
                         target="_blank">
                  {{ contractNameEdit }}
                </el-link>
                <div>
                  <small v-if="errContractFile !== null" style="color: red">
                    {{ errContractFile }}
                  </small>
                </div>
              </div>
              <div class="col">
                <span>Tài khoản<span style="color: red"> *</span></span><br>
                <el-input id="usernameEdit" v-model="userEdit.username" name="username"
                          autocomplete="off"
                          maxlength="50"
                          :class="{'error-border':errUserName !== null && errUserName !== ''}"
                          @change="clearErrorFullName('username')"
                          style="width: 90%;" disabled></el-input>
                <div>
                  <small v-if="errUserName !== null" style="color: red">
                    {{ errUserName }}
                  </small>
                </div>
              </div>
              <div class="w-100"></div>
              <div class="col" style="margin-top: 30px">
                <span>Ngày bắt đầu hợp đồng<span style="color: red"> *</span></span><br>
                <el-date-picker id="startWorkEdit" v-model="userEdit.startWork" name="startWork"
                                autocomplete="off"
                                :class="{'error-border':errStartWork !== null && errStartWork !== ''}"
                                @change="clearErrorFullName('startWork'), changeStartWorkEdit"
                                format='yyyy-MM-dd'
                                value-format='yyyy-MM-dd'
                                :editable="false"
                                placeholder="Chọn ngày" style="width: 90%"></el-date-picker>
                <div>
                  <small v-if="errStartWork !== null" style="color: red">
                    {{ errStartWork }}
                  </small>
                </div>
              </div>
              <div class="col" style="margin-top: 30px">
                <span>Ngày kết thúc hợp đồng<span style="color: red"> *</span></span><br>
                <el-date-picker id="endWorkEdit" v-model="userEdit.endWork" name="endWork"
                                autocomplete="off"
                                :class="{'error-border':errEndWork !== null && errEndWork !== ''}"
                                @change="clearErrorFullName('endWork')"
                                format='yyyy-MM-dd'
                                :editable="false"
                                value-format='yyyy-MM-dd'
                                :picker-options="pickerOptionsEdit"
                                placeholder="Chọn ngày" style="width: 90%"></el-date-picker>
                <div>
                  <small v-if="errEndWork !== null" style="color: red">
                    {{ errEndWork }}
                  </small>
                </div>
              </div>
            </div>
            <div style="position: absolute;bottom: 40px;right: 40px; margin-top: 50px">
              <!--                        <el-button  @click="createEmployeeDialogVisible = false">Huỷ</el-button>-->
              <button class="save" type="button" @click="editUser">Chỉnh sửa</button>
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
import ContractService from "@/services/contract-service";
import {BE_URL} from "@/http-common";
import {FE_URL} from "@/http-common";
// import User from "@/models/User";

export default {
  components: {},
  name: "ManageUser",
  data() {
    return {
      beUrl: BE_URL,
      feUrl: FE_URL,
      listUser: [],
      logInUser: '',
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
        userCode: '',
        email: '',
        fullName: '',
        gender: 1,
        address: '',
        phone: '',
        startWork: '',
        endWork: '',
        birthDay: '',
        positionId: 1,
        departmentId: 1,
        userImage: '',
        contractFile: ''
      },

      editEmployeeDialogVisible: false,
      userEdit: {},
      deparmentEditName: '',
      positionEditName: '',
      userImageEdit: '',
      contractNameEdit: '',
      contractFileEdit: '',


      errFullName: '',
      errUserCode: '',
      errGender: '',
      errAddress: '',
      errEmail: '',
      errPhone: '',
      errBirthDay: '',
      errPositionId: '',
      errDepartmentId: '',
      errUserImage: '',
      errContractFile: '',
      errUserName: '',
      errStartWork: '',
      errEndWork: '',

      isAuto: false,
    };
  },
  created() {

    this.getData()
    this.getAllDepartment()
    this.getAllPosition()
    this.getUser()
    this.getListUser()
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    pickerOptionsCreate() {
      return {
        disabledDate: this.disableOneDayAgoCreate,
      };
    },
    pickerOptionsEdit() {
      return {
        disabledDate: this.disableOneDayAgoEdit,
      };
    },

  },
  methods: {

    getUser() {
      this.logInUser = this.$store.state.auth.user;
      console.log(this.logInUser.id)
      return this.$store.state.auth.user;
    },
    async sendForm() {
      if (!this.user.fullName) {
        this.errFullName = "Vui lòng nhập họ và tên";
        document.getElementById("fullName").classList.add("error-border")
        return;
      }
      if (!this.user.userCode) {
        this.errUserCode = "Vui lòng nhập mã nhân viên";
        document.getElementById("userCode").classList.add("error-border")
        return;
      }
      if (this.user.gender == '' || this.user.gender == null) {
        this.errGender = "Vui lòng chọn giới tính";
        document.getElementById("gender").classList.add("error-border")
        return;
      }
      if (!this.user.address) {
        this.errAddress = "Vui lòng nhập địa chỉ";
        document.getElementById("address").classList.add("error-border")
        return;
      }
      if (!this.user.email) {
        this.errEmail = "Vui lòng nhập email";
        document.getElementById("email").classList.add("error-border")
        return;
      }

      if (this.user.email) {
        if (!this.isEmailValid(this.user.email)) {
          this.errEmail = "Vui lòng nhập đúng định dạng email";
          document.getElementById("email").classList.add("error-border")
          return;
        }

      }
      if (!this.user.phone) {
        this.errPhone = "Vui lòng nhập số điện thoại";
        document.getElementById("phone").classList.add("error-border")
        return;
      }
      if (!this.user.birthDay) {
        this.errBirthDay = "Vui lòng chọn ngày sinh";
        document.getElementById("birthDay").classList.add("error-border")
        return;
      }
      if (!this.user.positionId) {
        this.errPositionId = "Vui lòng chọn vị trí";
        document.getElementById("positionId").classList.add("error-border")
        return;
      }
      if (!this.user.departmentId) {
        this.errDepartmentId = "Vui lòng chọn phòng ban";
        document.getElementById("departmentId").classList.add("error-border")
        return;
      }
      if (!this.user.userImage) {
        console.log(this.user.userImage)
        this.errUserImage = "Vui lòng chọn ảnh nhân viên";
        document.getElementById("userImage").classList.add("error-border")
        return;
      }
      // else if (!this.user.contractFile) {
      //     console.log(this.user.contractFile)
      //     this.errContractFile = "Vui lòng chọn hợp đồng";
      //     document.getElementById("contractFile").classList.add("error-border")
      //     return;
      // }
      if (!this.user.username) {
        this.errUserName = "Vui lòng nhập tài khoản";
        document.getElementById("username").classList.add("error-border")
        return;
      }
      if (!this.user.startWork) {
        this.errStartWork = "Vui lòng chọn ngày bắt đầu hợp đồng";
        document.getElementById("startWork").classList.add("error-border")
        return;
      }
      if (!this.user.endWork) {
        this.errEndWork = "Vui lòng chọn ngày kết thúc hợp đồng";
        document.getElementById("endWork").classList.add("error-border")
        return;
      }



      for (var i = 0; i < this.departments.length; i++) {
        if (document.getElementById('departmentId').value === this.departments.at(i).name) {
          document.getElementById('departmentId').value = this.departments.at(i).id;
        }
      }
      for (var j = 0; j < this.positions.length; j++) {
        if (document.getElementById('positionId').value === this.positions.at(j).positionName) {
          document.getElementById('positionId').value = this.positions.at(j).id;
        }
      }

      for (var k in this.listUser) {
        var user = this.listUser[k]
        var userCode1 = user.userCode.split('_')[1];
        console.log(userCode1)
        console.log(this.user.userCode)

        if (userCode1 == this.user.userCode) {
          this.errUserCode = "Mã nhân viên đã tồn tại";
          document.getElementById("userCode").classList.add("error-border")
          return;
        }
        if (user.email == this.user.email) {
          this.errEmail = "Email đã tồn tại";
          document.getElementById("email").classList.add("error-border")
          return;
        }
        if (user.username == this.user.username) {
          this.errUserName = "Tài khoản đã tồn tại";
          document.getElementById("username").classList.add("error-border")
          return;
        }
        // if(user.userCode == userCode1)
      }

      let form = document.querySelector("#formCreate");
      UserService.saveUser(form).then(() => {
        this.$notify.success({
          message: "Tạo tài khoản thành công",
          title: "Success",
          timer: 2000,
          timerProgressBar: true,
        });
        this.createEmployeeDialogVisible = false;
        // this.hideLoading();
        this.getData();
      }).catch((e) => {
        console.log(e);
        if (e.response.error == "Tài khoản đã tồn tại!") {
          this.errUserCode = "Tài khoản đã tồn tại!";
          document.getElementById("userCode").classList.add("error-border")
        }
        if (e.response.data.status == 401) this.$store.dispatch("auth/logout");
      });


    },
    async editUser() {
      if (!this.userEdit.fullName) {
        this.errFullName = "Vui lòng nhập họ và tên";
        document.getElementById("fullNameEdit").classList.add("error-border")
        return;
      }
      if (!this.userEdit.userCode) {
        this.errUserCode = "Vui lòng nhập mã nhân viên";
        document.getElementById("userCodeEdit").classList.add("error-border")
        return;
      }
      if (this.userEdit.gender != 0 && this.userEdit.gender != 1) {
        this.errGender = "Vui lòng chọn giới tính";
        document.getElementById("genderEdit").classList.add("error-border")
        return;
      }
      if (!this.userEdit.address) {
        this.errAddress = "Vui lòng nhập địa chỉ";
        document.getElementById("addressEdit").classList.add("error-border")
        return;
      }
      if (!this.userEdit.email) {
        this.errEmail = "Vui lòng nhập email";
        document.getElementById("emailEdit").classList.add("error-border")
        return;
      }

      if (this.userEdit.email) {
        if (!this.isEmailValid(this.userEdit.email)) {
          this.errEmail = "Vui lòng nhập đúng định dạng email";
          document.getElementById("emailEdit").classList.add("error-border")
          return;
        }

      }
      if (!this.userEdit.phone) {
        this.errPhone = "Vui lòng nhập số điện thoại";
        document.getElementById("phoneEdit").classList.add("error-border")
        return;
      }
      if (!this.userEdit.birthDay) {
        this.errBirthDay = "Vui lòng chọn ngày sinh";
        document.getElementById("birthDayEdit").classList.add("error-border")
        return;
      }
      if (!this.positionEditName) {
        console.log(this.positionEditName)
        this.errPositionId = "Vui lòng chọn vị trí";
        document.getElementById("positionIdEdit").classList.add("error-border")
        return;
      }
      if (!this.deparmentEditName) {
        this.errDepartmentId = "Vui lòng chọn phòng ban";
        document.getElementById("departmentIdEdit").classList.add("error-border")
        return;
      }
      if (!this.userEdit.userImage) {
        this.errUserImage = "Vui lòng chọn ảnh nhân viên";
        document.getElementById("userImageEdit").classList.add("error-border")
        return;
      }
      // else if (!this.user.contractFile) {
      //     console.log(this.user.contractFile)
      //     this.errContractFile = "Vui lòng chọn hợp đồng";
      //     document.getElementById("contractFile").classList.add("error-border")
      //     return;
      // }
      if (!this.userEdit.username) {
        this.errUserName = "Vui lòng nhập tài khoản";
        document.getElementById("usernameEdit").classList.add("error-border")
        return;
      }
      if (!this.userEdit.startWork) {
        this.errStartWork = "Vui lòng chọn ngày bắt đầu hợp đồng";
        document.getElementById("startWorkEdit").classList.add("error-border")
        return;
      }
      if (!this.userEdit.endWork) {
        this.errEndWork = "Vui lòng chọn ngày kết thúc hợp đồng";
        document.getElementById("endWorkEdit").classList.add("error-border")
        return;
      }



      for (var i = 0; i < this.departments.length; i++) {
        if (document.getElementById('departmentIdEdit').value === this.departments.at(i).name) {
          document.getElementById('departmentIdEdit').value = this.departments.at(i).id;
        }
      }
      for (var j = 0; j < this.positions.length; j++) {
        if (document.getElementById('positionIdEdit').value === this.positions.at(j).positionName) {
          document.getElementById('positionIdEdit').value = this.positions.at(j).id;
        }
      }

      for (var k in this.listUser) {
        var user = this.listUser[k]
        var userCode1 = user.userCode.split('_')[1];
        console.log(userCode1)
        console.log(this.user.userCode)

        if (userCode1 == this.user.userCode) {
          this.errUserCode = "Mã nhân viên đã tồn tại";
          document.getElementById("userCode").classList.add("error-border")
          return;
        }
        if (user.email == this.user.email) {
          this.errEmail = "Email đã tồn tại";
          document.getElementById("email").classList.add("error-border")
          return;
        }
        if (user.username == this.user.username) {
          this.errUserName = "Tài khoản đã tồn tại";
          document.getElementById("username").classList.add("error-border")
          return;
        }
        // if(user.userCode == userCode1)
      }
      let form = document.querySelector("#formEdit");
      console.log('userId', this.userEdit.id)

      UserService.updateUser(this.userEdit.id, form).then(() => {
        this.$notify.success({
          message: "Sửa tài khoản thành công",
          title: "Success",
          timer: 2000,
          timerProgressBar: true,
        });
        // this.hideLoading();
        this.editEmployeeDialogVisible = false;
        this.getData();
      }).catch((e) => {
        console.log(e);
        if (e.response.data.status == 401) this.$store.dispatch("auth/logout");
      });


    },
    changeStatus(id, userCode, status) {
      if (status == 1) {
        this.$swal
            .fire({
              title: "Khóa mã nhân viên " + userCode + "?",
              showDenyButton: true,
              confirmButtonColor: "#ED9696",
              confirmButtonText: "Khóa",
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
                UserService.changeStatus(id).then((response) => {
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
                }).catch((e) => {
                  console.log(e);
                  if (e.response.data.status == 401) this.$store.dispatch("auth/logout");
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
      } else {
        this.$swal
            .fire({
              title: "Mở mã nhân viên " + userCode + "?",
              showDenyButton: true,
              confirmButtonColor: "#75C4C0",
              confirmButtonText: "Mở",
              denyButtonColor: "#ED9696",
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
                UserService.changeStatus(id).then((response) => {
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
                }).catch((e) => {
                  console.log(e);
                  if (e.response.data.status == 401) this.$store.dispatch("auth/logout");
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
      }
    },
    getAllDepartment() {
      DepartmentService.getAllDepartment()
          .then((response) => {
            this.departments = response.data;
          })
          .catch((e) => {
            console.log(e);
            if (e.response.data.status == 401) this.$store.dispatch("auth/logout");
          });
    },
    getAllPosition() {
      console.log(this.gender)
      PositionService.getAllPosition().then((response) => {
        this.positions = response.data
        // console.log(this.positions)
      }).catch((e) => {
        console.log(e);
        if (e.response.data.status == 401) this.$store.dispatch("auth/logout");
      });
    },
    showCreateEmployeeDialog() {
      this.clearAll()
      this.createEmployeeDialogVisible = true;
    },
    showEditEmployeeDialog(userId) {
      this.clearAll()
      UserService.profile(userId).then(response => {
        this.userEdit = response.data
        // this.codeEdit = this.userEdit.userCode;
        this.userEdit.userCode = String(this.userEdit.userCode.split("_")[1]);
        this.deparmentEditName = this.userEdit.department.name
        this.positionEditName = this.userEdit.position.positionName
        this.userImageEdit = this.userEdit.userImage !== ''
            ? this.beUrl + "api/file/avatar/" + this.userEdit.userImage
            : "https://www.namepros.com/attachments/empty-png.89209/";
        console.log(this.userEdit.department.name)
      }).catch(e => {
        console.log(e);
        if (e.response.data.status == 401) {
          this.$store.dispatch("auth/logout");
        }
      })
      this.getCurrentContractByUserId(userId)
      this.editEmployeeDialogVisible = true;
    },
    getData() {
      UserService.getData(this.page, this.pageSize, this.departmentId, this.search, this.status).then((response) => {
        this.users = response.data.content;
        this.page = response.data.pageable.pageNumber;
        this.totalItems = response.data.totalElements;
      }).catch((e) => {
        console.log(e);
        if (e.response.data.status == 401) this.$store.dispatch("auth/logout");
      });
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
    getCurrentContractByUserId(userId) {
      ContractService.getCurrentContractByUserId(userId).then(response => {
        this.contractFileEdit = response.data.fileName
        this.contractNameEdit = response.data.contractName
        console.log(this.contractFileEdit)
      }).catch((e) => {
        console.log(e);
        if (e.response.data.status == 401) this.$store.dispatch("auth/logout");
      });
    },
    getListUser() {
      UserService.getAll().then(res => {
        this.listUser = res.data
        console.log(this.listUser)


      })
    },
    previewFiles(event) {
      const file = event.target.files[0];

      const theReader = new FileReader();
      theReader.onloadend = async () => {
        this.user.userImage = await theReader.result;
      };
      theReader.readAsDataURL(file);
      // this.clearErrorFullName('userImage')
    },
    previewFilesEdit(event) {
      const file = event.target.files[0];
      this.isAuto = true;
      const theReader = new FileReader();
      theReader.onloadend = async () => {
        this.userImageEdit = await theReader.result;
      };
      theReader.readAsDataURL(file);


      // const file = event.target.files[0];
      //
      // // Tạo một FileReader instance
      // const theReader = new FileReader();
      //
      // // Define the onload event handler for the FileReader
      // theReader.onload = async () => {
      //   // Tạo một HTMLImageElement để tải hình ảnh
      //   const img = new Image();
      //   img.src = theReader.result;
      //
      //   // Đợi cho hình ảnh được tải hoàn tất
      //   img.onload = async () => {
      //     // Định dạng và chỉnh kích thước hình ảnh
      //     const resizedImageDataUrl = await this.resizeImage(img, 200, 200);
      //
      //     // Set the result to the userImageEdit property
      //     this.userImageEdit = resizedImageDataUrl;
      //   };
      // };
      //
      // // Đọc file đã chọn dưới dạng data URL
      // theReader.readAsDataURL(file);
    },

    async resizeImage(img, maxWidth, maxHeight) {
      // Tính toán kích thước mới dựa trên maxWidth và maxHeight
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      // Tạo một canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Đặt kích thước của canvas
      canvas.width = width;
      canvas.height = height;

      // Vẽ hình ảnh trên canvas với kích thước mới
      ctx.drawImage(img, 0, 0, width, height);

      // Chuyển đổi nội dung của canvas thành base64 data URL
      const resizedImageDataUrl = canvas.toDataURL();

      return resizedImageDataUrl;
    },
    disableOneDayAgoCreate(date) {
      const startWork = new Date(this.user.startWork)
      startWork.setDate(startWork.getDate())
      return date < startWork;
    },
    disableOneDayAgoEdit(date) {
      const startWorkEdit = new Date(this.userEdit.startWork)
      startWorkEdit.setDate(startWorkEdit.getDate())
      return date < startWorkEdit;
    },
    validateIsNumbers() {
      this.clearErrorFullName('phone');
      this.user.phone = this.user.phone.replace(/[^0-9]/g, '');
      this.userEdit.phone = this.userEdit.phone.replace(/[^0-9]/g, '');
      if (this.user.phone != '' || this.userEdit.phone != '') {
        this.clearErrorFullName('phone');
      }
    },
    isEmailValid(email) {
      // Biểu thức chính quy kiểm tra địa chỉ email
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      return emailRegex.test(email);
    },
    clearErrorFullName(input) {
      console.log(input)
      if (input == 'fullName') {
        this.errFullName = '';
      } else if (input == 'userCode') {
        this.errUserCode = '';
      } else if (input == 'gender') {
        this.errGender = '';
      } else if (input == 'address') {
        this.errAddress = '';
      } else if (input == 'email') {
        this.errEmail = '';
      } else if (input == 'phone') {
        this.errPhone = '';
      } else if (input == 'birthDay') {
        this.errBirthDay = '';
      } else if (input == 'positionId') {
        this.errPositionId = '';
      } else if (input == 'departmentId') {
        this.errDepartmentId = '';
      } else if (input == 'userImage') {
        this.errUserImage = '';
      } else if (input == 'contractFile') {
        this.errContractFile = '';
      } else if (input == 'username') {
        this.errUserName = '';
      } else if (input == 'startWork') {
        this.errStartWork = '';
      } else if (input == 'endWork') {
        this.errEndWork = '';
      }
    },
    clearAll() {
      // this.user = {
      //   username: '',
      //   userCode: '',
      //   email: '',
      //   fullName: '',
      //   gender: 1,
      //   address: '',
      //   phone: '',
      //   startWork: '',
      //   endWork: '',
      //   birthDay: '',
      //   positionId: 1,
      //   departmentId: 1,
      //   userImage: '',
      //   contractFile: ''
      // }

      this.errFullName = ''
      this.errUserCode = ''
      this.errGender = ''
      this.errAddress = ''
      this.errEmail = ''
      this.errPhone = ''
      this.errBirthDay = ''
      this.errPositionId = ''
      this.errDepartmentId = ''
      this.errUserImage = ''
      this.errContractFile = ''
      this.errUserName = ''
      this.errStartWork = ''
      this.errEndWork = ''
    },

  },

}
</script>

<style scoped>


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

.error-messages {
  color: red;
  margin-top: 10px;
}

.error-border {
  border: 1px solid red;
  border-radius: 5px
}

input[type="file"]::file-selector-button {
  border: 2px solid #6c5ce7;
  padding: 0.2em 0.4em;
  border-radius: 0.2em;
  /*background-color: #a29bfe;*/
  transition: 1s;
}

input[type="file"]::file-selector-button:hover {
  border: 2px solid #00cec9;
  cursor: pointer;
}

.el-dialog__body {
  height: 1000px !important;
}
</style>