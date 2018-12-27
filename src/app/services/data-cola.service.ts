import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { GLOBAL } from './global';
import { map } from "rxjs/operators";//Libreria para mapear objetos


@Injectable({
    providedIn: 'root'
})
export class DataColaService {

    public url: string;

    constructor(private _http: Http) {
        this.url = GLOBAL.url;

        this.getData();
    }

    getData() {
        return this._http.get(this.url).pipe(map(res => res.json()));
        // return this._http.get(this.url);
    }

}
