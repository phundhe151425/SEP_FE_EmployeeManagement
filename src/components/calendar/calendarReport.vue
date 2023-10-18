<template>
    <div style="padding-bottom: 310px">
        <div class="d-flex flex-row justify-content-center">

            <el-calendar style="width: 70% ; margin-top: 50px; border-radius: 10px" v-model="value">
                <template slot="dateCell">
                    <div :class="{

              cellSign:true,
              'position-relative':true

        }"
                         v-b-modal="'my-modal'"

                    >
                        <p style="font-size: 18px; margin-left: 2px">
                            12
                            <br>
                        </p>
                        <div class="sign-calender text-center align-middle ">

                            <el-tooltip popper-class="reason-popper" placement="right"
                                        effect="light">
                                <div slot="content">
                                    <div class="tooltip-wrapper"
                                         :class="{}"
                                    >
                                        <note-log ></note-log>
                                    </div>
                                </div>
                                <svg class="position-absolute top-0 end-0 " x="0px" y="0px"
                                     viewBox="0 0 512 512"
                                     style="enable-background:new 0 0 512 512;width: 15px;fill: #A843A8FF "
                                     xml:space="preserve">
              <g>
                <polygon points="5.8,0.6 0,6.4 0,378.3 5.8,384 384,384 512,512 512,5.8 506.3,0 6.4,0 	"/>
              </g>
              </svg>
                            </el-tooltip>
                        </div>
                    </div>
                </template>
            </el-calendar>
            <div class="mounthSelect ">
                <el-date-picker
                        v-model="month"
                        type="month"
                        placeholder="Chọn tháng"
                        format="yyyy/MM"
                        value-format="yyyy/MM"
                >
                    <!--                    @change="getAll"-->
                </el-date-picker>
            </div>
            <note-calender id="table-note" style="margin-left: 80px ;margin-top: 100px"/>
        </div>
    </div>

</template>

<script>
export default {
    name: "calendarReport",
    data() {
        return {
            value: new Date(),
            logs: [],
            month: "",
            cellDate: '',
            cellSign: {}
        }
    },
    // methods: {
    // getAll() {
    //     const params = {
    //         'code': this.currentUser.user.code,
    //         'month': this.month.split("/")[1].toString(),
    //         'year': this.month.split("/")[0].toString()
    //     }
    //     LogdetailService.getAllByUserAndTime(params).then(response => {
    //         this.logs = response.data;
    //         console.log(this.logs)
    //     })
    //         .catch(error => {
    //             console.log(error);
    //         })
    //
    // },
    //     setCell(date, sign) {
    //         // date = date.split("-").reverse().join("/");
    //         date = date.split("/");
    //         this.cellDate = date;
    //         this.cellSign = sign
    //     },
    //     getSign(date) {
    //         let sign = {
    //             name: '',
    //             allDay: false,
    //             weekend: false,
    //             halfOff: false,
    //             off: false,
    //             sick: false,
    //             standard: false,
    //             holiday: false,
    //             regime: false,
    //             timeIn: null,
    //             timeOut: null,
    //             note: []
    //         };
    //         for (let log of this.logs) {
    //             if (log.dateLog == date) {
    //                 if (log.signs != null)
    //                     sign.name = log.signs.name
    //                 sign.timeIn = log.timeIn
    //                 sign.timeOut = log.timeOut
    //                 sign.note = log.noteLogSet
    //                 if (sign.name.includes("H") && !sign.name.includes("_"))
    //                     sign.allDay = true
    //                 if (sign.name.includes("NT"))
    //                     sign.weekend = true
    //                 if (sign.name.includes("P_H") || sign.name.includes("H_P") || sign.name.includes("KL_H") || sign.name.includes("H_KL"))
    //                     sign.halfOff = true;
    //                 if ((sign.name.includes("KL") && !sign.name.includes("_")) || sign.name.includes("P_KL") || sign.name.includes("KL_P") || (sign.name.includes("P") && !sign.name.includes("_")))
    //                     sign.off = true
    //                 if (sign.name.includes("Ô"))
    //                     sign.sick = true;
    //                 if (sign.name.includes("TC"))
    //                     sign.standard = true;
    //                 if (sign.name.includes("L") && !sign.name.includes("K"))
    //                     sign.holiday = true
    //                 if (sign.name.includes("CĐ"))
    //                     sign.regime = true;
    //                 return sign
    //             }
    //         }
    //         return sign
    //     },
    // },
    // watch: {
    //     month: function () {
    //         const month = this.month.split("/")[1] - 1
    //         const year = this.month.split("/")[0]
    //         this.value = new Date().setFullYear(year, month, 1)
    //     }
    // },
}
</script>

<style scoped>

</style>