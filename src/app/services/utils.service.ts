import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  loadingCtrl=inject(LoadingController);
  toastCtrl = inject(ToastController); //sirve para capturar el error al ingresar las credenciales
  router = inject(Router)

  loading(){
    return this.loadingCtrl.create({spinner:'crescent'})
  }

  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  //enruta a cualquier pagina disponible
  routerLink(url:string){
    return this.router.navigateByUrl(url);
  }

  //guardar un elemento en local storage
  saveInLocalStorage(key:string, value:any){
    //JSON.stringify(value) convertimos a string
    return localStorage.setItem(key, JSON.stringify(value));
  }

  //obtiene unn elemento del local storage

  getFromLocalStorage(key:string){
    //convetimos el string en objeto
    return JSON.parse(localStorage.getItem(key));
  }
}   
