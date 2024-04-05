import { Component, OnInit, inject } from '@angular/core';
import { Product } from 'src/app/models/Product.models';
import { User } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductsComponent } from 'src/app/shared/components/add-update-products/add-update-products.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  //arreglo de produtos
  products: Product []=[];


  ngOnInit() {
  }
  //========cerrar sesion==========
  /*singOut(){
    this.firebaseSvc.singOut();
  }*/

  user(): User{
    return this.utilsSvc.getFromLocalStorage('user');
  }
  //sireve para entrar en la funcion cada vez que el usuario entra en la pagina
  ionViewWillEnter() {
    this.getProductos();
  }

  //======obtener productos===============
  getProductos(){
    let path= `users/${this.user().uid}/products`

    let sub=this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        console.log(res);
        this.products = res;
        sub.unsubscribe();
      }
    })
  }

  //==========agregar un producto==========
  // al colocar "?" este parametro nos es requerido
  async addUpdateProduct(product?:Product){
    //[ara poder recargar la pagina automaticamnte]
    let success = await this.utilsSvc.abrirModal({
      component: AddUpdateProductsComponent,
      cssClass : 'add-update-modal',
      componentProps:{product}
    })

    if(success) this.getProductos();
  }

  //====confirmar la eliminacion del prodcuto==========
  async confirmDeleteProduct(product: Product) {
    this.utilsSvc.presentAlert({
      header: 'Eliminar Producto!',
      message: '¿Quieres eliminar este producto?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
        }, {
          text: 'Si, Eliminar',
          handler: () => {
            this.deleteProduct(product);
          }
        }
      ]
    });
  }


     //=======eliminar=============
  async deleteProduct(product: Product){

    let path= `users/${this.user().uid}/products/${product.id}`
      
    const loading=await this.utilsSvc.loading();
    await loading.present();
      

    let imagePath= await this.firebaseSvc.getFilePath(product.image);
    await this.firebaseSvc.deleteFile(imagePath);
      //imprime en consola las credenciales ingresadas
      //enviamos el formulario al servicio para crear usuarios nuevos
    this.firebaseSvc.deleteDocument(path).then( async res => {
      
      this.products = this.products.filter(p => p.id !== product.id);
      this.utilsSvc.presentToast({
        message: 'Producto Eliminado Exitosamente',
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
    
    //console.log(this.form.value);
  
  }
}