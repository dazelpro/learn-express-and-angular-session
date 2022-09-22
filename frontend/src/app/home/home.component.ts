import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthInterceptor } from '../auth.interceptor';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

    name = '';

    constructor(private http: HttpClient, private route: Router) {}

    ngOnInit(): void {
        this.http
            .get('http://localhost:8000/users', { withCredentials: true })
            .subscribe((data: any) => {
                if(data.length > 0) {
                    this.name = 'Zel'
                } else {
                    this.name = 'null'
                }
            });
    }

    tes() {
        this.ngOnInit();
    }

    logout() {
        this.http.delete('http://localhost:8000/logout', { withCredentials: true });
        AuthInterceptor.accessToken = '';
        this.route.navigate(['/login']);
    }
}
