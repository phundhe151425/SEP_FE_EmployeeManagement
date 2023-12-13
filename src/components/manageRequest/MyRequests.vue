<template>
  <div class="manage-request">
    <h3 class="text-start" style="font-weight: bold">Đề xuất của tôi</h3>
    <hr style="margin-bottom: 2%" />
    <div style="padding-bottom: 20px">
      <div className="" style="width: 100%; margin: auto">
        <!-- <el-row :gutter="20">
        <el-col :md="6" :lg="6" :xl="6">
                  <div class="" style="margin-bottom: 20px">
                    <div><span style="font-weight:bold">Họ và tên: </span> {{ user.name }}</div> 
                    <div><span style="font-weight:bold">Mã nhân viên: </span> {{ user.code }}</div>
                    <div><span style="font-weight:bold">Phòng ban: </span>{{ user.department }}</div>
                  </div>
                </el-col>
       
        </el-row> -->
        <el-row :gutter="20">
          <el-col :md="6" :lg="6" :xl="6" style="margin-bottom: 20px">
            <div class="grid-content">
              <span style="">Từ ngày</span> &ensp;

              <el-date-picker
                id="date"
                type="date"
                :clearable="false"
                v-model="startDate"
                @change="getData"
                name="startDate"
                format="dd/MM/yyyy"
                value-format="yyyy-MM-dd"
                placeholder="Chọn ngày"
                style="width: 100%"
              ></el-date-picker>
            </div>
          </el-col>

          <el-col :md="6" :lg="6" :xl="6" style="margin-bottom: 20px">
            <div class="grid-content">
              <span style="">Đến ngày</span> &ensp;

              <el-date-picker
                type="date"
                v-model="endDate"
                @change="getData"
                :clearable="false"
                name="endDate"
                format="dd/MM/yyyy"
                value-format="yyyy-MM-dd"
                placeholder="Chọn ngày"
                :picker-options="pickerOptionFilterEndDate"
                style="width: 100%"
              ></el-date-picker>
            </div>
          </el-col>
          <el-col :md="6" :lg="6" :xl="6">
            <div class="grid-content" style="margin-bottom: 20px">
              <span>Trạng thái</span> &ensp;
              <el-select
                v-model="status"
                @change="getData"
                placeholder="Chọn trạng thái"
              >
                <el-option value="" label="Tất cả"></el-option>
                <el-option
                  v-for="item in allStatus"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :md="6" :lg="6" :xl="6" class="div-buttons">
            <div class="div-buttons">
              <el-dropdown split-button type="danger">
                Tạo đề xuất
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item, index) in requestCategories"
                    :key="index"
                    @click.native="chooseCategory(item.id)"
                  >
                    {{ item.requestCategoryName }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-col>
        </el-row>

        <br />
        <div>
          <el-table
            :data="requests"
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
            <el-table-column label="Loại đề xuất" v-slot:="data" align="center">
              <router-link
                style="text-decoration: none; color: black; font-weight: bold"
                :to="'/request/' + type + '/' + data.row.id"
              >
                {{ data.row.requestType.requestTypeName }}
              </router-link>
            </el-table-column>
            <el-table-column
              label="Mã Nhân viên"
              prop="user.userCode"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="Nhân viên"
              prop="user.fullName"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="Phòng ban"
              prop="department.name"
              align="center"
            ></el-table-column>
            <el-table-column label="Trạng thái" v-slot:="data" align="center">
              <button v-if="data.row.status == 1" class="tt3">
                Chờ phê duyệt
              </button>
              <button v-if="data.row.status == 2" class="tt1">
                Đã chấp thuận
              </button>
              <button v-if="data.row.status == 3" class="tt2">
                Đã từ chối
              </button>
            </el-table-column>

            <el-table-column label="Ngày tạo" prop="createdDate" align="center">
            </el-table-column>
            <el-table-column
              v-slot:="data"
              label="Thao tác"
              width="150px"
              align="center"
            >
              <!--
                                         <el-button type="danger" icon="el-icon-edit-outline" circle></el-button>-->
              <div>
                <button
                  style="margin-right: 10px"
                  class="btn-action"
                  @click="showAcceptRequestDialog(data.row.id)"
                >
                  <i class="el-icon-view" style="width: 30px"></i>
                </button>
              </div>
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
      :visible.sync="declineRequestDialogVisible"
      width="50%"
      title="Ghi chú"
      left
    >
      <el-form
        id="formCreate"
        :model="requestStatus"
        :rules="noteRules"
        ref="requestStatus"
        label-width="200px"
        class="demo-ruleForm"
      >
        <div class="row" style="margin-top: 15px">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <el-form-item label="Nhập ghi chú" prop="note">
              <el-input
                type="textarea"
                v-model="requestStatus.note"
                name="requestContent"
                autocomplete="off"
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
                  @click="cancelDeclineRequestForm('requestStatus')"
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
                  style="width: 90%"
                  @click="declineRequest('requestStatus')"
                  >Lưu
                </el-button>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
    </el-dialog>

    <!-------------------------------------------------------- Tạo đề xuất --------------------------------------------- -->

       <el-dialog
      :visible.sync="createRequestDialogVisible"
      width="50%"
      title="Tạo đề xuất nghỉ phép"
      left
    >
      <el-form
        id="formCreate"
        v-if="createRequestDialogVisible"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="200px"
        class="demo-ruleForm"
      >
        <div class="row">
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <el-form-item label="Họ và tên" required>
              <el-input
                v-model="name"
                name="name"
                autocomplete="off"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <el-form-item label="Bộ phận" required>
              <el-input
                v-model="department"
                name="department"
                autocomplete="off"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="row" style="margin-top: 5px">
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <small style="color: Orange"
              >Lưu ý: {{ numberDayRemainMess }} ngày!</small
            >
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <el-form-item label="Chọn loại đề xuất" prop="requestTypeId">
              <el-select
                v-model="ruleForm.requestTypeId"
                @change="selectType(ruleForm.requestTypeId, 'ruleForm')"
                placeholder="Chọn loại đề xuất nghỉ"
              >
                <el-option
                  v-for="item in requestTypes"
                  :key="item.id"
                  :label="item.requestTypeName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div v-if="errMess != ''" class="row" style="margin-top: 5px">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <small style="color: red">Cảnh báo: {{ errMess }}</small>
          </div>
        </div>
        <div v-if="isPersonalWork == true">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <el-form-item label="Chọn loại nghỉ" prop="restType" hidden>
                <el-select
                  v-model="ruleForm.restType"
                  @change="selectRestType(ruleForm.restType)"
                  placeholder="Chọn loại nghỉ"
                >
                  <el-option
                    v-for="item in restTypes"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="row" style="margin-top: 15px">
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
                    :clearable="false"
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
                    :clearable="false"
                    :picker-options="pickerOptionEndDate"
                  ></el-date-picker>
                </el-form-item>
              </el-form-item>
            </div>
          </div>
          <div class="row" style="margin-top: 15px" hidden>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <el-form-item label="Thời gian" required>
                <el-form-item prop="startTime">
                  <el-time-picker
                    v-model="ruleForm.startTime"
                    placeholder="Chọn thời gian"
                    :clearable="false"
                  >
                  </el-time-picker>
                </el-form-item>
              </el-form-item>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <el-form-item label="Thời gian" required>
                <el-form-item prop="endTime">
                  <el-time-picker
                    v-model="ruleForm.endTime"
                    placeholder="Chọn thời gian"
                    :clearable="false"
                  >
                  </el-time-picker>
                </el-form-item>
              </el-form-item>
            </div>
          </div>
        </div>
        <div v-else-if="isRest">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <el-form-item label="Chọn loại nghỉ" prop="restType">
                <el-select
                  v-model="ruleForm.restType"
                  @change="selectRestType(ruleForm.restType)"
                  placeholder="Chọn loại nghỉ"
                >
                  <el-option
                    v-for="item in restTypes"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>

          <div v-if="isRestBySlot">
            <div class="row" style="margin-top: 15px">
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <el-form-item label="Chọn ngày nghỉ" required>
                  <el-form-item prop="startDate">
                    <el-date-picker
                      type="date"
                      v-model="ruleForm.startDate"
                      format="dd/MM/yyyy"
                      value-format="yyyy-MM-dd"
                      name="startDate"
                      placeholder="Chọn ngày"
                      style="width: 100%"
                      :clearable="false"
                      @change="setDateTime"
                      :picker-options="pickerOptionStartDate"
                    ></el-date-picker>
                  </el-form-item>
                </el-form-item>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6" hidden>
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
                      :clearable="false"
                      :picker-options="pickerOptionEndDate"
                    ></el-date-picker>
                  </el-form-item>
                </el-form-item>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <el-form-item label="Chọn ca nghỉ" prop="slotId">
                  <el-select
                    v-model="ruleForm.slotId"
                    @change="setDateTime"
                    placeholder="Chọn ca nghỉ"
                  >
                    <el-option
                      v-for="item in slots"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <div class="row" style="margin-top: 15px">
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <el-form-item label="Thời gian bắt đầu" required>
                  <el-form-item prop="startTime">
                    <el-time-picker
                      v-model="ruleForm.startTime"
                      placeholder="Chọn thời gian"
                      readonly=""
                    >
                    </el-time-picker>
                  </el-form-item>
                </el-form-item>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <el-form-item label="Thời gian kết thúc" required>
                  <el-form-item prop="endTime">
                    <el-time-picker
                      v-model="ruleForm.endTime"
                      placeholder="Chọn thời gian"
                      readonly=""
                    >
                    </el-time-picker>
                  </el-form-item>
                </el-form-item>
              </div>
            </div>
          </div>
          <div v-if="isRestByDay">
            <div class="row" style="margin-top: 15px">
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
                      :clearable="false"
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
                      :clearable="false"
                      style="width: 100%"
                      :picker-options="pickerOptionEndDate"
                    ></el-date-picker>
                  </el-form-item>
                </el-form-item>
              </div>

            
            </div>
            <div class="row">
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <el-form-item label="Chọn ca nghỉ" prop="slotId" hidden>
                  <el-select
                    v-model="ruleForm.slotId"
                    placeholder="Chọn ca nghỉ"
                  >
                    <el-option
                      v-for="item in slots"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <div class="row" style="margin-top: 15px" hidden>
               <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <el-form-item label="Thời gian" required>
                  <el-form-item prop="startTime">
                    <el-time-picker
                      v-model="ruleForm.startTime"
                      placeholder="Chọn thời gian"
                      :clearable="false"
                    >
                    </el-time-picker>
                  </el-form-item>
                </el-form-item>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <el-form-item label="Thời gian" required>
                  <el-form-item prop="endTime">
                    <el-time-picker
                      v-model="ruleForm.endTime"
                      placeholder="Chọn thời gian"
                      :clearable="false"
                    >
                    </el-time-picker>
                  </el-form-item>
                </el-form-item>
              </div>
            </div>
          </div>
        </div>

        <div class="row" style="margin-top: 15px">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <el-form-item label="Nhập nội dung" prop="requestContent">
              <el-input
                type="textarea"
                v-model="ruleForm.requestContent"
                name="requestContent"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="row" style="display: flex; justify-content: flex-end">
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2">
            <div style="bottom: 40px">
              <el-form-item>
                <el-button
                  class="btn"
                  type="primary"
                  style="width: 90%; background-color: #ed9696; color: white"
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
                  class="btn"
                  type="primary"
                  style="width: 90%; background-color: #75c4c0; color: white"
                  @click="submitForm('ruleForm')"
                  >Lưu
                </el-button>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog
      :visible.sync="createOTRequestDialogVisible"
      width="50%"
      title="Tạo đề xuất làm thêm giờ"
      left
    >
      <el-form
        id="formCreate"
        :model="ruleForm"
        v-if="createOTRequestDialogVisible"
        :rules="rules"
        ref="ruleForm"
        label-width="200px"
        class="demo-ruleForm"
      >
        <div class="row">
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <el-form-item label="Họ và tên" required>
              <el-input
                v-model="name"
                name="name"
                autocomplete="off"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <el-form-item label="Bộ phận" required>
              <el-input
                v-model="department"
                name="department"
                autocomplete="off"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <el-form-item label="Chọn loại đề xuất" prop="requestTypeId">
              <el-select
                v-model="ruleForm.requestTypeId"
                @change="selectType(ruleForm.requestTypeId, 'ruleForm')"
                placeholder="Chọn loại đề xuất nghỉ"
              >
                <el-option
                  v-for="item in requestTypes"
                  :key="item.id"
                  :label="item.requestTypeName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div v-if="isOT">
          <div class="row" style="margin-top: 15px">
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <el-form-item label="Ngày làm thêm giờ" required>
                <el-form-item prop="startDate">
                  <el-date-picker
                    type="date"
                    v-model="ruleForm.startDate"
                    format="dd/MM/yyyy"
                    value-format="yyyy-MM-dd"
                    name="startDate"
                    placeholder="Chọn ngày"
                    style="width: 100%"
                    :clearable="false"
                    @change="setDateTime"
                    :picker-options="pickerOptionOTBeforeDate"
                  ></el-date-picker>
                </el-form-item>
              </el-form-item>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6" hidden>
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
                  :clearable="false"
                  :picker-options="pickerOptionEndDate"
                ></el-date-picker>
              </el-form-item>
            </el-form-item>
          </div>
          <div v-if="isWarning == true">
            <div class="row" style="margin-top: 5px">
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <small style="color: Orange"
                  >Chú ý: Bạn chưa tạo đơn xin trước cho ngày này!</small
                >
              </div>
            </div>
          </div>
          <div class="row" style="margin-top: 15px">
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <el-form-item label="Thời gian bắt đầu" required>
                <el-form-item prop="startTime">
                  <el-time-picker
                    v-model="ruleForm.startTime"
                    placeholder="Chọn thời gian"
                    :clearable="false"
                  >
                  </el-time-picker>
                </el-form-item>
              </el-form-item>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <el-form-item label="Thời gian kết thúc" required>
                <el-form-item prop="endTime">
                  <el-time-picker
                    v-model="ruleForm.endTime"
                    placeholder="Chọn thời gian"
                    :clearable="false"
                    :picker-options="pickerOptionOTTime"
                  >
                  </el-time-picker>
                </el-form-item>
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="row" style="margin-top: 15px">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <el-form-item label="Nhập nội dung" prop="requestContent">
              <el-input
                type="textarea"
                v-model="ruleForm.requestContent"
                name="requestContent"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="row" style="display: flex; justify-content: flex-end">
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2">
            <div style="bottom: 40px">
              <el-form-item>
                <el-button
                  class="btn"
                  type="primary"
                  style="width: 90%; background-color: #ed9696; color: white"
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
                  class="btn"
                  type="primary"
                  style="width: 90%; background-color: #75c4c0; color: white"
                  @click="submitForm('ruleForm')"
                  >Lưu
                </el-button>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
    </el-dialog>

  <el-dialog
      :visible.sync="createTimeKeepingRequestDialogVisible"
      width="50%"
      title="Tạo đề xuất chấm công"
      left
    >
      <el-form
        id="formCreate"
        :model="ruleForm"
        :rules="rules"
        v-if="createTimeKeepingRequestDialogVisible"
        ref="ruleForm"
        label-width="200px"
        class="demo-ruleForm"
      >
        <div class="row">
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <el-form-item label="Họ và tên" required>
              <el-input
                v-model="name"
                name="name"
                autocomplete="off"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <el-form-item label="Bộ phận" required>
              <el-input
                v-model="department"
                name="department"
                autocomplete="off"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <el-form-item label="Chọn loại đề xuất" prop="requestTypeId">
              <el-select
                v-model="ruleForm.requestTypeId"
                @change="selectType(ruleForm.requestTypeId)"
                placeholder="Chọn loại đề xuất nghỉ"
              >
                <el-option
                  v-for="item in requestTypes"
                  :key="item.id"
                  :label="item.requestTypeName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div v-if="isForgetTimeKeeping">
          <div class="row" style="margin-top: 15px">
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <el-form-item label="Chọn ngày" required>
                <el-form-item prop="startDate">
                  <el-date-picker
                    type="date"
                    v-model="ruleForm.startDate"
                    format="dd/MM/yyyy"
                    value-format="yyyy-MM-dd"
                    name="startDate"
                    placeholder="Chọn ngày"
                    :clearable="false"
                    style="width: 100%"
                    @change="setDateTime"
                  ></el-date-picker>
                </el-form-item>
              </el-form-item>
            </div>
          </div>
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <el-form-item label="Chọn ca" prop="slotId">
                <el-select
                  v-model="ruleForm.slotId"
                  @change="setDateTime"
                  placeholder="Chọn ca"
                >
                  <el-option
                    v-for="item in slots"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="row" style="margin-top: 15px">
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6" hidden>
              <el-form-item label="Chọn ngày kết thúc" required>
                <el-form-item prop="endDate">
                  <el-date-picker
                    type="date"
                    v-model="ruleForm.endDate"
                    name="endDate"
                    format="dd/MM/yyyy"
                    value-format="yyyy-MM-dd"
                    placeholder="Chọn ngày"
                    style="width: 100%"
                    :clearable="false"
                  ></el-date-picker>
                </el-form-item>
              </el-form-item>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <el-form-item label="Thời gian bắt đầu" required>
                <el-form-item prop="startTime">
                  <el-time-picker
                    v-model="ruleForm.startTime"
                    placeholder="Chọn thời gian"
                    readonly=""
                  >
                  </el-time-picker>
                </el-form-item>
              </el-form-item>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <el-form-item label="Thời gian kết thúc" required>
                <el-form-item prop="endTime">
                  <el-time-picker
                    v-model="ruleForm.endTime"
                    placeholder="Chọn thời gian"
                    readonly=""
                  >
                  </el-time-picker>
                </el-form-item>
              </el-form-item>
            </div>
          </div>
        </div>
        <div v-if="isWorkFromHome || isBusinessTravel">
          <div class="row" style="margin-top: 15px">
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <el-form-item label="Chọn ngày bắt đầu" required>
                <el-form-item prop="startDate">
                  <el-date-picker
                    type="date"
                    v-model="ruleForm.startDate"
                    format="dd/MM/yyyy"
                    value-format="yyyy-MM-dd"
                    name="startDate"
                    placeholder="Chọn ngày"
                    style="width: 100%"
                    :clearable="false"
                    :picker-options="pickerOptionStartDate"
                  ></el-date-picker>
                </el-form-item>
              </el-form-item>
            </div>
                 <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <el-form-item label="Chọn ngày kết thúc" required>
                <el-form-item prop="endDate">
                  <el-date-picker
                    type="date"
                    v-model="ruleForm.endDate"
                    name="endDate"
                    format="dd/MM/yyyy"
                    value-format="yyyy-MM-dd"
                    placeholder="Chọn ngày"
                    style="width: 100%"
                    :clearable="false"
                    :picker-options="pickerOptionEndDate"
                  ></el-date-picker>
                </el-form-item>
              </el-form-item>
            </div>
          </div>
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <el-form-item label="Chọn ca nghỉ" prop="slotId" hidden>
                <el-select v-model="ruleForm.slotId" placeholder="Chọn ca nghỉ">
                  <el-option
                    v-for="item in slots"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="row" hidden>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <el-form-item label="Thời gian" required>
                <el-form-item prop="startTime">
                  <el-time-picker
                    v-model="ruleForm.startTime"
                    placeholder="Chọn thời gian"
                    :clearable="false"
                  >
                  </el-time-picker>
                </el-form-item>
              </el-form-item>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <el-form-item label="Thời gian" required>
                <el-form-item prop="endTime">
                  <el-time-picker
                    v-model="ruleForm.endTime"
                    placeholder="Chọn thời gian"
                    :clearable="false"
                  >
                  </el-time-picker>
                </el-form-item>
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="row" style="margin-top: 15px">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <el-form-item label="Nhập nội dung" prop="requestContent">
              <el-input
                type="textarea"
                v-model="ruleForm.requestContent"
                name="requestContent"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="row" style="display: flex; justify-content: flex-end">
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2">
            <div style="bottom: 40px">
              <el-form-item>
                <el-button
                  class="btn"
                  type="primary"
                  style="width: 90%; background-color: #ed9696; color: white"
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
                  class="btn"
                  type="primary"
                  style="width: 90%; background-color: #75c4c0; color: white"
                  @click="submitForm('ruleForm')"
                  >Lưu
                </el-button>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import RequestService from "@/services/request-service";
import DepartmentService from "@/services/department-service";
import WorkingTimeService from "@/services/workingtime-service";
import DataService from "../../services/user-service";
import moment from "moment";

export default {
  components: {},
  name: "ManageHoliday",
  data() {
    var date = new Date();
    var currentYear = date.getFullYear();
    var currentMonth = date.getMonth() + 1;
    var startDate = new Date(currentYear, date.getMonth(), 1);

    const get_day_of_month = (year, month) => {
      return new Date(year, month, 0).getDate();
    };
    var lastDateOfMonth = get_day_of_month(currentYear, currentMonth);

    var endDate = new Date(currentYear, date.getMonth(), lastDateOfMonth);

    var validateEndDate = (rule, value, callback) => {
      if (this.ruleForm.startDate == "" || this.ruleForm.startDate == null) {
        this.ruleForm.endDate = "";
        callback(new Error("Vui lòng nhập ngày bắt đầu!"));
      } else {
        callback();
      }
    };

    var validateStartDate = (rule, value, callback) => {
      if (
        (this.ruleForm.startDate != "" || this.ruleForm.startDate != null) &&
        (this.ruleForm.endDate == "" || this.ruleForm.endDate == null)
      ) {
        this.$refs["ruleForm"].fields
          .find((f) => f.prop == "endDate")
          .resetField();
      } else {
        callback();
      }
    };

    var validateEndTime = (rule, value, callback) => {
      if (
        this.ruleForm.startDate == "" ||
        this.ruleForm.endDate == "" ||
        this.ruleForm.startDate == null ||
        this.ruleForm.endDate == null
      ) {
        this.ruleForm.endTime = "";
        callback(new Error("Vui lòng nhập ngày bắt đầu và ngày kết thúc!"));
      } else if (this.ruleForm.startTime == "") {
        this.ruleForm.endTime = "";
        callback(new Error("Vui lòng nhập thời gian bắt đầu!"));
      } else {
        callback();
      }
    };

    var validateStartTime = (rule, value, callback) => {
      if (
        this.ruleForm.startDate == "" ||
        this.ruleForm.endDate == "" ||
        this.ruleForm.startDate == null ||
        this.ruleForm.endDate == null
      ) {
        this.ruleForm.startTime = "";
        callback(new Error("Vui lòng nhập ngày bắt đầu và ngày kết thúc!"));
      } else if (this.ruleForm.startTime != "" && this.ruleForm.endTime == "") {
        this.$refs["ruleForm"].fields
          .find((f) => f.prop == "endTime")
          .resetField();
      } else {
        callback();
      }
    };

    // var validateNumberRestDay = (rule, value, callback) => {
    //   if (this.ruleForm.numberRestDay < 0.5) {
    //     callback(new Error("Số ngày nghỉ lớn hơn hoặc bằng 0.5!"));
    //   } else {
    //     callback();
    //   }
    // };

    return {
      requestCategoryId: "",
      type: "list",
      departmentOfModerator: "",
      isModerator: false,
      name: "",
      department: "",
      year: currentYear,
      month: currentMonth,
      currentDate: date,
      requests: [],
      requestTypes: [],
      requestCategories: [],
      requestId: "",
      requestTypeId: "",
      status: "",
      departments: [],
      departmentId: "",
      startDate: startDate,
      endDate: endDate,
      isPersonalWork: false,
      isRestByDay: false,
      isRestBySlot: false,
      isRest: false,
      isOT: false,
      isOTBefore: false,
      isOTAfter: false,
      isForgetTimeKeeping: false,
      isWorkFromHome: false,
      isBusinessTravel: false,
      isWarning: false,
      startFullTime: "",
      endFullTime: "",
      numberDayRemainMess: "",
      // numberRestDay: 0,
      user: {
        name: "",
        code: "",
        department: "",
      },
      slotId: "",
      dayOff: "",
      errMess: "",
      slots: [
        {
          id: 1,
          name: "Buổi sáng",
        },
        {
          id: 2,
          name: "Buổi chiều",
        },
      ],
      allStatus: [
        {
          id: 1,
          name: "Chờ phê duyệt",
        },
        {
          id: 2,
          name: "Đã chấp thuận",
        },
        {
          id: 3,
          name: "Đã từ chối",
        },
      ],
      restTypes: [
        { id: 1, name: "Nghỉ theo buổi" },
        { id: 2, name: "Nghỉ theo ngày" },
      ],
      requestStatus: {
        status: "",
        note: "",
      },
      noteRules: {
        note: [
          {
            required: true,
            message: "Vui lòng nhập nọi dung ghi chú!",
            trigger: "blur",
          },
          {
            min: 1,
            max: 255,
            message: "Nội dung ghi chú từ 1 đến 255 kí tự",
            trigger: "blur",
          },
        ],
      },
      ruleForm: {
        slotId: "",
        endDate: "",
        requestTitle: null,
        requestContent: "",
        startDate: "",
        requestTypeId: "",
        startTime: "",
        endTime: "",
        // numberRestDay: "",
        restType: "",
      },
      shift: {
        workingTimeName: "",
        id: "",
        startTime: "",
        endTime: "",
      },

      rules: {
        requestTypeId: [
          {
            required: true,
            message: "Vui lòng chọn loại đề xuất!",
            trigger: "change",
          },
        ],

        restType: [
          {
            required: true,
            message: "Vui lòng chọn loại nghỉ!",
            trigger: "change",
          },
        ],
        requestContent: [
          {
            required: true,
            message: "Vui lòng nhập nội dung!",
            trigger: "blur",
          },
          {
            min: 1,
            max: 255,
            message: "Nội dung từ 1 đến 255 kí tự",
            trigger: "blur",
          },
        ],
        startDate: [
          {
            required: true,
            message: "Vui lòng nhập ngày bắt đầu!",
            trigger: "change",
          },
          { validator: validateStartDate, trigger: "blur" },
        ],
        startTime: [
          {
            required: true,
            message: "Vui lòng nhập thời gian!",
            trigger: "change",
          },
          { validator: validateStartTime, trigger: "blur" },
        ],

        endTime: [
          {
            required: true,
            message: "Vui lòng nhập thời gian!",
            trigger: "change",
          },
          { validator: validateEndTime, trigger: "blur" },
        ],
        endDate: [
          {
            required: true,
            message: "Vui lòng nhập ngày kết thúc!",
            trigger: "change",
          },
          { validator: validateEndDate, trigger: "blur" },
        ],
        slotId: [
          {
            required: true,
            message: "Vui lòng chọn ca!",
            trigger: "change",
          },
        ],
        // numberRestDay: [
        //   {
        //     required: true,
        //     message: "Vui lòng chọn số ngày nghỉ!",
        //     trigger: "blur",
        //   },
        //   { validator: validateNumberRestDay, trigger: "change" },
        // ],
      },
      page: 0,
      pageSize: 10,
      search: "",
      date: "",
      totalItems: 0,
      fit: "fill",
      createRequestDialogVisible: false,
      createOTRequestDialogVisible: false,
      createTimeKeepingRequestDialogVisible: false,
      declineRequestDialogVisible: false,
    };
  },

  created() {
    this.user.name = this.$store.state.auth.user.fullName;
    this.user.code = this.$store.state.auth.user.userCode;
    this.user.department = this.$store.state.auth.user.departmentName;
    this.getData();
    this.getAllDepartment();
    this.getAllRequestCategory();
    this.getWoringTimeFullTime();
    this.name = this.$store.state.auth.user.fullName;
    this.department = this.$store.state.auth.user.departmentName;
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
    pickerOptionFilterEndDate() {
      return {
        disabledDate: this.disableEndDate,
      };
    },
    pickerOptionOTBeforeDate() {
      return {
        disabledDate: this.disableOneDayAgoDate,
      };
    },
    pickerOptionStartTime() {
      return {
        selectableRange: this.rangeStartTime(),
      };
    },
    pickerOptionOTTime() {
      return {
        selectableRange: this.rangeOTTime(),
      };
    },
    pickerOptionOtherTime() {
      return {
        selectableRange: this.rangeOtherTime(),
      };
    },
  },
  methods: {
    getData() {
      this.startDate = moment(String(this.startDate)).format(
        "yyyy-MM-DD 00:00:00"
      );
      this.endDate = moment(String(this.endDate)).format("yyyy-MM-DD 23:59:59");
      if (this.$store.state.auth.user.roles[0] === "ROLE_MODERATOR") {
        this.isModerator = true;
        this.departmentOfModerator = this.$store.state.auth.user.departmentName;
        this.departmentId = this.$store.state.auth.user.departmentId;
      }
      RequestService.getListRequestByUser(
        this.page,
        this.pageSize,
        this.search,
        this.status,
        this.startDate,
        this.endDate
      )
        .then((response) => {
          this.requests = response.data.content;
          for (const key in this.requests) {
            if (Object.hasOwnProperty.call(this.requests, key)) {
              this.requests[key].createdDate = moment(
                String(this.requests[key].createdDate)
              ).format("DD/MM/yyyy");
            }
          }
          this.page = response.data.pageable.pageNumber;
          this.totalItems = response.data.totalElements;
        })
        .catch((e) => {
          console.log(e);
          if (e.response.data.status == 401)
            this.$store.dispatch("auth/logout");
        });
    },

    getUser() {
      DataService.getProfile(this.$store.state.auth.user.id)
        .then((response) => {
          console.log(response.data);
          this.currentUser = response.data;
          this.dayOff = response.data.dayOff;
        })
        .catch((e) => {
          console.log(e);
          if (e.response.data.status == 401)
            this.$store.dispatch("auth/logout");
        });
    },

    getAllDepartment() {
      DepartmentService.getAllDepartment()
        .then((response) => {
          this.departments = response.data;
        })
        .catch((e) => {
          console.log(e);
          if (e.response.data.status == 401)
            this.$store.dispatch("auth/logout");
        });
    },

    getAllRequestCategory() {
      RequestService.getRequestCategories()
        .then((response) => {
          this.requestCategories = response.data.content;
        })
        .catch((e) => {
          console.log(e);
          if (e.response.data.status == 401)
            this.$store.dispatch("auth/logout");
        });
    },

    acceptRequest(id) {
      this.requestStatus.status = 2;
      RequestService.changeStatus(id, this.requestStatus)
        .then(() => {
          this.$notify.success({
            message: "Yêu cầu đã được chấp nhận",
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
    },

    declineRequest(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.declineRequestDialogVisible = false;
          this.requestStatus.status = 3;
          RequestService.changeStatus(this.requestId, this.requestStatus)
            .then(() => {
              this.$notify.success({
                message: "Yêu cầu đã bị từ chối",
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

    submitForm(formName) {
      if (this.isPersonalWork) {
        this.ruleForm.restType = 1;
      }
      if (this.isRestByDay || this.isWorkFromHome || this.isBusinessTravel) {
        this.ruleForm.slotId = 1;
      }
      if (
        this.isPersonalWork ||
        this.isRestByDay ||
        this.isWorkFromHome ||
        this.isBusinessTravel
      ) {
        var subStartTime = this.startFullTime.split(":");
        var startDate = new Date(this.ruleForm.startDate);
        startDate.setHours(
          Number(subStartTime[0]),
          Number(subStartTime[1]),
          Number(subStartTime[2])
        );
        this.ruleForm.startTime = startDate;
        var subEndTime = this.endFullTime.split(":");
        var endDate = new Date(this.ruleForm.endDate);
        endDate.setHours(
          Number(subEndTime[0]),
          Number(subEndTime[1]),
          Number(subEndTime[2])
        );
        this.ruleForm.endTime = endDate;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm.startTime = moment(
            String(this.ruleForm.startTime)
          ).format("HH:mm:ss");
          this.ruleForm.endTime = moment(String(this.ruleForm.endTime)).format(
            "HH:mm:ss"
          );
          this.ruleForm.endDate = moment(String(this.ruleForm.endDate)).format(
            "yyyy-MM-DD"
          );
          var request = {
            endDate: this.ruleForm.endDate,
            requestTitle: "",
            requestContent: this.ruleForm.requestContent,
            startDate: this.ruleForm.startDate,
            requestTypeId: this.ruleForm.requestTypeId,
            startTime: this.ruleForm.startTime,
            endTime: this.ruleForm.endTime,
          };
          RequestService.save(request)
            .then(() => {
              this.createRequestDialogVisible = false;
              this.createOTRequestDialogVisible = false;
              this.createTimeKeepingRequestDialogVisible = false;
              this.$notify.success({
                message: "Tạo đề xuất thành công",
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
              if (
                e.response.data.status == 400 &&
                this.ruleForm.requestTypeId == 1
              ) {
                this.$notify.error({
                  message: "Bạn đã hết xin nghỉ có phép!",
                  title: "Failed",
                  timer: 2000,
                  timerProgressBar: true,
                });
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    showAcceptRequestDialog(id) {
      this.$router.push("/request/" + this.type + "/" + id);
    },

    cancelCreateForm() {
      // this.clearField();
      // this.ruleForm.requestTypeId = "";
      this.createRequestDialogVisible = false;
      this.createOTRequestDialogVisible = false;
      this.createTimeKeepingRequestDialogVisible = false;
    },

    cancelDeclineRequestForm(formName) {
      this.$refs[formName].resetFields();
      this.declineRequestDialogVisible = false;
    },

    chooseCategory(categotyId) {
      RequestService.getRequestTypes(categotyId)
        .then((response) => {
          this.requestTypes = response.data.content;
        })
        .catch((e) => {
          console.log(e);
          if (e.response.data.status == 401)
            this.$store.dispatch("auth/logout");
        });
      this.isOT = false;
      this.isRest = false;
      this.isPersonalWork = false;
      this.isForgetTimeKeeping = false;
      (this.isOTBefore = false),
        (this.isOTAfter = false),
        // this.ruleForm.numberRestDay = 0;
        (this.ruleForm.restType = "");
      this.isWarning = false;
      this.isRestBySlot = false;
      this.isRestByDay = false;
      this.isWorkFromHome = false;
      this.isBusinessTravel = false;
      this.ruleForm.slotId = "";
      this.ruleForm.requestTypeId = "";
      this.errMess = "";
      this.clearField();
      if (categotyId == 1) {
        this.getUser();
        setTimeout(() => {
          this.numberDayRemainMess =
            "Số ngày nghỉ có lương còn lại của bạn là: " + this.dayOff;
        }, 50);
        this.createRequestDialogVisible = true;
        this.createOTRequestDialogVisible = false;
        this.createTimeKeepingRequestDialogVisible = false;
      } else if (categotyId == 2) {
        this.createOTRequestDialogVisible = true;
        this.createRequestDialogVisible = false;
        this.isOT = true;
        this.createTimeKeepingRequestDialogVisible = false;
      } else if (categotyId == 3) {
        this.createTimeKeepingRequestDialogVisible = true;
        this.createRequestDialogVisible = false;
        this.createOTRequestDialogVisible = false;
      }
    },

    showDeclineRequestDialog(id) {
      this.requestId = id;
      this.requestStatus.note = "Đề xuất của bạn bị từ chối!";
      this.declineRequestDialogVisible = true;
      this.createRequestDialogVisible = false;
      this.createOTRequestDialogVisible = false;
      this.createTimeKeepingRequestDialogVisible = false;
    },

    // handleChange() {
    //   this.clearField();
    //   this.ruleForm.slotId = "";
    //   if (this.ruleForm.numberRestDay >= 1) {
    //     this.ruleForm.slotId = 1;
    //     this.isRestBySlot = false;
    //     this.isRestByDay = true;
    //   } else if (
    //     this.ruleForm.numberRestDay < 1 &&
    //     this.ruleForm.numberRestDay > 0
    //   ) {
    //     this.isRestBySlot = true;
    //     this.isRestByDay = false;
    //   } else {
    //     this.isRestBySlot = false;
    //     this.isRestByDay = false;
    //   }
    //   this.resetField();
    // },
    selectRestType(id) {
      this.$refs["ruleForm"].fields
        .find((f) => f.prop == "requestContent")
        .resetField();
      if (id == 1) {
        this.ruleForm.slotId = "";
        this.isRestBySlot = true;
        this.isRestByDay = false;
        this.resetField();
        this.$refs["ruleForm"].fields
          .find((f) => f.prop == "slotId")
          .resetField();
      } else {
        this.isRestBySlot = false;
        this.isRestByDay = true;
        this.resetField();
      }
    },

    selectType(typeId) {
      this.isOTBefore = false;
      this.$refs["ruleForm"].fields
        .find((f) => f.prop == "requestContent")
        .resetField();
      switch (typeId) {
        case 1:
          if (this.dayOff <= 0) {
            this.isRest = false;
            this.isPersonalWork = false;
            this.ruleForm.restType = "";
            this.isRestBySlot = false;
            this.isRestByDay = false;
            this.ruleForm.slotId = "";
            this.errMess =
              "Số ngày nghỉ phép có lương còn lại của bạn là 0 ngày! Vui lòng chọn loại đơn khác!";
          } else {
            this.errMess = "";
            this.isRest = true;
            this.isPersonalWork = false;
            this.isRestBySlot = false;
            this.isRestByDay = false;
            this.ruleForm.slotId = "";
            this.$refs["ruleForm"].fields
              .find((f) => f.prop == "restType")
              .resetField();
            this.resetField();
          }
          break;
        case 2:
          this.errMess = "";
          this.isRest = true;
          this.isPersonalWork = false;
          this.isRestBySlot = false;
          this.isRestByDay = false;
          this.ruleForm.slotId = "";
          this.$refs["ruleForm"].fields
            .find((f) => f.prop == "restType")
            .resetField();
          this.resetField();
          break;
        case 3:
          this.errMess = "";
          this.isPersonalWork = true;
          this.isRest = false;
          this.isRestBySlot = false;
          this.isRestByDay = false;
          this.resetField();
          break;
        case 4:
          this.isOTBefore = true;
          this.isWarning = false;
          this.isOTAfter = false;
          this.resetField();
          break;
        case 5:
          this.isOTAfter = true;
          this.isWarning = false;
          this.isOTBefore = false;
          this.resetField();
          break;
        case 6:
          this.isForgetTimeKeeping = true;
          this.isWorkFromHome = false;
          this.isBusinessTravel = false;
          this.$refs["ruleForm"].fields
            .find((f) => f.prop == "slotId")
            .resetField();
          this.resetField();
          break;
        case 7:
          this.isForgetTimeKeeping = false;
          this.isBusinessTravel = false;
          this.isWorkFromHome = true;
          this.resetField();
          break;
        case 8:
          this.isForgetTimeKeeping = false;
          this.isWorkFromHome = false;
          this.isBusinessTravel = true;
          this.resetField();
          break;
      }
    },

    resetField() {
      this.$refs["ruleForm"].fields
        .find((f) => f.prop == "startDate")
        .resetField();
      this.$refs["ruleForm"].fields
        .find((f) => f.prop == "endDate")
        .resetField();
      this.$refs["ruleForm"].fields
        .find((f) => f.prop == "startTime")
        .resetField();
      this.$refs["ruleForm"].fields
        .find((f) => f.prop == "endTime")
        .resetField();
    },

    clearField() {
      this.ruleForm.startDate = "";
      this.ruleForm.endDate = "";
      this.ruleForm.startTime = "";
      this.ruleForm.endTime = "";
      this.ruleForm.requestContent = "";
    },

    getWoringTimeFullTime() {
      WorkingTimeService.getWorkingTimeById(1)
        .then((response) => {
          this.startFullTime = response.data.startTime;
          this.endFullTime = response.data.endTime;
        })
        .catch((e) => {
          console.log(e);
          if (e.response.data.status == 401)
            this.$store.dispatch("auth/logout");
        });
    },
    getWoringTimeById(id) {
      WorkingTimeService.getWorkingTimeById(id).then((response) => {
        this.shift = response.data;
      });
    },

   getDataByUser(startDate) {
      console.log(startDate)
      RequestService.getListRequestByUserAndStartDate(startDate,0,30)
        .then((response) => {
          this.listRequest = response.data.content;
          console.log(this.listRequest);
          for (const key in this.requests) {
            if (Object.hasOwnProperty.call(this.requests, key)) {
              this.requests[key].createdDate = moment(
                String(this.requests[key].createdDate)
              ).format("DD/MM/yyyy");
            }
          }
        })
        .catch((e) => {
          console.log(e);
          if (e.response.data.status == 401)
            this.$store.dispatch("auth/logout");
        });
    },
    setDateTime() {
      if (
        this.isRestBySlot ||
        this.createOTRequestDialogVisible ||
        this.isForgetTimeKeeping
      ) {
        var date = new Date(this.ruleForm.startDate);
        this.ruleForm.endDate = date;
        var date1 = new Date(this.ruleForm.endDate);
        if (this.isOTAfter == true) {
          
          this.getDataByUser(this.ruleForm.startDate);
          setTimeout(() => {
         
            if (this.listRequest.length > 0) {
              this.isWarning = false;
            } else {
              this.isWarning = true;
            }
          }, 50);
        }
        if (this.ruleForm.slotId == 1) {
          this.getWoringTimeById(2);
          setTimeout(() => {
            console.log(this.shift);
            var startTime = this.shift.startTime;
            var subStartTime = startTime.split(":");
            date.setHours(
              Number(subStartTime[0]),
              Number(subStartTime[1]),
              Number(subStartTime[2])
            );
            var endTime = this.shift.endTime;
            var subEndTime = endTime.split(":");
            date1.setHours(
              Number(subEndTime[0]),
              Number(subEndTime[1]),
              Number(subEndTime[2])
            );
            this.ruleForm.startTime = date;
            this.ruleForm.endTime = date1;
          }, 50);
        } else if (this.ruleForm.slotId == 2) {
          this.getWoringTimeById(3);
          setTimeout(() => {
            console.log(this.shift);
            var startTime = this.shift.startTime;
            var subStartTime = startTime.split(":");
            date.setHours(
              Number(subStartTime[0]),
              Number(subStartTime[1]),
              Number(subStartTime[2])
            );
            var endTime = this.shift.endTime;
            var subEndTime = endTime.split(":");
            date1.setHours(
              Number(subEndTime[0]),
              Number(subEndTime[1]),
              Number(subEndTime[2])
            );
            this.ruleForm.startTime = date;
            this.ruleForm.endTime = date1;
          }, 50);
        }
      }
    },

    disableOneDayAgoStartDate(date) {
      if (this.isForgetTimeKeeping != true) {
        const startWork = new Date();
        startWork.setDate(startWork.getDate() - 1);
        return date < startWork;
      }
    },

    disableOneDayAgoEndDate(date) {
      const endWork = new Date(this.ruleForm.startDate);
      endWork.setDate(endWork.getDate() - 1);
      return date < endWork;
    },

    disableEndDate(date) {
      const startDay = new Date(this.startDate);
      startDay.setDate(startDay.getDate());
      return date < startDay;
    },
    rangeStartTime() {
      return this.startFullTime + " - " + this.endFullTime;
    },

    rangeOTTime() {
      const startTime = new Date(this.ruleForm.startTime);
      var min = startTime.getMinutes();
      startTime.setMinutes(min + 1);
      var timeString = moment(String(startTime)).format("HH:mm:ss");
      return timeString + " - 23:59:59";
    },

    rangeOtherTime() {
      if (this.ruleForm.startDate != "" && this.ruleForm.endDate != "") {
        const startDate = new Date(this.ruleForm.startDate);
        const endDate = new Date(this.ruleForm.endDate);
        var startDateString = moment(String(startDate)).format("DD/MM/yyyy");
        var endDateString = moment(String(endDate)).format("DD/MM/yyyy");
        if (startDateString === endDateString) {
          if (this.ruleForm.startTime != "") {
            const startTime = new Date(this.ruleForm.startTime);
            var min = startTime.getMinutes();
            startTime.setMinutes(min + 1);
            var timeString = moment(String(startTime)).format("HH:mm:ss");
            return timeString + " - " + this.endFullTime;
          }
        }
      }
      return this.startFullTime + " - " + this.endFullTime;
    },

    disableOneDayAgoDate(date) {
      if (this.isOTBefore) {
        const startWork = new Date();
        startWork.setDate(startWork.getDate() - 1);
        return date < startWork;
      }
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

.manage-request .el-date-editor.el-input {
  width: 60% !important;
}

.manage-request .el-form-item__label {
  text-align: left;
}

.manage-request .el-form-item__content {
  margin-left: 0px !important;
}

.manage-request .el-form-item {
  display: flex;
  flex-direction: column;
}

.manage-request .avatar {
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

.manage-request .el-table .tt1 {
  cursor: default;
  color: white;
  background-color: #75c4c0;
  border: none;
  border-radius: 5px;
  padding: 3px 20px;
}

.manage-request .el-table .tt2 {
  cursor: default;
  color: white;
  background-color: #ed9696;
  border: none;
  border-radius: 5px;
  padding: 3px 20px;
}

.manage-request .el-table .tt3 {
  cursor: default;
  color: white;
  background-color: #f8cbad;
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
  .manage-request .el-col-md-6 {
    width: 108%;
  }

  .manage-request .buttons {
    text-align: left;
  }
}

@media only screen and (min-width: 992px) {
  .manage-request .el-col-md-6 {
    width: 100%;
  }

  .manage-request .buttons {
    text-align: left;
  }
}

@media only screen and (min-width: 1440px) {
  .manage-request .el-col-md-6 {
    width: 23%;
  }

  .manage-request .buttons {
    text-align: right;
  }

  .manage-request .div-buttons {
    float: right;
  }
}

@media only screen and (min-width: 1689px) {
  .manage-request .el-col-md-6 {
    width: 23%;
  }

  .manage-request .buttons {
    text-align: right;
  }

  .manage-request .div-buttons {
    float: right;
  }
}

@media only screen and (min-width: 1920px) {
  .manage-request .el-col-md-6 {
    width: 23%;
  }

  .manage-request .buttons {
    text-align: right;
  }

  .manage-request .div-buttons {
    float: right;
  }
}
</style>