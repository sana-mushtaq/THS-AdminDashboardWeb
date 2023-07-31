import { AbstractControl, ValidationErrors } from '@angular/forms';

export function NationalIdValidator( controlName : string ){ 
    return (formGroup: AbstractControl) : ValidationErrors | null => {
        if( formGroup ){
            let control = formGroup.get(controlName);
            let controlType = formGroup.get('idType');

            if( control.value == null ){
                return null;
            }

            // IF ID TYPE IS NATIONAL ID
            if( controlType.value == 'nationalId' ){
                const id = control.value.trim();
                const type = id.substr(0, 1);

                if( control.errors && !control.errors['notValid'] ){
                    return null;
                }

                if (Number( id ) === null || ( type !== '2' && type !== '1' ) || id.length !== 10 ) {
                    control?.setErrors({ notValid: true });
                }
                else{
                    let sum = 0;
                    for (let i = 0; i < 10; i++) {
                        if (i % 2 === 0) {
                        const ZFOdd : any = String('00' + String(Number(id.substr(i, 1)) * 2)).slice(-2);
                        sum += Number(ZFOdd.substr(0, 1)) + Number(ZFOdd.substr(1, 1));
                        } else {
                        sum += Number(id.substr(i, 1));
                        }
                    }
                    if( sum % 10 !== 0 ){
                        control?.setErrors({ notValid: true });
                    }else{
                        control?.setErrors(null);
                    }
                }
            }
            // IF ID TYPE IS PASSPOST
            else if( controlType.value == 'passport' ){
                // let PASSPORT_REG_EX = RegExp("^(?!^0+$)[a-zA-Z0-9]{3,20}$");
                // console.log(PASSPORT_REG_EX.test(controlType.value));
            }
            // IF ID TYPE IS OTHER
            else if( controlType.value == 'other' ){
               // TODO
            }
        }
        return null;
    }
}