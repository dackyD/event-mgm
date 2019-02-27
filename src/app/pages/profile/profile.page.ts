import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../services/user/auth.service';
import { ProfileService } from '../../services/user/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  public userProfile: any;
  public birthDate: Date;
  constructor(
    private alertCtrl: AlertController,
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router
  ) { }

  ngOnInit() {
    this.profileService
    .getUserProfile()
    .get()
    .then( userProfileSnapshot => {
      this.userProfile = userProfileSnapshot.data();
      this.birthDate = userProfileSnapshot.data().birthDate;
    });
  }

  /**
   *
   */
  logOut(): void {
    this.authService.logoutUser().then(() => {
      this.router.navigateByUrl('login');
    });
  }

  /**
   *
   */
  async updateName(): Promise<void> {
    const alert = await this.alertCtrl.create({
      subHeader: 'Your first name & last name',
      inputs: [
        {
          type: 'text',
          name: 'firstName',
          placeholder: 'Your first name',
          value: this.userProfile.firstName,
        },
        {
          type: 'text',
          name: 'lastName',
          placeholder: 'Your last name',
          value: this.userProfile.lastName,
        },
      ],
      buttons: [
        {text: 'Cancel'},
        {
          text: 'Save',
          handler: (data: {firstName: string, lastName: string}) => {
            this.profileService
                .updateName(data.firstName, data.lastName)
                .then(() => {
                  this.userProfile.firstName = data.firstName;
                  this.userProfile.lastName = data.lastName;
                }).catch( error => {
                  console.log(error.message);
            });
          }
        }
      ]
    });
    await alert.present();
  }

  /**
   *
   * @param birthDate
   */
  updateDOB(birthDate: string): void {
    if (birthDate === undefined) {
      return;
    }
    this.profileService.updateDOB(birthDate);
  }

  /**
   *
   */
  async updateEmail(): Promise<void> {
    const alert = await this.alertCtrl.create({
      inputs: [
        { type: 'text', name: 'newEmail', placeholder: 'Your new email' },
        { type: 'password', name: 'password', placeholder: 'Your Password' },
      ],
      buttons: [
        {text: 'Cancel'},
        {
          text: 'Save',
          handler: (data: {newEmail: string, password: string}) => {
            this.profileService
                .updateEmail(data.newEmail, data.password)
                .then(() => {
                  console.log('Email Changed Successfully');
                  this.userProfile.email = data.newEmail;
                }).catch( error => {
                  console.log('ERROR: ' + error.message);
            });
          },
        }
      ]
    });
    await alert.present();
  }

  async updatePassword(): Promise<any> {
    const alert = await this.alertCtrl.create({
      inputs: [
        {name: 'newPassword', placeholder: 'New password', type: 'password'},
        {name: 'oldPassword', placeholder: 'Old password', type: 'password'}
      ],
      buttons: [
        {text: 'Cancel'},
        {
          text: 'Save',
          handler: (data: {newPassword: string, oldPassword: string}) => {
            this.profileService.updatePassword(data.newPassword, data.oldPassword);
          }
        }
      ]
    });
    await alert.present();
  }








}
