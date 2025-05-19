import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { RepoService } from 'src/app/services/repositorio/repo.service';
import { MenuController } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit{
  email: string = '';
  password: string = '';
  isLoading: boolean = false;

  constructor(
    private repoService: RepoService,
    private router: Router,
    private alertController: AlertController,
    private menu: MenuController,
  ) {}
  ngOnInit(): void {
      this.ionViewWillEnter();
  }
  //Desabilita sidemenu
  ionViewWillEnter() {
    this.menu.enable(false);
  }
  async login() {
    //Verifica se campos estao vazios
    if (!this.email || !this.password) {
      await this.showAlert('Error', 'Please enter both email and password');
      return;
    }

    this.isLoading = true;

    try {
      // Verifica se email existe
      const user = this.repoService.getUserByEmail(this.email);
      
      // Verifica se existe e mete o user logado atualmente na variavel no repo para cesso mais tarde
      if (user && user.password === this.password) {
       
        this.repoService.setCurrentUser(user);
        
        // Reencaminha para pagina principal
        this.router.navigate(['/mainpage']);
      } else {
        //Manda erro para avisar que nao existe
        await this.showAlert('Login Falhou', 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      //Manda erro caso app crashe
      await this.showAlert('Error', 'An unexpected error occurred during login');
    } finally {
      this.isLoading = false;
    }
  }

  redirect(){
     this.router.navigate(['/register'], { replaceUrl: true });
  }
  //Cria os cards usados para mandar avisos na app
  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}