import { Component, OnInit } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';
import { DataColaService } from 'src/app/services/data-cola.service';

@Component({
  selector: 'app-nuevo-ticket',
  templateUrl: './nuevo-ticket.component.html',
  styleUrls: ['./nuevo-ticket.component.css']
})
export class NuevoTicketComponent implements OnInit {

  public ticket: string;

  constructor(
    public _wsService: WebsocketService,
    public _getData: DataColaService
  ) { }

  ngOnInit() {
    //Para agregar la clase container
    document.getElementsByTagName('body')[0].classList.add('container');

    // OBTENER DATOS
    this.obtenerUltimo();

    // ESCUCHAR NUEVOS TICKETS
    //NO lo deje de esta forma porque en el mismo emit tengo la respuesta de la peticion que solicite a travez del tercer parametro que es una funcion. en el servidor utilizo esa funcion para responder y no necesito estas escuchando otros eventos para obtener esta respuesta!
    // this.escucharTicketsNuevos();
  }

  //OBTENGO MEDIANTE REST EL ULTIMO TICKET
  obtenerUltimo() {
    this._getData.getData().subscribe((ultimoTicket: string) => this.ticket = ultimoTicket);
  }

  //SE GENERA UN  NUEVO TICKET CUANDO LLAMO DESDE LA VISTA
  nuevoTicket() {
    this._wsService.emit('nuevo-ticket', null, (ticket: string) => {
      this.ticket = ticket
    });
  }

}
