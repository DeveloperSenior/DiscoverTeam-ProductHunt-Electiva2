import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { ComponentBase } from '../../../base/components/component.base';
import { TranslateService } from '@ngx-translate/core';
import { MdbTabsComponent } from 'mdb-angular-ui-kit/tabs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-modal',
  templateUrl: './login.modal.component.html',
})
export class LoginModalComponent extends ComponentBase  implements OnInit,AfterViewInit{

  @ViewChild('tabs') tabs!: MdbTabsComponent;
  formLogin!: FormGroup;
  formRegister!: FormGroup;

  tabActivate: number | 0 = 0;

  constructor(public modalRef: MdbModalRef<LoginModalComponent>,
     public override translateService: TranslateService,
     private fb: FormBuilder,
     private userService: UserService) {
    super(translateService);
  }
  ngOnInit(): void {
    this.formLogin = this.fb.group({

      email: new FormControl({ value: null, disabled: false }, [Validators.email]),
      password: new FormControl({ value: null, disabled: false }, [Validators.minLength(6), Validators.maxLength(18),]),


    });
    this.formRegister= this.fb.group({

      userName: new FormControl({ value: null, disabled: false }, [Validators.minLength(6), Validators.maxLength(25)]),
      bio: new FormControl({ value: null, disabled: false }, [Validators.minLength(10), Validators.maxLength(100)]),
      avatar: new FormControl({ value: null, disabled: false }, []),
      email: new FormControl({ value: null, disabled: false }, [Validators.email]),
      password: new FormControl({ value: null, disabled: false }, [Validators.minLength(6), Validators.maxLength(18),]),
      confirmPassword: new FormControl({ value: null, disabled: false }, [Validators.minLength(6), Validators.maxLength(18),]),

    });
    this.formLogin.reset();
  }

  get validateFormLogin() {
    return (this.formLogin.get('email')?.valid
    && this.formLogin.get('password')?.valid);
  }

  get validateFormRegister() {
    return (this.formRegister.get('userName')?.valid &&
    this.formRegister.get('bio')?.valid &&
    this.formRegister.get('avatar')?.valid &&
    this.formRegister.get('password')?.valid &&
    this.formRegister.get('confirmPassword')?.valid);
  }

  login(): void {
    const payload = this.formLogin.getRawValue();
    console.log(payload);
    this.userService.login(payload).subscribe((response: any) => {
      this.onResponseLogin(response.body, response.body.message);
    });
  }

  signup(): void {
    const payload = this.formRegister.getRawValue();
    console.log(payload);
    this.userService.signup(payload).subscribe((response: any) => {
      this.onResponseLogin(response.body, response.body.message);
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.tabs.setActiveTab(this.tabActivate);
    }, 0);
  }

  onResponseLogin(body: any, error?: string | undefined): void{

    if (!error) {
      localStorage.setItem('xa-token',body.tokenId);
      localStorage.setItem('xa-user',body.email);
      this.modalRef.close();
      window.location.reload();
    } else {
      this.modalRef.close();
      this.showAlert(error);
    }

  }


}
