import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Cliente } from '../cliente.model';
import { ClienteService } from '../cliente.service';
@Component({
  selector: 'app-cliente-lista',
  templateUrl: './cliente-lista.component.html',
  styleUrls: ['./cliente-lista.component.css']
})
export class ClienteListaComponent implements OnInit, OnDestroy {

  clientes:Cliente[] = [];
  private clientesSubscription: Subscription;

  constructor(public clienteService: ClienteService ) { }

  onDelete(id: string): void {
    this.clienteService.removerCliente(id);
  }

  ngOnInit(): void{
    this.clienteService.getClientes();



    //Insvrevendo o componen CLienteLista como observador do observavel 'listaClientesAtualizada'
    this.clientesSubscription = this.clienteService.getListaClienteAtualizadaObservable().subscribe( (clientes: Cliente[]) => {
    this.clientes = clientes
    });
  }

  ngOnDestroy(): void {
    this.clientesSubscription.unsubscribe();
  }
}
