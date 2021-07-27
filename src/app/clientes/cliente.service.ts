import { Cliente } from "./cliente.model"
import { Subject } from 'rxjs';

import { HttpClient } from '@angular/common/http'
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Router } from "@angular/router"

@Injectable({ providedIn: 'root' })
export class ClienteService {

  private clientes:Cliente[] = []
  private listaClientesAtualizada = new Subject<Cliente[]>()

  constructor(private httpClient: HttpClient, private router: Router) {

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


  AdicionarCliente(nome:string, fone:string, email:string, imagem: File) {
    // const cliente: Cliente = {
    //   id: "",
    //   nome: nome,
    //   fone: fone,
    //   email: email,
    // }
    const dadosCliente = new FormData();
    dadosCliente.append('nome', nome);
    dadosCliente.append('fone', fone);
    dadosCliente.append('email', email);
    dadosCliente.append('imagem', imagem);

    this.httpClient.post<{mensagem: string, id:string }>('http://localhost:3500/api/clientes', dadosCliente).subscribe((dados) => {
      console.log(dados.mensagem);
      //Cliente.id = dados.id
      const cliente: Cliente = {
        id: dados.id,
        nome: nome,
        fone: fone,
        email: email
      }
      this.clientes.push(cliente)
       //Alertando os OBSERVADORES de que os dados foram atualizados
      this.listaClientesAtualizada.next([...this.clientes])
      this.router.navigate(['/']);
    })
  }

  // método para que outros componentes possam observar o 'listaClientesAtualizada'
  getListaClienteAtualizadaObservable() {
    return this.listaClientesAtualizada.asObservable()
  }

  getCliente (idCliente: string){
    //return {...this.clientes.find((cli) => cli.id === idCliente)};
    return this.httpClient.get<{_id: string, nome: string, fone: string, email:
    string}>(`http://localhost:3500/api/clientes/${idCliente}`);
  }

  atualizarCliente (id:string, nome: string, fone: string, email:string) {
  const cliente: Cliente = {id, nome, fone, email};
  this.httpClient.put(`http://localhost:3500/api/clientes/${id}`, cliente).subscribe((res => {
    const copia = [...this.clientes];
    const indice = copia.findIndex(cli => cli.id === cliente.id);
    copia[indice] = cliente;
    this.clientes = copia;
    this.listaClientesAtualizada.next([...this.clientes]);

    this.router.navigate(['/']);
  }));
}


}
