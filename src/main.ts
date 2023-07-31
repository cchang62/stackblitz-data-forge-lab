import 'zone.js/dist/zone';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DataFrame } from 'data-forge';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <h1>Hello from {{name}}!</h1>
    <a target="_blank" href="https://angular.io/start">
      Learn more about Angular 
    </a>
    <br>
    <input type="file" class="file-input"
       (change)="onFileSelected($event)" #fileUpload>
<!--
    <div class="file-upload">

      {{fileName || "No file uploaded yet."}}

        <button mat-mini-fab color="primary" class="upload-btn"
          (click)="fileUpload.click()">
           <mat-icon>attach_file</mat-icon> 
        </button>
    </div>
    -->
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
        // console.log(this.userArray);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngOnInit(): void {
    this.testDataForge();
    this.whereClauseTest();
  }

  fileName = '';

  // constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    // https://web.dev/read-files/

    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;

      const formData = new FormData();

      formData.append('file', file);
      // console.log(formData);
      this.getMetadataForFileList(event.target.files);
      this.readCSV(file);
      // const upload$ = this.http.post('/api/thumbnail-upload', formData);
      // upload$.subscribe();
      // this.testDataForge;
    }
  }

  getMetadataForFileList(fileList: any) {
    for (const file of fileList) {
      // Not supported in Safari for iOS.
      const name = file.name ? file.name : 'NOT SUPPORTED';
      // Not supported in Firefox for Android or Opera for Android.
      const type = file.type ? file.type : 'NOT SUPPORTED';
      // Unknown cross-browser support.
      const size = file.size ? file.size : 'NOT SUPPORTED';
      console.log({ file, name, type, size });
    }
  }

  readCSV(file: any): any {
    // https://stackoverflow.com/questions/30223361/js-filereader-read-csv-from-local-file-jquery-csv
    // Check if the file is an csv.
    if (file.type && !file.type.startsWith('text/csv')) {
      console.log('File is not an csv.', file.type, file);
      return;
    }
    var reader = new FileReader();
    reader.readAsText(file);
    // let csv: any;
    reader.onload = function (event) {
      let csv = event.target?.result;
      // console.log(csv);
    };
    // console.log(csv);
    // this.printCSV(csv); // console.log(csv);
    reader.onerror = function () {
      alert('Unable to read ' + file.fileName);
    };
  }

  printCSV(csv: any) {
    console.log(csv);
  }

  testDataForge() {
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
    const pivotted = df.pivot(
      ['regiment', 'company'],
      'TestScore',
      (testScores) => testScores.average()
    );
    console.log('=====Call With Column: Pivotted=====');
    console.log(pivotted.toArray());
  }

  whereClauseTest() {
    const dataFrame = new DataFrame({
      columnNames: ['date', 'product', 'price', 'quantity'],
      rows: [
        ['01-03-2023', 'Apples', 3, 10],
        ['01-05-2023', 'Apples', 10, 6],
        ['02-03-2023', 'Bananas', 2, 20],
        ['03-03-2023', 'Oranges', 4, 5],
        ['03-23-2023', 'Oranges', 8, 15],
        ['05-03-2023', 'Strawberries', 8, 8],
        ['06-03-2023', 'Blueberries', 7, 12],
        ['09-03-2023', 'Grapes', 9, 5],
        ['10-03-2023', 'Kiwis', 8, 15],
        ['10-08-2023', 'Kiwis', 12, 10],
        ['15-03-2023', 'Pineapples', 7, 15],
        ['03-04-2023', 'Papayas', 6, 20],
      ],
    });
    // Raw data
    console.log('=====Call With CSV Option: Raw Data=====');
    console.log(dataFrame);
    // Filter data
    console.log('=====Call With CSV Option: Filtered Data: n-cond.=====');
    const filteredData = dataFrame.where(
      (row) => row.price > 6 && row.product === 'Oranges'
    );
    console.log(filteredData);
    console.log('=====Call With CSV Option: Filtered Data: Where-in=====');
    const filteredData1 = dataFrame.where((row) =>
      ['Kiwis', 'Apples'].includes(row.product)
    );
    console.log(filteredData1);
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

// import { HttpClient } from '@angular/common/http';

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
