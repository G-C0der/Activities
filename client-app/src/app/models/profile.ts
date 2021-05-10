import { User } from "./user";

export interface Profile {
    userName: string;
    displayName: string;
    image?: string;
    bio?: string;
    photos?: Photo[];
}

export class Profile implements Profile {
    constructor(user: User) {
        this.userName = user.userName;
        this.displayName = user.displayName;
        this.image = user.image;
    }
}

export class PartialProfile {
    displayName: string;
    bio?: string;
    
    constructor(profile: Profile) {
        this.displayName = profile.displayName;
        this.bio = profile.bio;
    }
}

export interface Photo {
    id: string;
    url: string;
    isMain: boolean;
}