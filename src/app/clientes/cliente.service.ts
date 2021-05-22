import { Cliente } from "./cliente.model"
import { Subject } from 'rxjs';

import { HttpClient } from '@angular/common/http'
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { stringify } from "@angular/compiler/src/util";

@Injectable({ providedIn: 'root' })
export class ClienteService {

  private clientes:Cliente[] = []
  private listaClientesAtualizada = new Subject<Cliente[]>()

  constructor(private httpClient: HttpClient) {

  }

  getClientes(): void{
    // conectar no servidor;
    this.httpClient.get<{
      mensagem: string,
      clientes: any
    }>('http://localhost:3500/api/clientes')
    .pipe(
      map(
        (dados) => {
          return dados.clientes.map((cliente) => {
            return {
              id: cliente._id,
              nome: cliente.nome,
              fone: cliente.fone,
              email: cliente.email,
            }
          })
        }))
    .subscribe(
      (clientes) => {
        this.clientes = clientes;
        this.listaClientesAtualizada.next([...this.clientes]);
      }
    )
  }

  removerCliente(id: string): void {
    this.httpClient.delete(`http://localhost:3500/api/clientes/${id}`).subscribe(()  => {
      console.log('Cliente removido');
      this.clientes = this.clientes.filter((cliente) => {
        return cliente.id !== id;

      });

      this.listaClientesAtualizada.next([...this.clientes])
      console.log(this.clientes)
    });
  }


  AdicionarCliente(nome:string, fone:string, email:string) {
    const cliente: Cliente = {
      id: "",
      nome: nome,
      fone: fone,
      email: email
    }
    this.httpClient.post<{mensagem: string, id:string }>('http://localhost:3500/api/clientes', cliente).subscribe((dados) => {
      console.log(dados.mensagem);
      cliente.id = dados.id
      this.clientes.push(cliente)
       //Alertando os OBSERVADORES de que os dados foram atualizados
      this.listaClientesAtualizada.next([...this.clientes])
    })
  }


  // método para que outros componentes possam observar o 'listaClientesAtualizada'
  getListaClienteAtualizadaObservable() {
    return this.listaClientesAtualizada.asObservable()
  }
  getCliente (idCliente: string)
 {
   return { ...this.clientes.find((cli) => cli.id === idCliente)};
 }
 atualizarCliente (id:string, nome: string, fone: string, email:string) {
  const cliente: Cliente = {id, nome, fone, email};
  this.httpClient.put(`http://localhost:3000/api/clientes/#{id}`, cliente).subscribe((res => {
    const copia = [...this.clientes];
    const indice = copia.findIndex(cli => cli.id === cliente.id);
    copia[indice] = cliente;
    this.clientes = copia;
    this.listaClientesAtualizada.next([...this.clientes]);
  }));
}

 





}