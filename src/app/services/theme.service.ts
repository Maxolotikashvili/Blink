import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_URL } from "../api_url";
import { activeVariables } from "../styles/active-theme-variables";
import { User } from "../model/user.model";
import { AuthService } from "./auth.service";
import { take } from "rxjs";

export type Theme = 'darkmode' | 'synthwave' | 'kyanite' | 'forest' | 'lightmode';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private activeThemeVariables: string[] = activeVariables;
    public activeTheme: string = '';
    private user!: User;

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getUser() {
        this.authService.user$.pipe(take(1)).subscribe((user) => {
            this.user = user;
        })
    }

    changeThemeTo(theme: Theme | 'default') {
        if (theme === this.activeTheme) return;
        this.getUser();

        if (theme === 'default') {
            this.applyTheme(this.user.theme);
            return;
        } else {
            this.applyTheme(theme);
            return this.http.post<{ message: string }>(`${API_URL}/themes/save_theme/${this.user.userId}`, { theme: theme });
        }
    }

    private applyTheme(themeName: Theme): void {
        const root = document.documentElement;

        this.activeThemeVariables.forEach((variable) => {
            const newThemeVariableName = variable.replace('--active-', `--${themeName}-`);

            // theme change with animation for basic colors
            const colorThemeValue = getComputedStyle(root).getPropertyValue(newThemeVariableName).trim();

            if (colorThemeValue) {
                root.style.setProperty(variable, colorThemeValue);
                this.activeTheme = themeName;
            }
        });
    }
}
