export class Service{
    createdBy: string;
	serviceTypeId: string;
    placeId: string;
	language: string;
    title: string;
    description: string;
    imagesDescription: Array<string>;
    createdAt: Date;
    updatedAt: Date; 
    expiredAt: Date;
    get getCreatedBy():string {
        return this.createdBy;
    }
    set setCreatedBy(createdBy:string) {
        this.createdBy = createdBy;
    }
    get getServiceTypeId():string {
        return this.serviceTypeId;
    }
    set setServiceTypeId(serviceTypeId:string) {
        this.serviceTypeId = serviceTypeId;
    }
    get getPlaceId():string {
        return this.placeId;
    }
    set setPlaceId(placeId:string) {
        this.placeId = placeId;
    }
    get getLanguage():string {
        return this.language;
    }
    set setLanguage(language:string) {
        this.language = language;
    }
    get getTitle():string {
        return this.title;
    }
    set setTitle(title:string) {
        this.title = title;
    }
    get getDescription():string {
        return this.description;
    }
    set setDescription(description:string) {
        this.description = description;
    }
    get getImagesDescription():Array<string> {
        return this.imagesDescription;
    }
    set setImagesDescription(imagesDescription:Array<string>) {
        this.imagesDescription = imagesDescription;
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
    get getExpiredAt():Date {
        return this.expiredAt;
    }
    set setExpiredAt(expiredAt:Date) {
        this.expiredAt = expiredAt;
    }
}