import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private todoUrl: string = 'http://localhost:1337/api/todos';
  private categoryUrl: string = 'http://localhost:1337/api/categories';

  private baseUrlTodos: string = `http://localhost:1337/api/todos`;
  private sortPartUrlTodos: string = `[sort]=updatedAt%3Adesc`;
  private filterPartUrlTodos: string = `populate[0]=category`;
  private todoUrlWithCategory: string = `${this.baseUrlTodos}?${this.sortPartUrlTodos}&${this.filterPartUrlTodos}`;

  private loginUserUrl = `http://localhost:1337/api/auth/local`;
  private registerUserUrl = `http://localhost:1337/api/auth/local/register`;
  private myToken: string = localStorage.getItem('token') || '';
  private myUsername: string = localStorage.getItem('username') || '';

  constructor(private http: HttpClient) {}

  getUsername() {
    return this.myUsername;
  }

  setUsername(newName: string) {
    this.myUsername = newName;
  }

  getToken() {
    return this.myToken;
  }

  setToken(newToken: string) {
    this.myToken = newToken;
  }

  getTodoUrlWithCategory() {
    return this.todoUrlWithCategory;
  }

  setTodoUrlWithCategory(
    sort: string = this.sortPartUrlTodos,
    filter: string = this.filterPartUrlTodos
  ): void {
    this.todoUrlWithCategory = `${this.baseUrlTodos}?${sort}&${filter}`;
  }

  getFilterPartUrlTodos() {
    return this.filterPartUrlTodos;
  }

  setFilterPartUrlTodos(newUrl: string): void {
    this.filterPartUrlTodos = newUrl;
  }

  setSortPartUrlTodos(newUrl: string): void {
    this.sortPartUrlTodos = newUrl;
  }

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
    const token = this.myToken;
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
          console.error('Error while fetching data:', error);
          return throwError(() => new Error('Something went wrong'));
        })
      );
    return data;
  }

  createData(apiUrl: string, data: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(apiUrl, data, { headers }).pipe(
      catchError((error) => {
        console.error('Error while creating data:', error);
        return throwError(() => new Error('Something went wrong'));
      })
    );
  }

  updateData(apiUrl: string, data: any, id: string): Observable<any> {
    const headers = this.getHeaders();
    const url = `${apiUrl}/${id}`;
    return this.http.put<any>(url, data, { headers }).pipe(
      catchError((error) => {
        console.error('Error while updating data:', error);
        return throwError(() => new Error('Something went wrong'));
      })
    );
  }

  deleteData(apiUrl: string, id: string): Observable<any> {
    const headers = this.getHeaders();
    const url = `${apiUrl}/${id}`;
    return this.http.delete<any>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error while deleting data:', error);
        return throwError(() => new Error('Something went wrong'));
      })
    );
  }

  createUser(data: any): Observable<any> {
    const apiUrl = this.registerUserUrl;
    const headers = {
      'Content-Type': 'application/json',
    };

    return this.http.post<any>(apiUrl, data, { headers }).pipe(
      catchError((error) => {
        console.error('Error while creating data:', error);
        return throwError(() => new Error('Something went wrong'));
      })
    );
  }

  loginUser(data: any): Observable<any> {
    const apiUrl = this.loginUserUrl;

    const headers = {
      'Content-Type': 'application/json',
    };

    return this.http.post<any>(apiUrl, data, { headers }).pipe(
      catchError((error) => {
        console.error('Error while creating data:', error);
        return throwError(() => new Error(error.status));
      })
    );
  }
}
