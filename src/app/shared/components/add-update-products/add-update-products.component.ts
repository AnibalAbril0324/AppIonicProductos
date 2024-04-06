import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/Product.models';
import { User } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-products',
  templateUrl: './add-update-products.component.html',
  styleUrls: ['./add-update-products.component.scss'],
})
export class AddUpdateProductsComponent  implements OnInit {

  @Input() product: Product

  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('',[Validators.required]),
    name: new FormControl('',[Validators.required,Validators.minLength(4)]),
    price: new FormControl(null,[Validators.required,Validators.min(0)]),
    soldUnits: new FormControl(null,[Validators.required,Validators.min(0)]),
  });

  constructor() { }

  firebaseService =inject(FirebaseService);
  utilsSvc=inject(UtilsService)
  
  //declaramos una variable user que es igual a un objeto
  user={} as User;

  ngOnInit() {
    this.user= this.utilsSvc.getFromLocalStorage('user');
    if(this.product) this.form.setValue(this.product);
  }

  async takeImage(){
    const dataUrl= (await this.utilsSvc.takePicture('Imagen del Producto')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  submit(){
    if(this.form.valid){
      if(this.product) this.updateProduct();
      else this.createProduct();
    }
  }
  //===convierte valores de string a numero========
  setNumbersInputs(){
    let {soldUnits, price} = this.form.controls;

    if(soldUnits.value) soldUnits.setValue(parseFloat(soldUnits.value));
    if(price.value) price.setValue(parseFloat(price.value));
  }

  //=======crear=============
  //la palabra async representa la eventual finalizacion (exito o fracaso) de una operacion asincrona
  async createProduct(){

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
          message: 'Producto creado Exitosamente',
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
    console.log(this.form.value);
  }

  //=======actualizar=============
  async updateProduct(){

      let path= `users/${this.user.uid}/products/${this.product.id}`
      
      const loading=await this.utilsSvc.loading();
      await loading.present();
      
      //si cambio la imagen subir y obtener la url
      if(this.form.value.image !== this.product.image){
        let dataUrl = this.form.value.image;
        //let imagePath= `${this.user.uid}/${Date.now()}`;
        let imagePath= await this.firebaseService.getFilePath(this.product.image);
        let imageUrl = await this.firebaseService.uploadImage(imagePath,dataUrl); 
        this.form.controls.image.setValue(imageUrl);
      }
        
      //eliminamos el id porque estamos agregando un producto
      delete this.form.value.id 
      
      
      //imprime en consola las credenciales ingresadas
      //enviamos el formulario al servicio para crear usuarios nuevos
      this.firebaseService.updateDocument(path,this.form.value).then( async res => {
        
        this.utilsSvc.dismisModal({success: true}); //cerramos el modal cuando se crea exitosamente 

        this.utilsSvc.presentToast({
          message: 'Producto Actualizado Exitosamente',
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
    
    console.log(this.form.value);

  }
  

}