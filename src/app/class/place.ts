export class Place{
	eventId: string;
	language: string;
    province: string;
    geonameIdProvince:number;
    municipality: string;
    geonameIdMunicipality:number
    location:string;
    lat:number;
    lng:number;
    createdAt: Date;
    updatedAt: Date; 
    get getEventId():string {
        return this.eventId;
    }
    set setEventId(eventId:string) {
        this.eventId = eventId;
    }
    get getLanguage():string {
        return this.language;
    }
    set setLanguage(language:string) {
        this.language = language;
    }
    get getProvince():string {
        return this.province;
    }
    set setProvince(province:string) {
        this.province = province;
    }
    get getGeonameIdProvince():string {
        return this.province;
    }
    set setGeonameIdProvince(geonameIdProvince:number) {
        this.geonameIdProvince = geonameIdProvince;
    }
    get getMunicipality():string {
        return this.municipality;
    }
    set setMunicipality(municipality:string) {
        this.municipality = municipality;
    }
    get getGeonameIdMunicipality():string {
        return this.province;
    }
    set setGeonameIdMunicipality(geonameIdMunicipality:number) {
        this.geonameIdMunicipality = geonameIdMunicipality;
    }
    get getLocation():string {
        return this.location;
    }
    set setLocation(location:string) {
        this.location = location;
    }
    get getLat():number {
        return this.lat;
    }
    set setLat(lat:number) {
        this.lat = lat;
    }
    get getLng():number {
        return this.lng;
    }
    set setLng(lng:number) {
        this.lng = lng;
    }
    get getCreatedAt():Date {
        return this.createdAt;
    }
    set setCreatedAt(createdAt:Date) {
        this.createdAt = createdAt;
    }
    get getUpdatedAt():Date {
        return this.updatedAt;
    }
    set setUpdatedAt(updatedAt:Date) {
        this.updatedAt = updatedAt;
    }
}