import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Algoritmo } from './algoritmo';

describe('Algoritmo', () => {
  let component: Algoritmo;
  let fixture: ComponentFixture<Algoritmo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Algoritmo],
    }).compileComponents();

    fixture = TestBed.createComponent(Algoritmo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
