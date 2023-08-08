/* THS-23 by sana */
export class Branch {

  id: number
  title: string
  title_arabic: string
  location: string
  location_arabic: string
  longitude: string
  latitude: string
  contact: string
  email: string
  description: string
  description_arabic: string
  image: string
  radius: number
  active: number
  additional_cost_radius: number
  user_id: object
  
  static getBranchList( data ): Branch[] {

    var branchList: Branch[] = []
    let branchData = data["branch"]

    //loop through an array of data and initizlize it to branch variable
    branchData.forEach( (branch) => {
      
      let branch_data = new Branch()

      branch_data.id = branch.id
      branch_data.title = branch.title
      branch_data.title_arabic = branch.title_arabic
      branch_data.location = branch.location
      branch_data.location_arabic = branch.location_arabic
      branch_data.longitude = branch.longitude
      branch_data.latitude = branch.latitude
      branch_data.contact = branch.contact
      branch_data.email = branch.email
      branch_data.description = branch.description
      branch_data.description_arabic = branch.description_arabic
      branch_data.image = branch.image
      branch_data.radius = branch.radius
      branch_data.active = branch.active
      branch_data.additional_cost_radius = branch.additional_cost_radius
      branch_data.user_id = branch.user_id

      branchList.push(branch_data)
    
    })
    
    return branchList
  
  }

}
  