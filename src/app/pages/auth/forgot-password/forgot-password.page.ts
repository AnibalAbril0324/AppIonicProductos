import { Component, OnInit,inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('',[Validators.required,Validators.email]),
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
      this.firebaseService.sendRecoveryEmail(this.form.value.email).then(res => {
        //imprime la respuesta a las credenciales ingresadas desde firebase
        //console.log(res);

        this.utilsSvc.presentToast({
          message: 'Correo enviado con exito',
          duration: 1500,
          color:'primary',
          position:'middle',
          icon: 'mail-circle'
        });
        
        this.utilsSvc.routerLink('/auth');
        this.form.reset();

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
