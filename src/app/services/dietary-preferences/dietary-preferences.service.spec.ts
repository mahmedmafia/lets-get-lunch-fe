import { TestBed } from '@angular/core/testing';

import { DietaryPreferencesService } from './dietary-preferences.service';
const dietPreferences = [
  { name: 'BBQ', checked: false },
  { name: 'Burger', checked: false },
  { name: 'Chinese', checked: false },
  { name: 'Deli', checked: false },
  { name: 'Fast Food', checked: false },
  { name: 'Italian', checked: false },
  { name: 'Japanese', checked: false },
  { name: 'Mexican', checked: false },
  { name: 'Pizza', checked: false }
];
describe('DietaryPreferencesService', () => {
  let service: DietaryPreferencesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[DietaryPreferencesService]
    });
    service = TestBed.inject(DietaryPreferencesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should have array with all marked as false check',()=>{
    for(let df of service.getdietPreferences()){
      expect(df.checked).toEqual(false);
    }
  })
  it('service should get all dietary preferences',()=>{

    expect(service.getdietPreferences()).toEqual(dietPreferences);
  })
});
