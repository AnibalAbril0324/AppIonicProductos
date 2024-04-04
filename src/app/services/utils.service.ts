import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  loadingCtrl=inject(LoadingController);
  toastCtrl = inject(ToastController); //sirve para capturar el error al ingresar las credenciales
  modalCtrl = inject(ModalController)
  router = inject(Router)


  async takePicture(promptLabelHeader: string) {
    return await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.DataUrl,
    source: CameraSource.Prompt,
    promptLabelHeader,
    promptLabelPhoto: 'Selecciona una imagen',
    promptLabelPicture : 'Toma una foto'
  });
};


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

  //============modal===================
  async abrirModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
    await modal.present(); // Muestra el modal en la pantalla
    const {data} =await modal.onWillDismiss(); //obtener la data cuando se cierra
    if (data) return data;
  }

  dismisModal(data?:any){
    return this.modalCtrl.dismiss(data);//sirve para cerrar un modal 
                                        //abierto y opcionalmente pasar 
                                        //datos de vuelta a la página que lo abrió. 
                                        //Es una función útil cuando necesitas cerrar el modal 
                                        //desde dentro del propio modal, como en un botón de "Cancelar" o "Aceptar".
  }

  
}   
