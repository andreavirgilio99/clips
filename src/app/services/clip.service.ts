import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QueryDocumentSnapshot, QuerySnapshot } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, combineLatest, from, map, Observable, of, switchMap } from 'rxjs';
import IClip from '../models/clip.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClipService implements Resolve<IClip | null>{

  private clipsCollection: AngularFirestoreCollection<IClip>;

  pageClips: IClip[] = [];
  pendingReq = false;

  constructor(private storage: AngularFireStorage, private db: AngularFirestore, private auth: AuthService, private router: Router) {
    this.clipsCollection = db.collection('clips');
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): IClip | Observable<IClip | null> | Promise<IClip | null> | null {
    return this.clipsCollection.doc(route.params.id).get().pipe(
      map(snapshot => {
        const data = snapshot.data();

        if (!data) {
          this.router.navigate(['/']);
          return null;
        }

        return data;
      })
    )
  }

  saveClip(clip: IClip): Promise<DocumentReference<IClip>> {
    return this.clipsCollection.add(clip);
  }

  updateClip(id: string, title: string): Promise<void> {
    return this.clipsCollection.doc(id).update({
      title: title
    })
  }

  findAllByCurrentUser(sort$: BehaviorSubject<string>): Observable<QueryDocumentSnapshot<IClip>[]> {
    return combineLatest([this.auth.getUser(), sort$]).pipe(
      switchMap(values => {
        const user = values[0];
        const sort = values[1];
        if (!user) {
          return of([]);
        }

        const query = this.clipsCollection.ref.where('uid', '==', user?.uid
        ).orderBy(
          'timestamp',
          sort === '1' ? 'desc' : 'asc'
        );
        return from(query.get());
      }),
      map(snapshot => (snapshot as QuerySnapshot<IClip>).docs)
    );
  }

  deleteClip(clip: IClip) {
    const clipRef = this.storage.refFromURL(clip.url);
    clipRef.delete().subscribe({
      next: async () => {
        await this.clipsCollection.doc(clip.docID).delete()
      },
      error: (error) => { console.error }
    })
  }

  async getClips(limit: number) {
    if (this.pendingReq) {
      return;
    }

    this.pendingReq = true;

    let query = this.clipsCollection.ref.orderBy(
      'timestamp', 'desc'
    ).limit(limit)

    const { length } = this.pageClips;

    if (length) {
      const lastDocID = this.pageClips[length - 1].docID;
      const lastDoc = await this.clipsCollection.doc(lastDocID)
        .get()
        .toPromise();

      query = query.startAfter(lastDoc)
    }

    const snapshot = await query.get();

    snapshot.forEach(doc => {
      this.pageClips.push({
        docID: doc.id,
        ...doc.data()
      })
    })
    this.pendingReq = false;
  }
}
