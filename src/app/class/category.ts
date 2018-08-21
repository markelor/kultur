export class Category{
    firstParentId:string;
	parentId: string;
    level:number;
	language: string;
    title: string;
    description: string;
    icons: Array<string>;
    createdAt: Date;
    updatedAt: Date; 
    get getFirstParentId():string {
        return this.firstParentId;
    }
    set setFirstParentId(firstParentId:string) {
        this.firstParentId = firstParentId;
    }
     get getParentId():string {
        return this.parentId;
    }
    set setParentId(parentId:string) {
        this.parentId = parentId;
    }
    get getLevel():number {
        return this.level;
    }
    set setLevel(level:number) {
        this.level = level;
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