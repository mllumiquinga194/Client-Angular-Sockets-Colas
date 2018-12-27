import { Component, OnInit } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';
import { Ultimos } from 'src/app/classes/ultimos';

@Component({
  selector: 'app-publico',
  templateUrl: './publico.component.html',
  styleUrls: ['./publico.component.css']
})
export class PublicoComponent implements OnInit {

  public ultimosCuatro: Ultimos[] = [];
  public actual: Ultimos = {
    numero: 0,
    escritorio: 0
  };

  constructor(
    public _wsService: WebsocketService
  ) { }

  ngOnInit() {
    //Para remover la clase container
    document.getElementsByTagName('body')[0].classList.remove('container');

    // Solicitar Ultimos4
    this.ultimos4();

    this.escucharAtenderTicket();
  }

  //Solicitar Ultimos4
  ultimos4() {
    this._wsService.emit('ultimos4', null, (ultimos4: Ultimos[]) => {
      //aqui no necesito vaciar el arreglo ya que solo se llama una sola vez al cargar el componente!

      //Esta posicion sera la del numero y escritorio que estaran en el frente de la pantalla
      this.actual = {
        numero: ultimos4[0].numero,
        escritorio: ultimos4[0].escritorio
      }
      this.ultimosCuatro.push(...ultimos4);
      //Elimina el primer elemento del arreglo para no iterar sobre esa prosicion ya que estara ebn el centro de la pantalla
      this.ultimosCuatro.shift();
    });
  }

  //ESCUCHAR CUANDO UN TICKET ES ATENDIDO.
  escucharAtenderTicket() {
    this._wsService.listen('aumentar-ticket').subscribe((ultimos: Ultimos[]) => {
      this.ultimosCuatro = [];

      //Esta posicion sera la del numero y escritorio que estaran en el frente de la pantalla
      this.actual = {
        numero: ultimos[0].numero,
        escritorio: ultimos[0].escritorio
      }
      this.ultimosCuatro.push(...ultimos);
      //Elimina el primer elemento del arreglo para no iterar sobre esa prosicion ya que estara ebn el centro de la pantalla
      this.ultimosCuatro.shift();
    });
  }



}
