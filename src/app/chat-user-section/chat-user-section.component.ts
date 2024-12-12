import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../shared-modules/materia.module';
import { CommonModule } from '@angular/common';
import { Theme, ThemeService } from '../services/theme.service';
import { AuthService } from '../services/auth.service';
import { User } from '../model/auth.model';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { matSnackDuration } from '../styles/active-theme-variables';

@Component({
  selector: 'app-chat-user-section',
  imports: [CommonModule, MaterialModule],
  templateUrl: './chat-user-section.component.html',
  styleUrl: './chat-user-section.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ChatUserSectionComponent implements OnInit, OnDestroy {
  user!: User;
  subscriptions: Subscription = new Subscription();

  themeNameList: { displayName: string, key: Theme, background: string }[] = [
    { displayName: 'Synth', key: 'synthwave', background: 'var(--synthwave-button-background-color)' },
    { displayName: 'Forest', key: 'forest', background: 'var(--darkmode-wallpaper-color)' },
    { displayName: 'Kyanite', key: 'kyanite', background: 'var(--darkmode-wallpaper-color)' },
    { displayName: 'Dark', key: 'darkmode', background: 'var(--darkmode-wallpaper-color)' },
    { displayName: 'Light', key: 'lightmode', background: 'var(--darkmode-wallpaper-color)' }
  ];

  constructor(
    private themeService: ThemeService, 
    private authService: AuthService,
    private matSnack: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    const subscription = this.authService.user$.subscribe((user: User) => {
      this.user = user;

      this.applyDefaultThemeOnStart();
    });

    this.subscriptions.add(subscription);
  }

  applyDefaultThemeOnStart() {
    this.themeService.changeThemeTo('default', this.user);
  }

  changeTheme(theme: Theme) {
    const subscription = this.themeService.changeThemeTo(theme, this.user)?.subscribe({
      error: (err) => {
        this.matSnack.open(err.detail, 'Dismiss', {duration: matSnackDuration});
      }
    });
    this.subscriptions.add(subscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
