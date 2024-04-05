import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.models';

//==============Firestore=====================
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc, addDoc, collection,collectionData,query, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import {getStorage, uploadString, ref, getDownloadURL, deleteObject } from "firebase/storage";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsSvc =inject(UtilsService);
  storage = inject(AngularFirestore);

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

  //========obtener dod de la base ======================
  //el ? se utiliza para requerir o no la coleccion
  getCollectionData(path:string, collectionQuery?:any ){
    const ref = collection(getFirestore(),path);
    return collectionData(query(ref,collectionQuery),{idField:'id'});
    //obtenemos los productos desde la coleccion
  }

    //============== Setear un documento =================
    //guardamos los datos del usuario
  setDocument(path:string,data:any){  
    return setDoc (doc(getFirestore(), path), data);
  }

    //actualizar los datos del usuario
  updateDocument(path:string,data:any){  
    return updateDoc(doc(getFirestore(), path), data);
  }

    //eliminar un documento
  deleteDocument(path:string){  
    return deleteDoc(doc(getFirestore(), path));
  }

  //============== obtener un documento =================
  async getDocument(path:string){
    return (await getDoc(doc(getFirestore(), path))).data();
  }

   //============== agregar un documento =================
  addDocument(path:string,data:any){
    return addDoc (collection(getFirestore(), path), data);
  }

  //============almacenamiento============
  async uploadImage(path:string, data_url:string){
    return uploadString(ref(getStorage(),path),data_url,'data_url').then(() => {
      return getDownloadURL(ref(getStorage(),path))
    })
  }

  //=====obtener ruta de la img con su url===========
  async getFilePath(url:string){
    return ref(getStorage(),url).fullPath
  }

   //===eliminar archivo===
  deleteFile(path:string){
    return deleteObject(ref(getStorage(),path));
  }
}