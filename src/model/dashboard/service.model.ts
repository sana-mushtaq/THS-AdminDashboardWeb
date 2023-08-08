// THS-23 BY SANA
export class Service {

    id: number
    category_id: number
    service_type: string
    url: string
    title: string
    title_arabic: string
    description: string
    description_arabic: string
    title_tag: string
    meta_tag: string
    instructions: string
    instructions_arabic: string
    faq: string
    faq_arabic: string
    icon: string
    cover_image: string
    banner: string
    price: number
    cost: number
    active: boolean
    whatsapp_url: string
    category_title: string
    coupon_code: string

    static getServiceList( data ): Service[] {
  
        var serviceList: Service[] = [];
        let serviceData = data["Service"];
    
        //loop through an array of data and initizlize it to branch variable
        serviceData.forEach( (service) => {
          
          let service_data = new Service();
          
          service_data.id = service.id
          service_data.category_id = service.category_id
          service_data.service_type = service.service_type
          service_data.url = service.url
          service_data.title = service.title
          service_data.title_arabic = service.title_arabic
          service_data.description = service.description
          service_data.description_arabic = service.description_arabic
          service_data.title_tag = service.title_tag
          service_data.meta_tag = service.meta_tag
          service_data.instructions = service.instructions
          service_data.instructions_arabic = service.instructions_arabic
          service_data.faq = service.faq
          service_data.faq_arabic = service.faq_arabic
          service_data.icon = service.icon
          service_data.cover_image = service.cover_image
          service_data.banner = service.banner
          service_data.price = service.price
          service_data.cost = service.cost
          service_data.active = service.active
          service_data.whatsapp_url = service.whatsapp_url
          service_data.category_title = service.category_title
          service_data.coupon_code = service.coupon_code
          
          serviceList.push(service_data)
        
        })
        
        return serviceList
      
      }
      
}
