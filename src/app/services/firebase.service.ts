import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.models';

//==============Firestore=====================
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsSvc =inject(UtilsService);

  constructor() { }

  // ================autenticacion=================================
  getAuth(){
    return getAuth();
  }

  // ===========Acceder==========================

  singIn(user :User){
    return signInWithEmailAndPassword(getAuth(),user.email, user.password);
  }

  // ===========Crear==========================
  singUp(user :User){
    return createUserWithEmailAndPassword(getAuth(),user.email, user.password);
  }

  // ===========Update==========================
  updateUser(displayName:string){
    return updateProfile(getAuth().currentUser,{displayName})
  }

  // ===========enviar datos para restablecer la contraseña==========================

  sendRecoveryEmail(email:string){
    return sendPasswordResetEmail(getAuth(),email);
  }
   // ===========Cerrar Sesion==============
  singOut(){
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }
    // ===========Base de datos==========================
    //============== Setear un documento =================
  setDocument(path:string,data:any){  
    return setDoc (doc(getFirestore(), path), data);
  }
  //============== obtener un documento =================
  async getDocument(path:string){
    return (await getDoc(doc(getFirestore(), path))).data();
  }
}