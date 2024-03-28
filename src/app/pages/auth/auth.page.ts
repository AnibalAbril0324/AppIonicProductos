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
        //console.log(res);
      this.getUserInfo(res.user.uid);

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


  async getUserInfo(uid:string) {
    if(this.form.valid){
      
      const loading=await this.utilsSvc.loading();
      await loading.present();
      
      // obtengo el uid 
      // al usar comillas invertidas hace referencia a que envio en valor de la variable uid
      let path = `users/${uid}`;
  
      this.firebaseService.getDocument(path).then((user:User) => {
      
      this.utilsSvc.saveInLocalStorage('user',user);
      //enrutamos a la pagina home
      this.utilsSvc.routerLink('/main/home')    
      //limpiamos los campos del formulario 
      this.form.reset();
      
      this.utilsSvc.presentToast({
        message: `Te damos la bienvenida ${user.name}`,
        duration: 1500,
        color:'primary',
        position:'middle',
        icon: 'person-circle-outline'
      });

      }).catch(error => {
        console.log(error);
        
        this.utilsSvc.presentToast({
          message: 'ERROR EL CORREO O CONTRASEÑA SON INCORRECTOS',
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
