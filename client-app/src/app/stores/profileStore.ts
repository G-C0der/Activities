import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import {Photo, Profile } from "../models/profile";
import { store } from "./store";

export default class ProfileStore {
    profile: Profile | null = null;
    loadingProfile = false;
    uploading = false;
    loading = false;
    followings: Profile[] = [];
    loadingFollowings = false;
    activeTab = 0;
    
    constructor() {
        makeAutoObservable(this);
        
        reaction(
            () => this.activeTab,
            activeTab => {
                if (activeTab === 3 || activeTab === 4) {
                    const predicate = activeTab === 3 ? 'followers' : 'targets';
                    this.loadFollowings(predicate);
                } else {
                    this.followings = [];
                }
            }
        )
    }
    
    setActiveTab = (activeTab: any) => {
        this.activeTab = activeTab;
    }
    
    get isCurrentUser() {
        return store.userStore.user && this.profile
            ? store.userStore.user.userName === this.profile.userName
            : false;
    }
    
    loadProfile = async (userName: string) => {
        this.loadingProfile = true;
        try {
            const profile = await agent.Profiles.get(userName);
            runInAction(() => {
                this.profile = profile;
                this.loadingProfile = false
            });
        } catch (error) {
            console.log(error);
            runInAction(() => this.loadingProfile = false);
        }
    }
    
    updateProfile = async (profile: Partial<Profile>) => {
        this.loading = true;
        try {
            await agent.Profiles.edit(profile);
            if (profile.displayName && profile.displayName !== store.userStore.user?.displayName) {
                store.userStore.setDisplayName(profile.displayName);
            }
            runInAction(() => {
                this.profile = {...this.profile, ...profile as Profile};
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false);
        }
    }
    
    uploadPhoto = async (file: Blob) => {
        this.uploading = true;
        try {
            const photo = await agent.Profiles.uploadPhoto(file);
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos?.push(photo);
                    if (photo.isMain && store.userStore.user) {
                        store.userStore.setImage(photo.url);
                        this.profile.image = photo.url;
                    }
                }
                this.uploading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.uploading = false);
        }
    }
    
    setMainPhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            await agent.Profiles.setMainPhoto(photo.id);
            store.userStore.setImage(photo.url);
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos.find(p => p.isMain)!.isMain = false;
                    this.profile.photos.find(p => p.id === photo.id)!.isMain = true;
                    this.profile.image = photo.url;
                    this.loading = false;
                }
            });
        } catch (error) {
            runInAction(() => this.loading = false);
            console.log(error);
        }
    }
    
    deletePhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            await agent.Profiles.deletePhoto(photo.id);
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos = this.profile.photos.filter(p => p.id !== photo.id);
                    this.loading = false;
                }
            });
        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false);
        }
    }
    
    updateFollowing = async (userName: string, following: boolean) => {
        this.loading = true;
        try {
            await agent.Profiles.updateFollowing(userName);
            store.activityStore.updateAttendeeFollowing(userName);
            runInAction(() => {
                if (this.profile && this.profile.userName !== store.userStore.user?.userName && 
                    this.profile.userName === userName) {
                    this.profile.following = !this.profile.following;
                    following ? this.profile.followersCount++ : this.profile.followersCount--;
                }
                if (this.profile && this.profile.userName === store.userStore.user?.userName) {
                    this.profile.following = !this.profile.following;
                    following ? this.profile.targetCount++ : this.profile.targetCount--;
                }
                this.followings.forEach(profile => {
                    if (profile.userName === userName) {
                        profile.following = !profile.following;
                        profile.following ? profile.followersCount++ : profile.followersCount--;
                    }
                })
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false);
        }
    }
    
    loadFollowings = async (predicate: string) => {
        this.loadingFollowings = true;
        try {
            const followings = await agent.Profiles.listFollowings(this.profile!.userName, predicate);
            runInAction(() => {
                this.followings = followings;
                this.loadingFollowings = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loadingFollowings = false);
        }
    }
}