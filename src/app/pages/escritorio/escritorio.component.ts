import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataColaService } from 'src/app/services/data-cola.service';
import { ActivatedRoute, Params } from '@angular/router';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-escritorio',
  templateUrl: './escritorio.component.html',
  styleUrls: ['./escritorio.component.css']
})
export class EscritorioComponent implements OnInit, OnDestroy {

  public numeroEnAtencion: string;
  public ultimoTicketAtendido: string;
  public escritorio: number;

  constructor(
    public _getData: DataColaService,
    private _route: ActivatedRoute,
    public _wsService: WebsocketService
  ) { }

  ngOnInit() {
    //Para agregar la clase container
    document.getElementsByTagName('body')[0].classList.add('container');

    this.nuevosTickets();
    this.obtenerEscritorio();

  }

  //Escucha cuando hay un nuevo tickets, esto lo hago para volver a habilitar el boton de atender tickets en los escritorios.
  nuevosTickets() {
    this._wsService.listen('nuevos-ticket').subscribe(() => {

      //Si el ultimo tickets atendido es *No hay Tickets*, yo le asigno el tickets en atencion al numero ticket atendido
      if (this.numeroEnAtencion = '*No hay Tickets*') {
        //obtengo el ultimo ticekt atendido desde el localstorage
        this.numeroEnAtencion = this._wsService.cargarStorage('tickets');
        // this.numeroEnAtencion = this.ultimoTicketAtendido;
      }
    });
  }

  obtenerEscritorio() {
    this._route.params.forEach((params: Params) => {
      this.escritorio = params['id'];

      //Si recargo la pagina, obtengo tambien el ultimo tickets que estaba atendiendo
      this.numeroEnAtencion = this._wsService.cargarStorage('tickets');
    });
  }

  //escucho cuando se atiende un nuevo tickets. ticketEnAtencion me puede traer un objeto con el numero en atencion si hay numeros en la cola o un string con *No hay Tickets* si ya no hay nadie en cola.
  atenderTicket() {
    this._wsService.emit('atender-ticket', this.escritorio, (ticketEnAtencion: any) => {

      //Si existe el ticketEnAtencion.numero, lo guardo en this.ultimoTicketAtendido para luego utuilizarlo cuando se vuelvan a generar nuevos tickets y tambien lo guardo en numeroEnAtencion para mostrarlo en la vista. utilice esta logica porque numeroEnAtencion puede tomar el valor de '*No hay Tickets*' cuando no hay gente en la cola. en cambio ultimoTicketAtendido mantiene siempre su valor.
      if (ticketEnAtencion.numero) {

        this._wsService.guardarStorage('tickets', ticketEnAtencion.numero);
        //Guardaba en una propiedad el ultimo tickets en atencion pero no es necesario ya que lo tengo en el localstorage, puedo sacarlo de ahi tambien
        // this.ultimoTicketAtendido = ticketEnAtencion.numero;

        return this.numeroEnAtencion = ticketEnAtencion.numero;
      }

      this.numeroEnAtencion = '*No hay Tickets*';
    });
  }

  ngOnDestroy(){

    //Cuando el componente muere libero el escritorio :)
    this._wsService.emit('liberarEscritorio', this.escritorio, (escritorios) => {

      //Puedo mostrar los escritorios existentes
      console.log('Escritorios Existentes: ',escritorios);
      
    });
    
  };
}
