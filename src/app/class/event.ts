
export class Event{
    id:string;
    createdBy: string;
    categoryId:string;
    language:string;
    visible: boolean;
    participants: Array<string>;
    title: string;
    start: Date;
    end: Date;
    price:number;
    description: string;
    observations:string;
    reactions: object;
    imagesPoster: Array<string>;
    imagesDescription: Array<string>;
    createdAt: Date;
    updatedAt: Date ;
    get getId():string {
        return this.id;
    }
    set setId(id:string) {
        this.id = id;
    }   
    get getCreatedBy():string {
        return this.createdBy;
    }
    set setCreatedBy(createdBy:string) {
        this.createdBy = createdBy;
    }
    get getCategoryId():string {
        return this.categoryId;
    }
    set setCategoryId(categoryId:string) {
        this.categoryId = categoryId;
    }
    get getLanguage():string {
        return this.language;
    }
    set setLanguage(language:string) {
        this.language = language;
    }
    get getVisible():boolean {
        return this.visible;
    }
    set setVisible(visible:boolean) {
        this.visible = visible;
    }
    get getParticipants():Array<string> {
        return this.participants;
    }
    set setParticipants(participants:Array<string>) {
        this.participants = participants;
    }
    get getTitle():string {
        return this.title;
    }
    set setTitle(title:string) {
        this.title = title;
    } 
    get getStart():Date {
        return this.start;
    }
    set setStart(start:Date) {
        this.start = start;
    }
    get getEnd():Date {
        return this.end;
    }
    set setEnd(end:Date) {
        this.end = end;
    }
    get getPrice():number {
        return this.price;
    }
    set setPrice(price:number) {
        this.price = price;
    }
    get getDescription():string {
        return this.description;
    }
    set setDescription(description:string) {
        this.description = description;
    }
    get getObservations():string {
        return this.observations;
    }
    set setObservations(observations:string) {
        this.observations = observations;
    }
    get getReactions():object {
        return this.reactions;
    }
    set setReactions(reactions:object) {
        this.reactions = reactions;
    }
    get getImagesPoster():Array<string> {
        return this.imagesPoster;
    }
    set setImagesPoster(imagesPoster:Array<string>) {
        this.imagesPoster = imagesPoster;
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
}
