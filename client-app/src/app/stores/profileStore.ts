import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import {PartialProfile, Photo, Profile } from "../models/profile";
import { store } from "./store";

export default class ProfileStore {
    profile: Profile | null = null;
    loadingProfile = false;
    uploading = false;
    loading = false;
    
    constructor() {
        makeAutoObservable(this);
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
    
    updateProfile = async (profile: PartialProfile) => {
        this.loading = true;
        try {
            await agent.Profiles.edit(profile);
            store.userStore.setDisplayName(profile.displayName);
            runInAction(() => {
                if (this.profile) {
                    this.profile = {...this.profile, ...profile};
                }
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
}