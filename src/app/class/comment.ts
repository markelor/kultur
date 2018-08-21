export class Comment{
    firstParentId:string;
    parentId: string;
    level:number;
    eventId: string;
	createdBy: string;
    language:string;
    mentionedUsers: Array<string>;   
    comment: string;
    createdAt: number;
    updatedAt: number ; 
    reactions: object;
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
    get getEventId():string {
        return this.eventId;
    }
    set setEventId(eventId:string) {
        this.eventId = eventId;
    }
    get getCreatedBy():string {
        return this.createdBy;
    }
    set setCreatedBy(createdBy:string) {
        this.createdBy = createdBy;
    }  
    get getLanguage():string {
        return this.language;
    }
    set setLanguage(language:string) {
        this.language = language;
    }
    get getMentionedUsers():Array<string> {
        return this.mentionedUsers;
    }
    set setMentionedUsers(mentionedUsers:Array<string>) {
        this.mentionedUsers = mentionedUsers;
    } 
    get getComment():string {
        return this.comment;
    }
    set setComment(comment:string) {
        this.comment = comment;
    }
    get getCreatedAt():number {
        return this.createdAt;
    }
    set setCreatedAt(createdAt:number) {
        this.createdAt = createdAt;
    }
    get getUpdatedAt():number {
        return this.updatedAt;
    }
    set setUpdatedAt(updatedAt:number) {
        this.updatedAt = updatedAt;
    }
    get getReactions():object {
        return this.reactions;
    }
    set setReactions(reactions:object) {
        this.reactions = reactions;
    }

}