<template>
  <div class="manage-request">
    <h3>Quản lý đề xuất</h3>
    <hr style="margin-bottom: 5%" />
    <div style="padding-bottom: 20px">
      <div className="" style="width: 100%; margin: auto">
        <el-row :gutter="20">
          <el-col :md="6" :lg="6" :xl="6" style="margin-bottom: 20px">
            <div class="grid-content">
              <span style="">Từ ngày</span> &ensp;

              <el-date-picker
                id="date"
                type="date"
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
                name="endDate"
                format="dd/MM/yyyy"
                value-format="yyyy-MM-dd"
                placeholder="Chọn ngày"
                style="width: 100%"
              ></el-date-picker>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="6" :lg="6" :xl="6" v-if="isModerator == false">
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

          <el-col :md="6" :lg="6" :xl="6" v-else>
            <div class="grid-content" style="margin-bottom: 20px">
              <span>Phòng ban</span> &ensp;
              <span>{{ departmentOfModerator }}</span>
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
          <el-col :md="6" :lg="6" :xl="6">
            <div class="grid-content" style="margin-bottom: 20px">
              <span>Tạo đề xuất</span> &ensp;
              <el-select
                v-model="requestCategoryId"
                @change="showCreateRequestDialog(requestCategoryId)"
                placeholder="Chọn mục đề xuất nghỉ"
              >
                <el-option
                  v-for="item in requestCategories"
                  :key="item.id"
                  :label="item.requestCategoryName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </div>
          </el-col>
          <!-- <el-col :md="6" :lg="6" :xl="6">
            <span>Tạo đề xuất</span> &ensp;
            <ul class="list-group">
              <li
                class="list-group-item"
                v-for="(requestCategory, index) in requestCategories"
                :key="index"
                @click="setActiveTutorial(tutorial, index)"
              >
                {{ tutorial.productName }}
              </li>
            </ul>
          </el-col> -->

          <!-- <el-col :md="6" :lg="6" :xl="6" class="div-buttons">
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
                @click="showCreateRequestDialog"
                ><i class="el-icon-plus"></i> Tạo đề xuất
              </el-button>
            </div>
          </el-col> -->
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
            <el-table-column label="Đề xuất" v-slot:="data" align="center">
              <router-link
                style="text-decoration: none; color: black; font-weight: bold"
                :to="'/request/' + type + '/' + data.row.id"
              >
                {{ data.row.requestTitle }}</router-link
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
              <div v-if="data.row.status == 1">
                <button
                  style="margin-right: 10px"
                  class="btn-action"
                  @click="showAcceptRequestDialog(data.row.id)"
                >
                  <i class="el-icon-check" style="width: 30px"></i>
                </button>
                <button
                  style="margin-right: 10px"
                  class="btn-action"
                  @click="showDeclineRequestDialog(data.row.id)"
                >
                  <i class="el-icon-close" style="width: 30px"></i>
                </button>
              </div>
              <div v-else>
                <button
                  style="margin-right: 10px"
                  class="btn-action"
                  @click="showAcceptRequestDialog(data.row.id)"
                  disabled
                >
                  <i class="el-icon-check" style="width: 30px"></i>
                </button>
                <button
                  style="margin-right: 10px"
                  class="btn-action"
                  @click="showDeclineRequestDialog(data.row.id)"
                  disabled
                >
                  <i class="el-icon-close" style="width: 30px"></i>
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
      :visible.sync="acceptRequestDialogVisible"
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
                  @click="cancelEditForm('requestStatus')"
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
                  @click="acceptRequest('requestStatus')"
                  >Lưu</el-button
                >
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
    </el-dialog>

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
                  @click="cancelDeclineRequestForm('requestStatus')"
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
                  @click="declineRequest('requestStatus')"
                  >Lưu</el-button
                >
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
                maxlength="50"
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
                maxlength="50"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="row" style="margin-top: 15px">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <el-form-item label="Nhập tiêu đề" prop="requestTitle" ref="title">
              <el-input
                v-model="ruleForm.requestTitle"
                name="requestTitle"
                autocomplete="off"
                maxlength="50"
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
        <div v-if="isPersonalWork == true">
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
                    @change="setDateTime"
                    clearable="false"
                  ></el-date-picker>
                </el-form-item>
              </el-form-item>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <el-form-item label="Thời gian" required>
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
          </div>
          <div class="row" style="margin-top: 15px">
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
                    readonly=""
                  ></el-date-picker>
                </el-form-item>
              </el-form-item>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <el-form-item label="Thời gian" required>
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
        <div v-else-if="isRest == true">
          <div class="row" style="margin-top: 15px">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <el-form-item label="Nhập số ngày nghỉ" prop="numberRestDay">
                <el-input-number
                  v-model="numberRestDay"
                  controls-position="right"
                  @change="handleChange('ruleForm')"
                  :step="0.5"
                  :min="0"
                ></el-input-number>
              </el-form-item>
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
                      style="width: 100%"
                    ></el-date-picker>
                  </el-form-item>
                </el-form-item>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <el-form-item label="Thời gian" required>
                  <el-form-item prop="startTime">
                    <el-time-picker
                      v-model="ruleForm.startTime"
                      placeholder="Chọn thời gian"
                    >
                    </el-time-picker>
                  </el-form-item>
                </el-form-item>
              </div>
            </div>
            <div class="row" style="margin-top: 15px">
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <el-form-item label="Nghỉ đến">
                  <el-form-item prop="endDate">
                    <el-date-picker
                      type="date"
                      v-model="ruleForm.endDate"
                      name="endDate"
                      format="dd/MM/yyyy"
                      value-format="yyyy-MM-dd"
                      placeholder="Chọn ngày"
                      style="width: 100%"
                    ></el-date-picker>
                  </el-form-item>
                </el-form-item>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <el-form-item label="Thời gian" required>
                  <el-form-item prop="endTime">
                    <el-time-picker
                      v-model="ruleForm.endTime"
                      placeholder="Chọn thời gian"
                    >
                    </el-time-picker>
                  </el-form-item>
                </el-form-item>
              </div>
            </div>
          </div>

          <div v-else-if="isRestBySlot">
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
                      @change="setDateTime"
                      clearable="false"
                    ></el-date-picker>
                  </el-form-item>
                </el-form-item>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <el-form-item label="Nghỉ đến" required hidden>
                  <el-form-item prop="endDate">
                    <el-date-picker
                      type="date"
                      v-model="ruleForm.endDate"
                      name="endDate"
                      format="dd/MM/yyyy"
                      value-format="yyyy-MM-dd"
                      placeholder="Chọn ngày"
                      style="width: 100%"
                      readonly=""
                    ></el-date-picker>
                  </el-form-item>
                </el-form-item>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <el-form-item label="Chọn ca nghỉ" prop="slotId">
                  <el-select
                    v-model="slotId"
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
        </div>

        <div class="row" style="margin-top: 15px">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <el-form-item label="Nhập nội dung" prop="requestContent">
              <el-input
                type="textarea"
                v-model="ruleForm.requestContent"
                name="requestContent"
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
      :visible.sync="createOTRequestDialogVisible"
      width="50%"
      title="Tạo đề xuất làm thêm giờ"
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
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <el-form-item label="Họ và tên" required>
              <el-input
                v-model="name"
                name="name"
                autocomplete="off"
                maxlength="50"
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
                maxlength="50"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="row" style="margin-top: 15px">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <el-form-item label="Nhập tiêu đề" prop="requestTitle" ref="title">
              <el-input
                v-model="ruleForm.requestTitle"
                name="requestTitle"
                autocomplete="off"
                maxlength="50"
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
                  @change="setDateTime"
                  clearable="false"
                ></el-date-picker>
              </el-form-item>
            </el-form-item>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <el-form-item label="Nghỉ đến" required hidden>
              <el-form-item prop="endDate">
                <el-date-picker
                  type="date"
                  v-model="ruleForm.endDate"
                  name="endDate"
                  format="dd/MM/yyyy"
                  value-format="yyyy-MM-dd"
                  placeholder="Chọn ngày"
                  style="width: 100%"
                  readonly=""
                ></el-date-picker>
              </el-form-item>
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
                >
                </el-time-picker>
              </el-form-item>
            </el-form-item>
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
      :visible.sync="createTimeKeepingRequestDialogVisible"
      width="50%"
      title="Tạo đề xuất chấm công"
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
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <el-form-item label="Họ và tên" required>
              <el-input
                v-model="name"
                name="name"
                autocomplete="off"
                maxlength="50"
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
                maxlength="50"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="row" style="margin-top: 15px">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <el-form-item label="Nhập tiêu đề" prop="requestTitle" ref="title">
              <el-input
                v-model="ruleForm.requestTitle"
                name="requestTitle"
                autocomplete="off"
                maxlength="50"
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
                    style="width: 100%"
                    @change="setDateTime"
                    clearable="false"
                  ></el-date-picker>
                </el-form-item>
              </el-form-item>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <el-form-item label="Nghỉ đến" required hidden>
                <el-form-item prop="endDate">
                  <el-date-picker
                    type="date"
                    v-model="ruleForm.endDate"
                    name="endDate"
                    format="dd/MM/yyyy"
                    value-format="yyyy-MM-dd"
                    placeholder="Chọn ngày"
                    style="width: 100%"
                    readonly=""
                  ></el-date-picker>
                </el-form-item>
              </el-form-item>
            </div>
          </div>
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <el-form-item label="Chọn ca" prop="slotId">
                <el-select
                  v-model="slotId"
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
                    @change="setDateTime"
                    clearable="false"
                  ></el-date-picker>
                </el-form-item>
              </el-form-item>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <el-form-item label="Chọn ca" prop="slotIdStart" required>
                <el-select
                  v-model="slotIdStart"
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
          <div class="row">
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
                  ></el-date-picker>
                </el-form-item>
              </el-form-item>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <el-form-item label="Chọn ca" prop="slotIdEnd" required>
                <el-select
                  v-model="slotIdEnd"
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
  </div>
</template>

<script>
import RequestService from "@/services/request-service";
import DepartmentService from "@/services/department-service";
import moment from "moment";
export default {
  components: {},
  name: "ManageHoliday",
  data() {
    var date = new Date();
    var currentYear = date.getFullYear();
    var currentMonth = date.getMonth();
    var startDate = new Date(currentYear, currentMonth, 1);

    const get_day_of_month = (year, month) => {
      return new Date(year, month, 0).getDate();
    };
    var lastDateOfMonth = get_day_of_month(currentYear, currentMonth);

    var endDate = new Date(currentYear, currentMonth, lastDateOfMonth + 1);

    // var validateEndDate = (rule, value, callback) => {
    //   if (value < this.ruleForm.startDate) {
    //     callback(
    //       new Error("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu!")
    //     );
    //   } else {
    //     callback();
    //   }
    // };

    // var validateStartDate = (rule, value, callback) => {
    //   var startHolidayDate = new Date(value);
    //   if (startHolidayDate < date) {
    //     callback(
    //       new Error("Vui lòng không chọn ngày hiện tại và ngày đã qua!")
    //     );
    //   } else {
    //     callback();
    //   }
    // };

    return {
      requestCategoryId: "",
      type: "manage",
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
      status: 0,
      departments: [],
      departmentId: "",
      startDate: startDate,
      endDate: endDate,
      isPersonalWork: false,
      isRestByDay: false,
      isRestBySlot: false,
      isRest: false,
      isForgetTimeKeeping: false,
      isWorkFromHome: false,
      isBusinessTravel: false,
      numberRestDay: 0,
      slotIdStart: "",
      slotIdEnd: "",
      slotId: "",
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
          id: 0,
          name: "Tất cả",
        },
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
            min: 3,
            max: 255,
            message: "Nội dung ghi chú từ 3 đến 255 kí tự",
            trigger: "blur",
          },
        ],
      },
      ruleForm: {
        endDate: "",
        requestTitle: "",
        requestContent: "",
        startDate: "",
        requestTypeId: "",
        startTime: "",
        endTime: "",
      },
      rules: {
        requestTitle: [
          {
            required: true,
            message: "Vui lòng nhập tên tiêu đề!",
            trigger: "blur",
          },
          {
            min: 3,
            max: 100,
            message: "Tên tiêu đề từ 3 đến 100 kí tự",
            trigger: "blur",
          },
        ],
        requestTypeId: [
          {
            required: true,
            message: "Vui lòng chọn loại đề xuất!",
            trigger: "blur",
          },
        ],
        requestContent: [
          {
            required: true,
            message: "Vui lòng nhập nọi dung!",
            trigger: "blur",
          },
          {
            min: 3,
            max: 255,
            message: "Nội dung từ 3 đến 255 kí tự",
            trigger: "blur",
          },
        ],
        startDate: [
          {
            required: true,
            message: "Vui lòng nhập ngày bắt đầu nghỉ!",
            trigger: "blur",
          },
          // { validator: validateStartDate, trigger: "blur" },
        ],
        startTime: [
          {
            required: true,
            message: "Vui lòng nhập thời gian!",
            trigger: "blur",
          },
        ],

        endTime: [
          {
            required: true,
            message: "Vui lòng nhập thời gian!",
            trigger: "blur",
          },
        ],
        endDate: [
          {
            required: true,
            message: "Vui lòng nhập ngày kết thúc nghỉ!",
            trigger: "blur",
          },
          // { validator: validateEndDate, trigger: "blur" },
        ],
      },
      page: 0,
      pageSize: 5,
      search: "",
      date: "",
      totalItems: 0,
      fit: "fill",
      acceptRequestDialogVisible: false,
      createRequestDialogVisible: false,
      createOTRequestDialogVisible: false,
      createTimeKeepingRequestDialogVisible: false,
      declineRequestDialogVisible: false,
    };
  },

  created() {
    this.startDate = moment(String(this.startDate)).format("yyyy-MM-DD");
    this.endDate = moment(String(this.endDate)).format("yyyy-MM-DD");
    this.getData();
    this.getAllDepartment();
    // this.getAllRequestType();
    this.getAllRequestCategory();
    this.name = this.$store.state.auth.user.fullName;
    this.department = this.$store.state.auth.user.departmentName;
    // this.getAllYear();
  },
  methods: {
    acceptRequest(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.requestStatus.status = 2;
          RequestService.changeStatus(this.requestId, this.requestStatus).then(
            () => {
              this.acceptRequestDialogVisible = false;
              this.$notify.success({
                message: "Yêu cầu đã được chấp nhận",
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

    declineRequest(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.declineRequestDialogVisible = false;
          this.requestStatus.status = 3;
          RequestService.changeStatus(this.requestId, this.requestStatus).then(
            () => {
              this.$notify.success({
                message: "Yêu cầu đã bị từ chối",
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

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm.startTime = moment(
            String(this.ruleForm.startTime)
          ).format("HH:mm:ss");
          this.ruleForm.endTime = moment(String(this.ruleForm.endTime)).format(
            "HH:mm:ss"
          );
          RequestService.save(this.ruleForm).then(() => {
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
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    cancelCreateForm(formName) {
      this.$refs[formName].resetFields();
      this.createRequestDialogVisible = false;
      this.createOTRequestDialogVisible = false;
      this.createTimeKeepingRequestDialogVisible = false;
      this.isForgetTimeKeeping = false;
      this.isRest = false;
      this.isRestBySlot = false;
      this.isRestByDay = false;
      this.isWorkFromHome = false;
      this.isBusinessTravel = false;
      this.isPersonalWork = false;
    },

    cancelEditForm(formName) {
      this.$refs[formName].resetFields();
      this.acceptRequestDialogVisible = false;
    },

    cancelDeclineRequestForm(formName) {
      this.$refs[formName].resetFields();
      this.declineRequestDialogVisible = false;
    },

    showCreateRequestDialog(categotyId) {
      RequestService.getRequestTypes(categotyId)
        .then((response) => {
          this.requestTypes = response.data.content;
        })
        .catch((e) => {
          this.logout();
          console.log(e);
        });
      this.acceptRequestDialogVisible = false;
      this.deleteHolidayDialogVisible = false;
      if (categotyId == 1) {
        this.createRequestDialogVisible = true;
      } else if (categotyId == 2) {
        this.createOTRequestDialogVisible = true;
      } else if (categotyId == 3) {
        this.createTimeKeepingRequestDialogVisible = true;
      }
    },

    showAcceptRequestDialog(id) {
      this.requestId = id;
      this.requestStatus.note = "Đề xuất của bạn được chấp thuận!";
      this.createRequestDialogVisible = false;
      this.acceptRequestDialogVisible = true;
      this.deleteHolidayDialogVisible = false;
      this.ruleForm = {};
    },

    showDeclineRequestDialog(id) {
      this.requestId = id;
      this.requestStatus.note = "Đề xuất của bạn bị từ chối!";
      this.createRequestDialogVisible = false;
      this.declineRequestDialogVisible = true;
      this.deleteHolidayDialogVisible = false;
      this.ruleForm = {};
    },
    getData() {
      if (this.$store.state.auth.user.roles[0] === "ROLE_MODERATOR") {
        this.isModerator = true;
        this.departmentOfModerator = this.$store.state.auth.user.departmentName;
        this.departmentId = this.$store.state.auth.user.departmentId;
      }
      RequestService.getData(
        this.page,
        this.pageSize,
        this.search,
        this.status,
        this.departmentId,
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
          this.logout();
          console.log(e);
        });
    },

    getAllDepartment() {
      DepartmentService.getAllDepartment()
        .then((response) => {
          this.departments = response.data;
        })
        .catch((e) => {
          this.logout();
          console.log(e);
        });
    },

    // getRequestTypes(categotyId) {
    //   RequestService.getRequestTypes(categotyId).then((response) => {
    //     this.requestTypes = response.data.content;
    //   });
    // },
    handleChange(formName) {
      if (this.numberRestDay < 1 && this.numberRestDay > 0) {
        this.isRestBySlot = true;
        this.isRestByDay = false;
        this.isWorkFromHome = false;
        this.isBusinessTravel = false;
        this.isPersonalWork = false;
        this.clearField(formName);
        this.$refs[formName].fields
          .find((f) => f.prop == "slotId")
          .resetField();
      } else if (this.numberRestDay >= 1) {
        this.isRestBySlot = false;
        this.isRestByDay = true;
        this.isWorkFromHome = false;
        this.isBusinessTravel = false;
        this.isPersonalWork = false;
        this.clearField(formName);
      } else {
        this.isRestBySlot = false;
        this.isRestByDay = false;
        this.isWorkFromHome = false;
        this.isBusinessTravel = false;
        this.isPersonalWork = false;
      }
    },

    selectType(typeId, formName) {
      if (typeId == 5 || typeId == 6 || typeId == 7) {
        this.isPersonalWork = true;
        this.isRest = false;
        this.isRestBySlot = false;
        this.isRestByDay = false;
        this.isWorkFromHome = false;
        this.isBusinessTravel = false;
      } else if (typeId == 1 || typeId == 2) {
        this.isPersonalWork = false;
        this.isRest = true;
        this.numberRestDay = 0;
        this.isRestBySlot = false;
        this.isRestByDay = false;
        this.isWorkFromHome = false;
        this.isBusinessTravel = false;
      } else if (typeId == 4) {
        this.isForgetTimeKeeping = true;
        this.isRest = false;
        this.isRestBySlot = false;
        this.isRestByDay = false;
        this.isWorkFromHome = false;
        this.isBusinessTravel = false;
      } else if (typeId == 8) {
        this.isForgetTimeKeeping = false;
        this.isRest = false;
        this.isRestBySlot = false;
        this.isRestByDay = false;
        this.isWorkFromHome = true;
        this.isBusinessTravel = false;
      } else if (typeId == 10) {
        this.isForgetTimeKeeping = false;
        this.isRest = false;
        this.isRestBySlot = false;
        this.isRestByDay = false;
        this.isWorkFromHome = false;
        this.isBusinessTravel = true;
      }
      this.clearField(formName);

      this.$refs[formName].fields.find((f) => f.prop == "slotId").resetField();
    },

    clearField(formName) {
      this.$refs[formName].fields
        .find((f) => f.prop == "startDate")
        .resetField();
      this.$refs[formName].fields.find((f) => f.prop == "endDate").resetField();
      this.$refs[formName].fields.find((f) => f.prop == "endTime").resetField();
      this.$refs[formName].fields
        .find((f) => f.prop == "startTime")
        .resetField();
      // this.$refs[formName].fields.find((f) => f.prop == "slotId").resetField();
    },

    setDateTime() {
      if (this.isPersonalWork) {
        const date = new Date(this.ruleForm.startDate);
        const date1 = new Date(this.ruleForm.startDate);
        date1.setHours(8, 30, 0, 0);
        this.ruleForm.startTime = date1;

        if (this.ruleForm.requestTypeId != 7) {
          date.setDate(date.getDate() + 2);
        }
        this.ruleForm.endDate = date;
        this.ruleForm.endDate.setHours(18, 0, 0, 0);
        this.ruleForm.endTime = this.ruleForm.endDate;
      }
      //  else if (this.isRestByDay) {
      //   const date = new Date(this.ruleForm.startDate);
      //   date.setHours(0, 0, 0, 0);
      //   this.ruleForm.startTime = date;
      //   const date1 = new Date(this.ruleForm.endDate);
      //   date1.setHours(23, 59, 59, 0);
      //   this.ruleForm.endTime = date1;
      // }
      else if (
        this.isRestBySlot ||
        this.createOTRequestDialogVisible ||
        this.isForgetTimeKeeping
      ) {
        const date = new Date(this.ruleForm.startDate);
        this.ruleForm.endDate = date;
        const date1 = new Date(this.ruleForm.endDate);
        if (this.slotId == 1) {
          date.setHours(8, 30, 0, 0);
          date1.setHours(12, 0, 0, 0);
          this.ruleForm.startTime = date;
          this.ruleForm.endTime = date1;
        } else if (this.slotId == 2) {
          date.setHours(13, 0, 0, 0);
          date1.setHours(18, 0, 0, 0);
          this.ruleForm.startTime = date;
          this.ruleForm.endTime = date1;
        }
      } else if (this.isWorkFromHome || this.isBusinessTravel) {
        const date = new Date(this.ruleForm.startDate);
        const date1 = new Date(this.ruleForm.endDate);
        if (this.slotIdStart == 1 && this.slotIdEnd == 1) {
          date.setHours(8, 30, 0, 0);
          date1.setHours(12, 0, 0, 0);
          this.ruleForm.startTime = date;
          this.ruleForm.endTime = date1;
        } else if (this.slotIdStart == 1 && this.slotIdEnd == 2) {
          date.setHours(8, 30, 0, 0);
          date1.setHours(18, 0, 0, 0);
          this.ruleForm.startTime = date;
          this.ruleForm.endTime = date1;
        } else if (this.slotIdStart == 2 && this.slotIdEnd == 2) {
          date.setHours(13, 0, 0, 0);
          date1.setHours(18, 0, 0, 0);
          this.ruleForm.startTime = date;
          this.ruleForm.endTime = date1;
        } else if (this.slotIdStart == 2 && this.slotIdEnd == 1) {
          date.setHours(13, 0, 0, 0);
          date1.setHours(12, 0, 0, 0);
          this.ruleForm.startTime = date;
          this.ruleForm.endTime = date1;
        }
      }
    },

    getAllRequestCategory() {
      RequestService.getRequestCategories()
        .then((response) => {
          this.requestCategories = response.data.content;
        })
        .catch((e) => {
          this.logout();
          console.log(e);
        });
    },

    logout() {
      this.$store.dispatch("auth/logout");
      window.location.replace("http://localhost:2001/login");
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