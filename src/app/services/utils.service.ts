import { inject, Injectable } from '@angular/core';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  loadingCtrl=inject(LoadingController);
  toastCtrl = inject(ToastController); //sirve para capturar el error al ingresar las credenciales

  loading(){
    return this.loadingCtrl.create({spinner:'crescent'})
  }

  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }
}   
