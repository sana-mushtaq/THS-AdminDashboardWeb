export class PractiseUser {
    userId: string;
    firstName: string;
    lastName: string;
    mobile: string;
    email: string;
    gender: string;
    dob: string;
    bloodGroup: string;
    empDisplayId: string;
    password: string;


    static getPracticeUserList(users): PractiseUser[] {
        var practiseUsers = [];
        users.forEach(data => {
            var user = new PractiseUser();
            user.userId = data["parctiseUserId"];
            user.firstName = data["firstName"];
            user.lastName = data["lastName"];
            user.mobile = data["mobileNumber"];
            user.email = data["emailId"];
            user.bloodGroup = data["bloodGroup"];
            user.empDisplayId = "EMP" + PractiseUser.zeroPad(user.userId, 4);
            user.password = data["password"];
            var genderId = data["gender"];

            if (genderId == 1) {
                user.gender = "Male";
            } else {
                user.gender = "Female";
            }
            user.dob = data["dob"];

            practiseUsers.push(user);
        });
        return practiseUsers;
    }

    static getServiceProviderStaffList(users): PractiseUser[] {
        var practiseUsers = [];
        users.forEach(data => {
            var user = new PractiseUser();
            user.userId = data["parctiseUserId"];
            user.firstName = data["firstName"];
            user.lastName = data["lastName"];
            user.mobile = data["mobileNumber"];
            user.email = data["emailId"];
            user.bloodGroup = data["bloodGroup"];
            user.empDisplayId = "EMP" + PractiseUser.zeroPad(user.userId, 4);
            user.password = data["password"];
            var genderId = data["gender"];

            if (genderId == 1) {
                user.gender = "Male";
            } else {
                user.gender = "Female";
            }
            user.dob = data["dob"];

            practiseUsers.push(user);
        });
        return practiseUsers;
    }
    


    static zeroPad(num, places) {
        var zero = places - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join("0") + num;
    }
}

