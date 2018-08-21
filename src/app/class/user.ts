export class User{
	language:string;
	name: string;
    email: string;
    username: string;
    password: string;
    active: boolean;
    aboutYourself:string;
    temporaryToken: string;
    resetToken: string;
    permission: string;

    get getLanguage():string {
        return this.language;
    }
    set setLanguage(language:string) {
        this.language = language;
    }
    get getName():string {
        return this.name;
    }
    set setName(name:string) {
        this.name = name;
    }
    get getEmail():string {
        return this.email;
    }
    set setEmail(email:string) {
        this.email = email;
    }
    get getUsername():string {
        return this.username;
    }
    set setUsername(username:string) {
        this.username = username;
    }
    get getPassword():string {
        return this.password;
    }
    set setPassword(password:string) {
        this.password = password;
    }
    get getActive():boolean {
        return this.active;
    }
    set setActive(active:boolean) {
        this.active = active;
    }
    get getAboutYourself():string {
        return this.aboutYourself;
    }
    set setAboutYourself(aboutYourself:string) {
        this.aboutYourself = aboutYourself;
    }
    get getTemporaryToken():string {
        return this.temporaryToken;
    }
    set setTemporaryToken(temporaryToken:string) {
        this.temporaryToken = temporaryToken;
    }
    get getResetToken():string {
        return this.resetToken;
    }
    set setResetToken(resetToken:string) {
        this.resetToken = resetToken;
    }
    get getPermission():string {
        return this.permission;
    }
    set setPermission(permission:string) {
        this.permission = permission;
    }

}

