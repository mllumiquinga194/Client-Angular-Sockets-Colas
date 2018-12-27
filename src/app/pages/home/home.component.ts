import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public min: number = 1;
  public alertMessage;
  constructor(
    private _router: Router,
    public _wsService: WebsocketService
  ) { }

  ngOnInit() {
    //Para agregar la clase container
    document.getElementsByTagName('body')[0].classList.add('container');

  }

  entrar(numero: number) {

    this._wsService.emit('existe', numero, (existe: boolean) =>{
      if (!numero || numero < 0 || existe ) {
        this.alertMessage = 'Escritorio invalido o ya Existe!!';
        return;
      }
      this._router.navigate(['/escritorio', numero]);
    });
  }

}
