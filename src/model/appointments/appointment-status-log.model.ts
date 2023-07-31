import * as moment from "moment";
import { AppointmentLogStatus } from "src/utils/app-enum";

export class AppointmentStatusLog {
    statusId: number;
    currentStatus: number;
    latitude: string;
    longitude: string;
    address: string;
    createdDate: string;
    updateDate: string;
    updateTime: string;

    statusText: string;
    logStatus: number;

    static getAppointmentStatusHistory(historyData): AppointmentStatusLog[] {
        let history: AppointmentStatusLog[] = [];
        historyData.forEach(statusData => {
            let status = new AppointmentStatusLog();
            status.statusId = statusData.statusId;
            status.currentStatus = statusData.currentStatus;
            status.latitude = statusData.latitude;
            status.longitude = statusData.longitude;
            status.address = statusData.address;
            status.updateDate = moment(statusData.createdDate, 'YYYY-MM-DD HH:mm:ss ZZ').format('DD-MM-YYYY');
            status.updateTime = moment(statusData.createdDate, 'YYYY-MM-DD HH:mm:ss ZZ').format('hh:mm a');
            status.logStatus = AppointmentLogStatus.Completed;
            history.push(status);
        });
        return history;
    }
}