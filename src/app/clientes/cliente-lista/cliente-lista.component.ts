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
  public estaCarregando:boolean = false;

  constructor(public clienteService: ClienteService ) { }

  onDelete(id: string): void {
    this.clienteService.removerCliente(id);
  }

  ngOnInit(): void{

    this.estaCarregando = true;

    this.clienteService.getClientes();



    //Insvrevendo o componen CLienteLista como observador do observavel 'listaClientesAtualizada'
    this.clientesSubscription = this.clienteService.getListaClienteAtualizadaObservable().subscribe((clientes: Cliente[]) => {
    this.clientes = clientes

    this.estaCarregando = false;
    });
  }

  ngOnDestroy(): void {
    this.clientesSubscription.unsubscribe();
  }
}

