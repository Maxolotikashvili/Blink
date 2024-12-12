import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ChatMainComponent } from './chat-main/chat-main.component';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent
    },

    {
        path: 'chat-main',
        component: ChatMainComponent,
        canActivate: [authGuard]
    },

    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    }
];
