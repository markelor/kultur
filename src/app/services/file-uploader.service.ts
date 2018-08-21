import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { LocalizeRouterService } from 'localize-router';
@Injectable()
export class FileUploaderService {
  public domain = this.authService.domain;
  public route;
  constructor(
    private authService: AuthService,
    private localizeService:LocalizeRouterService,
    private http: HttpClient
  ) { }

  // Function to create a new theme post
  public deleteImages(imageId,bucket,language) {
    this.route=encodeURIComponent(imageId)+'/'+encodeURIComponent(bucket)+'/';
    return this.http.delete<any>(this.domain + 'fileUploader/deleteImages/'+this.route+language);
  }
  // Function to create a new theme post
  public getSignatureFroala(bucket,language) {
    this.route=encodeURIComponent(bucket)+'/';
    return this.http.get<any>(this.domain + 'fileUploader/getSignatureFroala/'+this.route+language);
  }
  // Function to create a new theme post
  public uploadImagesBase64(bucket) {
    this.route=encodeURIComponent(bucket);
    return this.http.post<any>(this.domain + 'fileUploader/uploadImagesBase64',bucket);
  }
  // Function to create a new theme post
  public deleteProfileImage(username,name,bucket,language) {
    this.route=encodeURIComponent(username)+'/'+encodeURIComponent(name)+'/'+encodeURIComponent(bucket)+'/';
    return this.http.delete<any>(this.domain + 'fileUploader/deleteProfileImage/'+this.route+language);
  }
}

