/* THS-23 by sana */

export class Serviceprovide {

    id: number
    first_name: string
    last_name: string
    email: string
    phone_number: string
    gender: number
    nationality: string
    address: string
    profile_image: string
    type: string
    unavailable: boolean
    busy: boolean
    start_time: string
    end_time: string
    medical_license: string
    medical_license_expiry_date: string
    branch_id: number
    title: string //branch_title

    static getServiceProviderList( data ): Serviceprovide[] {
  
      var spList: Serviceprovide[] = []
      let spData = data["Serviceprovide"]
  
      //loop through an array of data and initizlize it to branch variable
      spData.forEach( (sp) => {
        
        let sp_data = new Serviceprovide()
  
        sp_data.id = sp.id
        sp_data.first_name = sp.first_name
        sp_data.last_name = sp.last_name
        sp_data.email = sp.email
        sp_data.phone_number = sp.phone_number
        sp_data.gender = sp.gender
        sp_data.nationality = sp.nationality
        sp_data.address = sp.address
        sp_data.profile_image = sp.profile_image
        sp_data.type = sp.type
        sp_data.unavailable = sp.unavailable
        sp_data.busy = sp.busy
        sp_data.start_time = sp.start_time
        sp_data.end_time = sp.end_time
        sp_data.medical_license = sp.medical_license
        sp_data.medical_license_expiry_date = sp.medical_license_expiry_date
        sp_data.branch_id = sp.branch_id
        sp_data.title = sp.title        
        
        spList.push(sp_data)
      
      })
      
      return spList
    
    }
  
  }