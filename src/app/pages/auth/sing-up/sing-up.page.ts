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
    uid: new FormControl(''),
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

        //obtenemos el uid y lo agregamos al formulario
        let uid= res.user.uid;
        this.form.controls.uid.setValue(uid);

        //llamamos a la funciona para guardar en la base de datos
        this.setUserInfo(uid);

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

async setUserInfo(uid:string){
    if(this.form.valid){
      
      const loading=await this.utilsSvc.loading();
      await loading.present();
      
      // obtengo el uid 
      // al usar comillas invertidas hace referencia a que envio en valor de la variable uid
      let path = `users/${uid}`;
      delete this.form.value.password; //no envia la contraseña

      this.firebaseService.setDocument(path, this.form.value).then( async res => {
      
      this.utilsSvc.saveInLocalStorage('user',this.form.value);
      //enrutamos a la pagina home
      this.utilsSvc.routerLink('/main/home')
      //limpiamos los campos del formulario
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
