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

async submit(){
  if(this.form.valid){
    
    const loading=await this.utilsSvc.loading();
    await loading.present();
    
    this.firebaseService.singIn(this.form.value as User).then(res => {
      console.log(res);

    }).catch(error => {
      console.log(error);

    }).finally( () => {
      loading.dismiss();
    })
  }
  console.log(this.form.value);

}
}
