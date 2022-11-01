import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Event } from 'src/app/services/events/event';
import { EventsService } from 'src/app/services/events/events.service';
declare var google:any;
@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent implements OnInit {
  eventForm:FormGroup;
  location: any;
  error='';
  success='';
  @ViewChild('city', { static: false }) citySearch: ElementRef;

  constructor(private fb: FormBuilder,
    private gmaps: MapsAPILoader,
    private ngZone: NgZone,private authServ:AuthService,private eventServ:EventsService) {}

  ngOnInit(): void {
    this.createForm();
  }
  createForm(){
    this.eventForm=this.fb.group({
      title: ['', Validators.required],
      description: [''],
      location: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      suggestLocations: [false, Validators.required]
    });
    this.loadPlaces();
  }
  loadPlaces(){
    this.gmaps.load().then(()=>{
      const autoComplete=new google.maps.places.Autocomplete(this.citySearch.nativeElement, {
        types: ['(cities)'],
        componentRestrictions: { 'country': 'us' }
      })
      autoComplete.addListener('place_changed',()=>{
        this.ngZone.run(()=>{
          this.location=autoComplete.getPlace();
          console.log('location ', this.location);
        })
      })
    });
  }
  onSubmit() {
    this.error = '';
    this.success = '';

    const user = this.authServ.currentUser();
    const event: Event = {
      _creator: user._id,
      title: this.eventForm.value.title,
      description: this.eventForm.value.description,
      startTime: this.eventForm.value.startTime,
      endTime: this.eventForm.value.endTime,
      city: this.location.address_components[0].long_name,
      state: this.location.address_components[2].short_name,
      suggestLocations: this.eventForm.value.suggestLocations
    };

    this.eventServ.create(event).subscribe(res => {
      this.success = 'Your event has been created.';
      this.error='';
    }, err => {
      this.error = err.error.message;
    });
  }
}

