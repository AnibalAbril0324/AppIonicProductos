import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

    form = new FormGroup({
    email: new FormControl('',[Validators.required,Validators.email]),
    password: new FormControl('',[Validators.required])
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
    this.firebaseService.singIn(this.form.value as User).then(res => {
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
