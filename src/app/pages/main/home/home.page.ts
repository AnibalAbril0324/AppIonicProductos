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
}