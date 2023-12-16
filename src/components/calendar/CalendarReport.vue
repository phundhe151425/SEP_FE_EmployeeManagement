<template>
    <div>
<!--        <h3 class="text-start" style="font-weight: bold">Lịch chấm công cá nhân</h3>-->
<!--        <hr style="margin-bottom: 1%"/>-->
<!--        <br>-->
        <div style="padding-bottom: 310px">

            <el-tooltip placement="bottom" effect="light" style="display: none" id="button-note">
                <el-button type="primary" class="el-icon-info el-button--info el-calendar__header"
                           style="border-radius: 10px">
                    Chú thích
                </el-button>
                <div slot="content">
                    <note-calendar/>
                </div>
            </el-tooltip>
            <div class="d-flex flex-row justify-content-center">
                <el-calendar style="width: 70% ; margin-top: 50px; border-radius: 10px" v-model="value"
                             ref="calendar">
                    <template slot="dateCell" slot-scope="{date,data,Sign = getSign(data.day)}">
                        <div :class="{
                           weekend:getSign(data.day).weekend,
                            halfOff:Sign.halfOff,
                            off:Sign.off,
                            allDay:Sign.allDay,
                            holiday:Sign.holiday,
                            standard:Sign.standard,
                            regime:Sign.regime,
                            sick:Sign.sick,
                            cellSign:true,
                            'position-relative':true
                            }"
                             v-b-modal="'my-modal'"
                             @click="setCell(data.day,Sign)"
                        >
                            <p style="font-size: 18px; margin-left: 2px">
                                {{ date.getDate() }}
                                <br>
                            </p>
                            <div class="sign-calender text-center align-middle ">
                                {{ Sign.name }}
                                <el-tooltip popper-class="reason-popper" v-if="Sign.note.length!=0" placement="right"
                                            effect="light">
                                    <div slot="content">
                                        <div class="tooltip-wrapper"
                                             :class="{
                                        'tooltip-wrapper_many':Sign.note.length>4,
                                        'tooltip-wrapper_min':Sign.note.length<=4
                                          }">
                                            <note-log :notes="Sign.note"></note-log>
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
                <div class="mounthSelect">
                    <el-date-picker
                            v-model="month"
                            type="month"
                            placeholder="Chọn tháng"
                            format="yyyy/MM"
                            value-format="yyyy/MM"
                            @change="getAll"
                    >
                        <!--                    @change="getAll"-->
                    </el-date-picker>
                </div>
                <note-calendar id="table-note" style="margin-left: 80px ;margin-top: 100px"/>
            </div>


            <b-modal id="my-modal" centered size="l">
                <template #modal-header="{ close }">
                    <!-- Emulate built in modal header close button action -->
                    <h5>Chi tiết ngày {{ cellDate }}</h5>
                    <b-icon-x-circle-fill style="color: #d8363a" size="sm" @click="close()">
                    </b-icon-x-circle-fill>
                </template>
                <div class="text-center" style="font-size: 16px;line-height: 19.5px;letter-spacing: 1px;">
                    <div v-if="cellSign.timeIn!=null">{{ cellSign.timeIn }}</div>
                    <div v-if="cellSign.timeIn==null">Không có dữ liệu</div>
                    <div>...</div>
                    <div v-if="cellSign.timeOut!=null">{{ cellSign.timeOut }}</div>
                    <div v-if="cellSign.timeOut==null">Không có dữ liệu</div>
                </div>

                <template #modal-footer="{ok}">
                    <b-button size="sm" variant="success" style="display:none;" @click="ok()">
                    </b-button>
                </template>
            </b-modal>
        </div>
    </div>
</template>

<script>
import NoteCalendar from "@/components/calendar/NoteCalendar.vue"
import AttendanceService from "@/services/attendance-service";
import NoteLog from "@/components/calendar/NoteLog.vue";

export default {
    name: "CalendarReport",
    components: {NoteCalendar, NoteLog},
    data() {
        return {
            value: new Date(),
            attendances: [],
            month: "",
            cellDate: '',
            cellSign: {}
        }
    },
    created() {
        this.getAll()
    },
    methods: {
        handleDateCellClick(event) {
            // Xử lý sự kiện click trên ô ngày ở đây
            const date = new Date(event.target.getAttribute('data-date'));
            console.log('Ngày được bấm:', date);
        },
        getAll() {
            const params = {
                'code': this.currentUser.userCode,
                'month': this.month.split("/")[1].toString(),
                'year': this.month.split("/")[0].toString()
            }
            console.log(params)
            AttendanceService.getForCalendar(params).then(response => {
                this.attendances = response.data;
                console.log(this.attendances)
            })
                .catch(e => {
                    console.log(e);
                    if (e.response.data.status == 401) this.$store.dispatch("auth/logout");
                })

        },
        setCell(date, sign) {
            // date = date.split("-").reverse().join("/");
            date = date.split("/");
            this.cellDate = date;
            this.cellSign = sign
        },
        getSign(date) {
            let sign = {
                name: '',
                allDay: false,
                weekend: false,
                halfOff: false,
                off: false,
                sick: false,
                standard: false,
                holiday: false,
                regime: false,
                timeIn: null,
                timeOut: null,
                note: []
            };
            for (let log of this.attendances) {
                if (log.dateLog == date) {
                    if (log.signs != null)
                        sign.name = log.signs.name
                    sign.timeIn = log.timeIn
                    sign.timeOut = log.timeOut
                    sign.note = log.noteLogSet
                    console.log(sign.note)
                    if (sign.name.includes("H") && !sign.name.includes("_"))
                        sign.allDay = true
                    if (sign.name.includes("NT"))
                        sign.weekend = true
                    if (sign.name.includes("P_H") || sign.name.includes("H_P") || sign.name.includes("KL_H") || sign.name.includes("H_KL"))
                        sign.halfOff = true;
                    if ((sign.name.includes("KL") && !sign.name.includes("_")) || sign.name.includes("P_KL") || sign.name.includes("KL_P") || (sign.name.includes("P") && !sign.name.includes("_")))
                        sign.off = true
                    if (sign.name.includes("Ô"))
                        sign.sick = true;
                    if (sign.name.includes("TC"))
                        sign.standard = true;
                    if (sign.name.includes("L") && !sign.name.includes("K"))
                        sign.holiday = true
                    if (sign.name.includes("CĐ"))
                        sign.regime = true;
                    return sign
                }
            }
            return sign
        },
    },
    computed: {
        currentUser() {
            return this.$store.state.auth.user;
        },
    },
    watch: {
        month: function () {
            const month = this.month.split("/")[1] - 1
            const year = this.month.split("/")[0]
            this.value = new Date().setFullYear(year, month, 1)
        }
    },
    mounted() {
        this.month = new Date().getFullYear().toString() + "/" + (new Date().getMonth() + 1).toString()
        this.getAll()

        const calendar = this.$refs.calendar;

        // Lấy danh sách tất cả các ô ngày trong lịch
        const dateCells = calendar.$el.querySelectorAll('.el-calendar-table td');

        // Lắng nghe sự kiện click trên mỗi ô ngày
        dateCells.forEach((cell) => {
            cell.addEventListener('click', this.handleDateCellClick);
        });
    }
}
</script>

<style scoped>

.tooltip-wrapper {
    width: fit-content;
    background-color: #F4F4F4;
    padding: 15px;
    box-sizing: content-box;
    border-radius: 10px;
    overflow: scroll;
}

.el-button-group {
    display: none;
}

.el-calendar__button-group {
    display: none;
}

.tooltip-wrapper_many {
    height: 500px;
}

.tooltip-wrapper_min {
    height: fit-content;
}

.note-wrapper .el-button:hover {
    cursor: default;
}

.sign-calender {
    font-weight: bold;
}

.mounthSelect {
    position: absolute;
    right: 30%;
    top: 100px;
}

.allDay {
    background-color: #C9E3C6;
}

.weekend {
    background-color: #F8CBAD;
}

.disable {

}

.halfOff {
    background-color: #ECC376;
}

.off {
    background-color: #E97C7CCC;
}

.sick {
    background-color: #CFD0E2;
}

.standard {
    background-color: #CBA4F3;
}

.holiday {
    background-color: #b3e3f7;
}

.regime {
    background-color: #e381e3;
}

.cellSign {
    margin: 5px;
    box-sizing: content-box;
    border-radius: 10px;
    height: inherit;
    width: inherit;
}

.reason-popper {
    border: #a843a8 1px;
}

@media only screen and (max-width: 600px) {
    .note-wrapper {
        display: none;
    }

    .mounthSelect {
        right: 0% !important;
        top: 100px !important;
    }

    .el-calendar {
        width: 100% !important;
    }

    .cellSign {
        margin: 2px !important;
        height: unset !important;
    }

    .el-calendar-table .el-calendar-day {
        height: 80px;
    }
}
</style>