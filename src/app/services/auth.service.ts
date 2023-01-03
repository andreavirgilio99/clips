import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { delay, filter, map, Observable, of, switchMap } from 'rxjs';
import IUser from '../models/user.model';
import firebase from 'firebase/compat/app'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usersCollection: AngularFirestoreCollection<IUser>;
  isAuthenticated$: Observable<boolean>;
  isAuthenticatedWithDelay$: Observable<boolean>;
  redirect = false;

  authOnlyRoutes = ['/manage', '/upload']

  constructor(private auth: AngularFireAuth, private db: AngularFirestore, private router: Router, private route: ActivatedRoute) {
    this.usersCollection = db.collection('users');
    this.isAuthenticated$ = auth.user.pipe(
      map(user => !!user)
    )

    this.isAuthenticatedWithDelay$ = auth.user.pipe(
      map(user => !!user),
      delay(1000)
    )

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
      ).subscribe(data =>{
      let urlNoParams = '';

      if(router.url.includes('?')){
        urlNoParams = router.url.substring(0, router.url.indexOf('?'))
      }
      else{
        urlNoParams =  router.url;
      }

      this.redirect = this.authOnlyRoutes.includes(urlNoParams); //on logout if true redirect
    })
  }

  async createUser(userData: IUser) {

    if (!userData.password) {
      throw new Error('Password not provided!');
    }

    const userCred = await this.auth.createUserWithEmailAndPassword(userData.email, userData.password!);

    if (!userCred.user) {
      throw new Error('User can\'t be found');
    }

    await this.usersCollection.doc(userCred.user.uid).set({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber
    })

    await userCred.user.updateProfile({
      displayName: userData.name
    })
  }

  async login(email: string, password: string) {
    await this.auth.signInWithEmailAndPassword(email, password);
  }

  async logout() {
    await this.auth.signOut();

    if(this.redirect){ //redirect if user is in authOnly route
      await this.router.navigateByUrl('/')
    }
  }

  getUser(): Observable<firebase.User | null>{
    return this.auth.user;
  }
}
