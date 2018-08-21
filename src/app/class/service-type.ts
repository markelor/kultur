export class ServiceType{
	language: string;
    title: string;
    icons: Array<string>;
    createdAt: Date;
    updatedAt: Date; 

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
    get getIcons():Array<string> {
        return this.icons;
    }
    set setIcons(icons:Array<string>) {
        this.icons = icons;
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