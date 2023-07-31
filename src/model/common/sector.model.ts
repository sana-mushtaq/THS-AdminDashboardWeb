export class Sector {
    sectorId: number;
    sectorName: string;
    sectorNameArabic: string;
    sectorIconPath: string;

    static getSectorList(response): Sector[] {
        let sectorResponse = response.serviceSectors;
        var sectors: Sector[] = [];

        sectorResponse.forEach(sectorData => {
            let sector = new Sector();
            sector.sectorId = sectorData.sectorId;
            sector.sectorName = sectorData.serviceSectorName;
            sector.sectorNameArabic = sectorData.serviceSectorNameArabic;
            sector.sectorIconPath = sectorData.serviceIcon
            sectors.push(sector);
        });
        return sectors;
    }
}



