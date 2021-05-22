import { Component, OnInit /*Output, EventEmitter */} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Cliente } from "../cliente.model"
import { ClienteService } from '../cliente.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-cliente-inserir',
  templateUrl: './cliente-inserir.component.html',
  styleUrls: ['./cliente-inserir.component.css']
})
export class ClienteInserirComponent implements OnInit {
  private modo:string = "criar";
  private idCliente: string;
  public cliente:Cliente;
  ngOnInit(){
    this.route.paramMap.subscribe((paramMap: ParamMap) =>{
      if (paramMap.has('idCliente')) {
        this.modo = "editar";
        this.idCliente = paramMap.get('idCliente');
        this.cliente = this.clienteService.getCliente(this.idCliente);
      }
      else {
        this.modo = "criar";
        this.idCliente = null;
      }
    })

  }
  // @Output() clienteAdicionado = new EventEmitter<Cliente>();
  constructor (public clienteService: ClienteService, public route: ActivatedRoute) {}

  onSalvarCliente(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.modo == "criar") {
    this.clienteService.AdicionarCliente(
      form.value.nome,
      form.value.fone,
      form.value.email
    );
  }
  else {
    this.clienteService.atualizarCliente(
      this.idCliente,
      form.value.nome,
      form.value.fone,
      form.value.email
    )
  }
    form.resetForm();
    // const cliente:Cliente = {
    //   nome: form.value.nome,
    //   fone: form.value.fone,
    //   email: form.value.email,
    // };
    // this.clienteAdicionado.emit(cliente);
  }
}

