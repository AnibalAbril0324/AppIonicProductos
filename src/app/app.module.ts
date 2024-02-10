import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// ======firebase====
import { AngularFireModule } from '@angular/fire/compat'
import { environment } from 'src/environments/environment';
//import { MainPipe } from './pages/main.pipe';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,
            IonicModule.forRoot({mode:'md'}),//mode:'md' sirve para mantener el material asi se cambien los dispositivos
            AppRoutingModule,
            AngularFireModule.initializeApp(environment.firebaseConfig), //llamamos al archivo que contiene la llave
],  
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
