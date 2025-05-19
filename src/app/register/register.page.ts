
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { RepoService } from 'src/app/services/repositorio/repo.service';
import { MenuController } from '@ionic/angular';

@Component({
  standalone:false,
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit{
  name: string = '';
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

  async register() {
    // Valida campos
    if (!this.name || !this.email || !this.password) {
      await this.showAlert('Error', 'Please fill all fields');
      return;
    }

    this.isLoading = true;

    try {
      // Verifica se email existe
      if (await this.repoService.doesEmailExistAsync(this.email)) {
        await this.showAlert('Error', 'Email already registered');
        return;
      }

      // Cria novo user
      const result = await this.repoService.insertUser({
        email: this.email,
        name: this.name,
        password: this.password
      });

      if (result.success) {
        await this.showAlert('Success', 'Registration successful');
        this.router.navigate(['/login']);
      } else {
        await this.showAlert('Error', 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      await this.showAlert('Error', 'An unexpected error occurred');
    } finally {
      this.isLoading = false;
    }
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}