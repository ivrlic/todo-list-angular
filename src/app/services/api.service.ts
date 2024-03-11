import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private todoUrl = 'http://localhost:1337/api/todos';
  private todoUrlWithCategory =
    'http://localhost:1337/api/todos?populate[0]=category';
  private categoryUrl = 'http://localhost:1337/api/categories';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<any> {
    return this.getData(this.categoryUrl);
  }

  createCategory(categoryData: any): Observable<any> {
    return this.createData(this.categoryUrl, categoryData);
  }

  deleteCategory(categoryId: any): Observable<any> {
    return this.deleteData(this.categoryUrl, categoryId);
  }

  getTodos(): Observable<any[]> {
    return this.getData(this.todoUrlWithCategory);
  }

  createTodo(todoData: any): Observable<any> {
    return this.createData(this.todoUrl, todoData);
  }

  deleteTodo(todoId: any): Observable<any> {
    return this.deleteData(this.todoUrl, todoId);
  }

  updateTodo(data: any, id: string): Observable<any> {
    return this.updateData(this.todoUrl, data, id);
  }

  private getHeaders(): HttpHeaders {
    const token =
      '5f4c76160711732c19f6dfc19eeff85ae78a8fd55068d8717ba34f16a64f466c614d56cef88910fe69bc9e8c3c543eeec5baaf4f1046e493fb026beeddd26714ed67d340164a7f1e6b3831893a8ba01ad6b45439d05a0ef0ccfec3d963fc12f4348b1abf97903462179bca0ddfe3180671744674ce8324d7038735fa9a4cffff';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getData(apiUrl: string): Observable<any> {
    const headers = this.getHeaders();
    const data = this.http
      .get<any>(`${apiUrl}`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error('Greška prilikom dohvaćanja podataka:', error);
          return throwError(() => new Error('Something went wrong'));
        })
      );
    return data;
  }

  createData(apiUrl: string, data: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(apiUrl, data, { headers }).pipe(
      catchError((error) => {
        console.error('Greška prilikom stvaranja podataka:', error);
        return throwError(() => new Error('Something went wrong'));
      })
    );
  }

  updateData(apiUrl: string, data: any, id: string): Observable<any> {
    const headers = this.getHeaders();
    const url = `${apiUrl}/${id}`;
    return this.http.put<any>(url, data, { headers }).pipe(
      catchError((error) => {
        console.error('Greška prilikom ažuriranja podataka:', error);
        return throwError(() => new Error('Something went wrong'));
      })
    );
  }

  deleteData(apiUrl: string, id: string): Observable<any> {
    const headers = this.getHeaders();
    const url = `${apiUrl}/${id}`;
    return this.http.delete<any>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Greška prilikom brisanja podataka:', error);
        return throwError(() => new Error('Something went wrong'));
      })
    );
  }

  // Ostale metode za slanje HTTP zahtjeva...
}
