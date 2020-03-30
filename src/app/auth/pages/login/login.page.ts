import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AuthProvider } from '../../../core/services/auth.types';
import { NavController } from '@ionic/angular';

import { OverlayService } from 'src/app/core/services/overlay.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  authForm: FormGroup;
  authProviders = AuthProvider;
  showPassword =false

  configs = {
    isSignIn:true,
    action: 'Login',
    actionChange: 'Criar conta'
  };

  private nameControl = new FormControl('', [Validators.required, Validators.minLength(3)]);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private navController: NavController,
    private route: ActivatedRoute,
    private overlayService: OverlayService,
    private notifier: NotifierService
    ) { }

  ngOnInit() {
    this.createForm();
  }

  private createForm(): void {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get name(): FormControl {
    return <FormControl>this.authForm.get('name');
  }
  
  get email(): FormControl {
    return <FormControl>this.authForm.get('email');
  }

  get password(): FormControl {
    return <FormControl>this.authForm.get('password');
  }

  changeAuthAction(): void {
    this.configs.isSignIn = !this.configs.isSignIn;
    const { isSignIn } = this.configs;
    this.configs.action = isSignIn ? 'Login' : 'Sign Up';
    this.configs.actionChange = isSignIn ? 'Criar conta' : 'Já tenho uma conta';
    !isSignIn ? this.authForm.addControl('name', this.nameControl) : this.authForm.removeControl('name');
  }

  async onSubmit(provider: AuthProvider): Promise<void>{
    const loading = await this.overlayService.loading({
      message: 'Aguarde...'
    });
    try {
      const credentials = await this.authService.authenticate({
        isSignIn: this.configs.isSignIn,
        user: this.authForm.value,
        provider
      });
      if(this.nameControl.valid){
        await this.overlayService.alert({
          message: 'Usuário cadastrado com sucesso',
          buttons: [
            {
              text: 'Ok',
              handler: async ()=> {
                await this.navController.navigateForward(this.route.snapshot.queryParamMap.get('redirect') || '/tasks-list');
              }
            },
          ]
        })
        /* this.showNotification(
          'success',
          'Usuário cadastrado com sucesso.'
        ); */
      } else{
        this.navController.navigateForward(this.route.snapshot.queryParamMap.get('redirect') || '/tasks-list');
      }
      
    } catch (e) {
      console.log('auth error:', e);
      this.showNotification(
        'error',
        'Usuário ou senha incorretos.'
      );

    } finally {
      loading.dismiss();
    }
  }

  public showNotification( type: string, message: string ): void {
    this.notifier.notify( type, message );
  }

  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  public toggleTextPassword() {
    this.showPassword = !this.showPassword;
  }


}
