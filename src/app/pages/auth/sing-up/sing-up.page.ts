import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sing-up',
  templateUrl: './sing-up.page.html',
  styleUrls: ['./sing-up.page.scss'],
})
export class SingUpPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('',[Validators.required,Validators.email]),
    password: new FormControl('',[Validators.required]),
    name: new FormControl('',[Validators.required,Validators.minLength(4)])
  });

  constructor() { }

  firebaseService =inject(FirebaseService);
  utilsSvc=inject(UtilsService)
  ngOnInit() {
  }

  //la palabra async representa la eventual finalizacion (exito o fracaso) de una operacion asincrona
async submit(){
  if(this.form.valid){
    
    const loading=await this.utilsSvc.loading();
    await loading.present();
    
    //imprime en consola las credenciales ingresadas
    //enviamos el formulario al servicio para crear usuarios nuevos
    this.firebaseService.singUp(this.form.value as User).then( async res => {
      
      await this.firebaseService.updateUser(this.form.value.name);
      //imprime la respuesta a las credenciales ingresadas desde firebase
      console.log(res);

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
  console.log(this.form.value);

}

}
