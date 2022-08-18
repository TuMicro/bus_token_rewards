import * as csvWriterLib from 'csv-writer';
import * as fs from "fs";
import csv from 'csv-parser';

export const writeCsv = async function (path: string, headers: string[], records: string[][]) {
    const createCsvWriter = csvWriterLib.createArrayCsvWriter;
    const csvWriter = createCsvWriter({
      header: headers,
      path: path
    });
    await csvWriter.writeRecords(records);
  };
  
  export const writeToCsvString = async function (headers: string[], records: string[][]) {
      const createArrayCsvStringifier = csvWriterLib.createArrayCsvStringifier;
      const csvWriter = createArrayCsvStringifier({
          header: headers,
      });
      return csvWriter.getHeaderString() + csvWriter.stringifyRecords(records);
  };

  export const readCsvFile = function (filename: string) : Promise<any[][]> {
    //console.log('...............')
    return new Promise((resolve, reject) => {
      const rows: any[] = [];
      fs.createReadStream(filename)
        .pipe(csv({
        headers: false
      })).on('data', (row: any) => {
        //console.log(row);
        rows.push(row);
      }).on('end', () => {
        resolve(rows);
      });
    });
  };


  export const chunker = function<T> (array: T[], chunk_length: number) {
    const chunks = [];
    let temparray;
    const j=array.length;
    for (let i=0; i<j; i+=chunk_length) {
        temparray = array.slice(i,i+chunk_length);
        chunks.push(temparray);
    }
    return chunks;
  }

  export const sleep = function (ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }