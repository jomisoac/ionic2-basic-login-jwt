import { Component } from '@angular/core';
import {AuthServiceProvider} from '../../providers/auth-service/auth-service';
import {HomePage} from '../../pages/home/home';
import {NavController, AlertController, LoadingController} from 'ionic-angular';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  providers: [AuthServiceProvider],
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user_login : string;
  user_password: string;

  constructor (private users:AuthServiceProvider,public nav:NavController, public alertCtrl:AlertController,public loadingCtrl:LoadingController) {}

  goToHomePage() {
    this.nav.push(HomePage);
  }

  login(user_login, user_password) {

    if (user_login == '' || user_password == '')
    {
      this.alertConnexionError();
      return;
    }

    let loading = this.loadingCtrl.create({
      content: 'Conectando ...'
    });

    loading.present();

    // Server authentication.
    this.users.getUser(user_login, user_password).subscribe(token => {
      loading.dismiss();

      // If the user credentials are valid, the current user is redirected to the home page.
      if (token && token != 'undefined' && token != 'No user found') {
        let user = token.data.user;
        localStorage.setItem('id_token', token.data.token);
        localStorage.setItem('user_login', JSON.stringify(user));
        this.goToHomePage();
      } else {
        this.alertConnexionError();
      }
    });
  }

  alertConnexionError() {
    let alert = this.alertCtrl.create({
      title: 'Error!',
      subTitle: 'Coneccion rechazada. Verifica Usuario/Contrase&ntilde;a.',
      buttons: ['OK']
    });
    alert.present();
  }
}
