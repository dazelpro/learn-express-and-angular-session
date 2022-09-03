import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthInterceptor } from '../auth.interceptor';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
    email;
    pass;

    constructor(private http: HttpClient, private router: Router) {}

    ngOnInit(): void {}

    login() {
        this.http
            .post('http://localhost:8000/login', {
                email: this.email,
                password: this.pass,
            })
            .subscribe((data: any) => {
                console.log(data);
                AuthInterceptor.accessToken = data.accessToken;
                this.router.navigate(['/home']);
            });
    }
}
