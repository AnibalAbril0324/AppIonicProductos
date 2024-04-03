import { Component, OnInit, inject } from '@angular/core';
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


  ngOnInit() {
  }
  //========cerrar sesion==========
  singOut(){
    this.firebaseSvc.singOut();
  }

  //==========agregar un producto==========

  addUpdateProducts(){
    this.utilsSvc.abrirModal({
      component: AddUpdateProductsComponent,
      cssClass : 'add-update-modal-'
    })
  }
}
