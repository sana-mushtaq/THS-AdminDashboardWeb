// THS-23 BY SANA
export class Servicecategory {

    id: number
    title: string
    title_arabic: string
    icon: string
    image: string
    banner: string
    active: boolean

    static getServiceCategoryList( data ): Servicecategory[] {
  
        var catgeoryList: Servicecategory[] = []
        let categoryData = data["Servicecategory"]
    
        //loop through an array of data and initizlize it to branch variable
        categoryData.forEach( (category) => {
          
          let category_data = new Servicecategory();
    
          category_data.id = category.id
          category_data.title = category.title
          category_data.title_arabic = category.title_arabic
          category_data.icon = category.icon
          category_data.image = category.image
          category_data.banner = category.banner
          category_data.active = category.active
          
          catgeoryList.push(category_data)
        
        })
        
        return catgeoryList
      
      }
      
}

export class Servicesubcategory {

  id: number
  title: string
  title_arabic: string
  category_id: number
  parent_category: string
  icon: string
  image: string
  banner: string
  active: boolean

  static getServiceCategoryList( data ): Servicesubcategory[] {

      var catgeoryList: Servicesubcategory[] = []
      let categoryData = data["Servicecategory"]
  
      //loop through an array of data and initizlize it to branch variable
      categoryData.forEach( (category) => {
        
        let category_data = new Servicesubcategory();
  
        category_data.id = category.id
        category_data.title = category.title
        category_data.title_arabic = category.title_arabic
        category_data.category_id = category.parent_id
        category_data.parent_category = category.parent_category
        category_data.icon = category.icon
        category_data.image = category.image
        category_data.banner = category.banner
        category_data.active = category.active
        
        catgeoryList.push(category_data)
      
      })
      
      return catgeoryList
    
    }
    
}

