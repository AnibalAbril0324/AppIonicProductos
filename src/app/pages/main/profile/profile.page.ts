import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/Product.models';
import { User } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  firebaseService =inject(FirebaseService);
  utilsSvc=inject(UtilsService)

  constructor() { }

  ngOnInit() {
  }
  user(): User{
    return this.utilsSvc.getFromLocalStorage('user');
  }

  async takeImage(){
    let user=this.user();
    let path= `users/${user.uid}`
      
    const dataUrl= (await this.utilsSvc.takePicture('Imagen del Perfil')).dataUrl;

    const loading=await this.utilsSvc.loading();
    await loading.present();

    let imagePath= `${user.uid}/profile`;
    user.image = await this.firebaseService.uploadImage(imagePath,dataUrl); 

    this.firebaseService.updateDocument(path,{image: user.image}).then( async res => {
        
      this.utilsSvc.saveInLocalStorage('user',user);

      this.utilsSvc.presentToast({
        message: 'Imagen Actualizada Exitosamente',
        duration: 1500,
        color:'success',
        position:'middle',
        icon: 'checkmark-circle-outline'
      });

    }).catch(error => {
      console.log(error);
      this.utilsSvc.presentToast({
        message: 'ERROR  EL CORREO O CONTRASEÑA SON INCORRECTOS',
        duration: 2500,
        color:'primary',
        position:'middle',
        icon: 'alert-circle'
      });

    }).finally( () => {
      loading.dismiss();
    })
  }
}
