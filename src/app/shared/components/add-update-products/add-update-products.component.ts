import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-products',
  templateUrl: './add-update-products.component.html',
  styleUrls: ['./add-update-products.component.scss'],
})
export class AddUpdateProductsComponent  implements OnInit {

  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('',[Validators.required]),
    name: new FormControl('',[Validators.required,Validators.minLength(4)]),
    price: new FormControl('',[Validators.required,Validators.min(0)]),
    soldUnits: new FormControl('',[Validators.required,Validators.min(0)]),
  });

  constructor() { }

  firebaseService =inject(FirebaseService);
  utilsSvc=inject(UtilsService)
  
  //declaramos una variable user que es igual a un objeto
  user={} as User;

  ngOnInit() {
    this.user= this.utilsSvc.getFromLocalStorage('user');
  }

  async takeImage(){
    const dataUrl= (await this.utilsSvc.takePicture('Imagen del Producto')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  //la palabra async representa la eventual finalizacion (exito o fracaso) de una operacion asincrona
async submit(){
    if(this.form.valid){
      
      let path= `users/${this.user.uid}/products`
      
      const loading=await this.utilsSvc.loading();
      await loading.present();
      
      //subir la imagen y obtener la url
      let dataUrl = this.form.value.image;
      let imagePath= `${this.user.uid}/${Date.now()}`;
      let imageUrl = await this.firebaseService.uploadImage(imagePath,dataUrl); 
      this.form.controls.image.setValue(imageUrl);

      //eliminamos el id porque estamos agregando un producto
      delete this.form.value.id 
      
      
      //imprime en consola las credenciales ingresadas
      //enviamos el formulario al servicio para crear usuarios nuevos
      this.firebaseService.addDocument(path,this.form.value).then( async res => {
        
        this.utilsSvc.dismisModal({success: true}); //cerramos el modal cuando se crea exitosamente 

        this.utilsSvc.presentToast({
          message: 'Producto Creado Exitosamente',
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
    console.log(this.form.value);

  }
}
