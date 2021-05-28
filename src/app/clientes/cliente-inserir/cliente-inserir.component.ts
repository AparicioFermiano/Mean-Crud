import { Component, OnInit /*Output, EventEmitter */} from '@angular/core';
import { NgForm, FormGroup, Validators, FormControl, FormControlName } from '@angular/forms';
import { Cliente } from "../cliente.model"
import { ClienteService } from '../cliente.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeTypeValidator } from './mime-type.validator';

@Component({
  selector: 'app-cliente-inserir',
  templateUrl: './cliente-inserir.component.html',
  styleUrls: ['./cliente-inserir.component.css']
})
export class ClienteInserirComponent implements OnInit {
  private modo:string = "criar";
  private idCliente: string;
  public cliente:Cliente;

  public estaCarregando: boolean = false;

  public form: FormGroup;
  previewImagem: string;

  ngOnInit(){

    this.form = new FormGroup({
      nome: new FormControl(
        null,
        {
          validators: [Validators.required, Validators.minLength(4)]
        }
      ),
      fone: new FormControl(
        null,
        {
          validators: [Validators.required]
        }
      ),
      email: new FormControl(
        null,
        {
          validators: [Validators.required, Validators.email]
        }
      ),
      imagem: new FormControl(null, {
        validators: [Validators.required], asyncValidators: [mimeTypeValidator]
      })
    })

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('idCliente')) {
        this.modo = "editar";
        this.idCliente = paramMap.get('idCliente');

        this.estaCarregando = true;
        //this.cliente = this.clienteService.getCliente(this.idCliente);
        this.clienteService.getCliente(this.idCliente).subscribe( dadosCli => {
          this.cliente = {
          id: dadosCli._id,
          nome: dadosCli.nome,
          fone: dadosCli.fone,
          email: dadosCli.email
          }

          this.form.setValue({
            nome: this.cliente.nome,
            fone: this.cliente.fone,
            email: this.cliente.email
          })
          ;

          this.estaCarregando = false;
          });

        }
      else {
        this.modo = "criar";
        this.idCliente = null;
      }
    })

  }
  // @Output() clienteAdicionado = new EventEmitter<Cliente>();
  constructor (public clienteService: ClienteService, public route: ActivatedRoute) {}

  onSalvarCliente() {
    if (this.form.invalid) {
      return;
    }
    if (this.modo == "criar") {
    this.clienteService.AdicionarCliente(
      this.form.value.nome,
      this.form.value.fone,
      this.form.value.email,
      this.form.value.imagem
    );
  }
  else {
    this.clienteService.atualizarCliente(
      this.idCliente,
      this.form.value.nome,
      this.form.value.fone,
      this.form.value.email
    );
  }
    this.form.reset();
    // const cliente:Cliente = {
    //   nome: form.value.nome,
    //   fone: form.value.fone,
    //   email: form.value.email,
    // };
    // this.clienteAdicionado.emit(cliente);
  }
//Receber uma imagem como uma URL
  onImagemSelecionar( event: Event) {
    const arquivo = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({'imagem': arquivo});
    this.form.get('imagem').updateValueAndValidity();
    console.log(arquivo);
    console.log(this.form);
    const reader = new FileReader();
    reader.onload = () => {
      this.previewImagem = reader.result as string
    }
    reader.readAsDataURL(arquivo)
  }
}
