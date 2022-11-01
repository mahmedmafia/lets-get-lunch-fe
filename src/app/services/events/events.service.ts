import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Event } from './event';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  eventAPI=environment.API_URL+'/events';
  constructor(private http: HttpClient) { }

  create(event: Event): Observable<Event> {
    return this.http.post<Event>(this.eventAPI, event);
  }
}
