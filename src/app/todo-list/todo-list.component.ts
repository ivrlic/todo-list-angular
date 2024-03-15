import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent implements OnInit {
  todos: any[] = [];
  currentTodo: any;
  isEditMode = false;
  title: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getTodos();
    this.title = this.getTitle();
  }

  // getting todos from api
  getTodos() {
    this.apiService.getTodos().subscribe({
      next: (response: any) => {
        this.todos = response.data;
      },
      error: (error) => {
        console.log('Error fetching todos: ', error);
      },
    });
  }

  // after item changed render again todos/tasks
  toggleItemChanged(e: boolean) {
    this.getTodos();
  }

  // get title from todo url filter part
  getTitle() {
    const url = this.apiService.getFilterPartUrlTodos();
    if (url.includes('[dueDate][$eq]')) {
      return 'today';
    } else if (url.includes('[dueDate][$gt]')) {
      return 'upcoming';
    } else if (url.includes('[dueDate][$lt]')) {
      return 'overdue';
    } else if (url.includes('[checked][$eq]=false')) {
      return 'uncompleted';
    } else if (url.includes('[checked][$eq]=true')) {
      return 'completed';
    } else if (url.includes('[category][title]')) {
      return url.slice(32, -21);
    } else return 'all';
  }
}
