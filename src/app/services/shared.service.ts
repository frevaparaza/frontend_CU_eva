import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private data: any;

  setData(data: any) {
    this.data = data;
  }

  getData() {
    const temp = this.data;
    this.clearData();
    return temp;
  }

  clearData() {
    this.data = undefined;
  }

  private loadChatPreviewsSubject = new Subject<void>();

  triggerChatPreviewLoad() {
    this.loadChatPreviewsSubject.next();
  }

  getChatPreviewLoadTrigger(): Observable<void> {
    return this.loadChatPreviewsSubject.asObservable();
  }
}
