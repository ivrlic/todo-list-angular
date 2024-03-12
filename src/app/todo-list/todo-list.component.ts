import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent implements OnInit {
  // @Output() currentTodoEvent: EventEmitter<boolean> =
  //   new EventEmitter<boolean>();
  todos: any[] = [];
  currentTodo: any;
  isEditMode = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getTodos();
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
  toggleItemChanged(value: boolean) {
    this.getTodos();
  }

  // getCurrentTodoEvent(todo: any) {
  //   this.currentTodoEvent.emit(todo);
  //   this.currentTodo = todo;
  // }
}
