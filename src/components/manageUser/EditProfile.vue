<template>
  <div>
    <h3>Chỉnh sửa thông tin</h3>
    <hr style="margin-bottom: 5%" />
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="200px"
      class="demo-ruleForm"
    >
      <div class="edit-profile">
        <div class="row">
          <div class="col-md-6">
            <div class="left">
              <el-form-item label="Nhập họ tên nhân viên" prop="fullName">
                <el-input v-model="ruleForm.fullName"></el-input>
              </el-form-item>

              <el-form-item label="Nhập số điện thoại" prop="phone">
                <el-input v-model="ruleForm.phone"></el-input>
              </el-form-item>

              <el-form-item label="Giới tính" prop="gender">
                <el-radio-group v-model="ruleForm.gender">
                  <el-radio :label="1">Nam</el-radio>
                  <el-radio :label="2">Nũ</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </div>
          <div class="col-md-6 right">
            <div class="right">
              <el-form-item label="Nhập địa chỉ" prop="address">
                <el-input v-model="ruleForm.address"></el-input>
              </el-form-item>
              <el-form-item label="Ngày sinh" required>
                <el-form-item prop="birthDay">
                  <el-date-picker
                    type="date"
                    placeholder="Pick a date"
                    v-model="ruleForm.birthDay"
                    style="width: 100%"
                  ></el-date-picker>
                </el-form-item>
              </el-form-item>
              <el-form-item>
                <el-button
                  class="btn"
                  type="primary"
                  @click="submitForm('ruleForm')"
                  >Lưu</el-button
                >
              </el-form-item>
            </div>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import DataService from "../../services/user-service";
import moment from "moment";
export default {
  name: "edit-profile",
  data() {
    var checkName = (rule, value, callback) => {
      var re =
        /^[\sa-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s\\W|_]+$/;
      if (re.test(value) == false) {
        callback(new Error("Vui lòng nhập đúng định dạng tên"));
      } else {
        callback();
      }
    };
    var checkPhone = (rule, value, callback) => {
      var re = /^[0-9]+$/;
      if (re.test(value) == false) {
        callback(new Error("Vui lòng chỉ nhập số"));
      } else {
        callback();
      }
    };
    var checkAddress = (rule, value, callback) => {
      var re =
        /^[\sa-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s\\W|_]+$/;
      if (re.test(value) == false) {
        callback(new Error("Vui lòng nhập đúng định dạng địa chỉ"));
      } else {
        callback();
      }
    };

    return {
      id: "",
      dateFormat: "",
      currentUser: null,
      ruleForm: {
        fullName: "",
        phone: "",
        address: "",
        birthDay: "",
        gender: 0,
      },
      imageUrl: "",
      rules: {
        fullName: [
          {
            required: true,
            message: "Vui lòng nhập họ tên!",
            trigger: "blur",
          },
          {
            min: 3,
            message: "Tên có tối thiểu 3 chữ cái",
            trigger: "blur",
          },
          {
            validator: checkName,
            trigger: "blur",
          },
        ],
        phone: [
          {
            required: true,
            message: "Vui lòng nhập số điện thoại!",
            trigger: "blur",
          },
          {
            validator: checkPhone,
            trigger: "blur",
          },
        ],
        address: [
          {
            required: true,
            message: "Vui lòng nhập địa chỉ",
            trigger: "blur",
          },
          {
            validator: checkAddress,
            trigger: "blur",
          },
        ],
        birthDay: [
          {
            type: "date",
            required: true,
            message: "Vui lòng chọn ngày sinh",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    getUser(id) {
      DataService.getProfile(id)

        .then((response) => {
          this.currentUser = response.data;
          this.ruleForm.fullName = this.currentUser.fullName;
          this.ruleForm.phone = this.currentUser.phone;
          this.ruleForm.address = this.currentUser.address;
          this.ruleForm.gender = this.currentUser.gender;
          const date = new Date(this.currentUser.birthDay);
          this.ruleForm.birthDay = date;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        this.dateFormat = this.ruleForm.birthDay.toLocaleDateString();
        this.ruleForm.birthDay = moment(String(this.dateFormat)).format(
          "yyyy-MM-DD"
        );
        if (valid) {
          DataService.updateProfile(this.currentUser.id, this.ruleForm)
            .then(() => {
              this.$notify.success({
                message: "Cập nhật thông tin thành công!",
                title: "Success",
                timer: 2000,
                timerProgressBar: true,
              });
            })
            .catch((e) => {
              console.log(e);
            });

          this.$router.push("/profile");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
  computed: {},
  beforeMount() {
    this.id = this.$store.state.auth.user.id;
  },
  mounted() {
    this.getUser(this.id);

    // this.retrieveTutorials();
    // this.message = '';
  },
};
</script>

<style>
.edit-profile .el-form-item__label {
  text-align: left;
}

.edit-profile .left .el-form-item__label {
  margin-left: 22% !important;
}
.edit-profile .el-form-item {
  display: flex;
  flex-direction: column;
}

/* .mt-3{
    margin-top: 10% !important;
} */

.edit-profile .el-form-item__content {
  margin-left: 0px !important;
}

.edit-profile .el-input {
  width: 70% !important;
}

.edit-profile .left .el-input {
  margin-left: 22%;
}
.edit-profile .el-radio-group {
  margin-left: 22%;
}
.edit-profile .left .el-form-item__error {
  margin-left: 22%;
}


.edit-profile .btn {
  border-radius: 15px;
  color: white;
  width: 20%;
  margin-top: 100px;
  margin-left: 49%;
  background-color: #75c4c0;
}
</style>