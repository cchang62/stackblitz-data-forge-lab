import 'zone.js/dist/zone';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Hello from {{name}}!</h1>
    <a target="_blank" href="https://angular.io/start">
      Learn more about Angular 
    </a>
  `,
})
export class App {
  name = 'Angular';
  public userArray: User[] = [];
  constructor(private http: HttpClient) {
    this.http.get('assets/test.csv', { responseType: 'text' }).subscribe(
      (data) => {
        let csvToRowArray = data.split('\n');
        for (let index = 1; index < csvToRowArray.length - 1; index++) {
          let row = csvToRowArray[index].split(',');
          this.userArray.push(
            new User(parseInt(row[0], 10), row[1], row[2].trim())
          );
        }
        console.log(this.userArray);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}

export class User {
  id: number;
  name: String;
  lastName: String;

  constructor(id: number, name: String, lastName: String) {
    this.id = id;
    this.name = name;
    this.lastName = lastName;
  }
}

bootstrapApplication(App);
/*

type windowExtended = Window &
  typeof globalThis & {
    ngRef: NgModuleRef<AppModule>;
  };

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then((ref) => {
    // Ensure Angular destroys itself on hot reloads.
    const _window = window as windowExtended;
    if (_window['ngRef']) {
      _window['ngRef'].destroy();
    }
    _window['ngRef'] = ref;

    // Otherise, log the boot error
  })
  .catch((err) => console.error(err));
*/
import { DataFrame } from 'data-forge';
import { HttpClient } from '@angular/common/http';
let df = new DataFrame({
  columns: {
    regiment: [
      'Nighthawks',
      'Nighthawks',
      'Nighthawks',
      'Nighthawks',
      'Dragoons',
      'Dragoons',
      'Dragoons',
      'Dragoons',
      'Scouts',
      'Scouts',
      'Scouts',
      'Scouts',
    ],
    company: [
      '1st',
      '1st',
      '2nd',
      '2nd',
      '1st',
      '1st',
      '2nd',
      '2nd',
      '1st',
      '1st',
      '2nd',
      '2nd',
    ],
    TestScore: [4, 24, 31, 2, 3, 4, 24, 31, 2, 3, 2, 3],
  },
});
const pivotted = df.pivot(['regiment', 'company'], 'TestScore', (testScores) =>
  testScores.average()
);
console.log(pivotted.toArray());

/*
// Error in /turbo_modules/apache-arrow@11.0.0/fb/record-batch.js (8:21)
// Identifier 'Buffer' has already been declared
import { all, desc, op, table } from 'arquero';

// Average hours of sunshine per month, from https://usclimatedata.com/.
const dt = table({
  Seattle: [69, 108, 178, 207, 253, 268, 312, 281, 221, 142, 72, 52],
  Chicago: [135, 136, 187, 215, 281, 311, 318, 283, 226, 193, 113, 106],
  'San Francisco': [165, 182, 251, 281, 314, 330, 300, 272, 267, 243, 189, 156],
});

interface CityNum {
  Seattle: number;
  Chicago: number;
  'San Francisco'?: number;
}

// Sorted differences between Seattle and Chicago.
// Table expressions use arrow function syntax.
dt.derive({
  month: (d) => op.row_number(),
  diff: (d: CityNum) => d.Seattle - d.Chicago,
})
  .select('month', 'diff')
  .orderby(desc('diff'))
  .print();

// Is Seattle more correlated with San Francisco or Chicago?
// Operations accept column name strings outside a function context.
dt.rollup({
  corr_sf: op.corr('Seattle', 'San Francisco'),
  corr_chi: op.corr('Seattle', 'Chicago'),
}).print();

// Aggregate statistics per city, as output objects.
// Reshape (fold) the data to a two column layout: city, sun.
dt.fold(all(), { as: ['city', 'sun'] })
  .groupby('city')
  .rollup({
    min: (d) => op.min(d.sun), // functional form of op.min('sun')
    max: (d) => op.max(d.sun),
    avg: (d) => op.average(d.sun),
    med: (d) => op.median(d.sun),
    // functional forms permit flexible table expressions
    skew: ({ sun: s }) => (op.mean(s) - op.median(s)) / op.stdev(s) || 0,
  })
  .objects();
*/
