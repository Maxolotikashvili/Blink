import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { API_URL } from "../api_url";
import { activeVariables } from "../styles/active-theme-variables";
import { User } from "../model/auth.model";

export type Theme = 'darkmode' | 'synthwave' | 'kyanite' | 'forest' | 'lightmode';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private isThemeSwitched: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    readonly isThemeSwitched$: Observable<boolean> = this.isThemeSwitched as Observable<boolean>;

    public activeTheme: string = '';
    private activeThemeVariables: string[] = activeVariables;

    constructor(private http: HttpClient) { }

    changeThemeTo(theme: Theme | 'default', user: User) {
        if (theme === this.activeTheme) return;

        this.applyLoadingEffectWhenChangingTheme()

        if (theme === 'default') {
            this.applyTheme(user.theme);
            return;
        } else {
            this.applyTheme(theme);
            return this.http.post<{ message: string }>(`${API_URL}/save_theme/${user.userId}`, { theme: theme });
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

    private applyLoadingEffectWhenChangingTheme() {
        this.isThemeSwitched.next(true);

        let globalTransitionDuration = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--global-transition-duration')) * 1000;

        setTimeout(() => {
            this.isThemeSwitched.next(false);
        }, globalTransitionDuration);
    }
}
